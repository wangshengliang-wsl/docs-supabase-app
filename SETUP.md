# VibeGuide 部署和配置指南

## 前置要求

1. **Supabase 账号** - 用于数据库和认证
2. **OpenRouter 账号** - 用于调用 Claude AI
3. **ZPay 账号** - 用于支付功能（可选，测试时可以跳过）

## 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成
4. 获取以下信息：
   - Project URL (Settings > API > Project URL)
   - Anon/Public Key (Settings > API > Project API keys > anon public)
   - Database Connection String (Settings > Database > Connection string > URI)

## 步骤 2: 配置环境变量

在项目根目录创建 `.env.local` 文件：

\`\`\`bash
# Supabase Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI API (Claude via OpenRouter)
ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
ANTHROPIC_API_KEY=your_openrouter_api_key

# ZPay Payment
ZPAY_PID=2025110915115049
ZPAY_PKEY=hWLo15d8tIK4AklyyJHtl8WxsdP0TRBJ

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 获取 OpenRouter API Key

1. 访问 [https://openrouter.ai](https://openrouter.ai)
2. 注册账号并登录
3. 前往 [Keys](https://openrouter.ai/keys) 页面
4. 创建新的 API Key
5. 复制 API Key 到 `ANTHROPIC_API_KEY`

## 步骤 3: 安装依赖

\`\`\`bash
pnpm install
\`\`\`

## 步骤 4: 初始化数据库

运行以下命令将数据库 schema 推送到 Supabase：

\`\`\`bash
pnpm db:push
\`\`\`

这将创建以下表：
- `users` - 用户信息和点数
- `projects` - 项目数据
- `payment_history` - 支付历史

## 步骤 5: 启动开发服务器

\`\`\`bash
pnpm dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000)

## 步骤 6: 测试功能

### 测试认证

1. 访问首页，点击"注册"
2. 使用邮箱注册新账号
3. 检查邮箱验证链接（Supabase 会发送）
4. 登录成功

### 测试项目创建（需要先充值点数）

1. 登录后访问"我的"页面
2. 点击"获取点数"前往价格页面
3. 选择套餐并支付（测试环境可以直接在数据库中手动添加点数）
4. 前往"新建项目"页面
5. 按照 3 个步骤创建项目
6. 查看生成的文档

### 手动添加测试点数

如果不想配置支付，可以直接在数据库中添加点数：

1. 访问 Supabase Dashboard > Table Editor
2. 找到 `users` 表
3. 找到你的用户记录
4. 将 `credits` 字段设置为 10 或更多
5. 保存

## 步骤 7: 配置支付回调（生产环境）

### 开发环境使用 ngrok

\`\`\`bash
# 安装 ngrok
npm install -g ngrok

# 启动 ngrok
ngrok http 3000
\`\`\`

将 ngrok 提供的 URL 更新到 `.env.local` 的 `NEXT_PUBLIC_SITE_URL`。

### 生产环境

部署后，将 `NEXT_PUBLIC_SITE_URL` 设置为你的实际域名，例如：

\`\`\`
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

确保支付回调 URL 可以从外网访问：
- 通知 URL: `https://your-domain.com/api/payment/notify`
- 返回 URL: `https://your-domain.com/api/payment/return`

## 步骤 8: 部署到 Vercel

1. 将代码推送到 GitHub

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. 访问 [https://vercel.com](https://vercel.com)
3. 导入你的 GitHub 仓库
4. 配置环境变量（复制 `.env.local` 的内容）
5. 部署

### Vercel 环境变量

在 Vercel Dashboard > Settings > Environment Variables 中添加所有环境变量。

## 常见问题

### 1. 数据库连接失败

**问题**: `Error: connection refused` 或 `ECONNREFUSED`

**解决方案**:
- 检查 `DATABASE_URL` 是否正确
- 确保 Supabase 项目已完全初始化
- 检查网络连接

### 2. 认证失败

**问题**: 无法注册或登录

**解决方案**:
- 检查 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 确保 Supabase 项目中启用了 Email Auth
- 检查邮箱验证设置

### 3. AI 生成失败

**问题**: `Error: 401 Unauthorized` 或生成文档失败

**解决方案**:
- 检查 `ANTHROPIC_API_KEY` 是否正确
- 确保 OpenRouter 账号有足够余额
- 检查 API 调用限制

### 4. 支付回调失败

**问题**: 支付成功但点数未增加

**解决方案**:
- 检查支付回调 URL 是否可从外网访问
- 查看服务器日志 `/api/payment/notify`
- 确保 `ZPAY_PID` 和 `ZPAY_PKEY` 正确

### 5. 数据库 Schema 更新

如果修改了 `lib/db/schema.ts`，重新运行：

\`\`\`bash
pnpm db:push
\`\`\`

## 生产环境检查清单

- [ ] 所有环境变量已正确配置
- [ ] 数据库 schema 已推送
- [ ] Supabase Email Auth 已启用
- [ ] OpenRouter API Key 有余额
- [ ] 支付回调 URL 可从外网访问
- [ ] 域名已配置 SSL 证书
- [ ] 已测试完整用户流程
- [ ] 已设置监控和日志

## 安全建议

1. **环境变量**: 永远不要将 `.env.local` 提交到版本控制
2. **API 密钥**: 定期轮换 API 密钥
3. **数据库**: 使用强密码，启用 Row Level Security (RLS)
4. **CORS**: 在生产环境中正确配置 CORS
5. **速率限制**: 考虑添加 API 速率限制

## 监控和维护

1. **Supabase Dashboard**: 监控数据库使用情况
2. **Vercel Analytics**: 监控应用性能
3. **Error Tracking**: 集成 Sentry 等错误追踪工具
4. **日志**: 定期检查支付和 AI 调用日志

## 支持

遇到问题？
- 查看项目 Issues
- 阅读 Supabase 文档
- 查看 Next.js 文档
- 联系开发团队

