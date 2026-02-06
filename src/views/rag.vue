<template>
  <div class="rag-page">
    <div class="f1-container rag-page__inner">
      <header class="rag-page__header">
        <div class="rag-page__title-row">
          <div>
            <p class="rag-page__eyebrow">RAG Console</p>
            <h1 class="rag-page__title">Knowledge Base Q&amp;A</h1>
            <p class="rag-page__subtitle">Ask a question and retrieve answers from your knowledge base.</p>
          </div>

          <div class="rag-badges" v-if="metaBadges.length">
            <span v-for="b in metaBadges" :key="b" class="rag-badge">{{ b }}</span>
          </div>
        </div>
      </header>

      <div class="rag-grid">
        <!-- Left: Ask -->
        <section class="rag-card rag-card--form">
          <div class="rag-form-head">
            <div>
              <label class="rag-label" for="rag-question">Question</label>
              <p class="rag-hint">Tip: press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to ask.</p>
            </div>

            <div class="rag-form-actions">
              <button class="rag-button rag-button--ghost" type="button" :disabled="loading || !question" @click="clearAll">
                Clear
              </button>
              <button class="rag-button" type="button" :disabled="loading || !trimmedQuestion" @click="askQuestion">
                {{ loading ? 'Asking…' : 'Ask' }}
              </button>
            </div>
          </div>

          <textarea
            id="rag-question"
            v-model="question"
            class="rag-textarea"
            rows="8"
            placeholder="Type your question"
            @keydown="onTextareaKeydown"
          ></textarea>

          <div class="rag-chips">
            <button class="rag-chip" type="button" @click="setExample('网站定位（FormulaOneOne）')">网站定位（FormulaOneOne）</button>
            <button class="rag-chip" type="button" @click="setExample('什么是 Formula 1（F1）')">什么是 Formula 1（F1）</button>
            <button class="rag-chip" type="button" @click="setExample('F1 比赛形式（大奖赛）')">F1 比赛形式（大奖赛）</button>
          </div>

          <div class="rag-actions">
            <span v-if="loading" class="rag-status">Searching knowledge base…</span>
            <span v-else-if="error" class="rag-error">{{ error }}</span>
            <span v-else class="rag-muted">
              {{ lastLatencyMs ? `Latency: ${lastLatencyMs} ms` : '' }}
            </span>
          </div>
        </section>

        <!-- Right: Answer + Sources -->
        <section class="rag-stack">
          <section v-if="answer" class="rag-card rag-answer-card">
            <div class="rag-card-head">
              <h2 class="rag-card__title">Answer</h2>
              <div class="rag-card-tools">
                <button class="rag-link" type="button" @click="copyAnswer" :disabled="!answer">Copy</button>
              </div>
            </div>

            <!-- ✅ 更像知识库：按段落显示 + 引用是 chip -->
            <div class="rag-answer-body">
              <div v-for="(line, idx) in answerLines" :key="idx" class="rag-answer-line">
                <template v-for="(t, i) in line.tokens" :key="i">
                  <span v-if="t.type === 'text'">{{ t.value }}</span>
                  <button
                    v-else
                    type="button"
                    class="rag-cite-chip"
                    @click="onClickCite(t.id)"
                    :title="`View source [${t.id}]`"
                  >
                    [{{ t.id }}]
                  </button>
                </template>
              </div>
            </div>
          </section>

          <section v-if="hasSources" class="rag-card" ref="sourcesRef">
            <div class="rag-card-head">
              <h2 class="rag-card__title">Sources</h2>
              <label class="rag-toggle">
                <input type="checkbox" v-model="autoExpandFirst" />
                <span>Auto-expand first</span>
              </label>
            </div>

            <ul v-if="sourceItems.length" class="rag-sources rag-sources--plain">
              <li v-for="item in sourceItemsNormalized" :key="item.id" class="rag-source-item">
                <div class="rag-source-row">
                  <button type="button" class="rag-source-btn" @click="toggleSource(item.id)">
                    <span class="rag-source-label">{{ item.label }}</span>
                    <span class="rag-source-toggle">{{ openSourceId === item.id ? '▲' : '▼' }}</span>
                  </button>

                  <button class="rag-icon-btn" type="button" title="Copy snippet" @click="copyText(item.snippet)">
                    ⧉
                  </button>
                </div>

                <pre
                  class="rag-source-snippet"
                  :class="{ 'is-collapsed': openSourceId !== item.id }"
                >{{ item.snippet }}</pre>
              </li>
            </ul>

            <ul v-else class="rag-sources">
              <li v-for="(item, index) in sources" :key="`${item}-${index}`">{{ normalizeSourceLabel(item) }}</li>
            </ul>
          </section>

          <section v-if="!answer && !loading" class="rag-card rag-empty">
            <h2 class="rag-card__title">Ready</h2>
            <p class="rag-muted">
              Ask something about your indexed docs. If the docs don’t contain the info, the assistant should say so.
            </p>
          </section>
        </section>
      </div>
    </div>

    <div v-if="toast" class="rag-toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type SourceItem = {
  id: number
  label: string
  source: string
  page: string | number
  snippet: string
}

type AskResponse = {
  answer: string
  sources: string[]
  source_items?: SourceItem[]
  llm?: {
    provider?: string
    model?: string
    openai_model?: string | null
    ollama_model?: string | null
  }
  index_version?: {
    built_at_utc?: string
    files_hash?: string
  }
}

type AnswerToken =
  | { type: 'text'; value: string }
  | { type: 'cite'; id: number }

type AnswerLine = {
  raw: string
  tokens: AnswerToken[]
}

const USE_MOCK = false

const question = ref('')
const answer = ref('')
const sources = ref<string[]>([])
const sourceItems = ref<SourceItem[]>([])
const openSourceId = ref<number | null>(null)
const autoExpandFirst = ref(true)

const loading = ref(false)
const error = ref('')
const sourcesRef = ref<HTMLElement | null>(null)

const toast = ref('')
let toastTimer: number | null = null

const lastLatencyMs = ref<number | null>(null)
const lastMeta = ref<AskResponse['llm'] | null>(null)
const lastIndex = ref<AskResponse['index_version'] | null>(null)

const trimmedQuestion = computed(() => question.value.trim())
const hasSources = computed(() => sourceItems.value.length > 0 || sources.value.length > 0)

const metaBadges = computed(() => {
  const badges: string[] = []
  const llm = lastMeta.value
  const idx = lastIndex.value
  if (llm?.provider) badges.push(`LLM: ${llm.provider}`)
  if (llm?.model) badges.push(`Model: ${llm.model}`)
  if (idx?.files_hash) badges.push(`Index: ${idx.files_hash}`)
  return badges
})

function showToast(msg: string) {
  toast.value = msg
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 1800)
}

function clearAll() {
  question.value = ''
  answer.value = ''
  sources.value = []
  sourceItems.value = []
  openSourceId.value = null
  error.value = ''
  lastLatencyMs.value = null
}

function setExample(q: string) {
  question.value = q
}

function toggleSource(id: number) {
  openSourceId.value = openSourceId.value === id ? null : id
}

function onClickCite(id: number) {
  toggleSource(id)
  requestAnimationFrame(() => {
    sourcesRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function onTextareaKeydown(e: KeyboardEvent) {
  const isCmdEnter = (e.metaKey || e.ctrlKey) && e.key === 'Enter'
  if (isCmdEnter && !loading.value && trimmedQuestion.value) {
    e.preventDefault()
    askQuestion()
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied')
  } catch {
    showToast('Copy failed')
  }
}

async function copyAnswer() {
  if (!answer.value) return
  await copyText(answer.value)
}

// ---------- Answer parsing (professional layout) ----------

// token parse within a line
function tokenizeAnswerLine(text: string): AnswerToken[] {
  const tokens: AnswerToken[] = []
  const re = /\[(\d+)\]/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    const idx = m.index
    if (idx > last) tokens.push({ type: 'text', value: text.slice(last, idx) })
    tokens.push({ type: 'cite', id: Number(m[1]) })
    last = idx + m[0].length
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) })
  return tokens
}

// ✅ 兜底：把“只有 [2] 的孤儿行”合并到上一行末尾
const answerLines = computed<AnswerLine[]>(() => {
  const raw = (answer.value || '').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')

  const normalized: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    // ignore empty
    if (!trimmed) {
      normalized.push('')
      continue
    }
    // orphan cite line
    if (/^\[\d+\]$/.test(trimmed) && normalized.length > 0) {
      const prev = normalized[normalized.length - 1] ?? ''
      normalized[normalized.length - 1] = `${prev.trim()} ${trimmed}`
      continue
    }
    // remove <think> blocks if they slip through (defensive)
    if (trimmed.startsWith('<think>') || trimmed.startsWith('</think>')) continue
    normalized.push(line)
  }

  // build token lines, drop consecutive empty
  const out: AnswerLine[] = []
  for (const line of normalized) {
    const prev = out[out.length - 1]
    if (!line.trim() && prev && !prev.raw.trim()) continue
    out.push({ raw: line, tokens: tokenizeAnswerLine(line) })
  }
  return out.filter((x) => x.raw.trim() !== '')
})

// ---------- Sources label normalization ----------
function normalizeSourceLabel(label: string) {
  if (!label) return '知识库文档'
  return label
    .replace(/data\//g, '')
    .replace(/README\.md/gi, '知识库文档')
    .replace(/\s*page=\s*$/g, '')
    .trim()
}

const sourceItemsNormalized = computed(() => {
  return sourceItems.value.map((s) => ({
    ...s,
    label: normalizeSourceLabel(s.label),
  }))
})

type SSEEventName = 'meta' | 'delta' | 'error' | 'end'

async function consumeSSE(
  resp: Response,
  onEvent: (event: SSEEventName, payload: any) => void,
) {
  if (!resp.body) throw new Error('No response body (stream not supported).')

  const reader = resp.body.getReader()
  const decoder = new TextDecoder('utf-8')

  let buffer = ''

  const flush = () => {
    // SSE event is separated by \n\n
    const parts = buffer.split('\n\n')
    buffer = parts.pop() || ''

    for (const part of parts) {
      const lines = part.split('\n')
      let eventName: SSEEventName = 'delta'
      let dataStr = ''

      for (const line of lines) {
        if (line.startsWith('event:')) eventName = line.slice(6).trim() as SSEEventName
        if (line.startsWith('data:')) dataStr += line.slice(5).trim()
      }

      if (!dataStr) continue

      let payload: any
      try {
        payload = JSON.parse(dataStr)
      } catch {
        payload = { text: dataStr }
      }

      onEvent(eventName, payload)
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    flush()
  }

  // flush remaining
  flush()
}

const askQuestion = async () => {
  const currentQuestion = trimmedQuestion.value
  if (!currentQuestion) {
    error.value = 'Please enter a question.'
    return
  }

  loading.value = true
  error.value = ''
  answer.value = ''
  sources.value = []
  sourceItems.value = []
  openSourceId.value = null
  lastLatencyMs.value = null
  lastMeta.value = null
  lastIndex.value = null

  const start = performance.now()

  try {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300))
      answer.value = `（MOCK）你问的是：${currentQuestion}\n\n这里将来会显示后端 RAG 返回的答案，并带引用如 [1]。`
      sources.value = ['[1] 知识库：站点说明文档', '[2] 知识库文档']
      sourceItems.value = [
        { id: 1, label: '[1] 知识库：站点说明文档', source: '知识库：站点说明文档', page: '', snippet: '...mock snippet 1...' },
        { id: 2, label: '[2] 知识库文档', source: '知识库文档', page: '', snippet: '...mock snippet 2...' },
      ]
      lastMeta.value = { provider: 'ollama', model: 'deepseek-r1:7b' }
      lastIndex.value = { files_hash: 'abcdef123456' }
      return
    }

    const resp = await fetch('/ask_stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 如果你要切 provider/model：这里加 provider/model 字段即可
      body: JSON.stringify({ question: currentQuestion, k: 4 }),
    })

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      throw new Error(text || `Request failed (${resp.status})`)
    }

    await consumeSSE(resp, (event, payload) => {
      if (event === 'meta') {
        // meta: sources + source_items + badges
        sources.value = Array.isArray(payload?.sources) ? payload.sources : []
        sourceItems.value = Array.isArray(payload?.source_items) ? payload.source_items : []
        lastMeta.value = payload?.llm ?? null
        lastIndex.value = payload?.index_version ?? null

        if (autoExpandFirst.value && sourceItems.value.length) {
          const first = sourceItems.value[0]
          if (first) openSourceId.value = first.id
        }
        return
      }

      if (event === 'delta') {
        const t = payload?.text ?? ''
        if (t) answer.value += t
        return
      }

      if (event === 'error') {
        error.value = payload?.message || 'Stream error'
        return
      }

      if (event === 'end') {
        // nothing special here; finally 会关 loading
        return
      }
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Request failed. Please try again.'
  } finally {
    lastLatencyMs.value = Math.round(performance.now() - start)
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.rag-page {
  padding: 44px 0 80px;
  color: var(--text-primary);
  position: relative;
}

.rag-page__inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.rag-page__title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.rag-page__eyebrow {
  margin: 0;
  font-family: var(--font-tech);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  color: var(--neon-blue);
}

.rag-page__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 36px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rag-page__subtitle {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-tech);
  letter-spacing: 0.08em;
}

.rag-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.rag-badge {
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
}

.rag-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 16px;
  align-items: start;
}

.rag-stack {
  display: grid;
  gap: 16px;
}

.rag-card {
  padding: 18px;
  border-radius: 14px;
  background: rgba(18, 18, 26, 0.9);
  border: 1px solid var(--border-soft);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
}

.rag-card--form {
  display: grid;
  gap: 12px;
}

.rag-form-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.rag-form-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.rag-label {
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--text-muted);
}

.rag-hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-sans);
}

kbd {
  font-family: var(--font-tech);
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
}

.rag-textarea {
  width: 100%;
  min-height: 180px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.rag-textarea:focus {
  border-color: rgba(0, 243, 255, 0.6);
  box-shadow: 0 0 0 2px rgba(0, 243, 255, 0.2);
}

.rag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rag-chip {
  border-radius: 999px;
  border: 1px solid rgba(0, 243, 255, 0.22);
  background: rgba(0, 243, 255, 0.08);
  color: inherit;
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
  padding: 8px 10px;
  cursor: pointer;
}

.rag-chip:hover {
  border-color: rgba(0, 243, 255, 0.45);
}

.rag-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 18px;
}

.rag-button {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(0, 243, 255, 0.45);
  background: rgba(0, 243, 255, 0.12);
  color: #e8faff;
  font-family: var(--font-tech);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rag-button--ghost {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.rag-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rag-status {
  font-family: var(--font-tech);
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.rag-muted {
  color: var(--text-muted);
  font-size: 12px;
  font-family: var(--font-sans);
}

.rag-error {
  color: var(--neon-red);
  font-family: var(--font-tech);
  letter-spacing: 0.08em;
}

.rag-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.rag-card__title {
  margin: 0;
  font-family: var(--font-tech);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 12px;
  color: var(--text-muted);
}

.rag-link {
  background: transparent;
  border: none;
  color: rgba(0, 243, 255, 0.85);
  cursor: pointer;
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
}

.rag-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ✅ Answer block */
.rag-answer-card {
  min-height: 220px;
}

.rag-answer-body {
  display: grid;
  gap: 10px;
}

.rag-answer-line {
  font-family: var(--font-sans);
  font-size: 14.5px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.rag-cite-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0, 243, 255, 0.22);
  background: rgba(0, 243, 255, 0.08);
  color: var(--neon-blue);
  cursor: pointer;
  font-family: var(--font-tech);
  font-size: 11px;
  letter-spacing: 0.08em;
  line-height: 1.1;
  vertical-align: baseline;
}
.rag-cite-chip:hover {
  border-color: rgba(0, 243, 255, 0.45);
  background: rgba(0, 243, 255, 0.14);
}

.rag-sources {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
}

.rag-sources--plain {
  padding-left: 0;
}

.rag-source-item {
  list-style: none;
  display: grid;
  gap: 8px;
}

.rag-source-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rag-source-btn {
  flex: 1;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.rag-source-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rag-source-toggle {
  opacity: 0.7;
}

.rag-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  cursor: pointer;
}

.rag-source-snippet {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(0, 0, 0, 0.22);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* collapsed preview: 3 lines */
.rag-source-snippet.is-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rag-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 12px;
}

.rag-empty {
  opacity: 0.9;
}

.rag-toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 243, 255, 0.25);
  background: rgba(18, 18, 26, 0.92);
  color: var(--text-primary);
  font-family: var(--font-tech);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
  z-index: 9999;
}

@media (max-width: 980px) {
  .rag-grid {
    grid-template-columns: 1fr;
  }
  .rag-page__title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .rag-badges {
    justify-content: flex-start;
  }
  .rag-form-head {
    flex-direction: column;
    align-items: stretch;
  }
  .rag-form-actions {
    justify-content: stretch;
  }
  .rag-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
