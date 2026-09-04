const prefix = "/api";

export enum RestEndpoint {
  // Authentication (Firebase Bearer JWT)
  PostLogin = `${prefix}/auth/login`,
  PostRegister = `${prefix}/auth/register`,
  PostSession = `${prefix}/auth/session`,
  PostLogout = `${prefix}/auth/logout`,
  GetMe = `${prefix}/auth/me`,
  PostAuthGoogle = `${prefix}/auth/google`,

  // Standards
  GetStandards = `${prefix}/standards`,
  PostStandard = `${prefix}/standards`,
  GetStandardById = `${prefix}/standards`,
  PutStandardById = `${prefix}/standards`,
  PatchStandardById = `${prefix}/standards`,
  DeleteStandardById = `${prefix}/standards`,
  PostGenerateMcp = `${prefix}/standards`, // + /{id}/generate-mcp
  PostGenerateExample = `${prefix}/standards/generate-example`,

  // Journals
  GetJournals = `${prefix}/journals`,

  // Chat (Gemini Flash)
  PostChat = `${prefix}/chat`,

  // Templates (public)
  GetTemplates = `${prefix}/templates`,

  // MCPs
  GetMcps = `${prefix}/mcps`,

  // Stats
  GetStats = `${prefix}/stats`,
}
