import { Module, Global } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';

/**
 * This module provide the AlchemyService as a global service
 */

@Global()
@Module({
  providers: [AlchemyService],
  exports: [AlchemyService],
})
export class AlchemyModule { }
