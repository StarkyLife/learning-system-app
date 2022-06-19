import axios from 'axios';
import { APP_URLS } from './app-urls';
import { givenUserDatabaseWith } from './database.helpers';
import { createApplication } from '../src/start-app';

const BASE_API_URL = {
  port: 3000,
  full: 'http://localhost:3000',
};

const app = createApplication(BASE_API_URL.port);

beforeEach(app.start);
afterEach(app.stop);

it('should be able to login and logout', async () => {
  const CREDENTIALS = {
    userName: 'testUser',
    password: 'testPassword',
  };

  givenUserDatabaseWith(CREDENTIALS);

  const axiosInstance = axios.create({
    baseURL: BASE_API_URL.full,
  });

  const loginResponse = await axiosInstance.post(APP_URLS.login, CREDENTIALS);
  expect(loginResponse.status).toBe(200);

  const logoutResponse = await axiosInstance.post(APP_URLS.logout);
  expect(logoutResponse.status).toBe(200);
});
