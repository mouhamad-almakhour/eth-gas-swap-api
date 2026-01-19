# Eth Gas & Uniswap API

A NestJS-based REST API backend  service that provides:
- Real-time Ethereum gas price (cached, fast response)
- Uniswap V2 token swap estimation

# Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Examples](#api-examples)

# Features
- 🔄 Fast gas price estimates with response time < 50ms via Alchemy
- 🔄 Gas price refresh every 12 seconds (cron job)  
- 💱 Uniswap V2 swap calculations and price quotes
- 📊 Interactive Swagger API documentation
- 📊 Clean DTO-based response structure  
- 🔒 Environment validation for secure deployment
- 🐳 Docker and docker-compose support

# Getting Started

## Prerequisites
Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 16.x)
- [npm](https://www.npmjs.com/) (>= 8.x) or [yarn](https://yarnpkg.com/)
- An [Alchemy](https://www.alchemy.com/) account and API key
- [Docker Engine](https://docs.docker.com/engine/) `1.27+`
- Access to an Ethereum RPC node ( [infura](https://www.infura.io/), [alchemy](https://www.alchemy.com/), [quicknode](https://www.quicknode.com/)  )



## Configuration: .env 
1. Create a `.env` file in the root directory rom the sample with the following variables:
```bash
cp .env-sample .env
```
2. Fill in the required variables:
```bash
# Required
ALCHEMY_API_KEY=your_alchemy_api_key    # Your Alchemy API key
ALCHEMY_NETWORK=mainnet                 # Ethereum network (mainnet, goerli, etc.)

# Optional
PORT=3000                              # API port (defaults to 3000)
UNISWAP_FACTORY_ADDRESS=0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f  # UniswapV2 factory (defaults)
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eth-gas-swap-api
```

2. Install dependencies:
```bash
npm install
# or using yarn
yarn install
```

3. Build the project:
```bash
npm run build
# or using yarn
yarn build
```

## Running the Application

Start the application in different modes:

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at:
- API Endpoints: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

## API Documentation

### 1. Gas Price Endpoint

#### Get Current Gas Price
```http
GET /gas-price
```
- Returns the current gas price in Gwei with metadata.
- Cached to guarantee < 50ms response time.

Response example:
```json
{
  "slow": 1.75751619,
  "standard": 1.75751619,
  "fast": 2.50751619,
  "instant": 3.25751619,
  "baseFee": 0.25751619,
  "priorityFee": 1.5,
  "timestamp": 1760002992122,
  "blockNumber": 23539355,
  "cacheAge": 5829,
  "cacheAgeInSeconds": 6
}
```

### Uniswap Endpoint

#### Swap Estimate (Uniswap V2)
```http
POST /swap-change
```
Locates the Uniswap V2 pool, reads reserves, and returns the expected output for a swap.

**Body (JSON, validated by `GetReturnDto`)**:
- `fromTokenAddress` — source token (ERC20) address  
- `toTokenAddress` — destination token (ERC20) address  
- `amountIn` — exact input amount in human-readable units (string, e.g., `"1.5"`)

Request example:
```json
{
  "fromTokenAddress": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "toTokenAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "amountIn": "1"
}
```

Response example:
```json
{
  "fromToken": {
    "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "symbol": "LINK",
    "decimals": 18
  },
  "toToken": {
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "symbol": "USDC",
    "decimals": 6
  },
  "amountIn": "1000000000000000000",
  "amountOut": "21205458",
  "amountInFormatted": "1.0",
  "amountOutFormatted": "21.205458",
  "pairAddress": "0xd8C8a2B125527bf97c8e4845b25dE7e964468F77",
  "reserves": {
    "reserve0": "22125722115717592033",
    "reserve1": "491803340"
  }
}
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t eth-gas-swap-api .
```

2. Run with docker-compose:
```bash
docker-compose up -d
```

## Development Commands

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Project Structure
```
eth-gas-uniswap-api/
├── dist/                     # Compiled files
├── src/
|   |── alchemy/              # Alchemy API integration
│   ├── gas-price/            # Gas price estimation
│   ├── uniswap/              # Uniswap V2 integration
│   ├── config/
│   └── main.ts               # Application entry point
├── .env-sample
├── package.json
├── docker-compose.yml
├── Dockerfile
├── rest-client.http          # 👉 quick endpoint testing file
└── tsconfig.json
```

# Version
Version: 1.0.0