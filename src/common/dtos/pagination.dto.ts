import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    //transformar el query que me llega como string a numero
    //equivalente a enableImplicitConversions: true en pokedex
    @Type( ()=> Number ) 
    limit?:number;

    @IsOptional()
    // @IsPositive() //no toma 0 como positivo
    @Min(0)
    @Type( ()=> Number ) 
    offset?:number;
     
}