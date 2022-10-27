import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HMacModule } from 'nestjs-hmac256-guard';

@Module({
  imports: [
    HMacModule.register({
      HMAC_HASH_SECRET: 'this is my hash secret',
      logger: console,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
