import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoverTelemetry, MartianLocation } from '../../types';
import { soundManager } from '../../services/audio';
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square, Camera, RotateCcw, 
  Sun, Moon, Wind, Gauge, Compass, Battery, Thermometer, ShieldAlert, CheckCircle2 
} from 'lucide-react';

interface RoverSimulatorProps {
  initialLocation?: MartianLocation | null;
  onDistanceUpdated?: (distanceM: number) => void;
  onMissionEvent?: (type: string, value: number | string) => void;
}

export const RoverSimulator: React.FC<RoverSimulatorProps> = ({
  initialLocation,
  onDistanceUpdated,
  onMissionEvent
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [telemetry, setTelemetry] = useState<RoverTelemetry>({
    speedKmh: 0,
    distanceTraveledM: 0,
    batteryPercent: 96,
    currentLocationName: initialLocation ? initialLocation.name : 'Gale Crater (Aeolis Mons)',
    latitude: initialLocation ? initialLocation.lat : -5.37,
    longitude: initialLocation ? initialLocation.lng : 137.81,
    elevationM: -4500,
    terrainType: 'Regolith Plain',
    missionStatus: 'Exploring',
    explorationTimeSec: 0,
    signalDelaySec: 742,
    solarInputWatts: 420,
    motorTempC: 18
  });

  const [cameraMode, setCameraMode] = useState<'third' | 'first'>('third');
  const [dayNightPhase, setDayNightPhase] = useState<'day' | 'dusk' | 'night'>('day');
  const [dustStormActive, setDustStormActive] = useState<boolean>(false);
  const [isDrilling, setIsDrilling] = useState<boolean>(false);
  const [drillSuccess, setDrillSuccess] = useState<boolean>(false);

  // References for Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const roverGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const armRef = useRef<THREE.Group | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const rocksRef = useRef<THREE.Mesh[]>([]);

  // Rover Dynamics
  const roverPosRef = useRef<{ x: number; z: number; heading: number }>({ x: 0, z: 0, heading: 0 });
  const roverVelRef = useRef<{ forward: number; turn: number }>({ forward: 0, turn: 0 });
  const controlStateRef = useRef<{ forward: boolean; reverse: boolean; left: boolean; right: boolean }>({
    forward: false,
    reverse: false,
    left: false,
    right: false
  });

  // Procedural terrain height function
  const getTerrainHeight = useCallback((x: number, z: number): number => {
    const scale = 0.08;
    return (
      Math.sin(x * scale) * 0.45 +
      Math.cos(z * scale) * 0.45 +
      Math.sin((x + z) * scale * 2.2) * 0.25 +
      Math.cos((x * 0.5 - z) * scale * 1.5) * 0.3
    );
  }, []);

  // Initialize 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb25239); // Martian sky
    scene.fog = new THREE.FogExp2(0xb25239, 0.022);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(0xffcaa0, 0x552211, 0.9);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xffe6cc, 2.2);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 5. Procedural Martian Terrain Mesh
    const terrainSize = 180;
    const terrainSegments = 120;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      posAttr.setY(i, getTerrainHeight(vx, vz));
    }
    terrainGeo.computeVertexNormals();

    // Procedural canvas sand/rock texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 1024;
    const tCtx = texCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#b64232';
      tCtx.fillRect(0, 0, 1024, 1024);
      // Noise specs
      for (let i = 0; i < 3000; i++) {
        const nx = Math.random() * 1024;
        const ny = Math.random() * 1024;
        const col = Math.random() > 0.5 ? 'rgba(70,25,15,0.2)' : 'rgba(255,140,80,0.15)';
        tCtx.fillStyle = col;
        tCtx.fillRect(nx, ny, Math.random() * 5 + 1, Math.random() * 5 + 1);
      }
    }
    const terrainTex = new THREE.CanvasTexture(texCanvas);
    terrainTex.wrapS = THREE.RepeatWrapping;
    terrainTex.wrapT = THREE.RepeatWrapping;
    terrainTex.repeat.set(12, 12);

    const terrainMat = new THREE.MeshStandardMaterial({
      map: terrainTex,
      roughness: 0.95,
      metalness: 0.05
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 6. Surface Rocks (Obstacles with collision detection)
    const rocks: THREE.Mesh[] = [];
    const rockGeo = new THREE.DodecahedronGeometry(1, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x6e2c1c, roughness: 0.9 });

    for (let i = 0; i < 45; i++) {
      const rx = (Math.random() - 0.5) * 120;
      const rz = (Math.random() - 0.5) * 120;
      // Keep starting landing zone clear
      if (Math.hypot(rx, rz) < 6) continue;

      const rock = new THREE.Mesh(rockGeo, rockMat);
      const scale = 0.5 + Math.random() * 1.5;
      rock.scale.set(scale, scale * (0.6 + Math.random() * 0.6), scale);
      const ry = getTerrainHeight(rx, rz) + scale * 0.3;
      rock.position.set(rx, ry, rz);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
      rocks.push(rock);
    }
    rocksRef.current = rocks;

    // 7. Mars Atmosphere Dust Particles
    const dustCount = 600;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 70;
      dustPos[i + 1] = Math.random() * 12;
      dustPos[i + 2] = (Math.random() - 0.5) * 70;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xdf8453,
      size: 0.15,
      transparent: true,
      opacity: 0.45
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // 8. 3D Rover Assembly (Curiosity/Perseverance Style 6-wheel rover)
    const roverGroup = new THREE.Group();

    // Main Chassis Body
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.7, 2.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.4,
      roughness: 0.5
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.65;
    bodyMesh.castShadow = true;
    roverGroup.add(bodyMesh);

    // Electronics & Power Deck (Gold Foil / Solar Array)
    const solarGeo = new THREE.BoxGeometry(1.4, 0.05, 1.6);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e45,
      metalness: 0.8,
      roughness: 0.2
    });
    const solarMesh = new THREE.Mesh(solarGeo, solarMat);
    solarMesh.position.set(0, 1.03, -0.2);
    solarMesh.castShadow = true;
    roverGroup.add(solarMesh);

    // High-Gain Antenna Dish
    const dishGeo = new THREE.CylinderGeometry(0.25, 0.1, 0.12, 16);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xe5b879, metalness: 0.7 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0.5, 1.25, -0.7);
    dish.rotation.z = 0.3;
    roverGroup.add(dish);

    // Remote Sensing Mast & Camera Head (Mastcam)
    const mastPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    const mastPole = new THREE.Mesh(mastPoleGeo, mastMat);
    mastPole.position.set(-0.5, 1.35, 0.8);
    roverGroup.add(mastPole);

    const mastHeadGeo = new THREE.BoxGeometry(0.35, 0.2, 0.25);
    const mastHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3 });
    const mastHead = new THREE.Mesh(mastHeadGeo, mastHeadMat);
    mastHead.position.set(-0.5, 2.05, 0.8);

    // Camera lenses (Dual Stereo Mastcam)
    const lensGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12);
    lensGeo.rotateX(Math.PI / 2);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x00e1ff });
    const lensL = new THREE.Mesh(lensGeo, lensMat);
    lensL.position.set(-0.09, 0, 0.14);
    const lensR = new THREE.Mesh(lensGeo, lensMat);
    lensR.position.set(0.09, 0, 0.14);
    mastHead.add(lensL);
    mastHead.add(lensR);
    roverGroup.add(mastHead);

    // Robotic Sampling Arm with Drill
    const armGroup = new THREE.Group();
    armGroup.position.set(0.4, 0.5, 1.2);

    const armUpperGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8);
    armUpperGeo.rotateZ(0.6);
    const armUpper = new THREE.Mesh(armUpperGeo, mastMat);
    armGroup.add(armUpper);

    const turretGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12);
    const turretMat = new THREE.MeshStandardMaterial({ color: 0xff7139 });
    const turret = new THREE.Mesh(turretGeo, turretMat);
    turret.position.set(0.5, -0.3, 0.4);

    // Drill Bit
    const drillBitGeo = new THREE.ConeGeometry(0.04, 0.25, 8);
    drillBitGeo.rotateX(Math.PI / 2);
    const drillBitMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });
    const drillBit = new THREE.Mesh(drillBitGeo, drillBitMat);
    drillBit.position.set(0, -0.1, 0.15);
    turret.add(drillBit);
    armGroup.add(turret);
    roverGroup.add(armGroup);
    armRef.current = armGroup;

    // Six Wheels with Rocker-Bogie Suspension Mounts
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2
    });

    const wheelPositions = [
      [-0.95, 0.32, 1.0],  // Front Left
      [0.95, 0.32, 1.0],   // Front Right
      [-1.05, 0.32, 0.0],  // Mid Left
      [1.05, 0.32, 0.0],   // Mid Right
      [-0.95, 0.32, -1.0], // Rear Left
      [0.95, 0.32, -1.0]   // Rear Right
    ];

    const wheels: THREE.Mesh[] = [];
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      roverGroup.add(wheel);
      wheels.push(wheel);
    });
    wheelsRef.current = wheels;

    scene.add(roverGroup);
    roverGroupRef.current = roverGroup;

    // Initial Placement on Terrain
    const startY = getTerrainHeight(0, 0);
    roverGroup.position.set(0, startY, 0);

    // 9. Simulation & Animation Loop
    let animId: number;
    let lastTime = performance.now();
    let accumulatedDistance = 0;
    let localSeconds = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      localSeconds += dt;

      // Handle Controls & Physics
      const controls = controlStateRef.current;
      const targetForward = controls.forward ? 3.8 : controls.reverse ? -2.2 : 0;
      const targetTurn = controls.left ? 1.6 : controls.right ? -1.6 : 0;

      // Smooth acceleration
      roverVelRef.current.forward += (targetForward - roverVelRef.current.forward) * 4 * dt;
      roverVelRef.current.turn += (targetTurn - roverVelRef.current.turn) * 5 * dt;

      const isMoving = Math.abs(roverVelRef.current.forward) > 0.08;

      // Sound feedback for motor
      soundManager.updateRoverMotor(isMoving, Math.abs(roverVelRef.current.forward) / 3.8);

      if (Math.abs(roverVelRef.current.turn) > 0.01) {
        roverPosRef.current.heading += roverVelRef.current.turn * dt;
      }

      // Calculate candidate next position
      const nextX = roverPosRef.current.x + Math.sin(roverPosRef.current.heading) * roverVelRef.current.forward * dt;
      const nextZ = roverPosRef.current.z + Math.cos(roverPosRef.current.heading) * roverVelRef.current.forward * dt;

      // Collision Detection with Rocks
      let collision = false;
      for (const rock of rocksRef.current) {
        const dist = Math.hypot(nextX - rock.position.x, nextZ - rock.position.z);
        if (dist < 1.8) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        roverPosRef.current.x = nextX;
        roverPosRef.current.z = nextZ;

        if (isMoving) {
          const stepDist = Math.abs(roverVelRef.current.forward * dt);
          accumulatedDistance += stepDist;
          onDistanceUpdated?.(accumulatedDistance);
        }
      } else {
        // Bounce off rock slightly
        roverVelRef.current.forward = -roverVelRef.current.forward * 0.3;
      }

      // Update Rover 3D Object Transform
      if (roverGroupRef.current) {
        const curY = getTerrainHeight(roverPosRef.current.x, roverPosRef.current.z);
        roverGroupRef.current.position.set(roverPosRef.current.x, curY, roverPosRef.current.z);
        roverGroupRef.current.rotation.y = roverPosRef.current.heading;

        // Terrain pitch and roll tilt
        const sampleOffset = 1.0;
        const frontY = getTerrainHeight(
          roverPosRef.current.x + Math.sin(roverPosRef.current.heading) * sampleOffset,
          roverPosRef.current.z + Math.cos(roverPosRef.current.heading) * sampleOffset
        );
        const pitch = Math.atan2(frontY - curY, sampleOffset);
        roverGroupRef.current.rotation.x = pitch;

        // Wheel rotation animation
        if (isMoving) {
          const wheelSpin = (roverVelRef.current.forward * dt) / 0.32;
          wheelsRef.current.forEach((w) => {
            w.rotation.x += wheelSpin;
          });
        }
      }

      // Animate Dust Particles
      if (dustParticlesRef.current) {
        const pAttr = dustParticlesRef.current.geometry.attributes.position;
        const windSpeed = dustStormActive ? 0.35 : 0.05;
        for (let i = 0; i < pAttr.count; i++) {
          let px = pAttr.getX(i) + windSpeed;
          if (px > 35) px = -35;
          pAttr.setX(i, px);
        }
        pAttr.needsUpdate = true;
      }

      // Update Camera (First vs Third Person)
      if (cameraRef.current && roverGroupRef.current) {
        if (cameraMode === 'first') {
          // Mastcam cockpit camera
          const camOffset = new THREE.Vector3(-0.5, 2.1, 0.9).applyEuler(roverGroupRef.current.rotation);
          cameraRef.current.position.copy(roverGroupRef.current.position).add(camOffset);

          const lookTarget = roverGroupRef.current.position
            .clone()
            .add(new THREE.Vector3(
              Math.sin(roverPosRef.current.heading) * 15,
              0.5,
              Math.cos(roverPosRef.current.heading) * 15
            ));
          cameraRef.current.lookAt(lookTarget);
        } else {
          // Third-person chase camera
          const distBehind = 7.5;
          const heightAbove = 3.5;
          const camX = roverPosRef.current.x - Math.sin(roverPosRef.current.heading) * distBehind;
          const camZ = roverPosRef.current.z - Math.cos(roverPosRef.current.heading) * distBehind;
          const camY = getTerrainHeight(camX, camZ) + heightAbove;

          cameraRef.current.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.12);
          cameraRef.current.lookAt(
            roverGroupRef.current.position.x,
            roverGroupRef.current.position.y + 0.8,
            roverGroupRef.current.position.z
          );
        }
      }

      // Telemetry throttled update (every ~200ms)
      if (Math.floor(localSeconds * 5) !== Math.floor((localSeconds - dt) * 5)) {
        const curSpeedKmh = Math.abs(roverVelRef.current.forward) * 3.6;
        setTelemetry((prev) => ({
          ...prev,
          speedKmh: Number(curSpeedKmh.toFixed(1)),
          distanceTraveledM: Math.floor(accumulatedDistance),
          batteryPercent: Math.max(12, 96 - Math.floor(accumulatedDistance * 0.03)),
          explorationTimeSec: Math.floor(localSeconds),
          motorTempC: Math.min(48, 18 + Math.floor(curSpeedKmh * 3.5))
        }));
      }

      renderer.render(scene, camera);
    };
    animate();

    // Keyboard bindings for desktop testing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') controlStateRef.current.forward = true;
      if (e.key === 'ArrowDown' || e.key === 's') controlStateRef.current.reverse = true;
      if (e.key === 'ArrowLeft' || e.key === 'a') controlStateRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') controlStateRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') controlStateRef.current.forward = false;
      if (e.key === 'ArrowDown' || e.key === 's') controlStateRef.current.reverse = false;
      if (e.key === 'ArrowLeft' || e.key === 'a') controlStateRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') controlStateRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Handle Window Resize
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
      soundManager.stopRoverMotor();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [cameraMode, dustStormActive, getTerrainHeight, onDistanceUpdated]);

  // Handle Day/Night & Lighting cycle updates
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current) return;
    if (dayNightPhase === 'day') {
      sceneRef.current.background = new THREE.Color(0xb25239);
      sceneRef.current.fog = new THREE.FogExp2(0xb25239, dustStormActive ? 0.055 : 0.022);
      dirLightRef.current.intensity = 2.2;
      hemiLightRef.current.intensity = 0.9;
    } else if (dayNightPhase === 'dusk') {
      sceneRef.current.background = new THREE.Color(0x5a1f18);
      sceneRef.current.fog = new THREE.FogExp2(0x5a1f18, 0.035);
      dirLightRef.current.intensity = 0.9;
      hemiLightRef.current.intensity = 0.45;
    } else {
      sceneRef.current.background = new THREE.Color(0x0a0c14);
      sceneRef.current.fog = new THREE.FogExp2(0x0a0c14, 0.04);
      dirLightRef.current.intensity = 0.15;
      hemiLightRef.current.intensity = 0.15;
    }
  }, [dayNightPhase, dustStormActive]);

  // Reset Rover to starting position
  const handleResetPosition = () => {
    soundManager.playClick();
    roverPosRef.current = { x: 0, z: 0, heading: 0 };
    roverVelRef.current = { forward: 0, turn: 0 };
    controlStateRef.current = { forward: false, reverse: false, left: false, right: false };
    if (roverGroupRef.current) {
      const y = getTerrainHeight(0, 0);
      roverGroupRef.current.position.set(0, y, 0);
      roverGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // Trigger virtual robotic arm sample drill
  const handleDrillSample = () => {
    if (isDrilling) return;
    soundManager.playScanner();
    setIsDrilling(true);
    setDrillSuccess(false);

    // Animate robotic arm turret
    if (armRef.current) {
      armRef.current.rotation.x = 0.6;
    }

    setTimeout(() => {
      soundManager.playAchievementFanfare();
      setIsDrilling(false);
      setDrillSuccess(true);
      if (armRef.current) armRef.current.rotation.x = 0;
      onMissionEvent?.('sample_drilled', telemetry.currentLocationName);
    }, 2400);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-mars-deep overflow-hidden select-none">
      {/* 3D WebGL Simulation Viewport */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Top Telemetry HUD Bar */}
      <div className="safe-top absolute top-2 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between">
          {/* Location & Coordinates */}
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-mars-orange/30 pointer-events-auto flex items-center gap-2">
            <Compass className="w-4 h-4 text-mars-orange animate-spin-slow" />
            <div>
              <span className="text-[10px] font-mono text-mars-silver uppercase block">SURFACE SECTOR</span>
              <span className="font-orbitron text-xs font-bold text-mars-white">{telemetry.currentLocationName}</span>
            </div>
          </div>

          {/* Quick Environment Controls */}
          <div className="glass-panel rounded-xl p-1 border border-white/10 flex items-center gap-1 pointer-events-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                setDayNightPhase((p) => (p === 'day' ? 'dusk' : p === 'dusk' ? 'night' : 'day'));
              }}
              className="p-1.5 rounded-lg text-mars-silver hover:text-mars-orange transition-colors"
              title="Cycle Sun Elevation"
            >
              {dayNightPhase === 'day' ? <Sun className="w-4 h-4 text-mars-gold" /> : <Moon className="w-4 h-4 text-nebula-blue" />}
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setDustStormActive(!dustStormActive);
              }}
              className={`p-1.5 rounded-lg transition-colors ${dustStormActive ? 'bg-mars-red/50 text-mars-orange glow-red' : 'text-mars-silver hover:text-mars-white'}`}
              title="Toggle Atmospheric Dust Storm"
            >
              <Wind className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                const nextMode = cameraMode === 'third' ? 'first' : 'third';
                setCameraMode(nextMode);
                onMissionEvent?.('camera_toggle', nextMode);
              }}
              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-mars-secondary/80 text-mars-white border border-white/10 flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5 text-mars-orange" />
              <span>{cameraMode === 'third' ? '3RD' : 'MASTCAM'}</span>
            </button>
            <button
              onClick={handleResetPosition}
              className="p-1.5 rounded-lg text-mars-silver hover:text-mars-orange transition-colors"
              title="Reset Position"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Readouts Strip */}
        <div className="grid grid-cols-4 gap-2 text-center pointer-events-auto">
          <div className="glass-panel px-2 py-1 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-mars-silver block">SPEED</span>
            <span className="font-orbitron font-bold text-xs text-mars-white">{telemetry.speedKmh} km/h</span>
          </div>
          <div className="glass-panel px-2 py-1 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-mars-silver block">ODOMETER</span>
            <span className="font-orbitron font-bold text-xs text-mars-gold">{telemetry.distanceTraveledM} m</span>
          </div>
          <div className="glass-panel px-2 py-1 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-mars-silver block">BATTERY</span>
            <span className={`font-orbitron font-bold text-xs ${telemetry.batteryPercent > 20 ? 'text-mars-green' : 'text-mars-red'}`}>
              {telemetry.batteryPercent}%
            </span>
          </div>
          <div className="glass-panel px-2 py-1 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-mars-silver block">SURFACE TEMP</span>
            <span className="font-orbitron font-bold text-xs text-mars-silver">
              {dayNightPhase === 'day' ? '-18°C' : dayNightPhase === 'dusk' ? '-65°C' : '-115°C'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Drilling Banner (if active) */}
      {isDrilling && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 glass-card px-5 py-3 rounded-2xl border border-mars-orange text-center pointer-events-none animate-pulse">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full border-2 border-mars-orange border-t-transparent animate-spin" />
          <span className="font-orbitron text-xs font-bold text-mars-white block">CORE DRILL ENGAGED</span>
          <span className="text-[10px] text-mars-silver font-mono">EXTRACTING REGOLITH MATRIX...</span>
        </div>
      )}

      {/* Drill Success Toast */}
      {drillSuccess && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 glass-panel px-4 py-2 rounded-xl border border-mars-green text-center pointer-events-none flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-mars-green" />
          <span className="text-xs font-bold text-mars-white">Virtual Regolith Sample Stored in Carousel</span>
        </div>
      )}

      {/* Bottom Control HUD (Touch D-Pad & Actions) */}
      <div className="absolute bottom-16 left-0 right-0 z-30 px-4 py-2 flex items-end justify-between pointer-events-none">
        {/* Touch D-Pad / Steering Controls */}
        <div className="grid grid-cols-3 gap-1.5 w-36 h-36 pointer-events-auto">
          <div />
          <button
            onPointerDown={() => (controlStateRef.current.forward = true)}
            onPointerUp={() => (controlStateRef.current.forward = false)}
            onPointerLeave={() => (controlStateRef.current.forward = false)}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-mars-white hover:text-mars-orange active:bg-mars-orange/40 active:scale-95 transition-all border border-mars-orange/40"
            aria-label="Forward"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />

          <button
            onPointerDown={() => (controlStateRef.current.left = true)}
            onPointerUp={() => (controlStateRef.current.left = false)}
            onPointerLeave={() => (controlStateRef.current.left = false)}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-mars-white hover:text-mars-orange active:bg-mars-orange/40 active:scale-95 transition-all border border-mars-orange/40"
            aria-label="Turn Left"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              controlStateRef.current = { forward: false, reverse: false, left: false, right: false };
              roverVelRef.current = { forward: 0, turn: 0 };
              soundManager.stopRoverMotor();
            }}
            className="w-11 h-11 rounded-xl bg-mars-red/40 hover:bg-mars-red/60 text-mars-white flex items-center justify-center border border-mars-red active:scale-95 transition-all"
            aria-label="Stop"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
          <button
            onPointerDown={() => (controlStateRef.current.right = true)}
            onPointerUp={() => (controlStateRef.current.right = false)}
            onPointerLeave={() => (controlStateRef.current.right = false)}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-mars-white hover:text-mars-orange active:bg-mars-orange/40 active:scale-95 transition-all border border-mars-orange/40"
            aria-label="Turn Right"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div />
          <button
            onPointerDown={() => (controlStateRef.current.reverse = true)}
            onPointerUp={() => (controlStateRef.current.reverse = false)}
            onPointerLeave={() => (controlStateRef.current.reverse = false)}
            className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-mars-white hover:text-mars-orange active:bg-mars-orange/40 active:scale-95 transition-all border border-mars-orange/40"
            aria-label="Reverse"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <div />
        </div>

        {/* Right Action Tools: Drill / Sample Arm */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={handleDrillSample}
            disabled={isDrilling}
            className={`px-4 py-3 rounded-2xl glass-card border flex items-center gap-2 font-orbitron text-xs font-bold tracking-wider uppercase transition-all active:scale-95 ${
              isDrilling
                ? 'border-mars-silver/30 text-mars-silver bg-black/40'
                : 'border-mars-orange text-white hover:text-mars-orange glow-orange'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-mars-orange animate-ping" />
            <span>{isDrilling ? 'DRILLING...' : 'SAMPLE DRILL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
