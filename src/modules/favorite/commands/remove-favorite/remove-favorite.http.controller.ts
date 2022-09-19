import { Result } from '@badrap/result';
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { Id } from '@src/libs/ddd/interface-adapters/interfaces/id.interface';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { FavoriteResponse } from '../../dtos/favorite.dto';
import { RemoveFavoriteCommand } from './remove-favorite.command';

@Controller({
  version: '1',
  path: 'favorite',
})
@UseGuards(AuthGuard('custom'))
export class RemoveFavoriteHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('/:id')
  async remove(@Param('id') id: number, @User() user: UserEntity) {
    const command = new RemoveFavoriteCommand({
      id,
      user,
    });
    const result: Result<FavoriteEntity, Error> = await this.commandBus.execute(
      command,
    );

    return new DataResponseBase(result.unwrap((f) => new FavoriteResponse(f)));
  }
}
