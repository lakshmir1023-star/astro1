import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MARS_LOCATIONS } from '../../data/marsLocations';
import { MartianLocation } from '../../types';
import { soundManager } from '../../services/audio';
import { Compass, X, Info, ChevronRight, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MarsGlobeProps {
  onExploreLocation: (location: MartianLocation) => void;
  onBackToHome?: () => void;
}

export const MarsGlobe: React.FC<MarsGlobeProps> = ({ onExploreLocation }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<MartianLocation | null>(null);
  const [activeLayer, setActiveLayer] = useState<'realistic' | 'elevation' | 'night'>('realistic');

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const autoRotateRef = useRef<boolean>(true);

  // Helper: Convert lat/lng to 3D Cartesian coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Generate dynamic procedural Martian procedural texture canvas (works 100% offline without network drops!)
  const createProceduralMarsTexture = useCallback((style: 'realistic' | 'elevation' | 'night'): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Fill base planetary tones
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (style === 'elevation') {
      grad.addColorStop(0, '#ffffff'); // North polar ice
      grad.addColorStop(0.15, '#2e6b9e'); // Low basins
      grad.addColorStop(0.5, '#c97a3e'); // Highlands
      grad.addColorStop(0.85, '#e0a458'); // High volcanic plateaus
      grad.addColorStop(1, '#ffffff'); // South polar ice
    } else {
      grad.addColorStop(0, '#f2f0ea'); // Polar frost
      grad.addColorStop(0.12, '#8a3c26');
      grad.addColorStop(0.35, '#c45a33');
      grad.addColorStop(0.65, '#9a3c22');
      grad.addColorStop(0.88, '#82311c');
      grad.addColorStop(1, '#f2f0ea'); // Polar frost
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural features & maria patterns
    const rng = (s: number) => Math.sin(s * 9999) * 0.5 + 0.5;
    for (let i = 0; i < 400; i++) {
      const x = rng(i * 1.3) * canvas.width;
      const y = rng(i * 2.7) * canvas.height;
      const r = rng(i * 4.1) * 60 + 5;
      const darkGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      darkGrad.addColorStop(0, 'rgba(60, 20, 10, 0.45)');
      darkGrad.addColorStop(0.7, 'rgba(120, 40, 20, 0.15)');
      darkGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = darkGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Prominent Valles Marineris canyon feature
    ctx.strokeStyle = 'rgba(50, 15, 8, 0.7)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.38, canvas.height * 0.55);
    ctx.bezierCurveTo(
      canvas.width * 0.42, canvas.height * 0.56,
      canvas.width * 0.48, canvas.height * 0.53,
      canvas.width * 0.55, canvas.height * 0.54
    );
    ctx.stroke();

    // Olympus Mons circular caldera feature
    ctx.fillStyle = 'rgba(180, 70, 35, 0.8)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.28, canvas.height * 0.38, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(40, 10, 5, 0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Polar ice caps
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 20, canvas.width * 0.25, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height - 20, canvas.width * 0.22, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Update texture style
  useEffect(() => {
    if (marsMeshRef.current) {
      const mat = marsMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.map?.dispose();
      mat.map = createProceduralMarsTexture(activeLayer);
      mat.needsUpdate = true;
    }
  }, [activeLayer, createProceduralMarsTexture]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xff5522, 1.0);
    rimLight.position.set(-6, -2, -3);
    scene.add(rimLight);

    // 5. Starfield background particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 80;
      starPos[i + 1] = (Math.random() - 0.5) * 80;
      starPos[i + 2] = -20 - Math.random() * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xe8edf5, size: 0.18, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Mars Sphere Geometry & Material
    const marsRadius = 1.9;
    const sphereGeo = new THREE.SphereGeometry(marsRadius, 64, 64);
    const marsMat = new THREE.MeshStandardMaterial({
      map: createProceduralMarsTexture(activeLayer),
      roughness: 0.82,
      metalness: 0.1
    });
    const marsMesh = new THREE.Mesh(sphereGeo, marsMat);
    scene.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // 7. Atmospheric Fresnel Glow Shell
    const atmoGeo = new THREE.SphereGeometry(marsRadius * 1.03, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xff6633,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);
    atmosphereRef.current = atmoMesh;

    // 8. Markers for Martian Locations
    const markersGroup = new THREE.Group();
    marsMesh.add(markersGroup);
    markersGroupRef.current = markersGroup;

    MARS_LOCATIONS.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, marsRadius + 0.05);

      // Marker beacon pin
      const markerPinGeo = new THREE.CylinderGeometry(0.015, 0.002, 0.14, 8);
      markerPinGeo.rotateX(Math.PI / 2);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xff7139 });
      const pin = new THREE.Mesh(markerPinGeo, markerMat);
      pin.position.copy(pos);
      pin.lookAt(pos.clone().multiplyScalar(2));

      // Glowing marker sphere head
      const headGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xe5b879 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.copy(pos.clone().multiplyScalar(1.04));

      // Outer beacon ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.08, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xff7139, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.045));
      ring.lookAt(pos.clone().multiplyScalar(2));

      const markerObj = new THREE.Group();
      markerObj.userData = { location: loc };
      markerObj.add(pin);
      markerObj.add(head);
      markerObj.add(ring);
      markersGroup.add(markerObj);
    });

    // 9. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotateRef.current && marsMeshRef.current) {
        marsMeshRef.current.rotation.y += 0.0018;
      }

      // Animate marker beacon rings
      if (markersGroupRef.current) {
        const time = performance.now() * 0.003;
        markersGroupRef.current.children.forEach((group, index) => {
          const ring = group.children[2] as THREE.Mesh;
          if (ring) {
            const scale = 1 + Math.sin(time + index * 1.5) * 0.25;
            ring.scale.set(scale, scale, scale);
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Touch & Pointer Controls
    const dom = renderer.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !marsMeshRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      marsMeshRef.current.rotation.y += deltaX * 0.006;
      marsMeshRef.current.rotation.x += deltaY * 0.006;
      marsMeshRef.current.rotation.x = Math.max(-1.2, Math.min(1.2, marsMeshRef.current.rotation.x));

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        // Check for click/tap on marker
        const rect = dom.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        if (markersGroupRef.current) {
          const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
          if (intersects.length > 0) {
            // Find root marker group
            let obj: THREE.Object3D | null = intersects[0].object;
            while (obj && !obj.userData.location && obj.parent) {
              obj = obj.parent;
            }
            if (obj && obj.userData.location) {
              soundManager.playClick();
              focusLocation(obj.userData.location as MartianLocation);
            }
          }
        }
      }
      isDraggingRef.current = false;
    };

    // Touch pinch to zoom
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && cameraRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (touchDistanceRef.current !== null) {
          const delta = dist - touchDistanceRef.current;
          cameraRef.current.position.z = Math.max(3.2, Math.min(7.5, cameraRef.current.position.z - delta * 0.01));
        }
        touchDistanceRef.current = dist;
      }
    };

    const handleTouchEnd = () => {
      touchDistanceRef.current = null;
    };

    // Wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      e.preventDefault();
      cameraRef.current.position.z = Math.max(3.2, Math.min(7.5, cameraRef.current.position.z + e.deltaY * 0.003));
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('touchmove', handleTouchMove, { passive: false });
    dom.addEventListener('touchend', handleTouchEnd);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [activeLayer, createProceduralMarsTexture]);

  // Rotate camera/globe to focus on a specific location
  const focusLocation = (loc: MartianLocation) => {
    setSelectedLocation(loc);
    autoRotateRef.current = false;
    if (marsMeshRef.current) {
      const targetY = -((loc.lng + 90) * (Math.PI / 180));
      const targetX = (loc.lat * (Math.PI / 180)) * 0.5;

      // Smooth step towards target
      marsMeshRef.current.rotation.y = targetY;
      marsMeshRef.current.rotation.x = Math.max(-1.0, Math.min(1.0, targetX));
    }
  };

  const resetView = () => {
    soundManager.playClick();
    setSelectedLocation(null);
    autoRotateRef.current = true;
    if (cameraRef.current) cameraRef.current.position.set(0, 0, 5.2);
    if (marsMeshRef.current) {
      marsMeshRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleZoom = (inOut: 'in' | 'out') => {
    soundManager.playClick();
    if (!cameraRef.current) return;
    const factor = inOut === 'in' ? -0.6 : 0.6;
    cameraRef.current.position.z = Math.max(3.2, Math.min(7.5, cameraRef.current.position.z + factor));
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-mars-deep overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Controls Bar */}
      <div className="safe-top absolute top-2 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-mars-orange/30 flex items-center gap-2">
            <Compass className="w-4 h-4 text-mars-orange animate-spin-slow" />
            <span className="font-orbitron text-xs font-bold tracking-wider text-mars-white">
              MARS GLOBE 3D
            </span>
          </div>

          {/* Layer Selector */}
          <div className="glass-panel rounded-xl p-1 border border-white/10 flex items-center gap-1">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveLayer('realistic');
              }}
              className={`px-2 py-1 text-[10px] font-mono rounded-lg transition-all ${
                activeLayer === 'realistic' ? 'bg-mars-orange text-white font-bold' : 'text-mars-silver/70 hover:text-white'
              }`}
            >
              Surface
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveLayer('elevation');
              }}
              className={`px-2 py-1 text-[10px] font-mono rounded-lg transition-all ${
                activeLayer === 'elevation' ? 'bg-mars-orange text-white font-bold' : 'text-mars-silver/70 hover:text-white'
              }`}
            >
              Topography
            </button>
          </div>
        </div>

        {/* Zoom & Reset Floating Buttons */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={() => handleZoom('in')}
            className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-mars-white hover:text-mars-orange border border-white/10 active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-mars-white hover:text-mars-orange border border-white/10 active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-mars-white hover:text-mars-orange border border-white/10 active:scale-95"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Location Quick-Pills (Bottom) */}
      <div className="absolute bottom-20 left-0 right-0 z-20 px-4 pointer-events-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MARS_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                soundManager.playClick();
                focusLocation(loc);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedLocation?.id === loc.id
                  ? 'bg-mars-orange text-white border-mars-orange glow-orange'
                  : 'glass-panel text-mars-silver hover:text-white border-white/10 hover:border-mars-orange/50'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location Details Sheet Modal */}
      {selectedLocation && (
        <div className="absolute inset-x-0 bottom-0 max-h-[75vh] z-30 glass-card rounded-t-3xl border-t-2 border-mars-orange p-5 overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-mars-red/30 border border-mars-red/50 text-mars-orange">
                  {selectedLocation.type}
                </span>
                <span className="text-[11px] font-mono text-mars-silver">
                  {selectedLocation.coordinatesDisplay}
                </span>
              </div>
              <h2 className="font-orbitron text-xl font-bold text-mars-white mt-1">
                {selectedLocation.name}
              </h2>
              <p className="text-xs text-mars-gold font-medium">
                {selectedLocation.tagline}
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedLocation(null);
                autoRotateRef.current = true;
              }}
              className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-mars-silver hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="glass-panel p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-mars-silver block">ELEVATION</span>
              <span className="font-orbitron font-bold text-mars-white">
                {selectedLocation.elevationKm > 0 ? `+${selectedLocation.elevationKm} km` : `${selectedLocation.elevationKm} km`}
              </span>
            </div>
            <div className="glass-panel p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-mars-silver block">
                {selectedLocation.diameterKm ? 'DIAMETER / SPAN' : 'SURFACE TYPE'}
              </span>
              <span className="font-orbitron font-bold text-mars-white">
                {selectedLocation.diameterKm ? `${selectedLocation.diameterKm} km` : 'Regolith / Ice'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="my-3 text-xs text-mars-white/90 leading-relaxed">
            <p>{selectedLocation.description}</p>
          </div>

          {/* Scientific Significance */}
          <div className="glass-panel p-3 rounded-xl border border-mars-orange/20 my-3">
            <div className="flex items-center gap-1.5 text-mars-orange text-xs font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Scientific Significance</span>
            </div>
            <p className="text-xs text-mars-silver leading-relaxed">
              {selectedLocation.scientificSignificance}
            </p>
          </div>

          {/* Interesting Facts */}
          <div className="my-3">
            <h4 className="text-[11px] font-mono uppercase text-mars-gold tracking-wider mb-2">
              PLANETARY OBSERVATIONS
            </h4>
            <ul className="space-y-1.5 text-xs text-mars-silver">
              {selectedLocation.interestingFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-mars-orange font-bold">&bull;</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action: EXPLORE THIS LOCATION Button */}
          <div className="pt-3 pb-2">
            <button
              onClick={() => {
                soundManager.playAchievementFanfare();
                onExploreLocation(selectedLocation);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-mars-red to-mars-orange shadow-[0_0_20px_rgba(255,113,57,0.4)] active:scale-95 transition-all"
            >
              <span>EXPLORE THIS LOCATION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

