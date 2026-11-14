import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-landing',
    title: 'First Landing',
    description: 'Establish primary communications link and touch down on the Martian surface.',
    iconName: 'Rocket',
    unlocked: true,
    unlockedAt: 'Sol 01',
    category: 'exploration',
    xpReward: 150
  },
  {
    id: 'rover-commander',
    title: 'Rover Commander',
    description: 'Successfully pilot the virtual Mars exploration vehicle past 100 meters of rugged terrain.',
    iconName: 'Compass',
    unlocked: false,
    category: 'rover',
    xpReward: 300
  },
  {
    id: 'crater-explorer',
    title: 'Crater Explorer',
    description: 'Inspect the geological history of ancient impact craters on the interactive Mars globe.',
    iconName: 'Globe',
    unlocked: false,
    category: 'exploration',
    xpReward: 250
  },
  {
    id: 'martian-scientist',
    title: 'Martian Scientist',
    description: 'Complete 3 rigorous scientific laboratory experiments in the virtual testing chamber.',
    iconName: 'FlaskConical',
    unlocked: false,
    category: 'science',
    xpReward: 350
  },
  {
    id: 'master-explorer',
    title: 'Master Explorer',
    description: 'Analyze all 6 prime Martian geographical sites and log their scientific significance.',
    iconName: 'Award',
    unlocked: false,
    category: 'mastery',
    xpReward: 500
  },
  {
    id: 'mars-pioneer',
    title: 'Mars Pioneer',
    description: 'Attain maximum mission clearance by completing the entire primary mission roster.',
    iconName: 'Trophy',
    unlocked: false,
    category: 'mastery',
    xpReward: 750
  }
];

