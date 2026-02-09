import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class AlchemyService implements OnModuleInit {
  private readonly logger = new Logger(AlchemyService.name);
  private provider!: ethers.providers.JsonRpcProvider;
  private readonly apiKey: string | undefined; // Alchemy API key
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('alchemy.apiKey');
    if (!this.apiKey) {
      this.logger.error('ALCHEMY_API_KEY missing');
      return;
    }
  }

  async onModuleInit() {
    const rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${this.apiKey}`;

    try {
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      await this.provider.getNetwork();

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
