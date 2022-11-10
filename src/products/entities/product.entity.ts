import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true //no pueden haber 2 productos con el mismo nombre
    })
    title: string;

    @Column('float', {
        default: 0 //si creo un producto y no le dpy precio, precio=0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true  //sintaxis diferente, pero es lo mismo
    })
    description: string;

    @Column('text', {
        unique: true //
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    private slugTransform(slug:string) {

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
