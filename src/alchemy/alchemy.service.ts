import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class AlchemyService implements OnModuleInit {
  private readonly logger = new Logger(AlchemyService.name);
  private provider!: ethers.providers.JsonRpcProvider;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('alchemy.apiKey');

    if (!apiKey) {
      throw new Error('ALCHEMY_API_KEY is not configured');
    }
    }

    const rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;

    try {
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      this.logger.log('Alchemy connected');
    } catch (e) {
      this.logger.error('Alchemy init failed', e as Error);
    }
  }

  getProvider(): ethers.providers.JsonRpcProvider {
    if (!this.provider) {
      throw new Error('Alchemy provider not initialized');
    }
    return this.provider;
  }
}
