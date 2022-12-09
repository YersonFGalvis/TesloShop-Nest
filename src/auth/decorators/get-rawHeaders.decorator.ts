import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(


    (data:string, ctx: ExecutionContext) =>{ //ctx me da acceso a la request, es el contexto actual de la app de nest

        const req = ctx.switchToHttp().getRequest();
        const raw = req.rawHeaders

        return raw;
    }


)