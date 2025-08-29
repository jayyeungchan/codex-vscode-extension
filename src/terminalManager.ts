import * as vscode from 'vscode';
import { TerminalConfig, TerminalType, TerminalInstance } from './types';
import { ConfigManager, LocalizationManager } from './config';
import { Logger } from './logger';

export class TerminalManager {
    private terminals: Map<TerminalType, TerminalInstance> = new Map();
    private disposables: vscode.Disposable[] = [];
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
        this.setupTerminalEventListeners();
    }

    private setupTerminalEventListeners(): void {
        const disposable = vscode.window.onDidCloseTerminal((terminal) => {
            this.handleTerminalClosed(terminal);
        });
        this.disposables.push(disposable);
    }

    private handleTerminalClosed(terminal: vscode.Terminal): void {
        for (const [type, instance] of this.terminals.entries()) {
            if (instance.terminal === terminal) {
                this.logger.log(`Terminal ${type} closed`);
                this.terminals.delete(type);
                break;
            }
        }
    }

    public async createEditorTerminal(): Promise<boolean> {
        try {
            const config = ConfigManager.getConfig();
            const workspaceFolder = this.getWorkspaceFolder();
            
            if (!workspaceFolder) {
                vscode.window.showErrorMessage(LocalizationManager.getMessage('workspaceRequired'));
                return false;
            }

            // 检查是否已存在编辑器终端
            const existingTerminal = this.terminals.get(TerminalType.editor);
            if (existingTerminal) {
                return this.reuseExistingTerminal(existingTerminal, config);
            }

            return this.createNewEditorTerminal(workspaceFolder, config);
        } catch (error) {
            this.logger.error('Failed to create editor terminal', error);
            vscode.window.showErrorMessage(LocalizationManager.getMessage('terminalCreationFailed'));
            return false;
        }
    }

    private async reuseExistingTerminal(instance: TerminalInstance, config: TerminalConfig): Promise<boolean> {
        instance.terminal.show();
        
        if (config.autoExecuteCodex) {
            if (config.confirmBeforeExecute) {
                const confirmed = await this.confirmExecution();
                if (!confirmed) {
                    return false;
                }
            }
            
            await this.executeCodexCommand(instance.terminal, config);
        }
        
        vscode.window.showInformationMessage(LocalizationManager.getMessage('terminalOpened'));
        return true;
    }

    private async createNewEditorTerminal(workspaceFolder: vscode.WorkspaceFolder, config: TerminalConfig): Promise<boolean> {
        try {
            await vscode.commands.executeCommand('workbench.action.createTerminalEditorSide');
            
            // 等待终端创建
            await this.delay(config.terminalDelay);
            
            const activeTerminal = vscode.window.activeTerminal;
            if (!activeTerminal) {
                throw new Error('Failed to get active terminal');
            }

            // 存储终端实例
            const instance: TerminalInstance = {
                terminal: activeTerminal,
                type: TerminalType.editor,
                created: new Date()
            };
            this.terminals.set(TerminalType.editor, instance);

            // 发送欢迎信息
            await this.sendWelcomeMessages(activeTerminal, config);
            
            // 自动执行codex命令
            if (config.autoExecuteCodex) {
                if (config.confirmBeforeExecute) {
                    const confirmed = await this.confirmExecution();
                    if (!confirmed) {
                        return true;
                    }
                }
                
                await this.executeCodexCommand(activeTerminal, config);
            }

            vscode.window.showInformationMessage(LocalizationManager.getMessage('editorTerminalStarted'));
            this.logger.log('Editor terminal created successfully');
            return true;
        } catch (error) {
            this.logger.error('Failed to create new editor terminal', error);
            throw error;
        }
    }

    public async createCodexTerminal(): Promise<boolean> {
        try {
            const config = ConfigManager.getConfig();
            const workspaceFolder = this.getWorkspaceFolder();
            
            if (!workspaceFolder) {
                vscode.window.showErrorMessage(LocalizationManager.getMessage('workspaceRequired'));
                return false;
            }

            const existingTerminal = this.terminals.get(TerminalType.codex);
            if (existingTerminal) {
                existingTerminal.terminal.show();
                vscode.window.showInformationMessage(LocalizationManager.getMessage('terminalOpened'));
                return true;
            }

            const terminal = vscode.window.createTerminal({
                name: 'Codex Terminal',
                cwd: workspaceFolder.uri.fsPath,
                message: `${LocalizationManager.getMessage('terminalCreated')}\n输入 "${config.codexCommand}" 开始使用`
            });

            const instance: TerminalInstance = {
                terminal,
                type: TerminalType.codex,
                created: new Date()
            };
            this.terminals.set(TerminalType.codex, instance);

            terminal.show();
            vscode.window.showInformationMessage(LocalizationManager.getMessage('terminalCreated'));
            this.logger.log('Codex terminal created successfully');
            return true;
        } catch (error) {
            this.logger.error('Failed to create codex terminal', error);
            vscode.window.showErrorMessage(LocalizationManager.getMessage('terminalCreationFailed'));
            return false;
        }
    }

    public async executeCodex(): Promise<boolean> {
        try {
            const config = ConfigManager.getConfig();
            let terminal = this.terminals.get(TerminalType.codex)?.terminal;

            if (!terminal) {
                const created = await this.createCodexTerminal();
                if (!created) {
                    return false;
                }
                terminal = this.terminals.get(TerminalType.codex)?.terminal;
            }

            if (!terminal) {
                throw new Error('Terminal not available');
            }

            terminal.show();

            if (config.confirmBeforeExecute) {
                const confirmed = await this.confirmExecution();
                if (!confirmed) {
                    return false;
                }
            }

            await this.executeCodexCommand(terminal, config);
            vscode.window.showInformationMessage(LocalizationManager.getMessage('codexExecuted'));
            return true;
        } catch (error) {
            this.logger.error('Failed to execute codex', error);
            return false;
        }
    }

    private async sendWelcomeMessages(terminal: vscode.Terminal, config: TerminalConfig): Promise<void> {
        const messages = [
            `echo "${config.welcomeMessage}"`,
            'echo "📍 当前目录: $(pwd)"',
            `echo "⚡ 正在自动启动 ${config.codexCommand}..."`,
            ''
        ];

        for (const message of messages) {
            terminal.sendText(message);
            await this.delay(100); // 短暂延迟确保命令顺序执行
        }
    }

    private async executeCodexCommand(terminal: vscode.Terminal, config: TerminalConfig): Promise<void> {
        // 验证命令安全性
        if (!this.isCommandSafe(config.codexCommand)) {
            throw new Error('Unsafe command detected');
        }

        await this.delay(200);
        terminal.sendText(config.codexCommand);
        this.logger.log(`Executed command: ${config.codexCommand}`);
    }

    private isCommandSafe(command: string): boolean {
        // 基本安全检查
        const dangerousPatterns = [
            /rm\s+-rf/,
            /sudo/,
            /chmod\s+777/,
            />/,
            /\|/,
            /;/,
            /&&/,
            /\|\|/
        ];

        return !dangerousPatterns.some(pattern => pattern.test(command));
    }

    private async confirmExecution(): Promise<boolean> {
        const result = await vscode.window.showQuickPick(
            ['确认', '取消'],
            {
                placeHolder: LocalizationManager.getMessage('confirmExecution')
            }
        );
        return result === '确认';
    }

    private getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
        return vscode.workspace.workspaceFolders?.[0];
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public dispose(): void {
        // 清理所有终端
        for (const instance of this.terminals.values()) {
            try {
                instance.terminal.dispose();
            } catch (error) {
                this.logger.error('Error disposing terminal', error);
            }
        }
        this.terminals.clear();

        // 清理事件监听器
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];

        this.logger.log('TerminalManager disposed');
    }

    public getTerminalInfo(): { type: TerminalType; created: Date }[] {
        return Array.from(this.terminals.values()).map(instance => ({
            type: instance.type,
            created: instance.created
        }));
    }
}