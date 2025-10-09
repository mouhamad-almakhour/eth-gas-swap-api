import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ethers } from 'ethers';
import { AlchemyService } from '../alchemy/alchemy.service';
import { UniswapMath } from './uniswap-math.util';
import { FACTORY_ABI, PAIR_ABI, ERC20_ABI } from '../alchemy/contracts/abi.contract';
import { ConfigService } from '@nestjs/config';
import { UniswapResponseDto, } from './dto/uniswap-response.dto';

/**
 * Service for interacting with UniswapV2 to calculate swap returns
 */
@Injectable()
export class UniswapService {
    private readonly logger = new Logger(UniswapService.name);
    private readonly factoryAddress: string;

    constructor(private alchemyService: AlchemyService, private configService: ConfigService) {
        // this.provider = this.alchemyService.getProvider();
        const addr = this.configService.get<string>('uniswap.factoryAddress');
        if (!addr) {
            throw new Error('Missing uniswap.factoryAddress in config');
        }
        this.factoryAddress = addr;
    }

    /**
     * Calculates the output amount for a swap on UniswapV2
     * 
     * @param fromTokenAddress - Source token address
     * @param toTokenAddress - Destination token address
     * @param amountIn - Input amount as string (in human-readable format, e.g., "1" for 1 token)
     * @returns Swap details including estimated output
     */
    async getReturn(
        fromTokenAddress: string,
        toTokenAddress: string,
        amountIn: string,
    ): Promise<UniswapResponseDto> {
        try {
            // Get pair address from factory
            const provider = this.alchemyService.getProvider(); // Using Alchemy provider
            const factory = new ethers.Contract(this.factoryAddress, FACTORY_ABI, provider);

            const pairAddress = await factory.getPair(fromTokenAddress, toTokenAddress);

            if (pairAddress === ethers.constants.AddressZero) {
                throw new NotFoundException('No liquidity pool exists for this token pair');
            }

            // Fetch token metadata first (we need decimals for conversion)
            const [fromToken, toToken] = await Promise.all([
                this.getTokenInfo(fromTokenAddress),
                this.getTokenInfo(toTokenAddress),
            ]);

            // Get pair contract
            const pair = new ethers.Contract(pairAddress, PAIR_ABI, provider);

            // Fetch reserves and token order
            const [reserves, token0Address] = await Promise.all([
                pair.getReserves(),
                pair.token0(),
            ]);

            // Determine which token is token0 and which is token1
            const [token0, token1] = UniswapMath.sortTokens(fromTokenAddress, toTokenAddress);
            const isToken0Input = token0.toLowerCase() === fromTokenAddress.toLowerCase();

            const reserveIn = isToken0Input ? reserves.reserve0 : reserves.reserve1;
            const reserveOut = isToken0Input ? reserves.reserve1 : reserves.reserve0;

            // Calculate output amount using UniswapV2 formula
            const amountInWei = ethers.utils.parseUnits(amountIn, fromToken.decimals);
            const amountInBN = ethers.BigNumber.from(amountInWei);
            const amountOut = UniswapMath.getAmountOut(amountInBN, reserveIn, reserveOut);

            return {
                fromToken: {
                    address: fromTokenAddress,
                    symbol: fromToken.symbol,
                    decimals: fromToken.decimals,
                },
                toToken: {
                    address: toTokenAddress,
                    symbol: toToken.symbol,
                    decimals: toToken.decimals,
                },
                amountIn: amountInWei.toString(), // Return wei amount in
                amountOut: amountOut.toString(), // Return wei amount out
                amountInFormatted: ethers.utils.formatUnits(amountInWei, fromToken.decimals),
                amountOutFormatted: ethers.utils.formatUnits(amountOut, toToken.decimals),
                pairAddress,
                reserves: {
                    reserve0: reserves.reserve0.toString(),
                    reserve1: reserves.reserve1.toString(),
                },

            };
        } catch (error) {
            this.logger.error('Error calculating swap return', error);
            throw error;
        }
    }

    /**
     * Fetches token metadata (symbol and decimals)
     */
    private async getTokenInfo(tokenAddress: string) {
        const provider = this.alchemyService.getProvider(); // Using Alchemy provider
        const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        try {
            const [symbol, decimals] = await Promise.all([
                token.symbol(),
                token.decimals(),
            ]);
            return { symbol, decimals };
        } catch (error) {
            this.logger.warn(`Could not fetch token info for ${tokenAddress}`);
            return { symbol: 'UNKNOWN', decimals: 18 };
        }
    }
}