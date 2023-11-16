import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { Role, User } from '@prisma/client'
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt/jwt.guard'
import { Roles } from 'src/auth/jwt/roles.decorator'
import { PrismaService } from 'src/prima.service'
import {
  CourseBodyTypeSchema,
  ZodValidationPipe,
  courseBodyTypeSchema,
} from 'src/zod.validation'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    return await this.prisma.course.findMany()
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: parseInt(id) },
    })
    if (!course) {
      throw new NotFoundException('Course not found')
    }
    return course
  }

  @Roles(...[Role.RULER, Role.INSTRUCTOR])
  @Get(':id/students')
  async getEnrolled(@Param('id') id: string) {
    const enrolleds = await this.prisma.group.findMany({
      where: { courseId: parseInt(id) },
    })
    const studentsIds = enrolleds.map((courses) => courses.userId)
    const students: User[] = await this.prisma.user.findMany({
      where: { id: { in: studentsIds } },
    })
    return students.map((user) => {
      const { password, ...cleanUser } = user
      return cleanUser
    })
  }

  @Roles(Role.RULER)
  @Post('create')
  @UsePipes(new ZodValidationPipe(courseBodyTypeSchema))
  async create(@Body() data: CourseBodyTypeSchema) {
    return this.prisma.course.create({ data })
  }

  @Roles(Role.RULER)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.prisma.course.delete({
      where: { id: parseInt(id) },
    })
  }
}
