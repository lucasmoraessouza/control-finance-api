import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateService } from './services/authenticate.service';
import { RegisterController } from './controllers/register.controller';
import { registerService } from './services/register.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AuthenticateController, RegisterController],
  providers: [PrismaService, AuthenticateService, registerService],
})
export class AppModule {}
