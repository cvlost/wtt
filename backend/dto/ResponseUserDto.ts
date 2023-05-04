import { IResponseUserDto } from '../types';
import { UserDocument } from '../models/User';

class ResponseUserDto implements IResponseUserDto {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}

export default ResponseUserDto;
