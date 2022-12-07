import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import * as crypto from "crypto";
import { ConfigService } from "./config-service";

//hmac256 verification implement base on https://learn.microsoft.com/en-us/azure/azure-app-configuration/rest-api-authentication-hmac
@Injectable()
export class HmacGuard implements CanActivate {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const secretKey = this.configService.HMAC_HASH_SECRET;

    const requestSignature =
      request.headers[this.configService.HMAC_SIGNATURE_HEADER_NAME];

    const originalContentHash =
      request.headers[this.configService.REQUEST_CONTENT_HASH_HEADER_NAME];

    const verb = request.method;
    const url = request.url;
    const utcNow = new Date().getTime();

    const date = request.headers[this.configService.REQUEST_DATE_HEADER_NAME];
    if (!date) {
      this.configService.log("No request date present in request header");
      return false;
    }

    // check if request date is not oldest than x minutes
    if (
      utcNow - new Date(date).getTime() >
      this.configService.MAX_REQUEST_MINUTES_ALLOW
    )
      return false;

    const host = request.headers.host;
    const contentHash = request.body
      ? crypto
          .createHash("sha256")
          .update(JSON.stringify(request.body))
          .digest("base64")
      : undefined;

    this.configService.log("contentHash: ", contentHash);
    this.configService.log("originalContentHash: ", originalContentHash);
    if (originalContentHash !== contentHash) {
      this.configService.log(
        "Content hash does not match original content hash"
      );
      return false;
    }
    this.configService.log("url: ", url);
    this.configService.log("host: ", host);

    const contentToHash = this.configService.getStringToHash({
      verb,
      url,
      host,
      date,
      contentHash,
    });
    this.configService.log("contentToHash", contentToHash);
    const validateHashSignature = crypto
      .createHmac("sha256", secretKey)
      .update(contentToHash)
      .digest("base64");

    this.configService.log("Request signature: ", requestSignature);
    this.configService.log("HMAC hash: ", validateHashSignature);
    return requestSignature === validateHashSignature;
  }
}
