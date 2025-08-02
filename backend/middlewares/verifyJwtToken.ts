import { Request, Response, NextFunction } from 'express';
const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
  user?: any; // You can make this more specific based on your user type
}

export const verifyJWTToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Only check the automatic HTTP-only cookie
    const token = req.cookies?.auth_token;
    
    if (!token) {
      res.status(401).json({ 
        error: 'Authentication required',
        message: 'No auth token found in cookies'
      });
      return;
    }
    
    // Verify the JWT token
    jwt.verify(token, process.env.SECRET_KEY as string, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ 
          error: 'Invalid token',
          message: 'Token verification failed'
        });
        return;
      }
      
      // Add user info to request object
      req.user = decoded.user;
      next(); // Pass control to next middleware
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error during authentication',
      message: 'Internal server error'
    });
  }
};
