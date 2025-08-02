import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Pre-create all possible rate limiters at initialization
const rateLimiters = {
  1: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Math.floor(100 / 1),
    // Remove keyGenerator - use default IP-based limiting
    message: 'Rate limited: Route cost 1x exceeded',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Smart rate limit exceeded',
        type: 'cost-based',
        window: '15 minutes',
        routeCost: 1,
        effectiveLimit: 100
      });
    }
  }),
  2: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Math.floor(100 / 2),
    // Remove keyGenerator - use default IP-based limiting
    message: 'Rate limited: Route cost 2x exceeded',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Smart rate limit exceeded',
        type: 'cost-based',
        window: '15 minutes',
        routeCost: 2,
        effectiveLimit: 50
      });
    }
  }),
  3: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Math.floor(100 / 3),
    // Remove keyGenerator - use default IP-based limiting
    message: 'Rate limited: Route cost 3x exceeded',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Smart rate limit exceeded',
        type: 'cost-based',
        window: '15 minutes',
        routeCost: 3,
        effectiveLimit: 33
      });
    }
  }),
  10: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Math.floor(100 / 10),
    // Remove keyGenerator - use default IP-based limiting
    message: 'Rate limited: Route cost 10x exceeded',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Smart rate limit exceeded',
        type: 'cost-based',
        window: '15 minutes',
        routeCost: 10,
        effectiveLimit: 10
      });
    }
  }),
  15: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Math.floor(100 / 15),
    // Remove keyGenerator - use default IP-based limiting
    message: 'Rate limited: Route cost 15x exceeded',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Smart rate limit exceeded',
        type: 'cost-based',
        window: '15 minutes',
        routeCost: 15,
        effectiveLimit: 6
      });
    }
  })
};

export const smartLimiter = () => {
  const routeCosts: { [pattern: string]: number } = {
    '/judge': 10,
    '/aiChat': 15,
    '/addProblem': 3,
    '/voteProblem': 2,
    '/problems': 1,
    '/profile': 1,
    '/comments': 2,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const routePath = req.route?.path || req.path;
    let cost = 1;

    for (const [pattern, routeCost] of Object.entries(routeCosts)) {
      if (routePath.includes(pattern)) {
        cost = routeCost;
        break;
      }
    }

    const limiter = rateLimiters[cost as keyof typeof rateLimiters] || rateLimiters[1];
    limiter(req, res, next);
  };
};
