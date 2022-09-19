import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBookingServiceTable1636696612250
  implements MigrationInterface
{
  private readonly tableName: string = 'booking_services';
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
            name: 'service_id',
            type: 'varchar',
          },
          {
            name: 'booking_id',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 12,
            scale: 2,
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
