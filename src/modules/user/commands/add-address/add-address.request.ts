export class CreateAddressRequest {
  name: string;
  address: string;
  notes?: string;
  latitude: number;
  longitude: number;
  extra?: { [key: string]: any };
}
