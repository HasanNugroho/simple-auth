import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Express } from 'express';
import dotenv from 'dotenv';
import { Database } from './infrastructure/configs/database';
import { AuthController } from './presentation/user/controller/auth.controller';
import { container } from 'tsyringe';
import { ErrorMiddleware } from './infrastructure/middlewares/error.middleware';
import { AuthMiddleware } from './infrastructure/middlewares/auth.middleware';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  const database = new Database();
  await database.initDatabase();

  useContainer({
    get: (cls: any) => container.resolve(cls),
  });

  const routingControllersOptions = {
    controllers: [AuthController],
    middlewares: [AuthMiddleware, ErrorMiddleware],
    defaultErrorHandler: false,
    validation: true,
    routePrefix: '/api',
  };

  const app: Express = createExpressServer(routingControllersOptions);

  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
})();
