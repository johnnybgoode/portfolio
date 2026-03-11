export const makeId = (str: string) =>
  str.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
