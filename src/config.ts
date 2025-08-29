import * as vscode from 'vscode';
import { TerminalConfig, LocalizedMessages } from './types';

export class ConfigManager {
    private static readonly configSection = 'codex';

    public static getConfig(): TerminalConfig {
        const config = vscode.workspace.getConfiguration(this.configSection);
        
        return {
            terminalDelay: config.get<number>('terminalDelay', 800),
            welcomeMessage: config.get<string>('welcomeMessage', '🚀 Codex 编辑器侧边终端已启动！'),
            autoExecuteCodex: config.get<boolean>('autoExecuteCodex', true),
            confirmBeforeExecute: config.get<boolean>('confirmBeforeExecute', false),
            codexCommand: config.get<string>('codexCommand', 'codex'),
            enableLogging: config.get<boolean>('enableLogging', false)
        };
    }

    public static async updateConfig(key: keyof TerminalConfig, value: any): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }

    public static onConfigChange(callback: (e: vscode.ConfigurationChangeEvent) => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(callback);
    }
}

export class LocalizationManager {
    private static messages: LocalizedMessages = {
        workspaceRequired: '请先打开一个工作区',
        terminalOpened: '终端已打开',
        terminalCreated: '终端已创建并打开',
        codexExecuted: '已执行 Codex 命令',
        editorTerminalStarted: 'Codex 编辑器终端已在侧边打开',
        confirmExecution: '确认执行 Codex 命令？',
        commandNotFound: 'Codex 命令不可用，请确保已正确安装',
        terminalCreationFailed: '终端创建失败',
        extensionActivated: 'Codex 扩展已激活'
    };

    public static getMessage(key: keyof LocalizedMessages): string {
        return this.messages[key];
    }

    // 将来可以扩展支持多语言
    public static setLanguage(_locale: string): void {
        // TODO: 实现多语言支持
    }
}