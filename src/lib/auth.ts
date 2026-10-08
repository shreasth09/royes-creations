import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getAdminById } from '@/lib/db';
import { AdminUser } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'royes_creations_super_secret_jwt_key_2026_jaipur_production_quality';

export interface AdminJwtPayload {
  adminId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signAdminToken(admin: { id: number; email: string; role: string }): string {
  return jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
  } catch (err) {
    return null;
  }
}

export function getAdminFromRequest(req: NextRequest): AdminUser | null {
  // Check authorization header first
  const authHeader = req.headers.get('authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Check cookies
    const cookieToken = req.cookies.get('royes_admin_token')?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload || !payload.adminId) return null;

  return getAdminById(payload.adminId);
}
