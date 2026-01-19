import { IsNotEmpty, IsNumber } from 'class-validator';
/**
 * API response DTO for gas price endpoint
 * Contains gas prices in Gwei and metadata
 */
export class GasPriceResponseDto {
  /** Standard/slow gas price in Gwei */
  @IsNumber()
  @IsNotEmpty()
  slow: number;

  /** Standard gas price in Gwei */
  @IsNumber()
  @IsNotEmpty()
  standard: number;

  /** Fast gas price in Gwei */
  @IsNumber()
  @IsNotEmpty()
  fast: number;

  /** Instant gas price in Gwei */
  @IsNumber()
  @IsNotEmpty()
  instant: number;

  /** EIP-1559 base fee per gas in Gwei */
  @IsNumber()
  baseFee: number;

  /** Priority fee (tip) in Gwei */
  @IsNumber()
  priorityFee: number;

  /** Unix timestamp of when data was fetched */
  @IsNumber()
  @IsNotEmpty()
  timestamp: number;

  /** Ethereum block number */
  @IsNumber()
  @IsNotEmpty()
  blockNumber: number;

  /** Age of cached data in milliseconds */
  @IsNumber()
  cacheAge: number;

  /** Age of cached data in seconds */
  @IsNumber()
  cacheAgeInSeconds: number;
}
