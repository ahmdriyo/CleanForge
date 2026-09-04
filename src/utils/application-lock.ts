const locks = new Map<string, Promise<void>>();

export async function withApplicationLock<T>(
  keys: string[],
  operation: () => Promise<T>,
): Promise<T> {
  const normalizedKeys = [...new Set(keys)].sort();
  const previousLocks = normalizedKeys.map(
    (key) => locks.get(key) ?? Promise.resolve(),
  );

  let release: () => void = () => undefined;
  const currentLock = new Promise<void>((resolve) => {
    release = resolve;
  });
  const waitForPrevious = Promise.all(previousLocks);
  const queuedLock = waitForPrevious.then(() => currentLock);

  for (const key of normalizedKeys) {
    locks.set(key, queuedLock);
  }

  await waitForPrevious;
  try {
    return await operation();
  } finally {
    release();
    for (const key of normalizedKeys) {
      if (locks.get(key) === queuedLock) {
        locks.delete(key);
      }
    }
  }
}
