import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy'
import { APP_FILTER } from '@nestjs/core'
import { ConflictExceptionFilter } from 'src/exception.filter'
import { JwtService } from 'src/auth/jwt/jwt.service'
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt/jwt.guard'
import { PrismaService } from 'src/prima.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
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
export class AuthModule {}
