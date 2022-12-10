// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger'; //importamos PartialType pero de swagger para que tome las propiedades del createDTO
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
