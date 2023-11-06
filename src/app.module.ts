import { Module } from '@nestjs/common'
import { CourseController } from './controllers/course.controller'
import { GroupController } from './controllers/group.controller'
import { InstructorController } from './controllers/instructor.controller'
import { UserController } from './controllers/user.controller'
import { PrismaService } from './prima.service'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    UserController,
    CourseController,
    GroupController,
    InstructorController,
  ],
  providers: [
    PrismaService,
  ],
})
export class AppModule { }
