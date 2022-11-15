import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer,fileFilter} from './helpers';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    //para tener acceso a las .env
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findOneProductImage(
    //con este decorador RES, rompemos la ejecucion de nest y debemos
    //manualmente dar una res.*
    @Res() res: Response,
    @Param('imageName') imageName:string
  ){

    const path = this.filesService.getStaticProductImage(imageName);

    // res.status(403).json({
    //   ok: false,
    //   path: path
    // })

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    // limits:{ fileSize:1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File,
  ){

    //en este punto el interceptor ya admitio o no mi archivo, si no lo admitio da como vacio el file
    //si mi extension no es permitida mi archivo no existe y me aseguro de que no es una imagen en este caso
    if(!file){
      throw new BadRequestException('Make sure that the file is an image')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return {
      secureUrl
    };
  }
}
