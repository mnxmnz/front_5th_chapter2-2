export const findMaxBy = <T>(array: T[], getValue: (item: T) => number): number => {
  return array.reduce((max, item) => Math.max(max, getValue(item)), 0);
};

export const findItemById = <T extends { id: string }>(array: T[], id: string): T | undefined => {
  return array.find(item => item.id === id);
};
