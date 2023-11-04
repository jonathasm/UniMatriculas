import {
  Body,
  ConflictException,
  Controller,
  Post,
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
import { PrismaService } from '../prima.service'
import * as bcrypt from 'bcrypt'
import { ConflictExceptionFilter } from 'src/exception.filter'

@Controller('/auth')
@UseFilters(ConflictExceptionFilter)
export class AuthController {
  constructor(private prisma: PrismaService) { }

  @Post('/register')
  @UsePipes(new ZodValidationPipe(registerBodyTypeSchema))
  async create(@Body() data: RegisterBodyTypeSchema) {
    const { name, email, password, confirmPassword } = data

    await this.validateSameEmail(email)
    this.validateConfirmPassword(password, confirmPassword)

    const hashedPassword = await bcrypt.hash(password, 10)

    const { id } = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return {
      id,
      name,
      email,
    }
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginBodyTypeSchema))
  async login(@Body() data: LoginBodyTypeSchema) {
    const { email, password } = data

    const user = await this.findUser(email, password)
    return user
  }


  validateSameEmail = async (email: string) => {
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same e-mail address already exists.')
    }
  }

  validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match.')
    }
  }

  findUser = async (email: string, password: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new ConflictException('Email or password may be wrong.')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new ConflictException('Email or password may be wrong.')
    }

    return { token: 'token' }
  }
}
