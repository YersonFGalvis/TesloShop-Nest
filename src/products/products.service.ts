import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService'); //tener una consola mas especifica de los errores

  constructor(

    @InjectRepository(Product)

    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)

    private readonly productImageRepository: Repository<ProductImage>,

    //NECESARIO PARA EL QUERYRUNNER, DATASOURCE TIENE TODA NUESTRA INFORMACION
    //DE CONEXION CON LA DB
    private readonly dataSource: DataSource,

  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productDetails } = createProductDto

      //crea la instancia del producto con sus propiedades, no guarda en DB
      const product = this.productRepository.create({
        ...productDetails,
          images: images.map( image => this.productImageRepository.create({ url: image}))
      });
      //guardar en DB
      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleExceptions(error,);
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }

    });

    return products.map( ({images, ...rest}) => ({
      ...rest,
      images: images.map( image => image.url )
    }))
  }

  async findOne(term: string) {

    let product: Product

    try {

      if (isUUID(term)) {
        product = await this.productRepository.findOneByOrFail({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');

        product = await queryBuilder
          .where(' UPPER(title) =:title or slug =:slug', {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
          //EN EL ARCHIVO PRODUCT ENTITY LA RELACION ONETOMANY TIENE EAGER=TRUE, ESO ME TRAE LAS RELACIONES DE TABLAS,
          //PERO SOLO FUNCIONA CON FIND, EN ESTE CASO, SI BUSCO POR TITULO O SLUG MI LOGICA ES UN QUERYBUILDER NO UN FIND,
          //POR ESO LA DOC DE TYPEORM ME DICE QUE DEBO AñADIR .leftJoinAndSelect Y ESPECIFICAR LA RELACION
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }
    } catch (error) {
      console.log(error);
      this.handleExceptions(error, `${term} not found`);
    }
    return product;
  }

  async findOnePlain(term:string){

    const {images = [], ...rest} = await this.findOne( term );

    return{
      ...rest,
      images: images.map(image => image.url)
    }
  }

        //este endpoint sobreescribe las imagenes existentes si se le pasan nuevas
        //funciona asi por preferencia del profesor nada mas, no esta bien ni mal
  async update(id: string, updateProductDto: UpdateProductDto) {

    const {images , ...toUpdate } = updateProductDto;



    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    //CREATE QUERY RUNNER
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        //pueda poner product: {id}, ya que la tabla esta referenciada
        //y el query sabe que me refiero a la foranea 
        await queryRunner.manager.delete( ProductImage, {product: {id}} )
        product.images = images.map( 
          image => this.productImageRepository.create({url:image}))
      }
      //no impacta la BD
      await queryRunner.manager.save(product);

      //si todo salio bien, se hace el commit de la transaction
      //y ahi si se guardan los cambios
      await queryRunner.commitTransaction();

      //cerramos el queryrunner y no vuelve a funcionar
      await queryRunner.release();

      return this.findOnePlain(id);

    }catch (error) {

      //si algo salio mal, no queremos guardar algun cambio en la bd,
      //hacemos rollback y no guardamos cambios
      await queryRunner.rollbackTransaction();
       //cerramos el queryrunner y no vuelve a funcionar
       await queryRunner.release();

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

  //borrar todos los productos, USARLO PREFERIBLEMENTE EN DESARROLLO
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
      .delete()
      .where({})
      .execute();
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
