import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 验证用户登录
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 查询用户点数
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const credits = dbUser?.credits || 0;
    const hasCredits = credits > 0;

    return NextResponse.json({ hasCredits, credits });
  } catch (error) {
    console.error('检查点数失败:', error);
    return NextResponse.json(
      { error: '检查点数失败' },
      { status: 500 }
    );
  }
}

