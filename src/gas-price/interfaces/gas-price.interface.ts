/**
 * Represents Ethereum gas price data in Gwei units
 */
export interface IGasPrice {
    /** Standard/slow gas price - lowest cost, slower confirmation */
    slow: number;

    /** Standard gas price - balanced cost and speed */
    standard: number;

    /** Fast gas price - higher cost, faster confirmation */
    fast: number;

    /** Instant gas price - highest cost, fastest confirmation */
    instant: number;

    /** EIP-1559 base fee per gas in Gwei */
    baseFee: number;

    /** Suggested priority fee for standard transaction */
    priorityFee: number;

    /** Unix timestamp when data was fetched */
    timestamp: number;

    /** Block number when data was fetched */
    blockNumber: number;
}

