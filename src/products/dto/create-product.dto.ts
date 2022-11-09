import {
    IsArray,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MinLength
} from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsOptional()
    description?: string;

    @IsIn(['men', 'women', 'kid', 'unisex']) //si no vienen estos valores, no lo voy a permitir
    gender: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString({ each: true }) //cada uno de los elementos del arreglo debe cumplir la condicion de ser string
    @IsArray()
    sizes: string[];

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString()
    @MinLength(1)
    title: string;
}
