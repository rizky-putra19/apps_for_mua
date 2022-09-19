import { Module } from '@nestjs/common';
import { indexUserEntityOnCreatedProvider } from './search.provider';

@Module({
  providers: [indexUserEntityOnCreatedProvider],
})
export class SearchModule {}
