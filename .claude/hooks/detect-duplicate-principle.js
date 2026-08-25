const AGENT_FILE_RE = /[\\/]\.claude[\\/]agents[\\/][^\\/]+\.md$/;

const KEYWORDS = [
  '재사용 탐색',
  'entity 연동',
  'entity 연결',
  'Tailwind',
  'preview/live 모드 분리',
  '인라인 코딩 금지',
  '주석을 작성하지 않는다',
  '주석 전면 금지',
  '기획서에 없는 validation',
  '역기획 제안',
  '폴백(fallback)',
  '데드코드',
  'styles.ts 공통 상수',
];

const REFERENCE_RE = /00-4|FO-RULE/;

function extractNewContent(toolInput) {
  if (!toolInput) return '';
  if (typeof toolInput.content === 'string') return toolInput.content;
  if (typeof toolInput.new_string === 'string') return toolInput.new_string;
  if (Array.isArray(toolInput.edits)) {
    return toolInput.edits.map((e) => e.new_string || '').join('\n');
  }
  return '';
}

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(raw);
    const filePath = (input.tool_input && input.tool_input.file_path) || '';

    if (!AGENT_FILE_RE.test(filePath)) return;

    const newContent = extractNewContent(input.tool_input);
    const hitKeyword = KEYWORDS.some((k) => newContent.includes(k));
    const hasReference = REFERENCE_RE.test(newContent);

    if (hitKeyword && !hasReference) {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'ask',
            permissionDecisionReason:
              '이 내용은 docs/ge_guide/builder/00-4.builder_agent_common_principles.md 또는 fo/docs/FO-RULE.md에 이미 있는 원칙과 겹칠 수 있습니다. 개별 파일에 새로 적지 말고 공통 문서를 참조하도록 수정하는 게 맞는지 확인하세요. 정말 이 파일에 그대로 적어야 한다면 승인하세요.',
          },
        })
      );
    }
  } catch (e) {
    // malformed input — fail open, no output
  }
});
