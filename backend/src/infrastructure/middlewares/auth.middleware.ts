import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { UnauthorizedException } from '../../common/exceptions';
import { getMetadataArgsStorage } from 'routing-controllers';
const jwt = require('jsonwebtoken');

@Middleware({ type: 'before' })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    // Cek apakah route public
    const route = getMetadataArgsStorage().actions.find(
      (action) =>
        action.route === req.route?.path &&
        action.method.toLowerCase() === req.method.toLowerCase()
    );

    if (route) {
      const controller = route.target.prototype;
      const isPublicMethod = Reflect.getMetadata(
        IS_PUBLIC_KEY,
        controller,
        route.method
      );
      const isPublicController = Reflect.getMetadata(
        IS_PUBLIC_KEY,
        route.target
      );
      if (isPublicMethod || isPublicController) return next();
    }

    // Cek token
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Token not provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token not provided');

    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const userRepository = container.resolve(UserRepository);
      const user = await userRepository.getById(payload.id);

      if (!user) throw new UnauthorizedException('User not found');
      (req as any).user = user;

      return next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
