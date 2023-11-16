import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt/jwt.guard'
import { Roles } from 'src/auth/jwt/roles.decorator'
import { PrismaService } from '../prima.service'

@Roles(...[Role.RULER])
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.user.findMany()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({ where: { id: parseInt(id) } })
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id: parseInt(id) } })
  }
}
