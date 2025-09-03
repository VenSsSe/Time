// config/interaction-config.js
export const interactionConfig = {
    'default': {
        longPressDuration: 2000, 
        enableBackgroundInteraction: true,
        topLayerPointerEvents: 'auto',
        dimmingPercentage: 0.05
    },
    'matrix': {
        longPressDuration: 1000,
        transparencyDuration: 5000,
        enableBackgroundInteraction: false,
        topLayerPointerEvents: 'none',
        dimmingPercentage: 0.1
    },
    'neon': {
        longPressDuration: 2000,
        transparencyDuration: 7000,
        enableBackgroundInteraction: true,
        topLayerPointerEvents: 'auto',
        dimmingPercentage: 0.05
    },
    'crypto': {
        longPressDuration: 2000,
        transparencyDuration: 7000,
        enableBackgroundInteraction: true,
        topLayerPointerEvents: 'none',
        dimmingPercentage: 0.0
    },
    'slep': {
        longPressDuration: 3000,
        transparencyDuration: 10000,
        enableBackgroundInteraction: false,
        topLayerPointerEvents: 'none',
        dimmingPercentage: 0.2
    }
};