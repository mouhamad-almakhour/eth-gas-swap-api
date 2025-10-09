// Factory ABI (minimal)
export const FACTORY_ABI = [
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

// Pair ABI (minimal)
export const PAIR_ABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
];


// ERC20 ABI for decimals
export const ERC20_ABI = [
    'function decimals() external view returns (uint8)',
    'function symbol() external view returns (string)',
];