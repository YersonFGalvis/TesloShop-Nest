import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';
import { initialData } from './data/seed-data';
import { CreateUserDto } from 'src/auth/dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService,
    private readonly AuthService: AuthService,
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
  ){}
  
  async runSeed(){

    await this.deleteTables();
    const dbUser = await this.insertNewUsers();
    await this.insertNewProducts(dbUser);

    return `SEED EXECUTED`
  }

  private async deleteTables(){

    await this.ProductsService.deleteAllProducts(); //borramos todos los productos

    const queryBuilder = this.userRepository.createQueryBuilder(); //borramos todos los usuarios

    await queryBuilder
      .delete()
      .where({}) // delete from sin where
      .execute()

  }

  private async insertNewUsers(){

    const seedUser = initialData.users;

    const insertPromises = [];

    seedUser.forEach( user => {
      insertPromises.push( this.AuthService.create(user));
     });

    await Promise.all( insertPromises );

    return insertPromises[0];
  }

  private async insertNewProducts(User: User){
    await this.ProductsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
     insertPromises.push( this.ProductsService.create(product, User) );
    });

    //espera que todas las promesas de arriba se resuelvan y despues avanza
    await Promise.all( insertPromises );

    return true;
  }
}
