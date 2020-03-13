export function sum(data) {
  if (!data) {
    return 0;
  }
  
  return data.reduce((total, { count }) => count + total, 0);
}