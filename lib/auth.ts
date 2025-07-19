import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface UserPermissions {
  cardOrders: boolean;
  bookOrders: boolean;
  users: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "sub-admin";
  permissions?: UserPermissions;
}

export function generateToken(user: User) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      id: string;
      email: string;
      role: string;
      permissions?: UserPermissions;
    };
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}
