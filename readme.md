# NestJS module to support HMAC 256 verification

This module implement HMAC256 request verification base on requirement here - (https://learn.microsoft.com/en-us/azure/azure-app-configuration/rest-api-authentication-hmac)

## Basic usage with all default
  
  
```js
import { HMacModule } from 'nestjs-hmac256-guard';

@Module({
  imports: [
    HMacModule.register({ HMAC_HASH_SECRET: 'this is my hash secret' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


```

Then use Guard

```js
import { HmacGuard } from 'nestjs-hmac256-guard';
@Controller()
@UseGuards(HmacGuard)
export class AppController {

}
```

## Customise header name

```js
import { HMacModule } from 'nestjs-hmac256-guard';

@Module({
  imports: [
    HMacModule.register({ 
        HMAC_HASH_SECRET: 'this is my hash secret',
        HMAC_SIGNATURE_HEADER_NAME : 'x-my-hmac256-signature'
        REQUEST_CONTENT_HASH_HEADER_NAME: 'x-content-sha26',
        REQUEST_DATE_HEADER_NAME: 'x-date',
        MAX_REQUEST_MINUTES_ALLOW = 900
     }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

```

Default value


*HMAC_SIGNATURE_HEADER_NAME*: `x-signature`

*REQUEST_CONTENT_HASH_HEADER_NAME*: `x-content-sha26`

*MAX_REQUEST_MINUTES_ALLOW*: `900`
*REQUEST_DATE_HEADER_NAME*: `x-date`

## Custom hash format


```js
import { HMacModule } from 'nestjs-hmac256-guard';

@Module({
  imports: [
    HMacModule.register({ 
        HMAC_HASH_SECRET: 'this is my hash secret',
        getStringToHash: ({
            verb,
            url,
            host,
            date,
            contentHash,
        }) => {
            return 'your custom string format if that not same with default '
        }
     }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

```

