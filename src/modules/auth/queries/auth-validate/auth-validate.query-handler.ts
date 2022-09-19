import { Result } from '@badrap/result';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ForbiddenException } from '@src/libs/exceptions/forbidden.exception';
import { JwtFactoryUtil } from '@src/libs/utils/jwt-factory.util';
import { JwtTokenFactory } from '@src/libs/utils/jwt-token-factory.util';
import { IncomingHttpHeaders } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import { AuthValidateQuery } from './auth-validate.query';
import md5 from 'md5';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';

@QueryHandler(AuthValidateQuery)
export class AuthValidateQueryHandler extends QueryHandlerBase {
  private logger: Logger;
  constructor(
    private readonly jwtFactory: JwtTokenFactory,
    private readonly configservice: ConfigService,
    private readonly jwtLegacy: JwtFactoryUtil,
  ) {
    super();
    this.logger = new Logger('AuthValidateQueryHandler');
  }
  async handle(
    query: AuthValidateQuery,
  ): Promise<Result<IncomingHttpHeaders, Error>> {
    const { headers } = query;
    console.log(
      '🚀 ~ file: auth-validate.query-handler.ts ~ line 33 ~ AuthValidateQueryHandler ~ headers',
      headers,
    );

    const signature = headers['signature'];
    const signatureToken = headers['token'];
    const authorization = headers['authorization'];
    const scope = headers['scope'];
    const requestMethod = headers['x-forwarded-method'];

    delete headers.authorization;

    const requestUri = headers['x-forwarded-uri']?.toString();

    let claims: JwtPayload = null;
    let extHeaders: IncomingHttpHeaders = {};
    if (
      this.configservice
        .get<string[]>('allowedPublicRoute')
        .includes(requestUri) ||
      requestMethod == 'OPTIONS' ||
      requestMethod == 'options'
    ) {
      return Result.ok({});
    }

    if (signatureToken == null && authorization == null) {
      throw new ForbiddenException();
    }

    if (signatureToken != null && signature != null) {
      return Result.ok({
        signature: signature,
        token: signatureToken,
        scope: scope,
      });
    }

    if (authorization == null || authorization.length == 0) {
      throw new ForbiddenException('Invalid token');
    }
    try {
      if (authorization.includes('Bearer')) {
        const token = authorization.replace('Bearer ', '').trim();
        claims = this.jwtFactory.verifyToken(token);
      } else {
        const token = authorization.replace('Bearer ', '').trim();
        claims = this.jwtLegacy.verify(token, scope) as JwtPayload;
      }
    } catch (err) {
      console.log(
        '🚀 ~ file: auth-validate.query-handler.ts ~ line 84 ~ AuthValidateQueryHandler ~ err',
        err,
      );
      throw new ForbiddenException(err.message);
    }

    if (claims.grant_type != null && claims.grant_type != 'guest') {
      extHeaders['X-Subject'] = claims.sub;
      extHeaders['X-Grant-Type'] = claims.grant_type;
      if (claims.legacy_id != null) {
        extHeaders['X-Legacy-Id'] = claims.legacy_id;
      }
      extHeaders.scope = claims.scope;
      extHeaders.authorization = this.jwtLegacy.generateLegacyToken(
        claims.sub,
        claims.scope,
        claims.legacy_id,
      );
    } else if (claims.grant_type != null && claims.grant_type == 'guest') {
      const random = UUID.generate().value;
      extHeaders['Signature'] = this.generateCommonToken(headers, random);
      extHeaders['Scope'] = claims.scope;
      extHeaders['Token'] = random;
      extHeaders = {
        ...extHeaders,
        ...headers,
      };
    } else {
      extHeaders['Authorization'] = authorization;
      extHeaders['Scope'] = claims.scope;
    }

    this.logger.log(`forwarding : ${requestUri}`);
    this.logger.log(`Login verified for scope: customer`);
    console.log(
      '🚀 ~ file: auth-validate.query-handler.ts ~ line 111 ~ AuthValidateQueryHandler ~ extHeaders',
      extHeaders,
    );

    return Result.ok(extHeaders);
  }

  private generateCommonToken(
    headers: IncomingHttpHeaders,
    token: string,
  ): string {
    const payload = `${token}${headers['build-version']}${headers['build-version']}${headers.device}${headers.model}`;
    const hash = md5(payload);
    const buffer = Buffer.from(hash);
    const res = buffer.toString('base64');
    console.log(
      '🚀 ~ file: auth-validate.query-handler.ts ~ line 131 ~ AuthValidateQueryHandler ~ res',
      res,
    );

    return res;
  }
}
