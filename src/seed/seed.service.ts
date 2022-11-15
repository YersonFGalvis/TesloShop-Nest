import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService
  ){}
  
  async runSeed(){

    this.insertNewProducts();

    return `SEED EXECUTED`
  }

  private async insertNewProducts(){
    await this.ProductsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
     insertPromises.push( this.ProductsService.create(product) );
    });

    //espera que todas las promesas de arriba se resuelvan y despues avanza
    await Promise.all( insertPromises );

    return true;
  }
}
