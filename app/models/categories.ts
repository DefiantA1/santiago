export const FALLBACK_RESPONSE = "Please wait, I will be with you shortly";

export type Confidence = "low" | "medium" | "high";

export type MessageCategory = {
  id: string;
  description: string;
  responses: string[];
};

export const MESSAGE_CATEGORIES: MessageCategory[] = [
  {
    id: "greeting",
    description: "Hellos, thanks, and other small talk",
    responses: [
      "Hello! How can I help you today?",
      "Hi there! Thanks for getting in touch.",
    ],
  },
  {
    id: "hours",
    description: "Questions about opening hours, availability, or when someone will reply",
    responses: [
      "We're available during business hours and will get back to you as soon as we can.",
    ],
  },
  {
    id: "help",
    description: "Someone asking for help, support, or more information",
    responses: [
      "Happy to help. Could you share a bit more about what you need?",
    ],
  },
];
