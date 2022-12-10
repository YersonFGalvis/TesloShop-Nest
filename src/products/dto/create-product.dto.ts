import { ApiProperty } from "@nestjs/swagger";
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

    @ApiProperty({
        description: 'Product description',
        nullable: true
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
     description: 'Product gender',
     nullable: false
    })
    @IsIn(['men', 'women', 'kid', 'unisex']) //si no vienen estos valores, no lo voy a permitir
    gender: string;

    @ApiProperty({
      description: 'Product price',
      nullable: true,
      default: 0,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Product Size',
        nullable: false,
        isArray: true
      })
    @IsString({ each: true }) //cada uno de los elementos del arreglo debe cumplir la condicion de ser string
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product slug',
        nullable: true,
      })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Product stock',
        nullable: true,
      })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Product Title',
        nullable: false,
        minLength:1
      })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Product Tag',
        nullable: true,
        isArray: true
      })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[]; // product entity especifica que el default = [], entonces pasa a ser opcional
    
    @ApiProperty({
        description: 'Product images',
        nullable: true,
        isArray: true
      })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];   
}
