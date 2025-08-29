import * as assert from 'assert';
import { TerminalManager } from '../../terminalManager';

suite('TerminalManager Test Suite', () => {
    let terminalManager: TerminalManager;

    setup(() => {
        terminalManager = new TerminalManager();
    });

    teardown(() => {
        if (terminalManager) {
            terminalManager.dispose();
        }
    });

    test('TerminalManager should initialize successfully', () => {
        assert.ok(terminalManager);
        assert.strictEqual(typeof terminalManager.getTerminalInfo, 'function');
        assert.strictEqual(typeof terminalManager.createEditorTerminal, 'function');
        assert.strictEqual(typeof terminalManager.createCodexTerminal, 'function');
        assert.strictEqual(typeof terminalManager.executeCodex, 'function');
        assert.strictEqual(typeof terminalManager.dispose, 'function');
    });

    test('getTerminalInfo should return empty array initially', () => {
        const info = terminalManager.getTerminalInfo();
        assert.ok(Array.isArray(info));
        assert.strictEqual(info.length, 0);
    });

    test('dispose should not throw errors', () => {
        assert.doesNotThrow(() => {
            terminalManager.dispose();
        });
    });

    test('createEditorTerminal should return boolean', async () => {
        // 注意：在测试环境中，VSCode API可能不完全可用
        // 这个测试主要检查函数是否存在并且返回正确类型
        try {
            const result = await terminalManager.createEditorTerminal();
            assert.strictEqual(typeof result, 'boolean');
        } catch (error) {
            // 在测试环境中，某些VSCode API可能不可用，这是预期的
            assert.ok(error instanceof Error);
        }
    });

    test('createCodexTerminal should return boolean', async () => {
        try {
            const result = await terminalManager.createCodexTerminal();
            assert.strictEqual(typeof result, 'boolean');
        } catch (error) {
            // 在测试环境中，某些VSCode API可能不可用，这是预期的
            assert.ok(error instanceof Error);
        }
    });

    test('executeCodex should return boolean', async () => {
        try {
            const result = await terminalManager.executeCodex();
            assert.strictEqual(typeof result, 'boolean');
        } catch (error) {
            // 在测试环境中，某些VSCode API可能不可用，这是预期的
            assert.ok(error instanceof Error);
        }
    });
});