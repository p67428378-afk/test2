import { describe, it, expect } from 'vitest';
import * as api from './api';

describe('API Service', () => {
  it('should export all required functions', () => {
    expect(api.register).toBeInstanceOf(Function);
    expect(api.login).toBeInstanceOf(Function);
    expect(api.getUserProfile).toBeInstanceOf(Function);
    expect(api.updateUserProfile).toBeInstanceOf(Function);
    expect(api.getMovies).toBeInstanceOf(Function);
    expect(api.getMovieById).toBeInstanceOf(Function);
    expect(api.getWatchHistory).toBeInstanceOf(Function);
    expect(api.addToWatchHistory).toBeInstanceOf(Function);
    expect(api.updateWatchHistory).toBeInstanceOf(Function);
    expect(api.deleteFromWatchHistory).toBeInstanceOf(Function);
    expect(api.getRecommendations).toBeInstanceOf(Function);
  });
});
