# VibeGuide - AI 驱动的智能开发文档平台

VibeGuide 是一个智能 AI 开发文档平台，能够非常方便地帮助编程新手生成项目的一系列开发文档。

## 功能特性

- 🤖 **AI 智能生成** - 基于 Claude 4 模型，智能分析需求，生成专业的开发文档
- 📄 **全面的文档类型** - 支持用户旅程地图、PRD、前后端设计、数据库设计等多种文档
- ⚡ **快速高效** - 几分钟内完成需要数小时甚至数天的文档编写工作
- ☁️ **云端保存** - 随时随地访问和下载你的项目文档
- 🔒 **安全可靠** - 企业级数据安全保障，你的项目信息完全私密
- 📦 **灵活导出** - 支持 Markdown 和 HTML 预览，可单个或批量下载为 ZIP

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 组件**: Tailwind CSS + shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **认证**: Supabase Auth
- **AI**: Claude 4 (via OpenRouter)
- **支付**: ZPay (易支付)

## 环境变量配置

复制 `.env.example` 为 `.env.local` 并填写以下环境变量：

\`\`\`bash
# Supabase Database
DATABASE_URL=your_supabase_database_url

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Site Configuration
BASE_URL=your_base_url
NEXT_PUBLIC_SITE_URL=your_site_url

# AI API (Claude via OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key

# ZPay Payment
ZPAY_PID=your_zpay_pid
ZPAY_PKEY=your_zpay_pkey
\`\`\`

## 快速开始

### 1. 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 2. 配置环境变量

创建 `.env.local` 文件并填写所有必需的环境变量。

### 3. 推送数据库 Schema

\`\`\`bash
pnpm db:push
\`\`\`

这将自动在 Supabase 数据库中创建所需的表结构。

### 4. 启动开发服务器

\`\`\`bash
pnpm dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 数据库脚本

- `pnpm db:generate` - 生成数据库迁移文件
- `pnpm db:push` - 推送 schema 到数据库（推荐用于开发）
- `pnpm db:studio` - 启动 Drizzle Studio 可视化数据库管理

## 项目结构

\`\`\`
├── app/
│   ├── (dashboard)/          # 仪表盘页面（需要登录）
│   │   ├── layout.tsx        # 仪表盘布局
│   │   ├── projects/         # 项目管理
│   │   │   ├── page.tsx      # 项目列表
│   │   │   ├── new/          # 新建项目
│   │   │   └── [id]/         # 项目详情
│   │   └── my/               # 个人中心
│   ├── api/                  # API 路由
│   │   ├── ai/               # AI 相关 API
│   │   ├── payment/          # 支付相关 API
│   │   ├── projects/         # 项目相关 API
│   │   └── user/             # 用户相关 API
│   ├── auth/                 # 认证页面
│   ├── pricing/              # 价格页面
│   ├── page.tsx              # 落地页
│   └── layout.tsx            # 根布局
├── components/               # React 组件
│   └── ui/                   # shadcn/ui 组件
├── lib/
│   ├── ai/                   # AI 服务封装
│   ├── db/                   # 数据库配置和 schema
│   ├── payment/              # 支付服务封装
│   └── supabase/             # Supabase 客户端
└── drizzle.config.ts         # Drizzle 配置
\`\`\`

## 主要功能

### 1. 用户认证

- 使用 Supabase Auth 进行用户注册、登录
- 支持邮箱密码登录
- 路由保护，未登录自动跳转

### 2. 项目管理

- 查看所有项目
- 创建新项目（3步骤流程）
  - 步骤1：描述项目
  - 步骤2：AI 生成问题，用户回答
  - 步骤3：AI 生成完整文档
- 查看项目详情
- 下载文档（单个或批量 ZIP）

### 3. 点数系统

- 购买点数套餐（基础版/专业版）
- 每创建一个项目消耗 1 个点数
- 点数永久有效

### 4. 支付集成

- 集成 ZPay 支付
- 支持支付宝和微信支付
- 支付回调自动充值点数
- 支付历史记录

### 5. AI 文档生成

- 基于 Claude 4 模型
- 生成 5 种专业文档：
  - 用户旅程地图
  - 产品需求 PRD
  - 前端设计文档
  - 后端设计文档
  - 数据库设计文档

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 数据库准备

确保在部署前运行 `pnpm db:push` 创建数据库表结构。

## 开发说明

### 添加新的 shadcn/ui 组件

\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

### 修改数据库 Schema

1. 编辑 `lib/db/schema.ts`
2. 运行 `pnpm db:push` 推送更改

### 调试数据库

\`\`\`bash
pnpm db:studio
\`\`\`

这将启动 Drizzle Studio，可视化查看和编辑数据库。

## 注意事项

1. **API 密钥安全**: 确保所有敏感信息都存储在环境变量中，不要提交到版本控制
2. **支付回调**: 确保支付回调 URL 可以从外网访问（使用 ngrok 或部署后的域名）
3. **AI 调用限制**: 注意 API 调用频率和成本
4. **数据库连接**: 确保 DATABASE_URL 正确配置且数据库可访问

## License

MIT

## 支持

如有问题，请提交 Issue 或联系开发团队。
