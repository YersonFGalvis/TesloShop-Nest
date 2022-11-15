import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity({name: 'products_images'})
export class ProductImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url: string

    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        {onDelete: 'CASCADE'} // si se borra el producto, se borran las imagenes tambien, elimina en cascada  
    )
    product:Product

}