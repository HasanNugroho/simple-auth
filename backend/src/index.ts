import 'reflect-metadata';
import { Action, useContainer, useExpressServer } from 'routing-controllers';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import { Database } from './infrastructure/configs/database';
import { AuthController } from './presentation/user/controller/auth.controller';
import { container } from 'tsyringe';
import { ErrorMiddleware } from './infrastructure/middlewares/error.middleware';
import { UserRepository } from './infrastructure/repository/user.repository';
import { securityMiddleware } from './infrastructure/middlewares/security.middleware';
import limiter from './infrastructure/middlewares/limiter.middleware';
const jwt = require('jsonwebtoken');

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  const database = new Database();
  await database.initDatabase();

  useContainer({
    get: (cls: any) => container.resolve(cls),
  });

  const app: Express = express();

  const routingControllersOptions = {
    controllers: [AuthController],
    middlewares: [ErrorMiddleware],
    defaultErrorHandler: false,
    validation: true,
    routePrefix: '/api',
    authorizationChecker: async (action: Action) => {
      const authHeader = action.request.headers['authorization'];
      if (!authHeader) return false;

      const token = authHeader.split(' ')[1];
      if (!token) return false;

      try {
        const payload: any = jwt.verify(
          token,
          process.env.SECRET_KEY as string
        );
        console.log(payload);

        const userRepository = container.resolve(UserRepository);
        const user = await userRepository.getById(payload.id);

        if (!user) return false;

        const { password, ...userWithoutPassword } = user;
        action.request.user = userWithoutPassword;

        return true;
      } catch {
        return false;
      }
    },

    // Untuk inject @CurrentUser()
    currentUserChecker: async (action: Action) => {
      return action.request.user;
    },
  };

  app.use(securityMiddleware);
  app.use(limiter);

  useExpressServer(app, routingControllersOptions);

  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
})();
