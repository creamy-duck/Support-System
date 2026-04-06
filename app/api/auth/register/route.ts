import { NextResponse } from 'next/server';
import { AuthService } from '@/server/services/AuthService';
import { RegisterSchema } from '@/validation/user';
import { handleApiError } from '@/lib/errors';

const authService = new AuthService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const { name, email, password } = parsed.data;
    const user = await authService.register(name, email, password);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
