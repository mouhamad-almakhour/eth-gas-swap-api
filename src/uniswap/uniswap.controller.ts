import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { UniswapService } from './uniswap.service';
import { UniswapResponseDto } from './dto/uniswap-response.dto';
import { GetReturnDto } from './dto/create-swap.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * Controller handling Uniswap swap return API endpoint
 * the endpoint is GET /return/{fromTokenAddress}/{toTokenAddress}/{amountIn}
 * and it return a respone object of the type UniswapResponseDto
 * */

@Controller('return')
export class UniswapController {
    constructor(private readonly uniswapService: UniswapService) { }

    @ApiOperation({ summary: 'Get expected return amount from UniswapV2 for a given token swap' })
    @Get(':fromTokenAddress/:toTokenAddress/:amountIn')
    async getReturn(
        @Param() dto: GetReturnDto
    ): Promise<UniswapResponseDto> {

        try {
            return await this.uniswapService.getReturn(
                dto.fromTokenAddress,
                dto.toTokenAddress,
                dto.amountIn,
            );
        } catch (error) {
            throw new BadRequestException('Invalid route. Expected format: /return/{fromTokenAddress}/{toTokenAddress}/{amountIn}');
        }

    }

}
