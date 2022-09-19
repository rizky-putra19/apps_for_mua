import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@src/libs/exceptions';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Repository } from 'typeorm';
import { EditorChoiceEntity } from '../domain/entities/editor-choice.entity';
import { EditorChoiceOrmEntity } from './editor-choice.orm-entity';
import { EditorChoiceRepositoryPort } from './editor-choice.repository.port';

@Injectable()
export class EditorChoiceRepository implements EditorChoiceRepositoryPort {
  constructor(
    @InjectRepository(EditorChoiceOrmEntity)
    private readonly editorChoiceRepository: Repository<EditorChoiceOrmEntity>,
    private readonly userRepository: UserRepository,
  ) {}
  protected relations: string[] = ['artisan', 'artisan.metadata'];

  async save(entity: EditorChoiceEntity) {
    const ormEntity = EditorChoiceEntity.convertToOrmEntity(entity);
    const result = await this.editorChoiceRepository.save(ormEntity);

    return EditorChoiceEntity.convertToDomainEntity(result);
  }

  async delete(entity: EditorChoiceEntity) {
    return await this.editorChoiceRepository.delete(
      EditorChoiceEntity.convertToOrmEntity(entity),
    );
  }

  async exist(artisanID: string): Promise<boolean> {
    const found = await this.editorChoiceRepository.findOne({
      where: {
        artisan: {
          id: artisanID,
        },
      },
    });
    if (found) {
      return true;
    }

    return false;
  }

  async findOneOrThrow(id: number): Promise<EditorChoiceEntity> {
    const entity = await this.editorChoiceRepository.findOne({
      where: {
        id,
      },
      relations: this.relations,
    });
    if (!entity) {
      throw new NotFoundException('Not Found');
    }

    return EditorChoiceEntity.convertToDomainEntity(entity);
  }

  async getList(): Promise<EditorChoiceEntity[]> {
    const list = await this.editorChoiceRepository.find({
      relations: this.relations,
    });
    const result = list.map((e) => EditorChoiceEntity.convertToDomainEntity(e));

    return result;
  }
}
