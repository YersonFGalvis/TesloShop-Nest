import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService'); //tener una consola mas especifica de los errores

  constructor(

    @InjectRepository(Product)

    private readonly productRepository: Repository<Product>,

  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      //crea la instancia del producto con sus propiedades, no guarda en DB
      const product = this.productRepository.create(createProductDto);
      //guardar en DB
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleExceptions(error,);
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    return this.productRepository.find({
      take: limit,
      skip: offset

    });
  }

  async findOne(term: string) {

    let product: Product

    try {

      if (isUUID(term)) {
        product = await this.productRepository.findOneByOrFail({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();

        product = await queryBuilder
          .where(' UPPER(title) =:title or slug =:slug', {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          }).getOne();

      }
    } catch (error) {
      console.log(error);
      this.handleExceptions(error, `${term} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product

    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleExceptions(error: any, message?: string) {

    if (message) {
      throw new BadRequestException(message);
    }

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
