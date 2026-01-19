import { ethers } from 'ethers';

/**
 * UniswapV2 math utilities for off-chain calculations
 *
 * Implements the constant product formula: x * y = k
 * Formula: amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
 *
 * The 997/1000 factor represents the 0.3% fee taken by Uniswap
 */
export class UniswapMath {
  /**
   * Calculates output amount for a given input using UniswapV2 formula
   *
   * @param amountIn - Input amount in smallest unit
   * @param reserveIn - Reserve of input token in the pair
   * @param reserveOut - Reserve of output token in the pair
   * @returns Output amount after fees
   */
  static getAmountOut(
    amountIn: ethers.BigNumber,
    reserveIn: ethers.BigNumber,
    reserveOut: ethers.BigNumber,
  ): ethers.BigNumber {
    if (amountIn.lte(0)) {
      throw new Error('INSUFFICIENT_INPUT_AMOUNT');
    }
    if (reserveIn.lte(0) || reserveOut.lte(0)) {
      throw new Error('INSUFFICIENT_LIQUIDITY');
    }

    // amountInWithFee = amountIn * 997
    const amountInWithFee = amountIn.mul(997);

    // numerator = amountInWithFee * reserveOut
    const numerator = amountInWithFee.mul(reserveOut);

    // denominator = (reserveIn * 1000) + amountInWithFee
    const denominator = reserveIn.mul(1000).add(amountInWithFee);

    // amountOut = numerator / denominator
    return numerator.div(denominator);
  }

  /**
   * Sorts two token addresses to match UniswapV2 pair ordering
   * Uniswap always stores token0 < token1
   */
  static sortTokens(tokenA: string, tokenB: string): [string, string] {
    if (tokenA.toLowerCase() === tokenB.toLowerCase()) {
      throw new Error('IDENTICAL_ADDRESSES');
    }

    const [token0, token1] =
      tokenA.toLowerCase() < tokenB.toLowerCase()
        ? [tokenA, tokenB]
        : [tokenB, tokenA];

    if (!token0) {
      throw new Error('ZERO_ADDRESS');
    }

    return [token0, token1];
  }
}
