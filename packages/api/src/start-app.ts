import express from 'express';
import http from 'http';

export function createApplication(port: number) {
  const app = express();

  app.use('/', (_, res) => {
    res.send('Hello');
  });

  let serverInstance: http.Server | null;
  return {
    isRunning: () => Boolean(serverInstance),
    start: () =>
      new Promise<void>((resolve) => {
        serverInstance = app.listen(port, () => {
          console.log(`App is running on http://localhost:${port}`);
          resolve();
        });
      }),
    stop: () =>
      new Promise<void>((resolve, reject) => {
        serverInstance?.close((err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            serverInstance = null;
            resolve();
          }
        });
      }),
  };
}
