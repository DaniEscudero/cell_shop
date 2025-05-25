import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      token: string;
      role: {
        _id: string;
        name: string;
      };
    };
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    token: string;
    role: {
      _id: string;
      name: string;
    };
  }

  interface DefaultUser {
    id: string;
    email: string;
    name: string;
    token: string;
    role: {
      _id: string;
      name: string;
    };
  }

  interface AdapterUser {
    id: string;
    email: string;
    name: string;
    token: string;
    role: {
      _id: string;
      name: string;
    };
  }
}
