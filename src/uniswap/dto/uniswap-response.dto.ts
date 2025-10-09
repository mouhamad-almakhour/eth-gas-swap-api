import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested } from 'class-validator';
/**
 * API response DTO for gas price endpoint
 * Contains gas prices in Gwei and metadata
 */

class TokenInfoDto {
    @Expose()
    @IsString()
    address: string;

    @Expose()
    @IsString()
    symbol: string;

    @Expose()
    @IsNumber()
    decimals: number;
}
export class UniswapResponseDto {

    @Expose()
    @ValidateNested()
    @Type(() => TokenInfoDto)
    fromToken: TokenInfoDto;

    @Expose()
    @ValidateNested()
    @Type(() => TokenInfoDto)
    toToken: TokenInfoDto;

    @Expose()
    @IsString()
    amountIn: string;

    @Expose()
    @IsString()
    amountOut: string;

    @Expose()
    @IsString()
    amountInFormatted: string;

    @Expose()
    @IsString()
    amountOutFormatted: string;

    @Expose()
    @IsString()
    pairAddress: string;

    @Expose()
    @IsString()
    reserves: {
        reserve0: string;
        reserve1: string;
    };

}