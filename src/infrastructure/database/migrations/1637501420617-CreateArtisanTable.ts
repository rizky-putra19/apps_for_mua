import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArtisanTable1637501420617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'artisans',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            length: '36',
          },
          {
            name: 'legacy_id',
            type: 'int',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'binary',
            length: '60',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'status',
            type: 'varchar',
            default: '"active"',
          },
          {
            name: 'gender',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
          },
          {
            name: 'birth_date',
            type: 'date',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('artisans');
  }
}
