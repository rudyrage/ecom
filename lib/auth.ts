const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload) {
  try {
    const jwt = require("jsonwebtoken");
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error("Error signing token:", error);
    return null;
  }
}

export function verifyToken(token: string) {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }
    const jwt = require("jsonwebtoken");
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
