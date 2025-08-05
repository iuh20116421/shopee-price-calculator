interface Account {
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

export const accounts: Account[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  {
    username: 'tukilab',
    password: 'Tuki@2025',
    role: 'user',
    name: 'User Demo'
  },
  {
    username: 'tuki',
    password: 'tuki123',
    role: 'admin',
    name: 'Tuki Group'
  }
];

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_INFO_KEY = 'user_info';