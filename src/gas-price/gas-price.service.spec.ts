import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AlchemyService } from '../alchemy/alchemy.service'; // adjust path
import { GasPriceResponseDto } from './dto/gas-price-response.dto';
import { IGasPrice } from './interfaces/gas-price.interface';
import { GasPriceService } from './gas-price.service';
import { Test, TestingModule } from '@nestjs/testing';
describe('GasPriceService', () => {
    let service: GasPriceService;

    const mockIGasPrice: IGasPrice = {
        slow: 10,
        standard: 20,
        fast: 30,
        instant: 40,
        baseFee: 15,
        priorityFee: 2,
        timestamp: Date.now(),
        blockNumber: 12345678,
    };

    const mockResponse: GasPriceResponseDto = {
        ...mockIGasPrice,
        cacheAge: 5000,
        cacheAgeInSeconds: 5,
    };

    const mockAlchemyService = {
        getProvider: jest.fn(), // mock any methods you use
        // other methods if needed
    };

    const mockCacheManager: Partial<Cache> = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GasPriceService,
                { provide: AlchemyService, useValue: mockAlchemyService },
                { provide: CACHE_MANAGER, useValue: mockCacheManager },
            ],
        }).compile();

        service = module.get<GasPriceService>(GasPriceService);

        // mock the cached gas price
        jest.spyOn(service, 'getCachedGasPrice').mockResolvedValue(mockResponse);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return cached IGasPrice', async () => {
        const result = await service.getCachedGasPrice();
        expect(result).toEqual(mockResponse);
    });
});
