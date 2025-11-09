# VibeGuide 快速启动指南

## 🚀 5 分钟快速上手

### 1. 克隆项目（如果需要）

\`\`\`bash
cd /Users/wangshengliang/Desktop/i/docs-supabase-app
\`\`\`

### 2. 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 3. 配置环境变量

创建 `.env.local` 文件：

\`\`\`bash
# 复制模板
cp .env.example .env.local

# 编辑文件并填写配置
# 必需配置：
# - DATABASE_URL (Supabase)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ANTHROPIC_BASE_URL (OpenRouter)
# - ANTHROPIC_API_KEY
\`\`\`

**快速获取配置**：

#### Supabase 配置
1. 访问 https://supabase.com
2. 创建项目或使用现有项目
3. 在 Settings > API 中找到：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 在 Settings > Database > Connection string 中找到：
   - URI → `DATABASE_URL`

#### OpenRouter 配置
1. 访问 https://openrouter.ai
2. 注册并登录
3. 在 https://openrouter.ai/keys 创建 API Key
4. 配置：
   - `ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1`
   - `ANTHROPIC_API_KEY=sk-or-v1-...`

### 4. 初始化数据库

\`\`\`bash
pnpm db:push
\`\`\`

这将在 Supabase 中创建所需的表结构。

### 5. 启动开发服务器

\`\`\`bash
pnpm dev
\`\`\`

访问 http://localhost:3000 🎉

## 🧪 测试功能

### 测试 1: 用户注册和登录

1. 访问首页，点击【注册】
2. 使用邮箱注册（Supabase 会发送验证邮件）
3. 登录成功后会自动跳转到 /projects

### 测试 2: 添加测试点数

**选项 A: 手动添加（推荐用于快速测试）**

1. 打开 Supabase Dashboard
2. 前往 Table Editor > users 表
3. 找到你的用户记录
4. 将 `credits` 字段设置为 10
5. 保存

**选项 B: 完整支付流程**

需要配置 ZPay（见 SETUP.md）

### 测试 3: 创建项目

1. 登录后，点击【新建项目】
2. **步骤 1**: 输入项目描述（至少 20 字）
   \`\`\`
   我想开发一个在线学习平台，用户可以浏览课程、购买课程、在线学习视频、做练习题。管理员可以管理课程、用户和订单。
   \`\`\`
3. **步骤 2**: AI 会生成 3-5 个问题，详细回答
4. **步骤 3**: 查看生成的 5 份文档，下载或保存项目

### 测试 4: 查看项目

1. 在【我的项目】页面查看所有项目
2. 点击项目卡片查看详情
3. 可以重新下载文档

## 📋 功能检查清单

- [ ] 首页落地页显示正常
- [ ] 价格页面显示正常
- [ ] 用户可以注册和登录
- [ ] 登录后显示仪表盘
- [ ] 可以查看项目列表
- [ ] 可以创建新项目（3 步骤）
- [ ] AI 生成问题功能正常
- [ ] AI 生成文档功能正常
- [ ] 可以下载单个文档
- [ ] 可以批量下载 ZIP
- [ ] 可以保存项目
- [ ] 点数正确扣除
- [ ] 个人中心显示正确信息
- [ ] 支付历史记录显示（如果有）

## 🐛 常见问题

### 数据库连接失败

**错误**: `Error: Connection refused`

**解决**:
1. 检查 `DATABASE_URL` 格式是否正确
2. 确保包含正确的密码
3. 确保 Supabase 项目已完全初始化（可能需要几分钟）

### AI 调用失败

**错误**: `401 Unauthorized` 或 `Failed to generate`

**解决**:
1. 检查 `ANTHROPIC_API_KEY` 是否正确
2. 确保 OpenRouter 账号有余额
3. 测试 API Key：
   \`\`\`bash
   curl https://openrouter.ai/api/v1/models \\
     -H "Authorization: Bearer $ANTHROPIC_API_KEY"
   \`\`\`

### 无法创建项目

**错误**: 提示"点数不足"

**解决**:
1. 前往【我的】页面查看点数
2. 手动在数据库中添加测试点数
3. 或者配置支付系统购买点数

### 邮箱验证失败

**问题**: 没有收到验证邮件

**解决**:
1. 检查垃圾邮件文件夹
2. 在 Supabase Dashboard > Authentication > Email Templates 中查看配置
3. 开发环境可以禁用邮箱验证：
   - Settings > Authentication > Email Auth > Confirm email 设置为 off

## 🎯 下一步

项目已就绪！你可以：

1. **自定义品牌**
   - 修改 `app/page.tsx` 中的文案
   - 修改 `app/layout.tsx` 中的 metadata
   - 替换颜色主题

2. **扩展功能**
   - 添加更多文档类型
   - 优化 AI prompt
   - 添加项目分享功能
   - 添加团队协作功能

3. **部署到生产环境**
   - 参考 `SETUP.md` 中的 Vercel 部署指南
   - 配置自定义域名
   - 启用监控和分析

## 📚 更多文档

- `README.md` - 项目概览和功能介绍
- `SETUP.md` - 详细的部署和配置指南
- `IMPLEMENTATION_SUMMARY.md` - 技术实现总结
- `docs/prompt.md` - 原始产品需求

## 💡 提示

- 开发时使用 `pnpm db:studio` 可视化查看数据库
- 修改 schema 后记得运行 `pnpm db:push`
- 生产环境记得配置环境变量
- 定期检查 OpenRouter 使用量和余额

祝你使用愉快！🚀

