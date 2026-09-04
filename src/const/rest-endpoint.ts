const prefix = "/api";

export enum RestEndpoint {
  // Authentication (legacy)
  PostLogin = `${prefix}/auth/login`,

  // Standards
  GetStandards = `${prefix}/standards`,
  PostStandard = `${prefix}/standards`,
  GetStandardById = `${prefix}/standards`,
  PutStandardById = `${prefix}/standards`,
  PatchStandardById = `${prefix}/standards`,
  DeleteStandardById = `${prefix}/standards`,
  PostGenerateMcp = `${prefix}/standards`, // + /{id}/generate-mcp

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
