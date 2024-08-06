import { Body, Controller, Post, HttpCode, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { registerService } from 'src/services/register.service';

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
type RegisterBodySchema = z.infer<typeof registerBodySchema>;

@Controller('/register')
export class RegisterController {
  constructor(private registerService: registerService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(registerBodySchema))
  async login(@Body() body: RegisterBodySchema) {
    const { email, password, name } = body;
    return this.registerService.register({ email, password, name });
  }
}
