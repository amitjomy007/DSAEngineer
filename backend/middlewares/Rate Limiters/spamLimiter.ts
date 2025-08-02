import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const spamLimiter = () => {
  const spamLimits: { [pattern: string]: number } = {
    '/judge': 3,         // Max 3 code executions per minute
    '/aiChat': 5,        // Max 5 AI requests per minute  
    '/addProblem': 3,    // Max 3 problem creations per minute
    '/voteProblem': 15,  // Max 15 votes per minute
    '/problems': 12,     // Max 12 reads per minute
    '/profile': 8,      // Max 8 profile views per minute
    '/comments': 5,      // Max 5 comments per minute
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const routePath = req.route?.path || req.path;
    let maxRequests = 20; // Default spam limit

    // Find matching route pattern for spam limit
    for (const [pattern, limit] of Object.entries(spamLimits)) {
      if (routePath.includes(pattern)) {
        maxRequests = limit;
        break;
      }
    }

    const limiter = rateLimit({
      windowMs: 1 * 60 * 1000,        // 1 minute window
      max: maxRequests,               
      keyGenerator: (req) => `${req.ip}:spam`,
      message: `Spam protection: Too many requests in 1 minute`,
      standardHeaders: true,
      handler: (req, res) => {
        res.status(429).json({
          error: 'Spam protection activated',
          type: 'anti-spam',
          window: '1 minute',
          maxAllowed: maxRequests,
          message: 'Please slow down your requests'
        });
      }
    });

    limiter(req, res, next);
  };
};
