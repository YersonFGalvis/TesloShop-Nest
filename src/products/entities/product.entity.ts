import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '00bdc376-5023-4bec-a04e-f4af44ea6b3d',
        description:'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Tshirt Teslo',
        description:'Product Title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true //no pueden haber 2 productos con el mismo nombre
    })
    title: string;

    @ApiProperty({
        example: 0,
        description:'Product Price',
    })
    @Column('float', {
        default: 0 //si creo un producto y no le dpy precio, precio=0
    })
    price: number;

    @ApiProperty({
        example: 'Magna reprehenderit nostrud mollit ipsum.',
        description:'Product description',
        uniqueItems: null,
    })
    @Column({
        type: 'text',
        nullable: true  //sintaxis diferente, pero es lo mismo
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description:'Product Slug - for SEO',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true //
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description:'Product Stock',
        default: 0,
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','S'],
        description:'Product Sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description:'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['hoodie'],
        description:'Product Tag',
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: ['1740176-00-A_0_2000.jpg'],
        description:'Product Images',
    })
    //un producto puede tener muchas imagenes
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,

        //cada vez que se use un metodo find para buscar un producto, el eager me trae las relaciones automaticamente,
        //pero si se usa el querybuilder NO

        { cascade: true, eager: true } // si elimino un producto, me elimina las imagenes asociadas a el
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    user: User;

    private slugTransform(slug: string) {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_') // cualquier espacio lo cambio por un _
            .replaceAll("'", '') // voy a cambiar los apostrofes por un string vacio

    }

    //siempre que quiera insertar, pasara por esta condicion
    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title; // si al momento de crear un producto no viene el slug, el slug pasa a ser mi titulo que siempre debe venir
        }

        this.slugTransform(this.slug)
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slugTransform(this.slug)
    }
}
