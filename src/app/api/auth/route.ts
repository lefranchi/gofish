import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Simples hash para desenvolvimento (em produção, usar bcrypt)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }

      // Criar novo usuário
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashPassword(password),
        },
      });

      return NextResponse.json(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        { status: 201 }
      );
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !verifyPassword(password, user.password)) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in auth:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
