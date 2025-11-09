// 临时模拟 AI 响应 - 仅用于测试
import { Question, Documents } from './claude';

export async function generateQuestionsMock(description: string): Promise<Question[]> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return [
    {
      question: "这个项目的主要目标用户是谁？他们的典型使用场景是什么？",
      purpose: "了解目标用户群体和核心使用场景，帮助明确产品定位"
    },
    {
      question: "项目的核心功能有哪些？优先级如何排序？",
      purpose: "确定 MVP 范围和开发优先级"
    },
    {
      question: "项目预期的用户规模和并发量是多少？对性能有什么要求？",
      purpose: "了解技术架构和性能优化需求"
    },
    {
      question: "是否有偏好的技术栈？团队对哪些技术比较熟悉？",
      purpose: "选择合适的技术栈，降低学习成本"
    },
    {
      question: "项目的预算和时间计划是什么？有没有硬性的上线时间要求？",
      purpose: "确定项目范围和资源投入"
    }
  ];
}

export async function generateDocumentsMock(
  description: string,
  answers: string
): Promise<Documents> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return {
    userJourney: `# 用户旅程地图

## 项目概述
${description}

## 用户画像

### 主要用户类型
- **普通用户**: 使用系统的主要功能
- **管理员**: 管理系统配置和内容

## 用户旅程

### 1. 发现阶段
- 用户通过搜索引擎、社交媒体等渠道了解到产品
- 访问产品官网或应用商店

### 2. 注册/登录
- 简单的注册流程
- 支持邮箱、手机号等多种方式

### 3. 核心功能使用
- 浏览内容/产品
- 执行核心操作
- 个性化体验

### 4. 持续使用
- 收到通知提醒
- 查看历史记录
- 分享给好友

## 关键触点
- 首页展示
- 搜索功能
- 详情页面
- 支付流程（如果有）

## 用户痛点和解决方案
${answers}`,

    prd: `# 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 背景
${description}

### 1.2 产品定位
为用户提供便捷、高效的服务平台

### 1.3 目标用户
根据需求分析确定的目标用户群体

## 2. 功能需求

### 2.1 核心功能

#### 功能1: 用户管理
- 用户注册
- 用户登录
- 个人信息管理
- 密码找回

#### 功能2: 核心业务功能
- 列表浏览
- 详情查看
- 搜索筛选
- 收藏/点赞

#### 功能3: 管理后台
- 内容管理
- 用户管理
- 数据统计
- 系统设置

### 2.2 非功能需求
- 响应时间: < 2秒
- 并发支持: 1000+ 用户
- 可用性: 99.9%
- 安全性: 数据加密、权限控制

## 3. 用户故事

### 用户故事1
作为一个普通用户，我希望能够快速找到我需要的内容，这样我就能高效完成任务。

### 用户故事2
作为一个管理员，我希望能够方便地管理内容和用户，这样我就能保证平台正常运行。

## 4. 设计要点
- 简洁的界面设计
- 清晰的信息架构
- 流畅的交互体验

## 5. 成功指标
- 日活跃用户数
- 用户留存率
- 功能使用率
- 用户满意度`,

    frontendDesign: `# 前端设计文档

## 1. 技术栈

### 1.1 核心技术
- **框架**: React 18+ / Next.js 14+
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Context / Zustand
- **路由**: Next.js App Router

### 1.2 工具库
- **HTTP 客户端**: fetch / axios
- **表单处理**: React Hook Form
- **数据验证**: Zod
- **日期处理**: date-fns

## 2. 项目结构

\`\`\`
src/
├── app/                    # Next.js 页面
│   ├── (public)/          # 公开页面
│   ├── (dashboard)/       # 需要登录的页面
│   └── api/               # API 路由
├── components/            # 组件
│   ├── ui/               # 基础 UI 组件
│   ├── features/         # 功能组件
│   └── layouts/          # 布局组件
├── lib/                  # 工具函数
├── hooks/                # 自定义 Hooks
└── types/                # TypeScript 类型定义
\`\`\`

## 3. 页面设计

### 3.1 首页
- Hero 区域
- 功能介绍
- CTA 按钮

### 3.2 列表页
- 搜索栏
- 筛选器
- 卡片列表
- 分页

### 3.3 详情页
- 详细信息展示
- 相关操作按钮
- 评论区（如需要）

### 3.4 个人中心
- 用户信息
- 我的内容
- 设置选项

## 4. 组件设计

### 4.1 公共组件
- Header: 顶部导航
- Footer: 底部信息
- Sidebar: 侧边栏
- Modal: 弹窗
- Toast: 消息提示

### 4.2 业务组件
- Card: 内容卡片
- List: 列表组件
- Form: 表单组件
- Table: 表格组件

## 5. 状态管理

### 5.1 全局状态
- 用户信息
- 主题设置
- 语言设置

### 5.2 本地状态
- 表单数据
- UI 状态
- 临时数据

## 6. 性能优化

- 代码分割
- 懒加载
- 图片优化
- 缓存策略

## 7. 响应式设计

- 移动端适配
- 平板适配
- 桌面端优化`,

    backendDesign: `# 后端设计文档

## 1. 技术栈

### 1.1 核心技术
- **运行时**: Node.js 18+
- **框架**: Next.js API Routes
- **语言**: TypeScript
- **数据库**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM

### 1.2 第三方服务
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **AI**: Claude (via OpenRouter)
- **支付**: ZPay

## 2. 架构设计

### 2.1 分层架构
\`\`\`
┌─────────────────┐
│   API Routes    │  # 路由层
├─────────────────┤
│   Services      │  # 业务逻辑层
├─────────────────┤
│   Database      │  # 数据访问层
└─────────────────┘
\`\`\`

### 2.2 目录结构
\`\`\`
app/api/
├── auth/              # 认证相关
├── users/             # 用户管理
├── projects/          # 项目管理
└── ai/                # AI 功能

lib/
├── db/                # 数据库
├── services/          # 服务层
└── utils/             # 工具函数
\`\`\`

## 3. API 设计

### 3.1 认证 API
\`\`\`
POST /api/auth/register    # 注册
POST /api/auth/login       # 登录
POST /api/auth/logout      # 登出
\`\`\`

### 3.2 核心业务 API
\`\`\`
GET    /api/projects       # 获取项目列表
POST   /api/projects       # 创建项目
GET    /api/projects/:id   # 获取项目详情
PUT    /api/projects/:id   # 更新项目
DELETE /api/projects/:id   # 删除项目
\`\`\`

### 3.3 AI API
\`\`\`
POST /api/ai/generate-questions    # 生成问题
POST /api/ai/generate-documents    # 生成文档
\`\`\`

## 4. 数据模型

### 4.1 用户模型
- id: UUID
- email: String
- credits: Integer
- created_at: Timestamp

### 4.2 项目模型
- id: UUID
- user_id: UUID (外键)
- name: String
- description: Text
- documents: JSONB
- created_at: Timestamp

## 5. 安全设计

### 5.1 认证授权
- JWT Token 验证
- 路由权限控制
- 用户数据隔离

### 5.2 数据安全
- 密码加密
- SQL 注入防护
- XSS 防护
- CSRF 防护

## 6. 性能优化

- 数据库索引
- 查询优化
- 缓存策略
- API 限流

## 7. 错误处理

- 统一错误格式
- 日志记录
- 错误追踪`,

    databaseDesign: `# 数据库设计文档

## 1. 数据库选型

- **类型**: PostgreSQL
- **托管**: Supabase
- **ORM**: Drizzle ORM

## 2. 数据表设计

### 2.1 users 表（用户表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 用户ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| credits | INTEGER | DEFAULT 0 | 项目点数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- PRIMARY KEY: id
- UNIQUE INDEX: email
- INDEX: created_at

### 2.2 projects 表（项目表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 项目ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | 用户ID |
| name | VARCHAR(255) | NOT NULL | 项目名称 |
| step1_description | TEXT | | 项目描述 |
| step2_questions | JSONB | | AI生成的问题 |
| step2_answers | TEXT | | 用户回答 |
| step3_documents | JSONB | | 生成的文档 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- INDEX: user_id
- INDEX: created_at

### 2.3 payment_history 表（支付历史表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY | 支付ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | 用户ID |
| order_no | VARCHAR(100) | UNIQUE, NOT NULL | 订单号 |
| trade_no | VARCHAR(100) | | 交易号 |
| amount | DECIMAL(10,2) | NOT NULL | 金额 |
| credits | INTEGER | NOT NULL | 对应点数 |
| status | ENUM | DEFAULT 'pending' | 状态 |
| paid_at | TIMESTAMP | | 支付时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引**:
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- UNIQUE INDEX: order_no
- INDEX: user_id
- INDEX: status

**枚举类型**:
- payment_status: ['pending', 'completed', 'failed']

## 3. 数据关系

\`\`\`
users (1) ──────< (N) projects
users (1) ──────< (N) payment_history
\`\`\`

## 4. 数据完整性

### 4.1 外键约束
- projects.user_id → users.id (CASCADE DELETE)
- payment_history.user_id → users.id (CASCADE DELETE)

### 4.2 默认值
- credits: 0
- status: 'pending'
- timestamps: NOW()

## 5. 数据备份

- 自动备份: 每天
- 保留时间: 30天
- 恢复测试: 每月

## 6. 性能优化

### 6.1 索引策略
- 主键索引
- 外键索引
- 常用查询字段索引

### 6.2 查询优化
- 使用适当的 JOIN
- 避免 SELECT *
- 使用分页

## 7. 数据迁移

使用 Drizzle Kit 进行迁移:
\`\`\`bash
pnpm db:generate  # 生成迁移文件
pnpm db:push      # 推送到数据库
\`\`\``
  };
}

