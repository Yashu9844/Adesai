import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(_request: NextRequest) {
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
