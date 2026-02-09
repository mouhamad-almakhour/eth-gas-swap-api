import { Body, Controller, Post } from '@nestjs/common';
import { UniswapService } from './uniswap.service';
import { UniswapResponseDto } from './dto/uniswap-response.dto';
import { GetReturnDto } from './dto/create-swap.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * Controller handling Uniswap swap estimate endpoint
 * Exposes POST /swap-change with swap parameters provided in the request body.
 */
@Controller('v1/api/swap-change')
export class UniswapController {
  constructor(private readonly uniswapService: UniswapService) {}

  @ApiOperation({
    summary:
      'Get expected return amount from UniswapV2 for a given token swap (swap-change)',
  })
  @Post()
  async getReturn(@Body() dto: GetReturnDto): Promise<UniswapResponseDto> {
    // DTO is validated by Nest's ValidationPipe (typically configured globally)
    return this.uniswapService.getReturn(dto);
  }
}
