import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export const smartLimiter = () => {
  // Define route patterns and their costs
  const routeCosts: { [pattern: string]: number } = {
    "/judge": 10, // Code execution
    "/aiChat": 4, // AI processing
    "/addProblem": 3, // Content creation
    "/voteProblem": 2, // User action
    "/problems": 2, // Simple read
    "/profile": 2, // Simple read
    "/comments": 2, // Comment operations
  };

  return (req: Request, res: Response, next: NextFunction) => {
    // Find matching route pattern
    const routePath = req.route?.path || req.path;
    let cost = 1; // Default cost

    // Match route pattern to cost
    for (const [pattern, routeCost] of Object.entries(routeCosts)) {
      if (routePath.includes(pattern)) {
        cost = routeCost;
        break;
      }
    }

    // Create dynamic limiter based on cost
    const dynamicLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minute window
      max: Math.floor(100 / cost), // Base 100 points / cost
      keyGenerator: (req) => `${req.ip}:smart`,
      message: `Rate limited: Route cost ${cost}x exceeded`,
      handler: (req, res) => {
        res.status(429).json({
          error: "Smart rate limit exceeded",
          type: "cost-based",
          window: "15 minutes",
          routeCost: cost,
          effectiveLimit: Math.floor(100 / cost),
          message: "Server resource protection activated",
        });
      },
    });

    dynamicLimiter(req, res, next);
  };
};
