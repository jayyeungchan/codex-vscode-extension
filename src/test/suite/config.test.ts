import * as assert from 'assert';
import * as vscode from 'vscode';
import { ConfigManager, LocalizationManager } from '../../config';

suite('Config Test Suite', () => {
    
    test('ConfigManager should provide default configuration', () => {
        const config = ConfigManager.getConfig();
        
        assert.ok(config);
        assert.strictEqual(typeof config.terminalDelay, 'number');
        assert.strictEqual(typeof config.welcomeMessage, 'string');
        assert.strictEqual(typeof config.autoExecuteCodex, 'boolean');
        assert.strictEqual(typeof config.confirmBeforeExecute, 'boolean');
        assert.strictEqual(typeof config.codexCommand, 'string');
        assert.strictEqual(typeof config.enableLogging, 'boolean');
    });

    test('ConfigManager should return workspace configuration', () => {
        const config = ConfigManager.getConfig();
        const workspaceConfig = vscode.workspace.getConfiguration('codex');
        
        assert.strictEqual(config.terminalDelay, workspaceConfig.get('terminalDelay', 800));
        assert.strictEqual(config.autoExecuteCodex, workspaceConfig.get('autoExecuteCodex', true));
    });

    test('LocalizationManager should provide all required messages', () => {
        const requiredKeys = [
            'workspaceRequired',
            'terminalOpened', 
            'terminalCreated',
            'codexExecuted',
            'editorTerminalStarted',
            'confirmExecution',
            'commandNotFound',
            'terminalCreationFailed',
            'extensionActivated'
        ];

        requiredKeys.forEach(key => {
            const message = LocalizationManager.getMessage(key as any);
            assert.ok(message);
            assert.strictEqual(typeof message, 'string');
            assert.ok(message.length > 0);
        });
    });

    test('ConfigManager should handle configuration updates', async () => {
        const originalValue = ConfigManager.getConfig().enableLogging;
        
        try {
            await ConfigManager.updateConfig('enableLogging', !originalValue);
            const updatedConfig = ConfigManager.getConfig();
            assert.strictEqual(updatedConfig.enableLogging, !originalValue);
        } finally {
            // 恢复原始值
            await ConfigManager.updateConfig('enableLogging', originalValue);
        }
    });
});