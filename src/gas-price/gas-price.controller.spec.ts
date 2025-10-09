import { Test, TestingModule } from '@nestjs/testing';
import { GasPriceController } from './gas-price.controller';
import { GasPriceService } from './gas-price.service';
import { GasPriceResponseDto } from './dto/gas-price-response.dto';

describe('GasPriceController', () => {
    let controller: GasPriceController;
    let service: GasPriceService;

    const mockResponse: GasPriceResponseDto = {
        slow: 10,
        standard: 20,
        fast: 30,
        instant: 40,
        baseFee: 15,
        priorityFee: 2,
        timestamp: Date.now(),
        blockNumber: 12345678,
        cacheAge: 5000,
        cacheAgeInSeconds: 5,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GasPriceController],
            providers: [
                {
                    provide: GasPriceService,
                    useValue: {
                        getCachedGasPrice: jest.fn().mockResolvedValue(mockResponse),
                    },
                },
            ],
        }).compile();

        controller = module.get<GasPriceController>(GasPriceController);
        service = module.get<GasPriceService>(GasPriceService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return GasPriceResponseDto with cache metadata', async () => {
        const result = await controller.getGasPrice();
        expect(result).toBeDefined();
        expect(result.fast).toEqual(mockResponse.fast);
        expect(result.instant).toEqual(mockResponse.instant);
        expect(result.cacheAge).toBeDefined();
        expect(result.cacheAgeInSeconds).toBeDefined();
        expect(service.getCachedGasPrice).toHaveBeenCalled();
    });
});
