export function sum(data) {
  return data.reduce((total, { count }) => count + total, 0);
}