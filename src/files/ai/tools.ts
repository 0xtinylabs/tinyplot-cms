export type AiResponseInputType =
  | "optimize"
  | "ticker"
  | "wallet_provider"
  | "usd_price"
  | "usd_prices_of_tokens"
  | "number_notation"
  | "trasaction_type"
  | "percentage_notation"
  | "market_cap"
  | "volume"
  | "contract_address"
  | "time"
  | "analyze"
  | "trending"
  | "wallet_info"
  | "tickerv2"
  | "referral"
  | "follow_up_necessary"
  | "manage_wallet"
  | "execute_trade"
  | "token_amount"
  | "endpoint_chain_token"
  | "endpoint_chain_wallet"
  | "token_basic_data_enough";

export type AiSDKMessageOptionsTools = any;
export const tool_name = (name: AiResponseInputType) => `tool_${name}`;

export const sdkTools: (
  TOKENS: any
) => Record<AiResponseInputType, AiSDKMessageOptionsTools> = (TOKENS) => {
  const tools: Record<AiResponseInputType, AiSDKMessageOptionsTools> = {
    optimize: () => [
      {
        name: tool_name("optimize"),
        input_schema: {
          type: "object",
          properties: {
            similarity: {
              type: "number",
              description:
                "The similarity value for answer to given question(s). Give a number between 1-99. 99 is most similar and correct. 1 is the less similar and incorrect",
            },
          },
          required: ["similarity"],
        },
      },
    ],
    endpoint_chain_token: () => [
      {
        name: "EndpointChainTool",
        description:
          "Endpoint chain for answering questions. Supports deep nesting to achieve the final answer. You Use the response of one endpoint as other endpoint's input when necessary. If the provided data includes answer do not try to add more steps. Example: To find a user's latest post title: 1) Call 'getUser' with username, 2) Extract user.id, 3) Call 'getUserPosts' with extracted id, 4) Access posts[0].title but make each prop as another step from response. If farcaster wallet needs to call at endpoint call get users one of verified eth address. if you can't find verified eth address use custody address",
        input_schema: {
          type: "object",
          properties: {
            contract_address: {
              is_exist: {
                type: "boolean",
                description: "IF the contract address asked in prompt",
              },
              value: {
                type: "string",
                description:
                  "contract address in given prompt. It can ask with CA, ca, contract address, Contract Address, CONTRACT ADDRESS, contract id",
              },
            },
            ticker: {
              type: "object",
              properties: {
                value: {
                  description: "value of ticker",
                  type: "string",
                },

                ca: {
                  type: "string",
                  description:
                    "contract address of ticker. find it from " +
                    JSON.stringify(TOKENS) +
                    " if exists",
                },
              },

              description:
                "Token ticker or symbol. Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here.",
            },
            wallet_provider: {
              type: "object",
              properties: {
                provider_type: {
                  type: "string",
                  description:
                    "wallet provider for user. if user gives a wallet address it will be wallet address. If User gives an ENS name which ends with .eth it is this. If user gives a username it is this. If you find wallet address, type is wallet; if you find ens name type is ens. and if you find username type is fname, if type is fname and username has any space character or it is conceded of more than 1 words ask user to save correct form of the fname and type of this is ask not fname. Value will be wallet address if you find wallet. Otherwise it will be null",
                },
                value: {
                  type: "string",
                  description:
                    "The value of the wallet address. If the type of wallet it will be the found wallet address. Otherwise the value of eth name of user name. It can be given even when analyze wanted",
                },
              },
            },
            endpoint_chain: {
              type: "array",
              description:
                "An ordered sequence of steps to traverse through endpoints and data structures to retrieve the answer.",
              items: {
                type: "object",
                properties: {
                  step_type: {
                    type: "string",
                    description:
                      "The type of step: 'property_access', 'array_index', 'endpoint_call', tool, 'variable_assignment'. if it is the index of array make it array_index",
                    enum: [
                      "property_access",
                      "array_index",
                      "endpoint_call",
                      "variable_assignment",
                      "tool",
                      "ticker",
                      "wallet_provider",
                    ],
                  },

                  step_value: {
                    type: "string",
                    description:
                      "The property name, array index, endpoint name, other_tool_name or variable name to use in this step. if property name and it has nested parts do each as step. this is important dont do it as one step value like prop.prop2  do each one separate step",
                  },
                  parameters: {
                    type: "object",
                    description:
                      "parameters to pass to an endpoint call, can be get from other properties.",
                    additionalProperties: true,
                  },
                  store_as: {
                    type: "string",
                    description:
                      "Optional name to store the result of this step for use in subsequent steps",
                  },
                  description: {
                    type: "string",
                    description:
                      "Human-readable description of what this step does and why it's needed",
                  },
                  use_previous_result: {
                    type: "boolean",
                    description:
                      "Whether this step should operate on the result of the previous step (default: true)",
                    default: true,
                  },
                  use_stored_value: {
                    type: "object",
                    description:
                      "'Whether endpoint_call parameters includes one of the stored value. If it does give the value key.",
                    properties: {
                      should_use: {
                        description: "Should use stored value",
                        type: "boolean",
                        default: true,
                      },
                      store_key: {
                        description: "the key of stored value",
                        type: "string",
                      },
                    },
                  },
                },
                required: ["step_type", "step_value", "use_stored_value"],
              },
            },
          },
          required: ["endpoint_chain"],
        },
      },
    ],
    endpoint_chain_wallet: () => [
      {
        name: "EndpointChainTool",
        description:
          "Endpoint chain for answering questions. Supports deep nesting to achieve the final answer. You Use the response of one endpoint as other endpoint's input when necessary. If the provided data includes answer do not try to add more steps. Example: To find a user's latest post title: 1) Call 'getUser' with username, 2) Extract user.id, 3) Call 'getUserPosts' with extracted id, 4) Access posts[0].title but make each prop as another step from response. If farcaster wallet needs to call at endpoint call get users one of verified eth address. if you can't find verified eth address use custody address.",
        input_schema: {
          type: "object",

          properties: {
            usual_question: {
              type: "boolean",
              description:
                "Flag the nature of the user’s query.\n" +
                "• **true**  – General bot‑usage questions (help, commands, features, etc.).\n" +
                "• **false** – Questions that reference or revolve around a wallet address.",
            },
            contract_address: {
              is_exist: {
                type: "boolean",
                description: "IF the contract address asked in prompt",
              },
              value: {
                type: "string",
                description:
                  "contract address in given prompt. It can ask with CA, ca, contract address, Contract Address, CONTRACT ADDRESS, contract id",
              },
            },
            ticker: {
              type: "object",
              properties: {
                value: {
                  description: "value of ticker",
                  type: "string",
                },

                ca: {
                  type: "string",
                  description:
                    "contract address of ticker. find it from " +
                    JSON.stringify(TOKENS) +
                    " if exists",
                },
              },

              description:
                "Token ticker or symbol. Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here.",
            },
            wallet_provider: {
              type: "object",
              properties: {
                provider_type: {
                  type: "string",
                  description:
                    "wallet provider for user. if user gives a wallet address it will be wallet address. If User gives an ENS name which ends with .eth it is this. If user gives a username it is this. If you find wallet address, type is wallet; if you find ens name type is ens. and if you find username type is fname, if type is fname and username has any space character or it is conceded of more than 1 words ask user to save correct form of the fname and type of this is ask not fname. Value will be wallet address if you find wallet. Otherwise it will be null",
                },
                value: {
                  type: "string",
                  description:
                    "The value of the wallet address. If the type of wallet it will be the found wallet address. Otherwise the value of eth name of user name. It can be given even when analyze wanted",
                },
              },
            },
            endpoint_chain: {
              type: "array",
              description:
                "An ordered sequence of steps to traverse through endpoints and data structures to retrieve the answer.",
              items: {
                type: "object",
                properties: {
                  step_type: {
                    type: "string",
                    description:
                      "The type of step: 'property_access', 'array_index', 'endpoint_call', tool, 'variable_assignment'. if it is the index of array make it array_index",
                    enum: [
                      "property_access",
                      "array_index",
                      "endpoint_call",
                      "variable_assignment",
                      "tool",
                      "ticker",
                      "wallet_provider",
                    ],
                  },
                  add_to_result: {
                    type: "boolean",
                    description:
                      "if result of this step should add to end result it is true. It is just a inter-label for process next steps it is false",
                  },
                  step_value: {
                    type: "string",
                    description:
                      "The property name, array index, endpoint name, other_tool_name or variable name to use in this step. if property name and it has nested parts do each as step. this is important dont do it as one step value like prop.prop2  do each one separate step",
                  },
                  parameters: {
                    type: "object",
                    description:
                      "parameters to pass to an endpoint call, can be get from other properties.",
                    additionalProperties: true,
                  },
                  store_as: {
                    type: "string",
                    description:
                      "Optional name to store the result of this step for use in subsequent steps",
                  },
                  description: {
                    type: "string",
                    description:
                      "Human-readable description of what this step does and why it's needed",
                  },
                  use_previous_result: {
                    type: "boolean",
                    description:
                      "Whether this step should operate on the result of the previous step (default: true)",
                    default: true,
                  },
                  use_stored_value: {
                    type: "object",
                    description:
                      "'Whether endpoint_call parameters includes one of the stored value. If it does give the value key.",
                    properties: {
                      should_use: {
                        description: "Should use stored value",
                        type: "boolean",
                        default: true,
                      },
                      store_key: {
                        description: "the key of stored value",
                        type: "string",
                      },
                    },
                  },
                },
                required: ["step_type", "step_value", "use_stored_value"],
              },
            },
          },
          required: ["endpoint_chain", "usual_question"],
        },
      },
    ],
    follow_up_necessary: () => [
      {
        name: tool_name("follow_up_necessary"),
        input_schema: {
          type: "object",
          properties: {
            is_necessary: {
              type: "boolean",
              description:
                "Determine whether previous messages are necessary to answer the current user query. Return true if the context of previous messages is required for an accurate response, otherwise return false.",
            },
          },
          required: ["is_necessary"],
        },
        description:
          "Decide whether previous messages should be considered to answer the user’s question accurately. If the previous context is needed, return true. Last question is the most important question to answer. Rest is just will be analyzed to include or not.",
      },
    ],
    referral: () => [
      {
        name: tool_name("referral"),
        input_schema: {
          type: "object",
          properties: {
            is_referral: {
              type: "boolean",
              description:
                "Return true if the user query is asking about referral links. True when asked referral links. Otherwise always false. Use the last question. do not use previous messages",
            },
          },
        },
      },
    ],
    wallet_info: () => [
      {
        name: tool_name("wallet_info"),
        input_schema: {
          type: "object",
          properties: {
            is_private_key_asked: {
              type: "boolean",
              description: "If user asked for private key of own wallet",
            },
            is_asked: {
              type: "boolean",
              description:
                "Return true if the user query requests information about their own wallet (e.g., my wallet, my wallet address), otherwise false.",
            },
          },
        },
        description:
          "Determines if the user is asking for their own wallet information. If just asking for wallet information not token address or ticker.",
      },
    ],
    ticker: () => [
      {
        name: tool_name("ticker"),
        input_schema: {
          type: "object",
          properties: {
            ticker: {
              type: "string",
              description:
                'Extract and normalize the token ticker from the user’s query. Accept variations like "$ABC", "ABC", "abc", or "$abc", and always return the ticker in uppercase.',
            },
          },
        },
        description: "Extracts token ticker and returns it in uppercase.",
      },
    ],
    tickerv2: () => [
      {
        name: tool_name("tickerv2"),
        input_schema: {
          type: "object",
          properties: {
            is_about_token: {
              type: "boolean",
              description:
                "Is the question about token or token data. Look for all messages. If any ticker included true. But if user asked another thing other then token it is false",
            },
            value: {
              description: "symbol of ticker",
              type: "string",
            },
            ca_exist: {
              type: "boolean",
              description: "If token ca exist on list or given in question",
            },

            ca: {
              type: "string",
              description:
                "contract address of ticker. find it from " +
                JSON.stringify(TOKENS) +
                " if exists",
            },
          },
        },
        description:
          "Token ticker or symbol. Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here. Use contract address for {from_token} and {to_token}",
      },
    ],
    wallet_provider: () => [
      {
        name: tool_name("wallet_provider"),
        input_schema: {
          type: "object",
          properties: {
            provider_type: {
              type: "string",
              description:
                'Determine the type of wallet identifier from the query. Return "wallet" if it is a wallet address, "ens" if it ends with ".eth", or "fname" if it appears to be a username. if starts with @ like @name it is telegram. In ambiguous cases (e.g., multiple words or spaces), return "ask" for clarification.',
            },
            value: {
              type: "string",
              description:
                "The identified value corresponding to the provider_type. For example, the wallet address or the ENS or farcaster user name provided.",
            },
          },
        },
        description:
          "Identifies the wallet provider type based on the query input and returns the corresponding value.",
      },
    ],
    usd_price: () => [
      {
        name: tool_name("usd_price"),
        input_schema: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description:
                'Extract the USD price from the query. Accept variations like "$1", "1 dollar", "one dollar", "1 USD", etc.',
            },
          },
        },
        description: "Extracts the USD price from the given input.",
      },
    ],
    number_notation: () => [
      {
        name: tool_name("number_notation"),
        input_schema: {
          type: "object",
          properties: {
            amount: {
              type: "array",
              items: {
                type: "number",
                description:
                  "Extract numerical values given in various notations (e.g., 1M, 1 million, 1000000, 1 mill, one mill, 1.000.000, 1mn, 1 mio, 1mm, or for 1K, 1B and variants). Return standardized numeric values.",
                name: "value",
              },
            },
          },
        },
        description: "Standardizes numerical values from the input.",
      },
    ],
    trasaction_type: () => [
      {
        name: tool_name("trasaction_type"),
        input_schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Determine the type of transaction mentioned (e.g., swap, deposit, withdraw, buy, auto_buy, sell).",
            },
          },
        },
        description: "Extracts the transaction type from the query.",
      },
    ],
    percentage_notation: () => [
      {
        name: tool_name("percentage_notation"),
        input_schema: {
          type: "object",
          properties: {
            percentage: {
              type: "array",
              items: {
                type: "number",
                description:
                  'Extract numerical percentage values from the input. Accept formats such as "5%", "5 percent", "5 pct", or "five percent".',
              },
            },
          },
        },
        description:
          "Extracts percentage values from the user query and returns them as normalized numbers.",
      },
    ],
    market_cap: () => [
      {
        name: tool_name("market_cap"),
        input_schema: {
          type: "object",
          properties: {
            is_exist: {
              type: "boolean",
              description:
                'Return true if the user query mentions market cap (e.g., "MC", "MCAP", "market cap").',
            },
          },
        },
        description:
          "Determines if the user query includes market capitalization information.",
      },
    ],
    volume: () => [
      {
        name: tool_name("volume"),
        input_schema: {
          type: "object",
          properties: {
            is_exist: {
              type: "boolean",
              description:
                'Return true if the user query includes volume data (e.g., "VOL", "volume", "VOLUME").',
            },
          },
        },
        description:
          "Determines if the user query includes volume information.",
      },
    ],
    trending: () => [
      {
        name: tool_name("trending"),
        input_schema: {
          type: "object",
          properties: {
            is_asked: {
              type: "boolean",
              description:
                "Return true if the user query is asking about trending tokens.",
            },
          },
        },
        description: "Determines if the user query relates to trending tokens.",
      },
    ],
    analyze: () => [
      {
        name: tool_name("analyze"),
        input_schema: {
          type: "object",
          properties: {
            is_exist: {
              type: "boolean",
              description:
                "Return true if the user query requests an analysis of wallet or token data; otherwise, return false.",
            },
            analyze_type: {
              type: "boolean",
              description:
                'Specify the type of analysis requested: use "wallet" if the analysis is about a wallet, or "token" if it is about a token. For example, "wallet" or "token".',
            },
            value: {
              type: "string",
              description:
                "Provide the wallet address or token identifier to be analyzed, if available.",
            },

            is_my: {
              type: "boolean",
              description:
                'Return true if the query indicates that the analysis is for the user’s own data (e.g., "my wallet" analysis), otherwise false.',
            },
          },
        },
        description:
          "Determines if the query requests an analysis. If true, it specifies whether the analysis is for a wallet or token, includes any provided identifier (value), and indicates if it concerns the user’s own data (is_my).",
      },
    ],
    contract_address: () => [
      {
        name: tool_name("contract_address"),
        input_schema: {
          type: "object",
          properties: {
            is_exist: {
              type: "boolean",
              description:
                'Return true if the user query includes a contract address (e.g., "ca", "CA", "contract address", "contract id").',
            },
            value: {
              type: "string",
              description:
                "The extracted contract address from the query, if available.",
            },
          },
        },
        description:
          "Extracts the contract address from the user query if mentioned.",
      },
    ],
    time: () => [
      {
        name: tool_name("time"),
        input_schema: {
          type: "object",
          properties: {
            label: {
              type: "string",
              description:
                'The time unit mentioned in the query (e.g., "hour", "day", "week"). For example 1w, 1h, 10y',
            },
            value: {
              type: "number",
              description:
                "The numeric value associated with the time unit (e.g., 1, 24, 7).",
            },
          },
        },
        description:
          "Extracts time-related information from the query, returning both the unit and its value.",
      },
    ],
    manage_wallet: function (user_wallet_address: string) {
      return [
        {
          name: tool_name("manage_wallet"),
          input_schema: {
            type: "object",
            description:
              "If the question is asking for one of the transaction type to do agent bot.",
            properties: {
              wallet_provider: {
                type: "object",
                properties: {
                  provider_type: {
                    type: "string",
                    description:
                      'Determine the type of wallet identifier from the query. Return "wallet" if it is a wallet address like 0xDE70F611E821202e1432e7f06c06f124768A6A3D, "ens" if it ends with ".eth", or starts with @ it is "telegram", or "fname" if it appears to be a username. In ambiguous cases (e.g., multiple words or spaces), return "ask" for clarification.',
                  },
                  value: {
                    type: "string",
                    description:
                      "The identified value corresponding to the provider_type. For example, the wallet address or the ENS/username provided.",
                  },
                },
                description:
                  "Identifies the wallet provider type based on the query input and returns the corresponding value.",
              },
              is_dollar: {
                type: "boolean",
                description:
                  "Is user asked for dollar amount. For example $10, 10 dollars, 10$ etc.",
              },
              ticker: {
                type: "object",
                properties: {
                  value: {
                    description: "value of ticker",
                    type: "string",
                  },

                  ca: {
                    type: "string",
                    description:
                      "contract address of ticker. find it from. If user asked dollar and not given the ticker, ticker is WETH. If user asked for ETH ticker is WETH" +
                      JSON.stringify(TOKENS) +
                      " if exists",
                  },
                },

                description:
                  "Token ticker or symbol. Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here. Use contract address for {from_token} and {to_token}",
              },
              middle_token: {
                type: "string",
                description:
                  "Contract address of token to if user asked the amount from antoher token. For example: I want to buy 0.1 ethereum value SMOL. Ethereum is middle token here.",
              },
              transaction_type: {
                type: "string",
                enum: ["WITHDRAW", "DEPOSIT"],
                description:
                  "transaction type asked in question. If user says or means sending to another wallet it is withdraw.",
              },
              is_transaction: {
                type: "boolean",
                description:
                  "If the question asking for agent to perform one of the transaction types.",
              },
              token_address: {
                type: "string",
                description:
                  "Contract address of the from token. For deposit and withdraw.",
              },
              to_wallet_address: {
                type: "string",
                description: `Wallet address for withdraw only. If user asked for own wallet address: ${user_wallet_address} `,
              },
              amount: {
                type: "number",
                description: "The number of the token for the transaction. ",
              },
              amount_percentage: {
                type: "number",
                description:
                  "The percentage number of token for transaction. Both {amount_percentage} and {amount} cant be provided at the same time. ",
              },
            },
          },
        },
      ];
    },
    execute_trade: function (user_wallet_address: string) {
      return [
        {
          name: tool_name("execute_trade"),
          input_schema: {
            type: "object",
            description:
              "If the question is asking for one of the transaction type to do agent bot. Type: SWAP, BUY, SELL. User can ask for one token amount from another token. For example: I want to buy 1 ETH worth of SMOL, ETH is the middle token, SMOL is the from token. Another example: I want to swap 2 ETH worth of SMOL to DRB. SMOL is the from token, ETH is the middle token, DRB is the to token.",
            properties: {
              wallet_provider: {
                type: "object",
                properties: {
                  provider_type: {
                    type: "string",
                    description:
                      'Determine the type of wallet identifier from the query. Return "wallet" if it is a wallet address like 0xDE70F611E821202e1432e7f06c06f124768A6A3D, "ens" if it ends with ".eth", or "fname" if it appears to be a username. In ambiguous cases (e.g., multiple words or spaces), return "ask" for clarification.',
                  },
                  value: {
                    type: "string",
                    description:
                      "The identified value corresponding to the provider_type. For example, the wallet address or the ENS/username provided.",
                  },
                },
                description:
                  "Identifies the wallet provider type based on the query input and returns the corresponding value.",
              },
              is_dollar: {
                type: "boolean",
                description:
                  "Is user asked for dollar amount. For example $10, 10 dollars, 10$ etc.",
              },
              middle_token: {
                type: "string",
                description:
                  "Contract address of token to if user asked the amount from antoher token. For example: I want to buy 0.1 ethereum value SMOL. Ethereum is middle token here.",
              },
              from_ticker: {
                type: "string",
                description: "Ticker symbol for from token.",
              },
              to_ticker: {
                type: "string",
                description: "Ticker symbp; for to token",
              },
              ticker: {
                type: "object",
                properties: {
                  value: {
                    description: "value of ticker",
                    type: "string",
                  },

                  ca: {
                    type: "string",
                    description:
                      "contract address of ticker. find it from. If user asked for ETH ticker is WETH " +
                      JSON.stringify(TOKENS) +
                      " if exists",
                  },
                },

                description:
                  "Token ticker or symbol. Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here. Use contract address for {from_token} and {to_token}",
              },
              transaction_type: {
                type: "string",
                enum: ["SWAP", "BUY", "SELL"],
                description: "transaction type asked in question",
              },
              is_transaction: {
                type: "boolean",
                description:
                  "If the question asking for agent to perform one of the transaction types. SWAP, BUY, SELL is okay. WITHDRAW and DEPOSIT is not okay",
              },
              from_token: {
                type: "string",
                description:
                  "Contract address for token for buy, sell and swap. Some cases: if user asks x amount of y worth of Z the token is Z. If user asks x amount of y the token is y.",
              },

              to_token: {
                type: "string",
                description: "Contract address for token to swap.",
              },
              token_address: {
                type: "string",
                description:
                  "Contract address of the from token. For deposit and withdraw",
              },
              to_wallet_address: {
                type: "string",
                description: `Wallet address for withdraw only. If user asked for own wallet address: ${user_wallet_address} `,
              },
              amount: {
                type: "number",
                description: "The number of the token for the transaction. ",
              },
              amount_percentage: {
                type: "number",
                description:
                  "The percentage number of token for transaction. Both {amount_percentage} and {amount} cant be provided at the same time. ",
              },
            },
          },
        },
      ];
    },
    token_amount: () => [
      {
        name: tool_name("token_amount"),
        input_schema: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description:
                "The amount for the token for deposit, withdraw, swap, buy or sell. If user asked for percentage the calculate it for given balance. And floor it to closest integer",
            },
          },
          required: ["amount"],
        },
        description: "amount of token",
      },
    ],
    usd_prices_of_tokens: () => [
      {
        name: tool_name("usd_prices_of_tokens"),
        input_schema: {
          type: "object",
          properties: {
            contract_addresses: {
              type: "array",
              desciption: "possible token contract addresses",
              items: {
                contract_address: {
                  type: "string",
                  desciption: "token contract address",
                },
              },
            },
          },
          description: `Token contract address list. Get contract address from list for given token ${JSON.stringify(
            TOKENS
          )}`,
          required: ["contract_addresses"],
        },
      },
    ],
    token_basic_data_enough: (tickerStaticData: any, question: any) => [
      {
        name: tool_name("token_basic_data_enough"),
        input_schema: {
          description: `Just a usual bot question, or needs additional data`,
          type: "object",
          properties: {
            static_enough: {
              type: "boolean",
              default: false,
              description: `Just a usual bot question, or question can be answered with ${JSON.stringify(
                tickerStaticData
              )}. Or ${question} includes answer. If question not answer with the data provided and not a usual question it is false`,
            },
          },
          required: ["static_enough"],
        },
      },
    ],
  };
  return tools;
};
