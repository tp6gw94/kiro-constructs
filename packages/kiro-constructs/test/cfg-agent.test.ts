import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App, CfgAgent, CfgPrompt } from '../src/index.js';

describe('CfgAgent', () => {
  let tmpDir: string;
  let outdir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kiro-constructs-test-'));
    outdir = path.join(tmpDir, '.kiro-constructs.out');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('synthesizes agent config to agents/{name}.json', async () => {
    const app = new App({ outdir });

    new CfgAgent(app, 'developer', {
      description: 'Development assistant',
      prompt: 'You are a dev assistant.',
      tools: ['@builtin'],
      mcpServers: {
        'my-server': { command: 'my-server', args: ['--include-tools', 'SearchTool'] },
      },
    });

    await app.synth();

    const agentConfig = JSON.parse(
      fs.readFileSync(path.join(outdir, 'agents', 'developer.json'), 'utf-8'),
    ) as Record<string, unknown>;
    expect(agentConfig).toEqual({
      description: 'Development assistant',
      prompt: 'You are a dev assistant.',
      tools: ['@builtin'],
      mcpServers: {
        'my-server': { command: 'my-server', args: ['--include-tools', 'SearchTool'] },
      },
    });
  });

  it('synthesizes remote MCP server config', async () => {
    const app = new App({ outdir });
    new CfgAgent(app, 'remote', {
      description: 'Remote',
      mcpServers: {
        'remote-api': { url: 'https://example.com/mcp', headers: { Authorization: 'Bearer token' } },
      },
    });
    await app.synth();
    const config = JSON.parse(
      fs.readFileSync(path.join(outdir, 'agents', 'remote.json'), 'utf-8'),
    ) as Record<string, unknown>;
    expect(config.mcpServers).toEqual({
      'remote-api': { url: 'https://example.com/mcp', headers: { Authorization: 'Bearer token' } },
    });
  });

  it('synthesizes mixed local and remote MCP servers', async () => {
    const app = new App({ outdir });
    new CfgAgent(app, 'mixed', {
      description: 'Mixed',
      mcpServers: {
        local: { command: 'my-server', args: ['--flag'] },
        remote: { url: 'https://example.com/mcp' },
      },
    });
    await app.synth();
    const config = JSON.parse(
      fs.readFileSync(path.join(outdir, 'agents', 'mixed.json'), 'utf-8'),
    ) as Record<string, unknown>;
    expect(config.mcpServers).toEqual({
      local: { command: 'my-server', args: ['--flag'] },
      remote: { url: 'https://example.com/mcp' },
    });
  });
});

describe('CfgPrompt', () => {
  let tmpDir: string;
  let outdir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kiro-constructs-test-'));
    outdir = path.join(tmpDir, '.kiro-constructs.out');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('synthesizes prompt to prompts/{name}.md', async () => {
    const app = new App({ outdir });

    new CfgPrompt(app, 'code-review', {
      content: '# Code Review\n\nReview the code for best practices.',
    });

    await app.synth();

    const content = fs.readFileSync(path.join(outdir, 'prompts', 'code-review.md'), 'utf-8');
    expect(content).toBe('# Code Review\n\nReview the code for best practices.');
  });
});
