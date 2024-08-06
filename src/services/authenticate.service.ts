import { compare } from 'bcryptjs';
import {
  Body,
  Injectable,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Injectable()
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.');
    }

    const acessToken = this.jwt.sign({
      sub: user.id,
    });
    return {
      access_token: acessToken,
      name: user.email,
    };
  }
}
