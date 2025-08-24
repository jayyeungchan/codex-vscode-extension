import * as vscode from 'vscode';

let codexTerminal: vscode.Terminal | undefined;
// 新增：编辑器区域的终端
let editorTerminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Claude Code Router 扩展已激活!');

	// 注册 start codex 命令
	const startCodexCommand = vscode.commands.registerCommand('ccr.start', () => {
		startCodexTerminal();
	});

	// 注册 codex code 命令
	const codexCodeCommand = vscode.commands.registerCommand('ccr.code', () => {
		executeCodexCode();
	});

	// 新增：注册在编辑器侧边打开终端的命令
	const openTerminalEditorSideCommand = vscode.commands.registerCommand('ccr.openTerminalEditorSide', () => {
		openTerminalEditorSide();
	});

	context.subscriptions.push(
		startCodexCommand, 
		codexCodeCommand, 
		openTerminalEditorSideCommand
	);

	// 监听终端关闭事件
	vscode.window.onDidCloseTerminal((terminal) => {
		if (terminal === codexTerminal) {
			codexTerminal = undefined;
		}
		if (terminal === editorTerminal) {
			editorTerminal = undefined;
		}
	});
}

// 新增：在编辑器侧边打开终端并执行 ccr code
function openTerminalEditorSide() {
	// 获取当前工作区的根目录
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('请先打开一个工作区');
		return;
	}

	// 如果编辑器终端已存在，显示它并执行 ccr code；否则创建新的
	if (editorTerminal) {
		editorTerminal.show();
		setTimeout(() => {
			if (editorTerminal) {
				editorTerminal.sendText('codex');
			}
		}, 300);
		vscode.window.showInformationMessage('编辑器终端已显示，正在执行 codex...');
		return;
	}

	// 使用 workbench.action.createTerminalEditorSide 命令创建终端
	vscode.commands.executeCommand('workbench.action.createTerminalEditorSide').then(() => {
		// 等待终端创建完成，然后获取活动终端
		setTimeout(() => {
			editorTerminal = vscode.window.activeTerminal;
			if (editorTerminal) {
				// 发送欢迎信息并自动执行 ccr code
				editorTerminal.sendText('echo "🚀 CCR 编辑器侧边终端已启动！"');
				editorTerminal.sendText('echo "📍 当前目录: $(pwd)"');
				editorTerminal.sendText('echo "⚡ 正在自动启动 codex..."');
				editorTerminal.sendText('');
				// 自动执行 codex 命令
				editorTerminal.sendText('codex');
			}
		}, 800);
	});

	vscode.window.showInformationMessage('CCR 编辑器终端已在侧边打开，正在自动执行 codex...');
}

function startCodexTerminal() {
	// 获取当前工作区的根目录
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('请先打开一个工作区');
		return;
	}

	// 如果终端已存在，显示它；否则创建新的终端
	if (codexTerminal) {
		codexTerminal.show();
		vscode.window.showInformationMessage('Codex 终端已打开');
	} else {
		codexTerminal = vscode.window.createTerminal({
			name: 'Codex Terminal',
			cwd: workspaceFolder.uri.fsPath,
			message: 'Codex 终端已启动\n输入 "codex" 开始使用'
		});
		codexTerminal.show();
		vscode.window.showInformationMessage('Codex 终端已创建并打开');
	}
}

function executeCodexCode() {
	// 确保终端存在
	if (!codexTerminal) {
		startCodexTerminal();
		// 等待终端创建完成后执行命令
		setTimeout(() => {
			if (codexTerminal) {
				codexTerminal.sendText('codex');
			}
		}, 500);
	} else {
		codexTerminal.show();
		codexTerminal.sendText('codex');
	}
	
	vscode.window.showInformationMessage('已执行 Codex 命令');
}



export function deactivate() {
	if (codexTerminal) {
		codexTerminal.dispose();
	}
	if (editorTerminal) {
		editorTerminal.dispose();
	}
}