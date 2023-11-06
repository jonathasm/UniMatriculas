import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import {
  UserBodyTypeSchema,
  ZodValidationPipe,
  userBodySchema,
} from 'src/zod.validation'
import { PrismaService } from '../prima.service'
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt/jwt.guard'
import { Role } from '@prisma/client'
import { Roles } from 'src/auth/jwt/roles.decorator'

@Roles(...[Role.INSTRUCTOR])
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/users')
export class UserController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(userBodySchema))
  async create(@Body() data: UserBodyTypeSchema) {
    const { email } = data

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

    return await this.prisma.user.create({ data })
  }

  @Get()
  async findAll() {
    return this.prisma.user.findMany()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({ where: { id: parseInt(id) } })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UserBodyTypeSchema) {
    return this.prisma.user.update({ where: { id: parseInt(id) }, data })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id: parseInt(id) } })
  }
}
