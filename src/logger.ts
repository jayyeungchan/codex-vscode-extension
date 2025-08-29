import * as vscode from 'vscode';
import { ConfigManager } from './config';

export class Logger {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Codex Extension');
    }

    public log(message: string): void {
        const config = ConfigManager.getConfig();
        if (config.enableLogging) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] INFO: ${message}`;
            this.outputChannel.appendLine(logMessage);
            console.log(logMessage);
        }
    }

    public error(message: string, error?: any): void {
        const timestamp = new Date().toISOString();
        const errorMessage = error ? `${message}: ${error.message || error}` : message;
        const logMessage = `[${timestamp}] ERROR: ${errorMessage}`;
        
        this.outputChannel.appendLine(logMessage);
        console.error(logMessage);
        
        // 在开发模式下显示错误详情
        if (error && error.stack) {
            this.outputChannel.appendLine(`Stack trace: ${error.stack}`);
        }
    }

    public warn(message: string): void {
        const config = ConfigManager.getConfig();
        if (config.enableLogging) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] WARN: ${message}`;
            this.outputChannel.appendLine(logMessage);
            console.warn(logMessage);
        }
    }

    public show(): void {
        this.outputChannel.show();
    }

    public dispose(): void {
        this.outputChannel.dispose();
    }
}