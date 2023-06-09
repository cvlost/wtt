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

export interface IActivity {
  count: number;
  time: number;
}

export interface IUserWithActivity extends IUser {
  dayActivity: IActivity;
  overallActivity: IActivity;
}
