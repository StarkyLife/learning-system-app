type User = {
  userName: string;
  password: string;
};

export const givenUserDatabaseWith = (_user: Partial<User>) => {
  throw new Error("Not implemented!");
};
