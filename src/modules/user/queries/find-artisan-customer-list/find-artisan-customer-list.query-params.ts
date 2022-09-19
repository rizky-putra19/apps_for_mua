export class FindArtisanCustomerListQueryParams {
  search?: string;
  trending?: boolean;
  rating?: number;
  categories?: number[];
  price?: boolean;
  startPrice?: number;
  toPrice?: number;
  orderBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}
