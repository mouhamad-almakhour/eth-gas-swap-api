import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Cron } from '@nestjs/schedule';
import { ethers } from 'ethers';
import { IGasPrice } from './interfaces/gas-price.interface';
import { GasPriceResponseDto } from './dto/gas-price-response.dto';
import { AlchemyService } from '../alchemy/alchemy.service';

@Injectable()
export class GasPriceService implements OnModuleInit {

    private readonly logger = new Logger(GasPriceService.name);
    private readonly CACHE_STALE_THRESHOLD = 30000; // 30 seconds
    private provider: ethers.providers.AlchemyProvider; // Alchemy provider instance

    constructor(private readonly alchemyService: AlchemyService,
        @Inject(CACHE_MANAGER) private cache: Cache) {
        // this.provider = this.alchemyService.getProvider();
    }


    async onModuleInit(): Promise<void> {
        this.logger.log('Initializing gas price cache...');
        await this.updateGasPriceCache();
        this.logger.log('Gas price cache initialized successfully');
    }

    /**
     *  Update gas price every 12 seconds
     * This method fetches the latest gas price from the blockchain
     * and updates the cache. It runs as a cron job. 
     * 12 * * * * * means every 12 seconds.
     * @returns {Promise<void>}
     */
    @Cron(process.env.GAS_PRICE_UPDATE_INTERVAL_CRON || '*/12 * * * * *')
    async updateGasPriceCache(): Promise<void> {

        // Start measuring time
        const startTime = Date.now();

        try {
            // Fetch latest gas price from blockchain
            const gasPrice = await this.fetchGasPriceFromBlockchain();

            // Update cache with new gas price and current timestamp
            await this.cache.set('gasPrice', {
                data: gasPrice,
                fetchedAt: Date.now(),
            });

            // Log success with duration and key details
            const duration = Date.now() - startTime;
            this.logger.log(
                `Gas price updated successfully in ${duration}ms | ` +
                `Block: ${gasPrice.blockNumber} | ` +
                `Base: ${gasPrice.baseFee} Gwei | ` +
                `Standard: ${gasPrice.standard} Gwei`
            );
        } catch (error) {
            this.logger.error(`Failed to update gas price: ${error.message}`, error.stack);


        }
    }

    /**
     * Fetch gas price data from the blockchain using Alchemy provider
     * @returns Promise<IGasPrice>
     */

    private async fetchGasPriceFromBlockchain(): Promise<IGasPrice> {

        // Get the Alchemy provider
        const provider = this.alchemyService.getProvider(); // Using Alchemy provider
        const block = await provider.getBlock('latest'); // Fetch latest block for base fee
        const feeData = await provider.getFeeData(); // Fetch fee data for gas price and priority fee

        if (!block || !feeData) {
            throw new Error('Failed to fetch block or fee data from provider');
        }

        // Convert BigNumber values to numbers in Gwei
        const baseFee = block.baseFeePerGas ? Number(ethers.utils.formatUnits(block.baseFeePerGas, 'gwei')) : 0;
        const priorityFee = feeData.maxPriorityFeePerGas ? Number(ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')) : 0;
        const gasPrice = feeData.gasPrice ? Number(ethers.utils.formatUnits(feeData.gasPrice, 'gwei')) : 0;

        // Simple heuristic to derive slow/standard/fast/instant from gasPrice and priorityFee
        return {
            slow: Math.max(gasPrice * 0.8, baseFee + priorityFee), // 80% of gas price or base+tip
            standard: Math.max(gasPrice, baseFee + priorityFee), // gas price or base+tip
            fast: Math.max(gasPrice * 1.2, baseFee + priorityFee * 1.5), // 120% of gas price or base+1.5*tip
            instant: Math.max(gasPrice * 1.5, baseFee + priorityFee * 2), // 150% of gas price or base+2*tip
            baseFee,
            priorityFee,
            timestamp: Date.now(),
            blockNumber: block.number,
        };
    }

    /**
       * Get cached gas price data (ultra-fast, <5ms)
       * This method is called by the controller for each API request
       * @returns Gas price data with cache age
       * @throws Error if cache is not initialized
       */
    async getCachedGasPrice(): Promise<GasPriceResponseDto> {

        // Fetch cached data
        const cachedData = await this.cache.get<{ data: IGasPrice; fetchedAt: number }>('gasPrice');

        if (!cachedData) {
            throw new Error('Gas price cache not initialized. Please try again in a few seconds.');
        }

        // Calculate cache age
        const cacheAge = Date.now() - cachedData.fetchedAt;

        // Log warning if cache is too old
        if (cacheAge > this.CACHE_STALE_THRESHOLD) {
            this.logger.warn(`Cache is stale: ${Math.round(cacheAge / 1000)}s old`);
        }

        return {
            ...cachedData.data,
            cacheAge: Math.round(cacheAge),
            cacheAgeInSeconds: Math.round(cacheAge / 1000),

        };
    }


}
