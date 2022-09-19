import { Expose } from 'class-transformer';

export class UpdateWalletRequest {
  @Expose({ name: 'on_hold' })
  currentBalance?: number;
  onHold?: number;
  ready?: number;
}
