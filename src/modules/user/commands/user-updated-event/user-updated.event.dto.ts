export class UpdateUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  status: string;
}
export class UserUpdatedEvent {
  id: string;
  payload: UpdateUser;
}
