const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STATE_DIR = 'C:/tmp/bo-agent-comms';
const STATE_FILE = path.join(STATE_DIR, 'todo-state.json');

const STATUS_MARK = {
  completed: '\u25a0',
  in_progress: '\u25b6',
  pending: '\u25a1',
};

function ensureStateDir() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (e) {
    return { todos: [], updatedAt: null };
  }
}

function writeState(todos) {
  ensureStateDir();
  const state = { todos, updatedAt: new Date().toISOString() };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  return state;
}

function renderChecklist(state) {
  if (!state.todos || state.todos.length === 0) {
    return '(작업목록 없음)';
  }
  const lines = state.todos.map((t) => {
    const mark = STATUS_MARK[t.status] || STATUS_MARK.pending;
    const label = t.status === 'in_progress' && t.activeForm ? t.activeForm : t.content;
    return `${mark} ${label}`;
  });
  return lines.join('\n');
}

const TOOLS = [
  {
    name: 'todo_write',
    description: '작업목록 전체를 갱신한다. 매 STEP 시작/완료 시 전체 목록을 다시 전달한다(부분 갱신 아님).',
    inputSchema: {
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: { type: 'string', description: '항목 설명(완료형, 예: "bo-builder 개발 완료")' },
              activeForm: { type: 'string', description: '진행 중 표시용 설명(예: "bo-builder 개발 중")' },
              status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
            },
            required: ['content', 'status'],
          },
        },
      },
      required: ['todos'],
    },
  },
  {
    name: 'todo_read',
    description: '현재 작업목록 상태를 읽는다.',
    inputSchema: { type: 'object', properties: {} },
  },
];

function handleToolCall(name, args) {
  if (name === 'todo_write') {
    const todos = (args && args.todos) || [];
    const state = writeState(todos);
    return renderChecklist(state);
  }
  if (name === 'todo_read') {
    const state = readState();
    return renderChecklist(state);
  }
  throw new Error(`unknown tool: ${name}`);
}

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch (e) {
    return;
  }

  const { id, method, params } = msg;
  const hasId = id !== undefined && id !== null;

  try {
    if (method === 'initialize') {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'todo-mcp', version: '1.0.0' },
        },
      });
      return;
    }

    if (method === 'notifications/initialized') {
      return;
    }

    if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      return;
    }

    if (method === 'tools/call') {
      const text = handleToolCall(params.name, params.arguments);
      send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }] } });
      return;
    }

    if (hasId) {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `method not found: ${method}` } });
    }
  } catch (e) {
    if (hasId) {
      send({ jsonrpc: '2.0', id, error: { code: -32000, message: String(e && e.message || e) } });
    }
  }
});
