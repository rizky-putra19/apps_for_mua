import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { FavoriteResponse } from '../../dtos/favorite.dto';
import { AddFavoriteCommand } from './add-favorite.command';
import { AddFavoriteRequest } from './add-favorite.request';

@Controller({
  version: '1',
  path: '/favorite',
})
@UseGuards(AuthGuard('custom'))
export class AddFavoriteHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async add(@Body() body: AddFavoriteRequest, @User() user: UserEntity) {
    const command = new AddFavoriteCommand({
      artisanID: body.artisanID,
      user,
    });
    const result: Result<FavoriteEntity, Error> = await this.commandBus.execute(
      command,
    );

    return new DataResponseBase(result.unwrap((f) => new FavoriteResponse(f)));
  }
}
