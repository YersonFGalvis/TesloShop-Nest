import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @ApiProperty({
        default: 10, description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    //transformar el query que me llega como string a numero
    //equivalente a enableImplicitConversions: true en pokedex
    @Type( ()=> Number ) 
    limit?:number;

    @ApiProperty({
        default: 0, description: 'How many rows do you want to skip'
    })
    @IsOptional()
    // @IsPositive() //no toma 0 como positivo
    @Min(0)
    @Type( ()=> Number ) 
    offset?:number;
     
}