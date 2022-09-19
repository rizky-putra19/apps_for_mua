export class FindEventQueryParams {
  search?: string;
  orderBy: string = 'eventStartAt';
  order: string = 'ASC';
  page: number = 1;
  limit: number = 20;
  [key: string]: any;
}
