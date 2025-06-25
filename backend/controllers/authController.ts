import express from 'express';


export const loginControl = (req: express.Request, res: express.Response) => {
  // Logic for handling login
  res.send("Login successful");
}

export const registerControl = (req: express.Request, res: express.Response) => {
  // Logic for handling registration
  res.send("Registration successful");
}