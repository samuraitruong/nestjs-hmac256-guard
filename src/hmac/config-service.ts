import { Injectable } from "@nestjs/common";

Injectable();
export class ConfigService {
  readonly HMAC_HASH_SECRET: string;
  readonly HMAC_SIGNATURE_HEADER_NAME: string;
  readonly REQUEST_CONTENT_HASH_HEADER_NAME: string;
  readonly MAX_REQUEST_MINUTES_ALLOW: number;
  readonly REQUEST_DATE_HEADER_NAME: string;

  readonly logger: any;

  constructor(private options: any) {
    this.HMAC_HASH_SECRET = options.HMAC_HASH_SECRET;
    this.HMAC_SIGNATURE_HEADER_NAME =
      options.HMAC_SIGNATURE_HEADER_NAME || "x-signature";
    this.REQUEST_CONTENT_HASH_HEADER_NAME =
      options.REQUEST_CONTENT_SHA256_HEADER_NAME || "x-content-sha256";

    this.REQUEST_DATE_HEADER_NAME =
      options.REQUEST_DATE_HEADER_NAME || "x-date";

    this.MAX_REQUEST_MINUTES_ALLOW = options.MAX_REQUEST_MINUTES_ALLOW || 900; // 15 minutes
    this.logger = options.logger;
  }

  log(message: string, ...args: any[]): void {
    if (this.logger) {
      if (this.logger.info) this.logger.info(message, ...args);

      if (this.logger.log) this.logger.log(message, ...args);
    }
  }
  getStringToHash({
    verb,
    url,
    host,
    date,
    contentHash,
  }: {
    verb: string;
    url: string;
    host: string;
    date: string;
    contentHash?: string | undefined;
  }) {
    if (this.options.getStringToHash) {
      return this.options.getStringToHash({
        verb,
        url,
        host,
        date,
        contentHash,
      });
    }

    if (contentHash) {
      return `${verb}\n${url}\n${date};${host};${contentHash}`;
    }

    return `${verb}\n${url}\n${date};${host}`;
  }
}
