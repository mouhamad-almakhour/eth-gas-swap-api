import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDescription(): string {
    return [
      '<b>🔹 API Overview:</b>',
      '',
      '• <b>GET /gasPrice</b><br>',
      'Returns the recent gas price on the Ethereum network. The response should be very fast (≤ 50 ms).',
      '',
      '• <b>GET /return/:fromTokenAddress/:toTokenAddress/:amountIn</b><br>',
      'Estimates the output amount when swapping an exact input amount via Uniswap V2.<br>',
      'It does not execute a swap. It reads on-chain reserves and applies the Uniswap V2 formula off-chain.',
    ].join('<br>');
  }
}
