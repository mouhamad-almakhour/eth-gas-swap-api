import { Test, TestingModule } from '@nestjs/testing';
import { UniswapService } from './uniswap.service';
import { AlchemyService } from '../alchemy/alchemy.service';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { UniswapResponseDto } from './dto/uniswap-response.dto';

describe('UniswapService', () => {
    let service: UniswapService;
    let alchemyService: AlchemyService;
    let configService: ConfigService;

    const mockProvider = {};
    const factoryAddress = '0xFactoryAddress';
    const pairAddress = '0xPairAddress';
    const fromTokenAddress = '0xTokenA';
    const toTokenAddress = '0xTokenB';
    const amountIn = '1';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UniswapService,
                {
                    provide: AlchemyService,
                    useValue: {
                        getProvider: jest.fn().mockReturnValue(mockProvider),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            if (key === 'uniswap.factoryAddress') return factoryAddress;
                            return null;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<UniswapService>(UniswapService);
        alchemyService = module.get<AlchemyService>(AlchemyService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return UniswapResponseDto', async () => {
        // Mock ethers.Contract for factory
        const mockFactory = {
            getPair: jest.fn().mockResolvedValue(pairAddress),
        };

        const mockPair = {
            getReserves: jest.fn().mockResolvedValue({ reserve0: ethers.BigNumber.from(1000), reserve1: ethers.BigNumber.from(2000) }),
            token0: jest.fn().mockResolvedValue(fromTokenAddress),
        };

        const mockToken = {
            symbol: jest.fn().mockResolvedValue('TKA'),
            decimals: jest.fn().mockResolvedValue(18),
        };

        // Mock ethers.Contract constructor
        jest.spyOn(ethers, 'Contract').mockImplementation((address, abi, provider) => {
            if (address === factoryAddress) return mockFactory as any;
            if (address === pairAddress) return mockPair as any;
            if (address === fromTokenAddress || address === toTokenAddress) return mockToken as any;
            return {} as any;
        });

        const result: UniswapResponseDto = await service.getReturn(fromTokenAddress, toTokenAddress, amountIn);

        expect(result.fromToken.address).toBe(fromTokenAddress);
        expect(result.toToken.address).toBe(toTokenAddress);
        expect(result.amountIn).toBeDefined();
        expect(result.amountOut).toBeDefined();
        expect(result.amountInFormatted).toBeDefined();
        expect(result.amountOutFormatted).toBeDefined();
        expect(result.pairAddress).toBe(pairAddress);
        expect(mockFactory.getPair).toHaveBeenCalledWith(fromTokenAddress, toTokenAddress);
    });

    it('should throw error if pair does not exist', async () => {
        // Override getPair to return zero address
        const mockFactory = {
            getPair: jest.fn().mockResolvedValue(ethers.constants.AddressZero),
        };
        jest.spyOn(ethers, 'Contract').mockImplementation((address, abi, provider) => {
            if (address === factoryAddress) return mockFactory as any;
            return {} as any;
        });

        await expect(service.getReturn(fromTokenAddress, toTokenAddress, amountIn)).rejects.toThrow();
    });
});
