import { Module } from '@nestjs/common';
import { GasPriceService } from './gas-price.service';
import { GasPriceController } from './gas-price.controller';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [CacheModule.register()],
  providers: [GasPriceService],
  controllers: [GasPriceController],

})
export class GasPriceModule { }
