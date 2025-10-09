// dto/get-return.dto.ts
import { IsString, IsNotEmpty, Matches, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for swap parameters

export class GetReturnDto {
    @ApiProperty({
        description: 'Source token address (ERC20)',
        example: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^0x[a-fA-F0-9]{40}$/)
    fromTokenAddress: string;

    @ApiProperty({
        description: 'Destination token address (ERC20)',
        example: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^0x[a-fA-F0-9]{40}$/)
    toTokenAddress: string;

    @ApiProperty({
        description: 'Amount to swap',
        example: '1.5',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!0+(\.0+)?$)\d+\.?\d*$/)
    amountIn: string;
}