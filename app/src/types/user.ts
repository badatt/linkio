export type User = {
  isNew: boolean;
  uid: string;
  createdAt: number;
  lastLoginAt: number;
  isAnonymous: boolean;
  email?: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
  firebase?: Firebase;
};

export type Firebase = {
  signInProvider?: string;
};
