'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'admin-session';

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

export async function checkAuthAction() {
  const cookieStore = await cookies();
  return cookieStore.has(SESSION_COOKIE_NAME);
}
