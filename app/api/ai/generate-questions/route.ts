import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateQuestions } from '@/lib/ai/claude';
import { generateQuestionsMock } from '@/lib/ai/claude-mock';

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

    const { description } = await request.json();

    if (!description || description.length < 20) {
      return NextResponse.json(
        { error: '项目描述至少需要 20 个字' },
        { status: 400 }
      );
    }

    // 检查是否配置了 API Key
    const hasApiKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 0;
    
    let questions;
    let isMock = false;

    if (hasApiKey) {
      try {
        console.log('🤖 使用真实 AI API 生成问题...');
        questions = await generateQuestions(description);
      } catch (aiError) {
        console.error('❌ AI API 调用失败，切换到模拟数据:', aiError);
        console.log('⚠️  使用模拟数据生成问题');
        questions = await generateQuestionsMock(description);
        isMock = true;
      }
    } else {
      console.log('⚠️  未配置 OPENROUTER_API_KEY，使用模拟数据');
      questions = await generateQuestionsMock(description);
      isMock = true;
    }

    return NextResponse.json({ questions, isMock });
  } catch (error) {
    console.error('生成问题失败:', error);
    return NextResponse.json(
      { error: '生成问题失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

