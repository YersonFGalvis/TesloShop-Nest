import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get<string>('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate( payload: JwtPayload): Promise<User>{  //este metodo se llama si el token no ha expirado y la firma hace match

        const { id } = payload;

        const user = await this.userRepository.findOneBy({id});

        if(!user)
            throw new UnauthorizedException('TOKEN NOT VALID')

        if(!user.isActive)   
            throw new UnauthorizedException('USER INACTIVE') 

        // console.log(user);


        return user; //LO QUE SEA QUE YO RETORNE SE AñADE A LA REQUEST
    }


}