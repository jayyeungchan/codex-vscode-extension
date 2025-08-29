import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConfigManager } from '../../config';
import { TerminalManager } from '../../terminalManager';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Config Manager should return default values', () => {
		const config = ConfigManager.getConfig();
		
		assert.strictEqual(config.terminalDelay, 800);
		assert.strictEqual(config.autoExecuteCodex, true);
		assert.strictEqual(config.confirmBeforeExecute, false);
		assert.strictEqual(config.codexCommand, 'codex');
		assert.strictEqual(config.enableLogging, false);
	});

	test('Terminal Manager should initialize without errors', () => {
		assert.doesNotThrow(() => {
			const manager = new TerminalManager();
			manager.dispose();
		});
	});

	test('Terminal Manager should track terminal info', () => {
		const manager = new TerminalManager();
		const terminalInfo = manager.getTerminalInfo();
		
		assert.strictEqual(Array.isArray(terminalInfo), true);
		assert.strictEqual(terminalInfo.length, 0);
		
		manager.dispose();
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('codex-extension.codex-plugin'));
	});

	test('Commands should be registered', async () => {
		// 等待扩展激活
		const extension = vscode.extensions.getExtension('codex-extension.codex-plugin');
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		
		const commands = await vscode.commands.getCommands(true);
		
		const expectedCommands = [
			'codex.start',
			'codex.code', 
			'codex.openTerminalEditorSide',
			'codex.showLogs',
			'codex.checkHealth'
		];
		
		expectedCommands.forEach(command => {
			assert.ok(commands.includes(command), `Command ${command} should be registered`);
		});
	});

	test('Configuration properties should be available', () => {
		const configuration = vscode.workspace.getConfiguration('codex');
		
		// 测试配置项是否存在
		assert.ok(configuration.has('terminalDelay'));
		assert.ok(configuration.has('welcomeMessage'));
		assert.ok(configuration.has('autoExecuteCodex'));
		assert.ok(configuration.has('confirmBeforeExecute'));
		assert.ok(configuration.has('codexCommand'));
		assert.ok(configuration.has('enableLogging'));
	});
}); 