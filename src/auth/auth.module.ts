import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(), // ✅ Load environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule], // ✅ Ensure ConfigModule is available
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        signOptions: { algorithm: 'RS256', expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, EmailService, ConfigService, JwtService, AuthGuard], // ✅ Provide AuthGuard
  controllers: [AuthController],
  exports: [JwtModule, AuthService, AuthGuard, JwtService], // ✅ Export JwtService for other modules
})
export class AuthModule {}
