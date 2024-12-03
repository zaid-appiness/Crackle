export const generateMovieCardId = (movieId: number, index: number, prefix = 'movie'): string => {
  const timestamp = Date.now();
  return `${prefix}-${movieId}-${index}-${timestamp}`;
}; 