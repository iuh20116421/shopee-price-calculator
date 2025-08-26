interface Account {
  username?: string;
  phone: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

export const accounts: Account[] = [
  {
    username: 'admin',
    phone: '0123456789',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  {
    username: 'tukilab',
    phone: '0987654321',
    password: 'Tuki@2025',
    role: 'user',
    name: 'User Demo'
  },
  {
    username: 'tuki',
    phone: '0555123456',
    password: 'tuki123',
    role: 'admin',
    name: 'Tuki Group'
  }
];

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_INFO_KEY = 'user_info';