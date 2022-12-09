import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique: true,
    })
    email:string;

    @Column('text')
    password:string;

    @Column('text')
    fullName:string;

    @Column('bool',{
        default: true,
    })
    isActive:boolean;

    @Column('text',{
        array: true,
        default: ['user'] // por defecto el ROL AL CREAR UN USUARIO ES USER
    })
    roles: string[];

    @OneToMany(
        () => Product, //llamo a la entidad que voy a relacionar
        ( product ) => product.user //instancia de mi producto y como se relaciona con esta tabla
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
