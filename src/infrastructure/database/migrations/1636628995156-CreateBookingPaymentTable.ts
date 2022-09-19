import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBookingPaymentTable1636628995156
  implements MigrationInterface
{
  private readonly tableName: string = 'booking_payments';

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
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'int',
            length: '11',
          },
          {
            name: 'notes',
            type: 'text',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'code',
            type: 'varchar',
          },
          {
            name: 'payment_status',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'double',
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
