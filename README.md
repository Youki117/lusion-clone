# Lusion-Clone 项目

## 🚀 项目概述

这是一个高保真的 Lusion 网站克隆项目，使用现代前端技术栈构建，包含了丰富的动画效果和交互体验。

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: GSAP, Framer Motion
- **3D**: Three.js, @react-three/fiber, @react-three/drei
- **滚动**: Lenis (平滑滚动)
- **图标**: Lucide React

## ✨ 主要特性

1. **星空背景动画** - 使用CSS动画创建动态星空效果
2. **平滑滚动效果** - 基于Lenis库的优雅滚动体验
3. **网页宠物交互** - 跟随鼠标的触手动画效果
4. **加载动画系统** - 优雅的加载屏幕和进度显示
5. **响应式设计** - 完全适配各种设备尺寸
6. **现代化组件架构** - 基于React的模块化组件设计

## 📁 项目结构

```
lusion-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 主页
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   ├── sections/          # 页面区块组件
│   │   │   ├── Hero.tsx       # 主页Hero区块
│   │   │   ├── BeyondVisions.tsx
│   │   │   ├── FeaturedWork.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   ├── ui/                # UI组件
│   │   │   ├── StarfieldBackground.tsx
│   │   │   ├── TentaclePet.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...
│   │   └── providers/         # Context提供者
│   │       ├── LoadingProvider.tsx
│   │       ├── SmoothScrollProvider.tsx
│   │       └── TransitionProvider.tsx
│   ├── data/
│   │   └── projects.ts        # 项目数据
│   └── styles/
│       └── starfield.css      # 星空动画样式
├── public/                    # 静态资源
├── package.json              # 项目依赖
├── next.config.js            # Next.js配置
├── tailwind.config.ts        # Tailwind配置
└── tsconfig.json             # TypeScript配置
```

## 🚀 快速开始

### 1. 解压项目文件
```bash
# 解压 lusion-clone-source.zip 到目标目录
```

### 2. 安装依赖
```bash
cd lusion-clone
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问项目
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📦 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行ESLint检查

## 🎨 核心组件说明

### StarfieldBackground
星空背景组件，创建动态的星空效果，为整个网站提供沉浸式的视觉体验。

### TentaclePet
网页宠物组件，实现跟随鼠标的触手动画，增加用户交互的趣味性。

### SmoothScrollProvider
平滑滚动提供者，使用Lenis库实现优雅的滚动效果，提升用户体验。

### LoadingProvider
加载状态管理，提供全局的加载状态和进度控制。

## 🔧 配置说明

### Next.js 配置 (next.config.js)
- 图片优化配置
- 外部图片域名白名单
- Webpack视频文件处理

### Tailwind 配置 (tailwind.config.ts)
- 自定义动画效果
- 颜色主题扩展
- 响应式断点

## 📱 响应式设计

项目完全支持响应式设计，适配以下设备：
- 桌面端 (1200px+)
- 平板端 (768px - 1199px)
- 移动端 (< 768px)

## 🎯 性能优化

- Next.js 图片优化
- 代码分割和懒加载
- CSS动画硬件加速
- 组件级别的性能优化

## 📄 许可证

本项目仅用于学习和演示目的。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📞 联系方式

如有问题，请通过飞书文档或项目仓库联系。

---

**注意**: 本项目是 Lusion 官网的克隆版本，仅用于技术学习和展示目的。
