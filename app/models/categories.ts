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
    id: "next_shipment_date",
    description: "Questions about the next shipment date",
    responses: [
      "The next shipment date is September 20th, 2026",
    ],
  },
  {
    id: "how_to_pay",
    description: "Questions about how to pay",
    responses: [
      "You can deposit 60% to my nz bank account or you can pay in cash to our agent in Tonga",
    ],
  },
  {
    id: "how_to_order",
    description: "Questions about how to order",
    responses: [
      "You can use click and collect or I can pay for your products online or you can send me your package to my address",
    ],
  }
];
