import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GasPriceService } from './gas-price.service';
import { GasPriceResponseDto } from './dto/gas-price-response.dto';
import { ApiOperation } from '@nestjs/swagger';
/**
 * Controller handling gas price API endpoint
 * Provides ultra-fast responses (<50ms) using cached data
 * the endpoint is GET /gasPrice and it return a respone object of the type GasPriceResponseDto
 */

@Controller()
export class GasPriceController {
  private readonly logger = new Logger(GasPriceController.name);

  constructor(private readonly gasPriceService: GasPriceService) { }

  // Get current gas price
  @ApiOperation({
    summary:
      'Get current Ethereum gas prices (all values (except formatted) in Gwei)',
  })
  @Get('gasPrice')
  async getGasPrice(): Promise<GasPriceResponseDto> {
    try {
      //  Use cached gas price for ultra-fast response
      return await this.gasPriceService.getCachedGasPrice();

      // calculate response time manually for debugging
      //  const startTime = Date.now();
      // const gasPrice = this.gasPriceService.getCachedGasPrice();
      // const responseTime = Date.now() - startTime;
      //  this.logger.debug(`Response time: ${responseTime}ms`);
      // return gasPrice;
    } catch (error) {
      this.logger.error(`Failed to get gas price: ${error.message}`);

      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message:
            'Gas price service is initializing. Please try again shortly.',
          error: 'Service Unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
