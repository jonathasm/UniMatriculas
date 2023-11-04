import { Module } from '@nestjs/common'
import { CourseController } from './controllers/course.controller'
import { GroupController } from './controllers/group.controller'
import { InstructorController } from './controllers/instructor.controller'
import { UserController } from './controllers/user.controller'
import { PrismaService } from './prima.service'
import { AuthController } from './controllers/auth.controller'
import { ConflictExceptionFilter } from './exception.filter'
import { APP_FILTER } from '@nestjs/core'

@Module({
  imports: [],
  controllers: [
    AuthController,
    UserController,
    CourseController,
    GroupController,
    InstructorController,
  ],
  providers: [PrismaService, {
    provide: APP_FILTER,
    useClass: ConflictExceptionFilter,
  }],
})
export class AppModule { }
