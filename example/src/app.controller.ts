import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HmacGuard } from 'nestjs-hmac256-guard';
import { AppService } from './app.service';

@Controller()
@UseGuards(HmacGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  test() {
    return { ok: true };
  }

  @Post('/:anywhere')
  testany(@Param('anywhere') anywhere) {
    return { ok: true, anywhere };
  }
}
