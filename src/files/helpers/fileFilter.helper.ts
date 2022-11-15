

export const fileFilter = ( req:Express.Request, file: Express.Multer.File, callback: Function ) => {

    // console.log({file});
    //la funcion callback no manda un mensaje para saber si el archivo lo validamos/pasamos o no
    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1]
    const validExtensions = ['jpg','jpeg','png','gif'];

    if(validExtensions.includes(fileExtension)){
        return callback(null, true);
    }

    return callback(null, false);
}