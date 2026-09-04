type AiModel = {
  id: string;
  name: string;
  description: string;
};

export const MODELS: AiModel[] = [
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3.0 Flash",
    description: "Paling cepat untuk jawaban akurat",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Paling bagus untuk tugas umum",
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    description: "Tercepat untuk jawaban lengkap",
  },
  {
    id: "gemini-3.1-flash-lite-preview",
    name: "Gemini 3.1 Flash Lite",
    description: "Paling andal untuk pekerjaan ambisius",
  },
];
