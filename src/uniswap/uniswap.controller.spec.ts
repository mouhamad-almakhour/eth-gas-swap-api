import { Test, TestingModule } from '@nestjs/testing';
import { UniswapController } from './uniswap.controller';
import { UniswapService } from './uniswap.service';
import { GetReturnDto } from './dto/create-swap.dto';
import { UniswapResponseDto } from './dto/uniswap-response.dto';
import { BadRequestException } from '@nestjs/common';

describe('UniswapController', () => {
  let controller: UniswapController;
  let service: UniswapService;

  const mockResponse: UniswapResponseDto = {
    fromToken: { address: '0xTokenA', symbol: 'TKA', decimals: 18 },
    toToken: { address: '0xTokenB', symbol: 'TKB', decimals: 18 },
    amountIn: '1000000000000000000',
    amountOut: '500000000000000000',
    amountInFormatted: '1',
    amountOutFormatted: '0.5',
    pairAddress: '0xPairAddress',
    reserves: {
      reserve0: '1000000000000000000',
      reserve1: '2000000000000000000',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniswapController],
      providers: [
        {
          provide: UniswapService,
          useValue: {
            getReturn: jest.fn().mockResolvedValue(mockResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<UniswapController>(UniswapController);
    service = module.get<UniswapService>(UniswapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return UniswapResponseDto', async () => {
    const dto: GetReturnDto = {
      fromTokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      toTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amountIn: '1.5',
    };

    const result = await controller.getReturn(dto);

    expect(result).toEqual(mockResponse);
    expect(service.getReturn).toHaveBeenCalledWith(
      dto.fromTokenAddress,
      dto.toTokenAddress,
      dto.amountIn,
    );
  });

  it('should throw BadRequestException if service throws', async () => {
    (service.getReturn as jest.Mock).mockRejectedValue(
      new Error('Invalid input'),
    );

    const dto: GetReturnDto = {
      fromTokenAddress: '0xInvalidToken',
      toTokenAddress: '0xInvalidToken',
      amountIn: '1.5',
    };

    await expect(controller.getReturn(dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
