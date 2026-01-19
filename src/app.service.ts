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
      '<b>POST /swap-change </b><br>',
      'Request body example: { "fromTokenAddress": "0x514910771AF9Ca656af840dff83E8264EcF986CA", "toTokenAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "amountIn": "1" }<br>',
      'Estimates the output amount when swapping an exact input amount via Uniswap V2.<br>',
      'It does not execute a swap. It reads on-chain reserves and applies the Uniswap V2 formula off-chain.',
    ].join('<br>');
  }
}
