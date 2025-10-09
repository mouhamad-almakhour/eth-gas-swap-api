import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlchemyModule } from './alchemy/alchemy.module';
import { ConfigModule } from '@nestjs/config';
import { GasPriceModule } from './gas-price/gas-price.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { UniswapModule } from './uniswap/uniswap.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
  CacheModule.register({
    isGlobal: true, // Makes cache available everywhere
    ttl: 30, // seconds (default TTL)
    max: 100, // maximum number of items in cache
  }),
  ScheduleModule.forRoot(),
    AlchemyModule,
    GasPriceModule,
    UniswapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
