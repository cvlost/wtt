import { IResponseUserDto } from '../types';
import { UserDocument } from '../models/User';

class ResponseUserDto implements IResponseUserDto {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly position: string;
  readonly avatar: string | null;
  readonly employed: Date;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.position = user.position;
    this.employed = user.employed;
    this.avatar = user.avatar;
  }
}

export default ResponseUserDto;
