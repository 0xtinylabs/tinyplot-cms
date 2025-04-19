export type AiChainExtendedType = any;

export const questions = {
  usd_price_of_tokens: (prompt: string) => `${JSON.stringify(prompt)}`,
  follow_up_necessary: (prompt: any, oldPrompts: any) =>
    "This is the prompt: " +
    prompt +
    ". This is the prompt history: " +
    JSON.stringify(oldPrompts),
  wallet_data: (
    question: string,
    template: string,
    aiChain: AiChainExtendedType
  ) =>
    ` The user asked this question: ${question}. The current date: ${new Date(
      Date.now()
    ).toISOString()} Answer it. Use just the provided data. Do not hesitate. The data is true and correct. Just answer based on data. Do not add any data to it. Just give answer. If the data not includes answer give straight answer like none, 0, or similar. For number notations use K,M,B notation. If the user asked analyze fill this template and just return the filled template as answer. The analyze result template: ${template}. The wallet provider: ${JSON.stringify(
      aiChain.wallet_provider
    )}`,

  token_data: (question: string) =>
    `The user asked this question: ${question}. The current date: ${new Date(
      Date.now()
    ).toISOString()} Answer it. Use just the provided data. Do not hesitate. The data is true and correct. Just answer based on data. Do not add any data to it. Just give answer. If the data not includes answer give straight answer like none, 0, or similar. For number notations use K,M,B notation.`,
};
