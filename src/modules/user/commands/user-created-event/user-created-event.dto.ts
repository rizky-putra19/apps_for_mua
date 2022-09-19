export class CreateUser {
  id: number;
  email: string;
  phone: string;
  password: string;
  status: string;
}
export class UserCreatedEvent {
  id: string;
  payload: CreateUser;
}
