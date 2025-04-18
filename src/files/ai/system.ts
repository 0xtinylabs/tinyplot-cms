export const system_prompts = (TOKENS: any) => ({
  optimization: (params: any, answer: any) =>
    `I fetched claude api to this request: ${JSON.stringify(params)}, And claude has answered with this: ${JSON.stringify(answer)}. Look for the tool response and tool use detailed. The response for tool use is important and it affects similarity.`,
  my_wallet: (wallet_address: string, wallet_portfolio: Record<string, any>) =>
    `The users wallet info: wallet address: ${wallet_address}\n and wallet portfolio data: ${JSON.stringify(wallet_portfolio ?? {})}. Answer question based on it.`,
  token_security: (response: any) =>
    `The security data of token: ${JSON.stringify(response ?? {})}. Make analyze of token and give answers to what user asked too.`,
  token_list: (usd_price: any, balance: any) =>
    `The price for all tokens listed: ${JSON.stringify(usd_price)}, the balance for token: ${balance}`,
  guide: (guide: string, questions: any) =>
    `${guide}. This is the all information about bot. You will answer questions based on this data. You are the tinyplot. questions: ${JSON.stringify(questions)}`,
  endpoint_chain: (fileContent: string) => `${fileContent}`,
  token_data: (aiChainResponse: any, usdPriceResponse: any) =>
    `The data to answer: ${JSON.stringify(aiChainResponse)}, USD price data: ${JSON.stringify(usdPriceResponse)} data. if needed to get usd price for token. CA's for some tokens ${JSON.stringify(TOKENS)}. Use K, M, B notation if needed. Do not use markdown elements. Do not add something like let met help you or similar phrases. Just give the answer`,
  wallet_endpoint_chain: (fileContent: string) =>
    `${fileContent}. This content is mock data. Not includes the real answer`,
  wallet_data: (
    aiChainResponse: any[],
    wallet_address: any,
    usdPriceResponse: any,
  ) =>
    `The data to answer: ${JSON.stringify({ ...(aiChainResponse ?? {}), wallet_address })}, USD price data: ${JSON.stringify(usdPriceResponse)} data. if needed to get usd price for token. CA's for some tokens ${JSON.stringify(TOKENS)}. Use K, M, B notation if needed. Do not use markdown elements.`,

  token_basic_data_enough: (tickerStaticData: any) =>
    `You are a trader agent for tokens. You answer questions. Use direct and serious tone. This data given to you: ${JSON.stringify(tickerStaticData)}. If it is enough to answer use it.`,
});
