import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

export const getSecret = async (name: string): Promise<string> => {
  const secretName = `projects/${process.env.GCP_PROJECT_ID}/secrets/${name}/versions/latest`;
  const [version] = await client.accessSecretVersion({ name: secretName });
  return version.payload?.data?.toString() || "";
};
