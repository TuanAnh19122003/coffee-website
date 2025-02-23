import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.session && (req as any).session.user) {
      return res.status(403).json({ message: 'Bạn đã đăng nhập, không thể truy cập.' });
    }
    next();
  }
}
