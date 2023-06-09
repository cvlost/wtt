import { ICreateUserDto } from '../types';
import User from '../models/User';

export const ADMIN_ROLE = 'admin';
export const USER_ROLE = 'user';

export const DIRECTOR_POSITION = 'director';
export const MANAGER_POSITION = 'manager';
export const EMPLOYEE_POSITION = 'employee';

export const adminDirectorDto: ICreateUserDto = {
  firstName: 'John',
  lastName: 'Doe',
  role: ADMIN_ROLE,
  position: DIRECTOR_POSITION,
  phone: '111-111-111',
  email: 'admin@mail.com',
  password: '###111',
  avatar: '/images/admin.jpg',
  employed: new Date('2010-10-10').toISOString(),
  birthDay: new Date('1985-01-01').toISOString(),
};

export const userManagerDto: ICreateUserDto = {
  firstName: 'Dan',
  lastName: 'Jonson',
  role: USER_ROLE,
  position: MANAGER_POSITION,
  phone: '222-222-222',
  email: 'user.manager@mail.com',
  password: '###222',
  avatar: '/images/manager1.jpg',
  employed: new Date('2015-09-09').toISOString(),
  birthDay: new Date('1995-05-05').toISOString(),
};

export const userEmployeeDto: ICreateUserDto = {
  firstName: 'Kate',
  lastName: 'Hon',
  role: USER_ROLE,
  position: EMPLOYEE_POSITION,
  phone: '333-333-333',
  email: 'user.employee@mail.com',
  password: '###333',
  avatar: '/images/manager1.jpg',
  employed: new Date('2021-03-03').toISOString(),
  birthDay: new Date('1998-03-03').toISOString(),
};

export const newUserCreateDto: ICreateUserDto = {
  email: 'test@test.com',
  password: 'testPass',
  firstName: 'Bob',
  lastName: 'Marley',
  avatar: '/some/avatar.jpg',
  phone: '+234-423-434',
  position: MANAGER_POSITION,
  role: USER_ROLE,
  birthDay: new Date('2000-01-01').toISOString(),
  employed: new Date('2022-10-11').toISOString(),
};

export const createDefaultUsers = async () => {
  return User.create(adminDirectorDto, userManagerDto, userEmployeeDto);
};

export const bearer = (token: string) => `Bearer ${token}`;
