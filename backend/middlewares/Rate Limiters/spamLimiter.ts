import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Pre-create spam limiters for each route type
const spamLimiters = {
  2: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 2
      });
    }
  }),
  3: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 3
      });
    }
  }),
  5: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 5
      });
    }
  }),
  8: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 8,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 8
      });
    }
  }),
  10: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 10
      });
    }
  }),
  20: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 20
      });
    }
  }),
  30: rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    // Remove keyGenerator - use default IP-based limiting
    message: 'Spam protection: Too many requests in 1 minute',
    handler: (req, res) => {
      res.status(429).json({
        error: 'Spam protection activated',
        type: 'anti-spam',
        window: '1 minute',
        maxAllowed: 30
      });
    }
  })
};

export const spamLimiter = () => {
  const spamLimits: { [pattern: string]: number } = {
    '/judge': 3,
    '/aiChat': 2,
    '/addProblem': 5,
    '/voteProblem': 10,
    '/problems': 30,
    '/profile': 30,
    '/comments': 8,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const routePath = req.route?.path || req.path;
    let maxRequests = 20;

    for (const [pattern, limit] of Object.entries(spamLimits)) {
      if (routePath.includes(pattern)) {
        maxRequests = limit;
        break;
      }
    }

    const limiter = spamLimiters[maxRequests as keyof typeof spamLimiters] || spamLimiters[20];
    limiter(req, res, next);
  };
};
