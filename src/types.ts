import * as vscode from 'vscode';

export interface TerminalConfig {
    terminalDelay: number;
    welcomeMessage: string;
    autoExecuteCodex: boolean;
    confirmBeforeExecute: boolean;
    codexCommand: string;
    enableLogging: boolean;
}

export interface LocalizedMessages {
    workspaceRequired: string;
    terminalOpened: string;
    terminalCreated: string;
    codexExecuted: string;
    editorTerminalStarted: string;
    confirmExecution: string;
    commandNotFound: string;
    terminalCreationFailed: string;
    extensionActivated: string;
}

export enum TerminalType {
    codex = 'codex',
    editor = 'editor'
}

export interface TerminalInstance {
    terminal: vscode.Terminal;
    type: TerminalType;
    created: Date;
}