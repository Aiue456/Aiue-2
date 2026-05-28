好的，我来为你生成完整的前后端需求文档，包含云存档和社交功能。

---

# 《校园迷宫奇遇记》需求文档

---

## 目录
1. 项目概述
2. 前端需求文档
3. 后端需求文档
4. 数据库设计
5. API接口设计
6. 部署与集成方案

---

## 1. 项目概述

### 1.1 项目背景
《校园迷宫奇遇记》是一款2D迷宫解谜+叙事体验的网页游戏。玩家在校园迷宫中探索，帮助NPC完成任务，收集情感便签，解锁故事章节。

### 1.2 核心玩法
- **迷宫探索**：玩家控制主角在2D迷宫中移动，避开障碍物，到达终点
- **叙事体验**：通过漫画分镜和对话系统讲述温暖的校园故事
- **情感收集**：通关后获得老槐树便签，记录帮助他人的温暖瞬间
- **社交互动**：排行榜展示成就，好友系统支持互动

### 1.3 技术栈
| 层级     | 技术方案             | 选型理由                                        |
| -------- | -------------------- | ----------------------------------------------- |
| 前端框架 | Vue 3 + TypeScript   | 类型安全，生态成熟，便于与Phaser集成            |
| 游戏引擎 | Phaser 3             | 专为2D游戏设计，支持Tilemap、物理引擎、动画系统 |
| 构建工具 | Vite                 | 快速构建，热更新，适合现代前端项目              |
| UI组件   | Element Plus         | 成熟的Vue组件库，支持社交功能界面               |
| 后端语言 | Node.js + TypeScript | 与前端技术栈统一，开发效率高                    |
| 后端框架 | NestJS               | 企业级框架，支持依赖注入，便于维护              |
| 数据库   | MongoDB              | 适合存储游戏进度、用户数据等非结构化数据        |
| 缓存     | Redis                | 加速排行榜、会话管理等高频访问场景              |
| 认证     | JWT                  | 无状态认证，支持多端同步                        |

---

## 2. 前端需求文档

### 2.1 功能需求

#### 2.1.1 用户系统
| 功能模块 | 需求描述                        | 优先级 |
| -------- | ------------------------------- | ------ |
| 用户注册 | 支持邮箱/手机号注册，验证机制   | 高     |
| 用户登录 | 支持账号密码登录、记住密码      | 高     |
| 游客模式 | 无需登录即可游玩，数据存本地    | 高     |
| 用户信息 | 查看/编辑个人资料（头像、昵称） | 中     |

#### 2.1.2 核心游戏玩法
| 功能模块   | 需求描述                                | 优先级 |
| ---------- | --------------------------------------- | ------ |
| 迷宫移动   | 键盘WASD/方向键控制，移动端支持触摸控制 | 高     |
| 碰撞检测   | 主角与墙壁、障碍物的碰撞判定            | 高     |
| 出口检测   | 到达终点触发通关逻辑                    | 高     |
| 剧情触发区 | 进入特定区域触发NPC对话或漫画分镜       | 高     |
| 关卡选择   | 展示所有关卡，显示解锁状态和星级        | 高     |

#### 2.1.3 叙事与UI系统
| 功能模块     | 需求描述                                       | 优先级 |
| ------------ | ---------------------------------------------- | ------ |
| 漫画分镜     | 手绘分镜图片序列帧播放，支持淡入/平移/缩放动画 | 高     |
| 对话弹窗     | 气泡对话展示NPC对话内容，支持选项选择          | 高     |
| 章节解锁提示 | 达到条件时弹出章节解锁动画                     | 高     |

#### 2.1.4 老槐树便签系统
| 功能模块     | 需求描述                               | 优先级 |
| ------------ | -------------------------------------- | ------ |
| 通关便签动画 | 主角走到老槐树下写字、贴便签的固定动画 | 高     |
| 便签展示     | 手写体文字渐现效果                     | 高     |
| 数据同步     | 自动同步到云端存档                     | 高     |

#### 2.1.5 好人好事笔记本
| 功能模块 | 需求描述                           | 优先级 |
| -------- | ---------------------------------- | ------ |
| 章节解锁 | 累计通关10/30/60关分别解锁3个章节  | 高     |
| 笔记本UI | 手绘风格笔记本界面，支持翻页       | 高     |
| 记录展示 | 左侧显示帮助记录，右侧展示便签原迹 | 高     |
| 章节跳转 | 支持按章节快速跳转                 | 中     |

#### 2.1.6 云存档系统
| 功能模块   | 需求描述                 | 优先级 |
| ---------- | ------------------------ | ------ |
| 自动同步   | 通关后自动上传存档到云端 | 高     |
| 手动同步   | 提供手动同步按钮         | 中     |
| 存档恢复   | 登录后自动下载云端存档   | 高     |
| 多设备同步 | 支持多设备间存档同步     | 高     |

#### 2.1.7 社交功能
| 功能模块 | 需求描述                               | 优先级 |
| -------- | -------------------------------------- | ------ |
| 排行榜   | 按通关数、总星数排序展示玩家排名       | 高     |
| 好友列表 | 查看好友在线状态、游戏进度             | 高     |
| 好友申请 | 发送/接受/拒绝好友申请                 | 中     |
| 成就系统 | 达成特定条件解锁成就（如通关全部关卡） | 中     |
| 分享功能 | 分享游戏成就到社交平台                 | 中     |

#### 2.1.8 音频系统
| 功能模块     | 需求描述                           | 优先级 |
| ------------ | ---------------------------------- | ------ |
| 背景音乐     | 多音轨环境音播放（雨声、操场声等） | 中     |
| 音效         | 操作音效、剧情触发音效             | 中     |
| 自动播放处理 | 处理浏览器自动播放限制             | 高     |

### 2.2 非功能需求

#### 2.2.1 性能要求
| 指标         | 要求      |
| ------------ | --------- |
| 帧率         | 稳定60fps |
| 首屏加载时间 | ≤3秒      |
| 关卡切换时间 | ≤1秒      |
| API响应时间  | ≤200ms    |

#### 2.2.2 兼容性
| 平台   | 要求                                          |
| ------ | --------------------------------------------- |
| 浏览器 | Chrome ≥80、Firefox ≥75、Safari ≥13、Edge ≥80 |
| 移动端 | iOS ≥12、Android ≥8.0，支持触摸操作           |
| 响应式 | 适配不同屏幕尺寸（320px-1920px）              |

#### 2.2.3 用户体验
| 需求     | 描述                                 |
| -------- | ------------------------------------ |
| 操作流畅 | 移动控制响应灵敏，无卡顿             |
| 反馈及时 | 操作有音效和视觉反馈                 |
| 容错性   | 支持意外关闭后继续游戏，自动保存进度 |
| 可访问性 | 支持键盘导航，视觉元素对比度达标     |

### 2.3 数据结构

```typescript
// 关卡数据结构
interface LevelData {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  storyIntro: string;
  mission: string;
  npcNeeds: string;
  postNote: string;      // 通关后便签内容
  noteDate: string;      // 便签日期
  values: string;        // 价值观标签
  helpedPerson: string;  // 帮助的人
  action: string;        // 行为描述
  location: string;      // 地点
  stars: number;         // 星级（1-3）
  mapData: string;       // Tilemap JSON数据
}

// 便签存储结构
interface NoteItem {
  levelId: number;
  noteText: string;
  date: string;
  earnedAt: number;      // 获取时间戳
}

// 游戏进度
interface GameProgress {
  completedLevels: number[];      // 已通关关卡ID列表
  levelStars: Record<number, number>;  // 各关卡星级
  notesCollection: NoteItem[];    // 便签集合
  unlockedChapters: number[];     // 已解锁章节
  totalPlayTime: number;          // 累计游戏时间（秒）
  achievements: string[];         // 已解锁成就ID
}

// 用户信息
interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: number;
  lastLoginAt: number;
}

// 好友关系
interface FriendRelation {
  userId: string;
  friendId: string;
  status: "pending" | "accepted";
  createdAt: number;
}

// 排行榜条目
interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  completedLevels: number;
  totalStars: number;
  rank: number;
}
```

---

## 3. 后端需求文档

### 3.1 功能需求

#### 3.1.1 用户服务
| 功能模块     | 需求描述                           | 优先级 |
| ------------ | ---------------------------------- | ------ |
| 用户注册     | 创建用户账号，密码加密存储         | 高     |
| 用户登录     | 验证账号密码，返回JWT token        | 高     |
| 用户信息管理 | 更新用户资料、头像                 | 中     |
| 游客账号升级 | 支持游客账号绑定邮箱升级为正式账号 | 中     |

#### 3.1.2 云存档服务
| 功能模块 | 需求描述                           | 优先级 |
| -------- | ---------------------------------- | ------ |
| 存档上传 | 接收前端游戏进度数据，保存到数据库 | 高     |
| 存档下载 | 根据用户ID返回云端存档数据         | 高     |
| 存档同步 | 处理多设备同步冲突，保留最新版本   | 高     |
| 存档备份 | 自动保留最近5个版本的存档历史      | 中     |

#### 3.1.3 社交服务
| 功能模块 | 需求描述                     | 优先级 |
| -------- | ---------------------------- | ------ |
| 排行榜   | 按通关数、总星数实时排名     | 高     |
| 好友管理 | 好友申请、同意、删除好友关系 | 高     |
| 好友状态 | 实时更新好友在线状态         | 中     |
| 成就系统 | 成就解锁判定与记录           | 中     |

#### 3.1.4 关卡数据服务
| 功能模块     | 需求描述                         | 优先级 |
| ------------ | -------------------------------- | ------ |
| 关卡数据管理 | 提供关卡配置数据（地图、剧情等） | 高     |
| 关卡解锁验证 | 验证关卡解锁条件                 | 高     |

### 3.2 非功能需求

#### 3.2.1 性能要求
| 指标        | 要求                       |
| ----------- | -------------------------- |
| API响应时间 | ≤200ms（P95）              |
| 并发支持    | 支持1000+并发用户          |
| 可用性      | 99.9%                      |
| 数据备份    | 每日自动备份，保留30天历史 |

#### 3.2.2 安全性
| 需求     | 描述                        |
| -------- | --------------------------- |
| 数据加密 | 用户密码使用bcrypt加密存储  |
| 传输加密 | 所有API接口使用HTTPS        |
| 访问控制 | JWT token验证，过期自动刷新 |
| 请求限流 | 防止暴力破解和API滥用       |
| 数据脱敏 | 日志中不记录敏感信息        |

#### 3.2.3 可扩展性
| 需求       | 描述                               |
| ---------- | ---------------------------------- |
| 水平扩展   | 支持多实例部署                     |
| 模块化设计 | 服务模块解耦，便于独立扩展         |
| 配置管理   | 支持环境变量配置，便于不同环境部署 |

---

## 4. 数据库设计

### 4.1 数据库表/集合

#### 4.1.1 users（用户表）
| 字段名      | 类型     | 描述           | 约束         |
| ----------- | -------- | -------------- | ------------ |
| _id         | ObjectId | 用户唯一标识   | 主键         |
| username    | string   | 用户名         | 非空，唯一   |
| email       | string   | 邮箱地址       | 非空，唯一   |
| password    | string   | 加密后的密码   | 非空         |
| avatar      | string   | 头像URL        | 可选，默认值 |
| createdAt   | number   | 创建时间戳     | 非空         |
| lastLoginAt | number   | 最后登录时间戳 | 非空         |
| isGuest     | boolean  | 是否游客账号   | 默认false    |

#### 4.1.2 gameProgress（游戏进度表）
| 字段名           | 类型     | 描述                        | 约束       |
| ---------------- | -------- | --------------------------- | ---------- |
| _id              | ObjectId | 进度唯一标识                | 主键       |
| userId           | string   | 用户ID                      | 外键，非空 |
| completedLevels  | number[] | 已通关关卡ID列表            | 默认[]     |
| levelStars       | object   | 各关卡星级 {levelId: stars} | 默认{}     |
| notesCollection  | array    | 便签集合                    | 默认[]     |
| unlockedChapters | number[] | 已解锁章节                  | 默认[]     |
| totalPlayTime    | number   | 累计游戏时间（秒）          | 默认0      |
| achievements     | string[] | 已解锁成就ID                | 默认[]     |
| updatedAt        | number   | 最后更新时间戳              | 非空       |

#### 4.1.3 friends（好友关系表）
| 字段名    | 类型     | 描述                         | 约束 |
| --------- | -------- | ---------------------------- | ---- |
| _id       | ObjectId | 关系唯一标识                 | 主键 |
| userId    | string   | 用户ID                       | 非空 |
| friendId  | string   | 好友ID                       | 非空 |
| status    | string   | 关系状态（pending/accepted） | 非空 |
| createdAt | number   | 创建时间戳                   | 非空 |

#### 4.1.4 achievements（成就表）
| 字段名      | 类型     | 描述         | 约束       |
| ----------- | -------- | ------------ | ---------- |
| _id         | ObjectId | 成就唯一标识 | 主键       |
| id          | string   | 成就唯一ID   | 非空，唯一 |
| name        | string   | 成就名称     | 非空       |
| description | string   | 成就描述     | 非空       |
| icon        | string   | 成就图标URL  | 非空       |
| condition   | object   | 解锁条件配置 | 非空       |

#### 4.1.5 levels（关卡数据表）
| 字段名       | 类型     | 描述                     | 约束       |
| ------------ | -------- | ------------------------ | ---------- |
| _id          | ObjectId | 关卡唯一标识             | 主键       |
| id           | number   | 关卡编号                 | 非空，唯一 |
| title        | string   | 关卡标题                 | 非空       |
| difficulty   | string   | 难度（easy/medium/hard） | 非空       |
| storyIntro   | string   | 剧情介绍                 | 非空       |
| mission      | string   | 任务描述                 | 非空       |
| npcNeeds     | string   | NPC需求                  | 非空       |
| postNote     | string   | 通关便签内容             | 非空       |
| noteDate     | string   | 便签日期                 | 非空       |
| values       | string   | 价值观标签               | 非空       |
| helpedPerson | string   | 帮助的人                 | 非空       |
| action       | string   | 行为描述                 | 非空       |
| location     | string   | 地点                     | 非空       |
| mapData      | object   | Tilemap地图数据          | 非空       |

### 4.2 索引设计
| 表名         | 索引字段         | 索引类型     | 用途             |
| ------------ | ---------------- | ------------ | ---------------- |
| users        | email            | 唯一索引     | 登录查询         |
| users        | username         | 唯一索引     | 用户名查询       |
| gameProgress | userId           | 单字段索引   | 用户进度查询     |
| gameProgress | updatedAt        | 单字段索引   | 存档同步排序     |
| friends      | userId           | 单字段索引   | 好友列表查询     |
| friends      | userId, friendId | 复合唯一索引 | 防止重复好友关系 |
| levels       | id               | 唯一索引     | 关卡查询         |

---

## 5. API接口设计

### 5.1 用户模块

| 接口路径             | HTTP方法 | 功能描述         |
| -------------------- | -------- | ---------------- |
| `/api/auth/register` | POST     | 用户注册         |
| `/api/auth/login`    | POST     | 用户登录         |
| `/api/auth/logout`   | POST     | 用户登出         |
| `/api/users/me`      | GET      | 获取当前用户信息 |
| `/api/users/me`      | PUT      | 更新用户信息     |
| `/api/users/avatar`  | POST     | 上传头像         |

#### 接口详情

**POST /api/auth/register**
```json
// 请求体
{
  "username": "string (必填，3-20字符)",
  "email": "string (必填，邮箱格式)",
  "password": "string (必填，6-32字符)"
}

// 成功响应 (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string",
      "createdAt": "number"
    },
    "token": "string (JWT token)"
  }
}

// 失败响应 (400)
{
  "success": false,
  "message": "邮箱已被注册"
}
```

**POST /api/auth/login**
```json
// 请求体
{
  "email": "string (必填)",
  "password": "string (必填)"
}

// 成功响应 (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string"
    },
    "token": "string"
  }
}

// 失败响应 (401)
{
  "success": false,
  "message": "邮箱或密码错误"
}
```

---

### 5.2 云存档模块

| 接口路径              | HTTP方法 | 功能描述         |
| --------------------- | -------- | ---------------- |
| `/api/save`           | GET      | 获取用户存档     |
| `/api/save`           | POST     | 上传存档         |
| `/api/save/history`   | GET      | 获取存档历史版本 |
| `/api/save/{version}` | GET      | 恢复指定版本存档 |

#### 接口详情

**GET /api/save**
```json
// 请求头
Authorization: Bearer {token}

// 成功响应 (200)
{
  "success": true,
  "data": {
    "completedLevels": [1, 2, 3],
    "levelStars": { "1": 3, "2": 2 },
    "notesCollection": [...],
    "unlockedChapters": [1],
    "totalPlayTime": 3600,
    "achievements": ["first_win"],
    "updatedAt": 1699999999
  }
}
```

**POST /api/save**
```json
// 请求头
Authorization: Bearer {token}

// 请求体
{
  "completedLevels": "number[] (必填)",
  "levelStars": "object (必填)",
  "notesCollection": "array (必填)",
  "unlockedChapters": "number[] (必填)",
  "totalPlayTime": "number (必填)",
  "achievements": "string[] (必填)"
}

// 成功响应 (200)
{
  "success": true,
  "message": "存档保存成功",
  "updatedAt": 1699999999
}
```

---

### 5.3 社交模块

| 接口路径                    | HTTP方法 | 功能描述           |
| --------------------------- | -------- | ------------------ |
| `/api/leaderboard`          | GET      | 获取排行榜         |
| `/api/friends`              | GET      | 获取好友列表       |
| `/api/friends/search`       | GET      | 搜索用户           |
| `/api/friends/request`      | POST     | 发送好友请求       |
| `/api/friends/request/{id}` | PUT      | 接受/拒绝好友请求  |
| `/api/friends/{id}`         | DELETE   | 删除好友           |
| `/api/achievements`         | GET      | 获取成就列表       |
| `/api/achievements/user`    | GET      | 获取用户已解锁成就 |

#### 接口详情

**GET /api/leaderboard**
```json
// 请求参数
// ?page=1&limit=20&sort=stars (stars/completedLevels)

// 成功响应 (200)
{
  "success": true,
  "data": {
    "list": [
      {
        "rank": 1,
        "userId": "string",
        "username": "string",
        "avatar": "string",
        "completedLevels": 60,
        "totalStars": 180
      }
    ],
    "total": 1000
  }
}
```

**POST /api/friends/request**
```json
// 请求头
Authorization: Bearer {token}

// 请求体
{
  "friendId": "string (必填，目标用户ID)"
}

// 成功响应 (200)
{
  "success": true,
  "message": "好友请求已发送"
}
```

**PUT /api/friends/request/{id}**
```json
// 请求头
Authorization: Bearer {token}

// 请求体
{
  "action": "string (必填，accept/reject)"
}

// 成功响应 (200)
{
  "success": true,
  "message": "操作成功"
}
```

---

### 5.4 关卡模块

| 接口路径           | HTTP方法 | 功能描述         |
| ------------------ | -------- | ---------------- |
| `/api/levels`      | GET      | 获取所有关卡列表 |
| `/api/levels/{id}` | GET      | 获取单个关卡详情 |

#### 接口详情

**GET /api/levels**
```json
// 成功响应 (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "丢失的文具",
      "difficulty": "easy",
      "storyIntro": "课间，同桌的铅笔盒不见了...",
      "stars": 3
    }
  ]
}
```

**GET /api/levels/{id}**
```json
// 成功响应 (200)
{
  "success": true,
  "data": {
    "id": 1,
    "title": "丢失的文具",
    "difficulty": "easy",
    "storyIntro": "课间，同桌的铅笔盒不见了...",
    "mission": "帮助同学在迷宫中找到文具",
    "npcNeeds": "张三",
    "postNote": "今天帮张三找到了妈妈送的铅笔...",
    "noteDate": "1994-03-15",
    "values": "善良",
    "helpedPerson": "张三",
    "action": "找到丢失的文具",
    "location": "教室后走廊",
    "mapData": {...}
  }
}
```

---

## 6. 部署与集成方案

### 6.1 前端部署
- **构建输出**：Vite打包生成静态文件
- **部署方式**：
  - 开发环境：`npm run dev` 本地开发服务器
  - 生产环境：静态文件部署至CDN或云存储（如阿里云OSS、腾讯云COS）
- **环境变量**：
  - `VITE_API_BASE_URL`：后端API地址
  - `VITE_APP_VERSION`：应用版本号

### 6.2 后端部署
- **构建输出**：TypeScript编译为JavaScript
- **部署方式**：
  - 开发环境：`npm run start:dev` 热重载开发
  - 生产环境：Docker容器部署至云服务器（如阿里云ECS、腾讯云CVM）
- **环境变量**：
  - `PORT`：服务端口
  - `MONGODB_URI`：MongoDB连接字符串
  - `REDIS_URL`：Redis连接地址
  - `JWT_SECRET`：JWT密钥
  - `JWT_EXPIRES_IN`：Token过期时间

### 6.3 数据库部署
- **MongoDB**：使用MongoDB Atlas云数据库或自建副本集
- **Redis**：使用Redis云服务或自建集群，用于缓存排行榜和会话

### 6.4 CI/CD流程
1. 代码提交触发CI流水线
2. 自动执行代码检查（ESLint、Prettier）
3. 自动运行单元测试
4. 构建前端和后端应用
5. 部署至测试环境进行集成测试
6. 测试通过后部署至生产环境

---

## 文档版本记录

| 版本 | 日期       | 修改内容                     | 作者 |
| ---- | ---------- | ---------------------------- | ---- |
| V1.0 | 2026-05-28 | 初始版本，包含前后端完整需求 | -    |

---

以上是完整的前后端需求文档，包含：
- 项目概述和技术选型
- 前端功能需求（用户系统、游戏玩法、便签系统、社交功能等）
- 后端功能需求（用户服务、云存档、社交服务等）
- 数据库设计（表结构、索引设计）
- API接口设计（完整的接口定义和请求响应格式）
- 部署与集成方案

你可以根据这份文档进行开发工作。如果需要进一步细化某个模块或有其他问题，请随时告诉我！