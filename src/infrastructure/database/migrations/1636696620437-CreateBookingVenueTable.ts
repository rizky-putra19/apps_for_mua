import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBookingVenueTable1636696620437
  implements MigrationInterface
{
  private readonly tableName: string = 'booking_venues';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            length: '36',
          },
          {
            name: 'booking_id',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'address',
            type: 'text',
          },

          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
          },
          {
            name: 'note',
            type: 'text',
          },
          {
            name: 'extra',
            type: 'json',
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
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bookings',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
