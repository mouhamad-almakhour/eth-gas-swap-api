export default () => ({
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: process.env.ALCHEMY_NETWORK || 'mainnet',
  },
  uniswap: {
    factoryAddress:
      process.env.UNISWAP_FACTORY_ADDRESS ||
      '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  },
});
