import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class AlchemyService implements OnModuleInit {

    private readonly logger = new Logger(AlchemyService.name); // Logger instance
    private provider: ethers.providers.AlchemyProvider; // Alchemy provider instance
    private readonly apiKey: string | undefined; // Alchemy API key
    private readonly network: string | undefined; // Alchemy network


    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('alchemy.apiKey');
        this.network = this.configService.get<string>('alchemy.network');

        if (!this.apiKey) {
            throw new Error(
                'ALCHEMY_API_KEY is required. Please set it in .env file.'
            );
        }
    }
    // Initialize the Alchemy provider when the module is initialized
    async onModuleInit() {
        this.initializeAlchemyProvider();
    }

    // Initialize Alchemy provider
    private async initializeAlchemyProvider(): Promise<void> {
        try {
            this.provider = new ethers.providers.AlchemyProvider(
                this.network,
                this.apiKey
            );

            this.logger.log(`Connected to Alchemy on  Ethereum: ${this.network}\n` +
                ` via Provider: ${this.provider.constructor.name}`
            );

        } catch (error) {
            this.logger.error(`Failed to connect to Alchemy provider: ${error.message}`);
            throw error;
        }
    }

    // Get the Alchemy provider
    getProvider(): ethers.providers.AlchemyProvider {
        if (!this.provider) {
            throw new Error('Alchemy provider not initialized');
        }
        return this.provider;
    }

}


