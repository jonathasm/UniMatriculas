import { ConflictException, Controller, Param, Post, Req } from '@nestjs/common'
import { JwtService } from 'src/auth/jwt/jwt.service'
import { PrismaService } from 'src/prima.service'

@Controller('groups')
export class GroupController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('enroll/:courseId')
  async enroll(@Req() request: any, @Param('courseId') courseId: string) {
    const jwtToken = request.headers.authorization.split(' ')[1]
    const decodedJwt: any = await this.jwtService.decodeToken(jwtToken)
    const userId: number = decodedJwt?.userId
    const userAlreadyExists = await this.prisma.group.findFirst({
      where: { userId, courseId: parseInt(courseId) },
    })
    if (userAlreadyExists) {
      throw new ConflictException('User is already enrolled to this course.')
    }
    return await this.prisma.group.create({
      data: { userId, courseId: parseInt(courseId) },
    })
  }

  @Post('dropout/:courseId')
  async dropout(@Req() request: any, @Param('courseId') courseId: string) {
    const jwtToken = request.headers.authorization.split(' ')[1]
    const decodedJwt: any = await this.jwtService.decodeToken(jwtToken)
    const userId: number = decodedJwt?.userId
    const userAlreadyExists = await this.prisma.group.findFirst({
      where: {
        userId,
        courseId: parseInt(courseId),
      },
    })
    if (!userAlreadyExists) {
      throw new ConflictException('User is not enrolled to this course.')
    }
    return await this.prisma.group.delete({
      where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
    })
  }
}
