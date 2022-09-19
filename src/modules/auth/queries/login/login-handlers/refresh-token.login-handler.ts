import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@src/libs/exceptions';
import { JwtTokenFactory } from '@src/libs/utils/jwt-token-factory.util';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { LoginHandler } from '../login-handler.interface';
import { LoginRequest } from '../login.request.dto';

@Injectable()
export class RefreshTokenHandler extends LoginHandler {
  constructor(
    private readonly jwtTokenFactory: JwtTokenFactory,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }
  async authenticate(request: LoginRequest): Promise<UserEntity> {
    const accessToken: JwtPayload = this.jwtTokenFactory.getExpiredClaims(
      request.password,
    ) as JwtPayload;

    const refreshToken: JwtPayload = this.jwtTokenFactory.verifyToken(
      request.identifier,
    );

    if (accessToken.jti != refreshToken.jti) {
      throw new BadRequestException('Invalid token id');
    }

    return this.userRepository.findOneByIdOrThrow(accessToken.sub);
  }
}
