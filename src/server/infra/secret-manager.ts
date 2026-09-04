import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

let cache = new Map<string, { value: string; expires: number }>();

export const getSecret = async (name: string): Promise<string> => {
  const cached = cache.get(name);
  if (cached && Date.now() < cached.expires) return cached.value;

  // Fallback to env in dev
  const envValue = process.env[name];
  if (envValue && !process.env.GCP_PROJECT_ID) {
    return envValue;
  }

  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "";
  if (!projectId) {
    return envValue || "";
  }

  try {
    const secretName = `projects/${projectId}/secrets/${name}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name: secretName });
    const value = version.payload?.data?.toString() || "";
    cache.set(name, { value, expires: Date.now() + 5 * 60 * 1000 });
    return value;
  } catch {
    return envValue || "";
  }
};

export const clearSecretCache = () => cache.clear();
