import OpenAI from 'openai';

// 初始化 OpenAI 客户端（用于调用 Claude API via OpenRouter）
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "VibeGuide",
  },
});

export interface Question {
  question: string;
  purpose: string;
}

export interface Documents {
  userJourney: string;
  prd: string;
  frontendDesign: string;
  backendDesign: string;
  databaseDesign: string;
}

/**
 * 根据项目描述生成3-5个深入问题
 */
export async function generateQuestions(description: string): Promise<Question[]> {
  const completion = await openai.chat.completions.create({
    model: "anthropic/claude-sonnet-4.5",
    messages: [
      {
        role: "system",
        content: `你是一个专业的产品经理和技术顾问。用户会给你一个项目描述，你需要提出3-5个关键问题来深入了解项目需求。

问题应该涵盖：
1. 目标用户和使用场景
2. 核心功能优先级
3. 技术栈偏好
4. 性能和规模要求
5. 预算和时间限制

请以 JSON 数组格式返回，每个问题包含 question 和 purpose 字段。
格式如下：
[
  {
    "question": "问题内容",
    "purpose": "这个问题的目的"
  }
]`
      },
      {
        role: "user",
        content: `项目描述：${description}\n\n请生成3-5个关键问题来深入了解这个项目。`
      }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content || '[]';
  
  // 尝试从内容中提取 JSON
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return JSON.parse(content);
}

/**
 * 根据项目描述和用户回答生成完整的开发文档
 */
export async function generateDocuments(
  description: string,
  answers: string
): Promise<Documents> {
  const systemPrompt = `你是一个资深的全栈开发专家和技术文档撰写专家。你需要根据用户的项目描述和需求回答，生成5份专业的开发文档。

请生成以下文档：
1. 用户旅程地图 (User Journey Map)
2. 产品需求文档 (PRD - Product Requirements Document)
3. 前端设计文档 (Frontend Design Document)
4. 后端设计文档 (Backend Design Document)
5. 数据库设计文档 (Database Design Document)

所有文档必须使用 Markdown 格式，内容要专业、详细、可执行。

请以 JSON 格式返回，包含以下字段：
{
  "userJourney": "用户旅程地图的 Markdown 内容",
  "prd": "产品需求文档的 Markdown 内容",
  "frontendDesign": "前端设计文档的 Markdown 内容",
  "backendDesign": "后端设计文档的 Markdown 内容",
  "databaseDesign": "数据库设计文档的 Markdown 内容"
}`;

  const userPrompt = `项目描述：
${description}

需求深入回答：
${answers}

请根据以上信息生成完整的5份开发文档。`;

  const completion = await openai.chat.completions.create({
    model: "anthropic/claude-sonnet-4.5",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content || '{}';
  
  // 尝试从内容中提取 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return JSON.parse(content);
}
