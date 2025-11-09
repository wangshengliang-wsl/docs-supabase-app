import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db, projects } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 查询项目
    const [project] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, params.id),
        eq(projects.userId, user.id)
      ))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('获取项目失败:', error);
    return NextResponse.json(
      { error: '获取项目失败' },
      { status: 500 }
    );
  }
}

