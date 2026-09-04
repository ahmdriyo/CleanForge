export const parseArrayCell = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const serializeArrayCell = (value: string[]) => value.join(", ");
