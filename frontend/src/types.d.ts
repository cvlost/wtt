export interface GlobalError {
  error: string;
}

export interface ValidationError {
  message: string;
  name: string;
  _name: string;
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: 'director' | 'manager' | 'employee';
  avatar: string | null;
  employed: string;
  role: 'user' | 'admin';
}

export interface ILoginMutation {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  user: IUser;
  accessToken: string;
}

export interface IRegisterMutation {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
  avatar: File | null;
  employed: string | null;
  role: string;
}

export interface IRegisterResponse {
  message: string;
  user: IUser;
  accessToken: string;
}
