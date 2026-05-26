import '@testing-library/jest-dom';

// Mock ResizeObserver for Vitest/JSDOM
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};
