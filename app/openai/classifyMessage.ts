import {
  FALLBACK_RESPONSE,
  MESSAGE_CATEGORIES,
  type Confidence,
} from "@/app/models/categories";

type Classification = {
  category: string;
  confidence: Confidence;
  response: string;
};

export async function getAutoReply(messageText: string): Promise<string> {
  try {
    const classification = await classifyMessage(messageText);
    console.log("Message classification:", classification);

    if (classification.confidence !== "high") {
      return FALLBACK_RESPONSE;
    }

    return resolveAllowedResponse(classification) ?? FALLBACK_RESPONSE;
  } catch (error) {
    console.error("Error classifying message:", error);
    return FALLBACK_RESPONSE;
  }
}

async function classifyMessage(messageText: string): Promise<Classification> {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const categoryList = MESSAGE_CATEGORIES.map((category) => {
    const responses = category.responses.map((response) => `- ${response}`).join("\n");
    return `Category: ${category.id}\nDescription: ${category.description}\nAllowed responses:\n${responses}`;
  }).join("\n\n");

  const systemPrompt = `You classify incoming customer messages.

Choose exactly one category from this list, a confidence of low, medium, or high, and one of that category's allowed responses.

${categoryList}

Confidence:
- high: the message clearly belongs to one category
- medium: it might belong to a category, but it is ambiguous
- low: it is unclear, off-topic, or does not match a category

Return JSON only in this shape:
{"category":"greeting","confidence":"high","response":"Hello! How can I help you today?"}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: messageText },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message ?? "OpenAI request failed");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty classification");
  }

  const parsed = JSON.parse(content) as Partial<Classification>;
  const confidence = normalizeConfidence(parsed.confidence);

  return {
    category: typeof parsed.category === "string" ? parsed.category : "",
    confidence,
    response: typeof parsed.response === "string" ? parsed.response : "",
  };
}

function normalizeConfidence(value: unknown): Confidence {
  const confidence = String(value ?? "").toLowerCase();
  if (confidence === "high" || confidence === "medium" || confidence === "low") {
    return confidence;
  }
  return "low";
}

function resolveAllowedResponse(classification: Classification): string | null {
  const category = MESSAGE_CATEGORIES.find((item) => item.id === classification.category);
  if (!category) {
    return null;
  }

  if (category.responses.includes(classification.response)) {
    return classification.response;
  }

  return category.responses[0] ?? null;
}
