import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(

    (data:string, ctx: ExecutionContext) =>{ //ctx me da acceso a la request, es el contexto actual de la app de nest

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user)
            throw new InternalServerErrorException('User not found (request)');

        return (!data)
            ? user
            : user[data]
    }
)