import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
  user?: any; //
}

export const verifyJWTToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log("inside jwt verification middleware");
    const token = req.cookies?.auth_token;
    console.log("token is: ", token);
    if (!token) {
      res.status(401).json({
        error: "Authentication required",
        message: "No auth token found in cookies",
      });
      return;
    }

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          res.status(403).json({
            error: "Invalid token",
            message: "Token verification failed",
          });
          console.log("invalid token");
          return;
        }

        req.user = decoded.user;
        next();
      }
    );
  } catch (error) {
    res.status(500).json({
      error: "Server error during authentication",
      message: "Internal server error",
    });
    console.log("server error during authentication");
  }
};
