# 更新日志

## [0.0.5] - 2025-08-29

### 🚀 重大改进

#### 架构重构
- **TerminalManager类**: 重构了终端管理逻辑，使用类来管理终端状态，替代了全局变量
- **配置系统**: 添加了ConfigManager和LocalizationManager，提供了更好的配置管理
- **类型系统**: 引入了完整的TypeScript类型定义，提高了代码质量

#### 新增功能
- **配置选项**: 添加了6个可配置选项，用户可以自定义扩展行为
  - `codex.terminalDelay`: 终端创建后执行命令的延迟时间
  - `codex.welcomeMessage`: 自定义欢迎信息
  - `codex.autoExecuteCodex`: 是否自动执行codex命令
  - `codex.confirmBeforeExecute`: 执行前是否需要确认
  - `codex.codexCommand`: 可配置的执行命令
  - `codex.enableLogging`: 是否启用详细日志
- **健康检查**: 新增`codex.checkHealth`命令，显示扩展状态和配置信息
- **日志系统**: 新增`codex.showLogs`命令，查看详细日志信息

#### 安全性增强
- **命令验证**: 添加了基本的命令安全检查，防止危险命令执行
- **用户确认**: 可选的执行前确认机制
- **错误处理**: 改进了错误处理和用户反馈

#### 用户体验改进
- **更好的错误消息**: 本地化的错误和状态消息
- **配置热重载**: 支持运行时配置更改
- **资源管理**: 改进了扩展卸载时的资源清理

#### 代码质量
- **测试覆盖**: 添加了完整的测试套件，包括单元测试和集成测试
- **Lint规范**: 修复了所有ESLint警告，代码符合最佳实践
- **类型安全**: 完整的TypeScript类型定义

### 🔧 技术改进

#### 模块化架构
```
src/
├── extension.ts          # 主入口文件，简化逻辑
├── terminalManager.ts    # 终端管理核心类
├── config.ts            # 配置和本地化管理
├── logger.ts            # 日志系统
├── types.ts             # 类型定义
└── test/                # 测试套件
```

#### 配置示例
```json
{
  "codex.terminalDelay": 800,
  "codex.welcomeMessage": "🚀 Codex 编辑器侧边终端已启动！",
  "codex.autoExecuteCodex": true,
  "codex.confirmBeforeExecute": false,
  "codex.codexCommand": "codex",
  "codex.enableLogging": false
}
```

### 🐛 修复的问题
- 修复了全局变量导致的状态管理问题
- 解决了硬编码延迟时间的问题
- 改进了终端创建失败的处理
- 修复了资源泄漏问题

### 📊 测试覆盖
- ConfigManager: 4个测试用例
- TerminalManager: 6个测试用例  
- Extension: 6个测试用例
- 总计: 16个测试用例，覆盖主要功能

### 🔄 向后兼容性
- 保持了所有原有命令的兼容性
- 默认配置与之前行为一致
- 用户无需修改现有使用方式

## [0.0.4] - 之前版本
- 基础功能实现
- 编辑器侧边终端支持
- 基本的命令执行功能 