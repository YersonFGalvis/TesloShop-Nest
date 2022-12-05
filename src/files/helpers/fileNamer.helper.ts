import { v4 as uuid } from 'uuid';

export const fileNamer = ( req:Express.Request, file: Express.Multer.File, callback: Function ) => {


    //en este punto ya deberiamos tener un archivo en la carpeta

    // // console.log({file});
    // //la funcion callback nos manda un mensaje para saber si el archivo lo validamos/pasamos o no
    // if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1]
    const fileName = `${uuid()}.${fileExtension}`;

    return callback(null, fileName);
}