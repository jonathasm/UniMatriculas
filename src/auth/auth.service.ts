import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prima.service';
import { LoginBodyTypeSchema, RegisterBodyTypeSchema } from 'src/zod.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/auth/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async register(data: RegisterBodyTypeSchema) {
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

  async login(data: LoginBodyTypeSchema) {
    const { email, password } = data

    const user = await this.findUser(email, password)
    const token = await this.jwtService.generateToken(user)

    return { accessToken: token }
  }

  validateSameEmail = async (email: string) => {
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
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

    return user
  }
}
