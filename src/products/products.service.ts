import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

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
      this.handleExceptions(error);
    }

  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOneByOrFail({ id: id })
      return product;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
