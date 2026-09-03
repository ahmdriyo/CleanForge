import type { ChatMessage } from "@/types/standard";

export const dummyMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "What's the best folder structure for a payment feature in my Next.js app?",
    timestamp: "2026-09-02T10:00:00Z",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "For a payment feature, I recommend: `src/features/payment` with subfolders `components/`, `hooks/`, `schemas/`. Each file uses kebab-case like `payment-form.tsx`. Keep payment logic isolated from other features. Would you like me to apply this to your standard?",
    timestamp: "2026-09-02T10:00:30Z",
    hasApply: true,
  },
  {
    id: "msg-3",
    role: "user",
    content: "Yes, and how should I name my files?",
    timestamp: "2026-09-02T10:01:00Z",
  },
  {
    id: "msg-4",
    role: "assistant",
    content: "Always use kebab-case: `payment-form.tsx`, `use-payment-query.ts`, `payment-schema.ts`. For components, use PascalCase inside: `export const PaymentForm = () => {}`. This keeps consistency across your codebase.",
    timestamp: "2026-09-02T10:01:20Z",
  },
  {
    id: "msg-5",
    role: "user",
    content: "Generate example code for a folder `src/features/payment/components`",
    timestamp: "2026-09-02T10:02:00Z",
  },
  {
    id: "msg-6",
    role: "assistant",
    content: "Here's an example for `src/features/payment/components/payment-card.tsx`:\n\n```tsx\nexport const PaymentCard = () => {\n  return <div className=\"rounded-2xl p-4 bg-white border\">Payment</div>;\n};\n```\n\nRules: Keep UI pure, no business logic in components. Use shadcn Card as base.",
    timestamp: "2026-09-02T10:02:30Z",
    hasApply: true,
  },
];

export const mockGeminiResponses: Record<string, string> = {
  payment: "For payment, use `src/features/payment` with `components/payment-form.tsx` (kebab-case).",
  auth: "For auth, isolate in `src/features/auth` with `hooks/use-auth.ts`.",
  default: "Your standard looks great! Consider adding `globalRules` for naming and state management.",
};
