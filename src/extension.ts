import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';
import { ConfigManager, LocalizationManager } from './config';
import { Logger } from './logger';

let terminalManager: TerminalManager;
let logger: Logger;

export function activate(context: vscode.ExtensionContext) {
	try {
		// 初始化管理器
		terminalManager = new TerminalManager();
		logger = new Logger();
		
		logger.log(LocalizationManager.getMessage('extensionActivated'));

		// 注册命令
		const commands = [
			vscode.commands.registerCommand('codex.start', async () => {
				await terminalManager.createCodexTerminal();
			}),
			vscode.commands.registerCommand('codex.code', async () => {
				await terminalManager.executeCodex();
			}),
			vscode.commands.registerCommand('codex.openTerminalEditorSide', async () => {
				await terminalManager.createEditorTerminal();
			}),
			vscode.commands.registerCommand('codex.showLogs', () => {
				logger.show();
			}),
			vscode.commands.registerCommand('codex.checkHealth', async () => {
				await checkExtensionHealth();
			})
		];

		// 注册配置变化监听
		const configWatcher = ConfigManager.onConfigChange((e) => {
			if (e.affectsConfiguration('codex')) {
				logger.log('Configuration changed, reloading...');
			}
		});

		context.subscriptions.push(...commands, configWatcher);
		
		// 添加扩展资源清理
		context.subscriptions.push({
			dispose: () => {
				terminalManager.dispose();
				logger.dispose();
			}
		});
		
	} catch (error) {
		console.error('Failed to activate Codex extension:', error);
		vscode.window.showErrorMessage(`Codex扩展激活失败: ${error}`);
	}
}

async function checkExtensionHealth(): Promise<void> {
	try {
		const config = ConfigManager.getConfig();
		const terminalInfo = terminalManager.getTerminalInfo();
		
		const healthReport = [
			'🏥 Codex扩展健康检查报告',
			'',
			'⚙️ 配置信息:',
			`  - 终端延迟: ${config.terminalDelay}ms`,
			`  - 自动执行: ${config.autoExecuteCodex ? '启用' : '禁用'}`,
			`  - 确认执行: ${config.confirmBeforeExecute ? '启用' : '禁用'}`,
			`  - 日志记录: ${config.enableLogging ? '启用' : '禁用'}`,
			`  - 执行命令: ${config.codexCommand}`,
			'',
			'📱 终端状态:',
			`  - 活跃终端数量: ${terminalInfo.length}`,
			...terminalInfo.map(info => `  - ${info.type}: 创建于 ${info.created.toLocaleString()}`),
			'',
			'🌍 环境信息:',
			`  - VSCode版本: ${vscode.version}`,
			`  - 工作区: ${vscode.workspace.workspaceFolders?.[0]?.name || '未打开'}`,
			'',
			'✅ 扩展运行正常'
		].join('\n');
		
		const document = await vscode.workspace.openTextDocument({
			content: healthReport,
			language: 'plaintext'
		});
		
		await vscode.window.showTextDocument(document);
		logger.log('Health check completed successfully');
		
	} catch (error) {
		logger.error('Health check failed', error);
		vscode.window.showErrorMessage(`健康检查失败: ${error}`);
	}
}



export function deactivate() {
	try {
		if (terminalManager) {
			terminalManager.dispose();
		}
		if (logger) {
			logger.dispose();
		}
		logger?.log('Extension deactivated successfully');
	} catch (error) {
		console.error('Error during extension deactivation:', error);
	}
}