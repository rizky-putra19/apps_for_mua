const appRoot = '/api';
const accountRoot = '/account';
const usersRoot = '/users';
const v1 = '/v1';

export const routesPublic = {
  root: '/',
  account: {
    login: `${accountRoot}/login`,
    register: `${accountRoot}/register`,
    validate: `${accountRoot}/register`,
  },
};

export const routesApiV1 = {
  version: '1',
  app: {
    root: `${appRoot}`,
    users: {
      root: '/users',
      show: '/:id',
      validate: '/validate-password',
    },
    admins: {
      root: '/admins',
      show: '/admins/:id',
    },
  },
};
