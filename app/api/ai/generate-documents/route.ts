import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocuments } from '@/lib/ai/claude';
import { generateDocumentsMock } from '@/lib/ai/claude-mock';

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

    const { description, answers } = await request.json();

    if (!description || !answers) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查是否配置了 API Key
    const hasApiKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.length > 0;
    
    let documents;
    let isMock = false;

    if (hasApiKey) {
      try {
        console.log('🤖 使用真实 AI API 生成文档...');
        documents = await generateDocuments(description, answers);
      } catch (aiError) {
        console.error('❌ AI API 调用失败，切换到模拟数据:', aiError);
        console.log('⚠️  使用模拟数据生成文档');
        documents = await generateDocumentsMock(description, answers);
        isMock = true;
      }
    } else {
      console.log('⚠️  未配置 OPENROUTER_API_KEY，使用模拟数据');
      documents = await generateDocumentsMock(description, answers);
      isMock = true;
    }

    return NextResponse.json({ documents, isMock });
  } catch (error) {
    console.error('生成文档失败:', error);
    return NextResponse.json(
      { error: '生成文档失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

