export const pick = <
  T extends Record<string, unknown>,
  K extends Array<keyof T>,
>(
  obj: T,
  keys: K,
) => {
  return Object.keys(obj)
    .filter(k => keys.includes(k))
    .reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );
};

export const omit = <
  T extends Record<string, unknown>,
  K extends Array<keyof T>,
>(
  obj: T,
  keys: K,
) => {
  return Object.keys(obj)
    .filter(k => !keys.includes(k))
    .reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );
};

export const keyOf = <T extends {}>(o: T): keyof T =>
  Object.keys(o) as unknown as keyof T;
