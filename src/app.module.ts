import { Module } from '@nestjs/common'
import { CourseController } from './controllers/course.controller'
import { GroupController } from './controllers/group.controller'
import { InstructorController } from './controllers/instructor.controller'
import { UserController } from './controllers/user.controller'
import { PrismaService } from './prima.service'
import { AuthController } from './controllers/auth.controller'
import { ConflictExceptionFilter } from './exception.filter'
import { APP_FILTER } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt.strategy'
import { JwtService } from './jwt/jwt.service'
import { JwtAuthGuard, RolesGuard } from './jwt/jwt.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    CourseController,
    GroupController,
    InstructorController,
  ],
  providers: [
    PrismaService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: ConflictExceptionFilter,
    },
    JwtService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AppModule { }
