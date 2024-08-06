// src/controllers/auth.controller.ts
import { Body, Controller, Post, HttpCode, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthenticateService } from 'src/services/authenticate.service';

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginBodySchema = z.infer<typeof loginBodySchema>;

@Controller('/login')
export class AuthenticateController {
  constructor(private authService: AuthenticateService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(loginBodySchema))
  async login(@Body() body: LoginBodySchema) {
    const { email, password } = body;
    return this.authService.login({email, password});
  }
}
