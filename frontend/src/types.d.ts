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
  birthDay: string;
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
}

export interface IReport {
  id: string;
  startedAt: string;
  finishedAt: string;
  title: string;
  description: string;
}

export interface IDaySummary {
  dateStr: string;
  count: number;
  totalTime: number;
}

export interface IDayReport {
  user: IUser;
  dateStr: string;
  reports: IReport[];
  totalTime: number;
}

export interface IReportMutation {
  user?: string;
  dateStr: string;
  startedAt: string | null;
  finishedAt: string | null;
  title: string;
  description: string;
}
