import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseFilters,
  UsePipes,
} from '@nestjs/common'
import {
  LoginBodyTypeSchema,
  RegisterBodyTypeSchema,
  ZodValidationPipe,
  loginBodyTypeSchema,
  registerBodyTypeSchema,
} from 'src/zod.validation'
import { ConflictExceptionFilter } from 'src/exception.filter'
import { AuthService } from './auth.service'
import { Response } from 'express';

@Controller('/auth')
@UseFilters(ConflictExceptionFilter)
export class AuthController {
  constructor(
    private service: AuthService,
  ) { }

  @Post('/register')
  @UsePipes(new ZodValidationPipe(registerBodyTypeSchema))
  async register(@Body() data: RegisterBodyTypeSchema, @Res() res: Response) {

    const result = await this.service.register(data);

    return res.status(HttpStatus.CREATED).json(result)
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginBodyTypeSchema))
  async login(@Body() data: LoginBodyTypeSchema, @Res() res: Response) {
    const result = await this.service.login(data);

    return res.status(HttpStatus.OK).json(result)
  }
}
