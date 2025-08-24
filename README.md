# Codex-Plugin

![Codex-Plugin](src/codex-extension.png)

Codex-Plugin - Claude Code Router 命令行工具扩展，现已支持在编辑器窗口中显示真正的终端！

## 功能特性

### 🆕 编辑器终端功能
- **侧边终端**: 在编辑器侧边打开新的终端实例并自动执行 `codex`
- **传统终端**: 在底部面板显示标准终端

### 🚀 主要命令

#### 1. 编辑器侧边终端 (推荐)
```
命令: Codex: Open Terminal in Editor Side
快捷键: 可通过命令面板访问
```
- 在编辑器侧边创建真正的终端窗口
- 支持完整的终端功能和交互
- 自动设置到当前工作区目录
- **🚀 自动执行 `codex` 命令**
- 提供友好的欢迎信息和状态提示
- 适合多终端并行使用

#### 2. 传统Codex终端

命令: Codex: Start Codex
快捷键: 可通过命令面板访问
```
- 在底部终端面板创建Codex终端
- 传统的终端使用方式

#### 3. Codex代码执行

命令: Codex: Codex
快捷键: 可通过命令面板访问
```
- 快速执行 `codex` 命令
- 自动创建终端（如果不存在）

## 📋 使用方法

### 方法一：通过编辑器标题栏按钮（推荐）
1. 打开任意文件
2. 在编辑器标题栏找到Codex-Plugin图标按钮
3. 点击按钮：
   - 🔥 "Open Terminal in Editor Side" - 侧边终端并执行 `codex`

### 方法二：通过命令面板
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
2. 输入 "Codex" 查看所有可用命令
3. 选择对应的命令执行

### 方法三：通过快捷键（可自定义）
在VSCode的键盘快捷键设置中可以为以下命令设置快捷键：
- `codex.openTerminalEditorSide`
- `codex.start`
- `codex.code`

## 🛠️ 技术实现

### 编辑器侧边终端实现
使用VSCode扩展API的 `Terminal.location` 配置：
```typescript
const terminal = vscode.window.createTerminal({
    name: 'Codex 编辑器终端',
    cwd: workspaceFolder.uri.fsPath,
    location: vscode.TerminalLocation.Editor
});
```

并自动执行codex命令：
```typescript
setTimeout(() => {
    if (editorTerminal) {
        editorTerminal.sendText('codex');
    }
}, 800);
```

## 🔧 配置要求

- VSCode 版本: >= 1.74.0
- 支持的操作系统: Windows, macOS, Linux
- 需要Claude Code Router CLI工具

## 📦 安装和使用

1. 确保已安装Claude Code Router CLI工具
2. 打开VSCode并加载此扩展
3. 打开一个工作区或文件夹
4. 使用上述任意方法启动终端功能

## 🎯 推荐工作流程

1. **日常开发**: 使用 "Open Terminal in Editor Side" 在编辑器侧边使用终端
   - 命令会自动执行 `codex`，无需手动输入
   - 终端在编辑器侧边显示，方便并行工作
2. **多任务处理**: 多次点击可以复用现有终端或创建新实例
3. **快速操作**: 使用编辑器标题栏的万物图标按钮快速访问功能
4. **重复使用**: 再次点击会重新执行 `codex`

## 🐛 故障排除

### 终端无法创建
- 确保已打开工作区或文件夹
- 检查VSCode版本是否支持
- 尝试重新加载VSCode窗口

### 命令不可用
- 确保扩展已正确激活
- 检查命令面板中是否显示Codex相关命令
- 尝试重新启用扩展

## 🤝 贡献

欢迎提交Issue和Pull Request来改进Codex-Plugin扩展！

## 许可证

MIT License