import { SetMetadata } from '@nestjs/common';

export const ALLOW_GUEST_KEY = 'ALLOW_GUEST';
export const AllowGuest = (allow: boolean = false) =>
  SetMetadata(ALLOW_GUEST_KEY, allow);

export const BASIC_AUTH = 'BASIC_AUTH';
export const BasicAuth = () => SetMetadata(BASIC_AUTH, true);
