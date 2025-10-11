// src/utils/jwt.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = "2h";

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
