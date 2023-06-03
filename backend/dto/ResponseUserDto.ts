import { IResponseUserDto } from '../types';
import { UserDocument } from '../models/User';

class ResponseUserDto implements IResponseUserDto {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly position: 'director' | 'employee' | 'manager';
  readonly avatar: string | null;
  readonly employed: Date;
  readonly role: 'admin' | 'user';
  readonly birthDay: Date;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.position = user.position;
    this.employed = user.employed;
    this.avatar = user.avatar;
    this.role = user.role;
    this.birthDay = user.birthDay;
  }
}

export default ResponseUserDto;
