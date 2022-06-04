import axios from "axios";
import { startApp } from "./start-app";
import { APP_URLS } from "./app-urls";
import { getTokenFrom } from "./get-token";
import { givenUserDatabaseWith } from "./database.helpers";

const BASE_API_URL = {
  port: "3000",
  full: "localhost:3000",
};

it("should generate auth token given valid credentials", async () => {
  const CREDENTIALS = {
    userName: "testUser",
    password: "testPassword",
  };

  givenUserDatabaseWith(CREDENTIALS);

  await startApp(BASE_API_URL.port);
  const axiosInstance = axios.create({
    baseURL: BASE_API_URL.full,
  });

  const response = await axiosInstance.post(APP_URLS.login, CREDENTIALS);

  expect(response.status).toBe(200);
  expect(getTokenFrom(response)).toBeTruthy();
});
