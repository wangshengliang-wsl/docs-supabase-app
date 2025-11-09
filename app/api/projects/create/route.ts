import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db, projects, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
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

    const { name, step1Description, step2Questions, step2Answers, step3Documents } = await request.json();

    if (!name || !step1Description || !step3Documents) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查用户点数
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser || dbUser.credits < 1) {
      return NextResponse.json(
        { error: '点数不足' },
        { status: 400 }
      );
    }

    // 创建项目
    const [project] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name,
        step1Description,
        step2Questions,
        step2Answers,
        step3Documents,
      })
      .returning();

    // 扣除点数
    await db
      .update(users)
      .set({
        credits: dbUser.credits - 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, projectId: project.id });
  } catch (error) {
    console.error('创建项目失败:', error);
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    );
  }
}

