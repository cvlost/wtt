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

export interface IReport {
  id: string;
  user: string;
  startedAt: string;
  finishedAt: string;
  title: string;
  timeSpent: number;
  description: string;
}

export interface IDaySummary {
  dateStr: string;
  count: number;
  totalTime: number;
}

export interface IDayReport {
  user: IUser & { password: string };
  dateStr: string;
  reports: IReport[];
  totalTime: number;
}
