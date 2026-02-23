import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Очищать DOM после каждого теста
afterEach(() => {
  cleanup();
});
