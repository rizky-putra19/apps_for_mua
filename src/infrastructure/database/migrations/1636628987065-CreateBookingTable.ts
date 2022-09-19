import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookingTable1636628987065 implements MigrationInterface {
  private readonly tableName: string = 'bookings';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'legacy_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'artisan_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'client_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'event_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'code',
            type: 'varchar',
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'event_date',
            type: 'datetime',
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
          {
            name: 'custom',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: '"CREATED"',
          },
          {
            name: 'legacy_id',
            type: 'int',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
