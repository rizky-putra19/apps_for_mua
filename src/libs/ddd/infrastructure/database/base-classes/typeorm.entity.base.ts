import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class TypeormEntityBase {
  constructor(props?: unknown) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryColumn({ update: false })
  id?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;
}
