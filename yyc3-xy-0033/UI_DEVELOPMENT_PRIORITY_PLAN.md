# YYC³-XIAOYU 统一平台 - UI设计图开发优先级规划

**规划日期**: 2026-01-02
**基于**: 11个UI设计原图
**项目**: YYC³-XIAOYU 四合一统一平台

---

## 📊 UI设计图清单分析

| 序号 | 页面名称 | 设计图 | 复杂度 | 优先级 | 当前状态 |
|------|---------|--------|--------|--------|----------|
| 1 | 首页界面 | ✅ | ⭐⭐⭐ | P0 | 部分实现 |
| 2 | 成长记录 | ✅ | ⭐⭐⭐⭐⭐ | P0 | 框架存在 |
| 3 | 设置管理 | ✅ | ⭐⭐⭐ | P0 | ❌ 错误 |
| 4 | 作业任务 | ✅ | ⭐⭐⭐⭐ | P1 | 框架存在 |
| 5 | 消息中心 | ✅ | ⭐⭐⭐ | P1 | ❌ 缺失 |
| 6 | 智能课表 | ✅ | ⭐⭐⭐⭐ | P1 | ❌ 缺失 |
| 7 | 有声绘本 | ✅ | ⭐⭐⭐⭐ | P1 | 框架存在 |
| 8 | 视频工坊 | ✅ | ⭐⭐⭐⭐⭐ | P2 | ❌ 缺失 |
| 9 | 创意工坊 | ✅ | ⭐⭐⭐⭐⭐ | P2 | ❌ 缺失 |
| 10 | 公益活动 | ✅ | ⭐⭐⭐ | P2 | ❌ 缺失 |
| 11 | 公益课堂 | ✅ | ⭐⭐⭐ | P2 | ❌ 缺失 |

---

## 🎯 分阶段开发计划

### 第一阶段: 核心功能修复 (Week 1-2)
**目标**: 修复现有页面，确保基本功能可用

#### P0 - 最高优先级 (必须完成)

##### 1.1 修复设置管理页面 ⚠️
**问题**: Zod验证错误导致页面无法加载
**原因**: 环境变量或组件验证配置问题
**工期**: 2天
**任务**:
```bash
□ 检查.env.local配置完整性
□ 修复Zod schema验证
□ 添加默认值处理
□ 修复组件props类型
□ 测试所有设置项
```
**验收**: 页面可正常访问，所有设置项功能正常

##### 1.2 完善首页界面 ✅
**当前状态**: 基础框架已存在，可以访问
**工期**: 3天
**任务**:
```bash
□ 实现顶部导航栏 (根据设计图)
□ 实现主要功能区卡片
□ 添加快速操作按钮
□ 实现数据统计展示
□ 添加角色切换功能
□ 响应式布局优化
```
**验收**: 首页与设计图一致，响应式正常

##### 1.3 重构成长记录页面 📊
**当前状态**: 框架存在，但功能不完整
**设计图特点**:
- 时间线式成长记录展示
- 图表数据可视化
- 照片/视频记录
- 里程碑标记
- 数据导出功能

**工期**: 5天
**任务**:
```bash
□ 实现时间线组件
□ 集成图表库 (Recharts)
□ 实现记录添加/编辑功能
□ 照片/视频上传
□ 里程碑庆祝动画
□ 数据筛选和搜索
□ 导出功能 (PDF/Excel)
```
**验收**: 功能完整，与设计图一致

**第一阶段里程碑**: 核心页面可用率100%

---

### 第二阶段: 主要功能开发 (Week 3-4)
**目标**: 实现P1优先级功能

#### P1 - 高优先级 (重要功能)

##### 2.1 作业任务系统 📝
**设计图特点**:
- 作业列表展示
- 作业状态跟踪
- AI批改功能
- 成绩统计
- 作业提交

**工期**: 5天
**任务**:
```bash
□ 作业列表页面
□ 作业详情页
□ AI批改集成 (BigModel API)
□ 作业提交功能
□ 成绩统计图表
□ 作业历史记录
□ 家长反馈功能
```
**技术栈**:
- API: `/api/homework`
- AI: BigModel API作业批改
- 存储: 本地存储 + 数据库

##### 2.2 消息中心 💬
**设计图特点**:
- 消息列表
- 消息分类 (系统/AI/家长)
- 实时通知
- 消息详情
- 标记已读/未读

**工期**: 3天
**任务**:
```bash
□ 消息列表组件
□ 消息分类功能
□ WebSocket实时通知
□ 消息详情页面
□ 批量操作功能
□ 消息搜索功能
```
**技术栈**:
- Socket.IO实时通信
- 本地消息缓存

##### 2.3 智能课表 📅
**设计图特点**:
- 周视图课表
- 课程详情卡片
- 今日课程高亮
- 课程提醒
- 课程筛选

**工期**: 4天
**任务**:
```bash
□ 周课表视图
□ 日/周切换
□ 课程卡片详情
□ 时间冲突检测
□ 课程提醒功能
□ 课程分类筛选
□ 导出课表功能
```
**技术栈**:
- 日程组件库
- 本地通知API

##### 2.4 有声绘本 📚
**设计图特点**:
- 绘本列表
- 封面展示
- 音频播放
- 翻页动画
- 阅读进度

**工期**: 4天
**任务**:
```bash
□ 绘本列表页
□ 绘本阅读器
□ 音频播放器集成
□ 翻页动画效果
□ 阅读进度保存
□ AI朗读功能
□ 收藏/分享功能
```
**技术栈**:
- HTML5 Audio
- Web Speech API
- Canvas翻页动画

**第二阶段里程碑**: P1功能完成率100%

---

### 第三阶段: 创新功能开发 (Week 5-6)
**目标**: 实现P2创新功能

#### P2 - 中等优先级 (创新功能)

##### 3.1 视频工坊 🎬
**设计图特点**:
- AI视频生成
- 视频编辑工具
- 素材库
- 模板系统
- 导出分享

**工期**: 6天
**任务**:
```bash
□ 视频项目列表
□ AI视频生成界面
□ 基础视频编辑器
□ 素材库管理
□ 模板选择
□ 视频预览
□ 导出功能
```
**技术栈**:
- Video.js播放器
- FFmpeg.wasm视频处理
- AI视频生成API

##### 3.2 创意工坊 🎨
**设计图特点**:
- AI绘画工具
- 创作工具集
- 作品展示
- 分享功能
- 作品库

**工期**: 5天
**任务**:
```bash
□ 创作工具集合
□ AI绘画生成
□ 画布编辑器
□ 作品列表
□ 作品详情
□ 分享功能
□ 作品模板
```
**技术栈**:
- Fabric.js Canvas
- AI图像生成API
- html2canvas截图

##### 3.3 公益活动 🤝
**设计图特点**:
- 活动列表
- 活动详情
- 报名功能
- 活动记录
- 志愿时长

**工期**: 3天
**任务**:
```bash
□ 活动列表页
□ 活动详情页
□ 报名表单
□ 我的活动
□ 志愿时长统计
□ 活动证书
```

##### 3.4 公益课堂 📖
**设计图特点**:
- 课程列表
- 视频播放
- 课程分类
- 学习记录
- 证书系统

**工期**: 3天
**任务**:
```bash
□ 课程列表
□ 视频播放器
□ 课程分类
□ 学习进度
□ 完成证书
□ 课程评价
```

**第三阶段里程碑**: P2功能完成率100%

---

## 📋 详细的任务拆解

### 第一阶段详细任务 (Week 1-2)

#### Week 1: 修复核心页面

**Day 1-2: 设置管理页面**
- [ ] 检查.env.local缺失的配置项
- [ ] 修复app/settings/page.tsx的Zod验证
- [ ] 实现编辑资料功能 (API集成)
- [ ] 实现家长授权码查看
- [ ] 实现FAQ页面
- [ ] 实现联系我们页面
- [ ] 测试所有设置项

**Day 3-5: 首页界面**
- [ ] 重构app/page.tsx主页面
- [ ] 实现顶部导航组件
- [ ] 创建功能区卡片组件
- [ ] 实现快速操作按钮
- [ ] 集成数据统计API
- [ ] 添加角色切换动画
- [ ] 响应式设计优化
- [ ] 性能优化 (图片懒加载)

#### Week 2: 成长记录系统

**Day 1-2: 时间线组件**
- [ ] 创建Timeline组件
- [ ] 实现时间节点渲染
- [ ] 添加时间线交互
- [ ] 数据加载优化

**Day 3-4: 数据可视化**
- [ ] 集成Recharts图表
- [ ] 实现成长曲线图
- [ ] 实现里程碑标记
- [ ] 数据统计卡片

**Day 5: 记录管理**
- [ ] 实现添加记录表单
- [ ] 照片/视频上传
- [ ] 实现编辑功能
- [ ] 数据导出功能
- [ ] 测试完整流程

---

### 第二阶段详细任务 (Week 3-4)

#### Week 3: 作业任务系统

**Day 1: 作业列表**
- [ ] 作业列表页面
- [ ] 状态筛选
- [ ] 搜索功能
- [ ] 分页加载

**Day 2-3: AI批改**
- [ ] 集成BigModel API
- [ ] 实现批改结果展示
- [ ] 批改历史记录
- [ ] 错误处理

**Day 4-5: 作业管理**
- [ ] 作业详情页
- [ ] 提交功能
- [ ] 成绩统计
- [ ] 家长反馈
- [ ] 完整测试

#### Week 4: 其他P1功能

**Day 1: 消息中心**
- [ ] 消息列表组件
- [ ] WebSocket集成
- [ ] 实时通知
- [ ] 消息详情

**Day 2: 智能课表**
- [ ] 周视图组件
- [ ] 课程数据结构
- [ ] 冲突检测
- [ ] 提醒功能

**Day 3-4: 有声绘本**
- [ ] 绘本列表
- [ ] 阅读器界面
- [ ] 音频播放
- [ ] 翻页动画
- [ ] 进度保存

---

### 第三阶段详细任务 (Week 5-6)

#### Week 5: 创意工具

**Day 1-2: 视频工坊基础**
- [ ] 视频项目列表
- [ ] 上传界面
- [ ] 素材管理

**Day 3-4: 视频编辑**
- [ ] 基础编辑器
- [ ] AI生成集成
- [ ] 预览功能

**Day 5: 创意工坊**
- [ ] 创作工具集
- [ ] AI绘画
- [ ] 画布编辑

#### Week 6: 公益功能

**Day 1: 公益活动**
- [ ] 活动列表
- [ ] 报名功能
- [ ] 我的活动

**Day 2: 公益课堂**
- [ ] 课程列表
- [ ] 视频播放
- [ ] 学习进度

**Day 3-5: 完善和测试**
- [ ] 全功能联调
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 文档完善

---

## 🎨 UI组件库建设

为了提高开发效率，建议先建设基础UI组件库：

### 核心组件 (第1周完成)
```typescript
components/ui/
├── Timeline.tsx           # 时间线
├── ChartCard.tsx         # 图表卡片
├── MediaPlayer.tsx       # 媒体播放器
├── UploadZone.tsx        # 上传区域
├── EditableTable.tsx     # 可编辑表格
├── CalendarView.tsx      # 日历视图
└── NotificationBadge.tsx # 通知徽章
```

### 业务组件 (第2-3周完成)
```typescript
components/
├── growth/
│   ├── GrowthTimeline.tsx    # 成长时间线
│   ├── MilestoneCard.tsx     # 里程碑卡片
│   └── GrowthChart.tsx       # 成长图表
├── homework/
│   ├── AssignmentCard.tsx   # 作业卡片
│   ├── SubmissionForm.tsx   # 提交表单
│   └── AICorrectionPanel.tsx # AI批改面板
├── books/
│   ├── BookCover.tsx        # 书籍封面
│   ├── AudioPlayer.tsx       # 音频播放器
│   └── PageFlip.tsx         # 翻页动画
└── creative/
    ├── VideoEditor.tsx      # 视频编辑器
    ├── CanvasEditor.tsx     # 画布编辑器
    └── AIToolPanel.tsx      # AI工具面板
```

---

## 📊 技术实施建议

### 状态管理增强
```typescript
// 新增Slices
features/
├── homeworkSlice.ts      # 作业管理
├── messageSlice.ts        # 消息中心
├── scheduleSlice.ts       # 课程表
├── bookSlice.ts           # 绘本
├── creativeSlice.ts       # 创意工坊
└── activitySlice.ts       # 公益活动
```

### API路由规划
```typescript
app/api/
├── homework/
│   ├── route.ts           # 作业列表
│   ├── submit/route.ts    # 提交作业
│   └── correct/route.ts   # AI批改
├── messages/
│   ├── route.ts           # 消息列表
│   └── [id]/route.ts      # 消息详情
├── schedule/
│   ├── route.ts           # 课程表
│   └── events/route.ts    # 课程事件
├── books/
│   ├── route.ts           # 绘本列表
│   └── [id]/route.ts      # 绘本详情
├── creative/
│   ├── video/route.ts     # 视频生成
│   └── art/route.ts       # AI绘画
└── activities/
    ├── route.ts           # 活动列表
    └── [id]/join/route.ts # 报名
```

### 数据库表设计
```sql
-- 作业表
CREATE TABLE assignments (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 消息表
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50),
  title VARCHAR(255),
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 课程表
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL,
  title VARCHAR(255),
  instructor VARCHAR(100),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  location VARCHAR(255),
  day_of_week INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 绘本表
CREATE TABLE books (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(100),
  cover_url TEXT,
  audio_url TEXT,
  pages INTEGER,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创作作品表
CREATE TABLE creative_works (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50),
  title VARCHAR(255),
  content_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 公益活动表
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  location VARCHAR(255),
  max_participants INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⏱️ 时间线总结

```
Week 1-2:   ████████████ 第一阶段 - 核心功能修复
Week 3-4:   ████████████ 第二阶段 - 主要功能开发
Week 5-6:   ████████████ 第三阶段 - 创新功能开发
Week 7-8:   ████████████ 测试优化和文档
```

**总计**: 8周完整实现所有UI设计功能

---

## 🎯 成功指标

### 第一阶段验收标准
- [ ] 设置页面可正常访问
- [ ] 首页与设计图一致度 >90%
- [ ] 成长记录功能完整可用
- [ ] 无阻塞性bug

### 第二阶段验收标准
- [ ] 作业系统完整可用
- [ ] 消息中心实时通知正常
- [ ] 课表功能完整
- [ ] 绘本阅读体验流畅

### 第三阶段验收标准
- [ ] 视频工坊基础功能可用
- [ ] 创意工坊AI工具正常
- [ ] 公益功能完整
- [ ] 所有页面响应式适配

---

## 📝 开发规范

### 代码规范
```bash
✅ TypeScript严格模式
✅ 组件命名: PascalCase
✅ 文件命名: kebab-case
✅ 使用ESLint + Prettier
✅ Git提交前自动格式化
```

### Git工作流
```bash
# 功能分支
feature/首页优化
feature/成长记录
feature/作业系统

# 修复分支
fix/设置页面
fix/Zod验证

# 发布分支
release/v2.0.0
```

---

## 🚀 立即开始

### 今天就可以开始的任务

**优先级1: 修复设置页面**
```bash
cd /Users/yanyu/yyc3-xiaoyu/yyc3-xiaoyu-unified
# 1. 检查环境变量
cat .env.local | grep -v "API_KEY"
# 2. 修复Zod验证
# 3. 测试页面
```

**优先级2: 完善首页**
```bash
# 基于设计图实现首页组件
# 重点: 导航栏、卡片、快速操作
```

**优先级3: 成长记录**
```bash
# 实现时间线组件
# 集成图表库
# 完成数据管理
```

---

## 📞 需要的API密钥配置

### 确保以下环境变量已配置：
```bash
# .env.local
NEXT_PUBLIC_BIGMODEL_API_KEY=xxx
NEXT_PUBLIC_AI_API_URL=https://api.0379.email/v1
OPENAI_API_KEY=xxx  # 如需OpenAI功能
```

---

**规划完成！可以按照优先级开始开发了。**

**建议**: 从第一阶段开始，先修复核心功能，再逐步实现创新功能。

---

**文档版本**: 1.0.0
**创建日期**: 2026-01-02
**下次更新**: 第一阶段完成后
