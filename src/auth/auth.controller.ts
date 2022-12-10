import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, SetMetadata, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetRawHeaders } from './decorators/get-rawHeaders.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto,LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Auth') //agrupar estos endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
    // @GetUser('id') id:string, CUALQUIERA SIRVE
  ){
    return this.authService.checkAuthStatus( user );
  }

  @Get('private')
  @UseGuards(AuthGuard()) // usa el stratey que definimos por defecto automaticamente
  TestingPrivateRoute(
    // @GetUser(['email','role','fullName']) 
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
    @Req() request: Express.Request
  )
  {
    console.log(request);
    return {
      ok:true,
      message: 'Hola mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  //Ejemplo de toda la funcionalidad separada
  @Get('private2')
  // @SetMetadata('roles',['admin','super-user']) //forma no recomendada de establecer roles para esta ruta
  @RoleProtected( ValidRoles.superUser, ValidRoles.user) // forma recomendada de establecer roles para esta ruta
  @UseGuards(AuthGuard(), UserRoleGuard ) // los guards personalizados se usan sin instanciar la clase, usar guards personalizados sin el ()
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok:true,
      user,
    }
  }


  @Get('private3')
  @Auth(ValidRoles.user, ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ){
    return {
      ok:true,
      user,
    }
  }

}
