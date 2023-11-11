import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prima.service'
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt/jwt.guard'
import { Roles } from 'src/auth/jwt/roles.decorator'
import {
  InstructorBodyTypeSchema,
  ZodValidationPipe,
  instructorBodySchema,
} from 'src/zod.validation'
import { Role } from '@prisma/client'

@Roles(Role.INSTRUCTOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('instructors')
export class InstructorController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.instructor.findMany()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.instructor.findUnique({ where: { id: parseInt(id) } })
  }

  @Post()
  @UsePipes(new ZodValidationPipe(instructorBodySchema))
  async create(@Body() data: InstructorBodyTypeSchema) {
    return this.prisma.instructor.create({ data })
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: InstructorBodyTypeSchema,
  ) {
    return this.prisma.instructor.update({ where: { id: parseInt(id) }, data })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.instructor.delete({ where: { id: parseInt(id) } })
  }
}
