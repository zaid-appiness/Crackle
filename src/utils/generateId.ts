export const generateId = (prefix: string, ...parts: (string | number)[]) => {
  return `${prefix}-${parts.join('-')}-${Math.random().toString(36).substr(2, 9)}`;
}; 