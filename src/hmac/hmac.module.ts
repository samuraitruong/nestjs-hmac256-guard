import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./config-service";
import { HmacGuard } from "./hmac.guard";

@Module({})
export class HMacModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: HMacModule,

      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(options),
        },
        HmacGuard,
      ],
      exports: [HmacGuard, ConfigService],
    };
  }
}
