import { Body, ConflictException, Injectable, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { hash } from 'bcryptjs';

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Injectable()
@UsePipes(new ZodValidationPipe(registerBodySchema))
export class registerService {
  constructor(private prisma: PrismaService) {}

  async register(@Body() body: RegisterBodySchema) {
    const { email, password, name } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return {
      message: 'User created successfully',
      user,
    };
  }
}
