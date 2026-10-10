// my-mod/hooks/register.js
// /explorer : Claude Code를 실행한 폴더를 루트로 하는 파일 탐색기 Pane
//  - 루트 밖으로는 나갈 수 없음
//  - 폴더는 열고 닫을 수 있음 (v 열림 / > 닫힘)
//  - n: 새 파일, d: 새 폴더, r: 새로고침
//  - 새 파일/폴더는 Enter를 누른 시점에 "마지막으로 선택된 경로" 기준으로 생성

const PANE = 'explorer'
const ICON_OPEN = 'v'
const ICON_CLOSED = '>'
const MAX_ROWS = 500

// ── 상태 (모듈 변수: 코드를 저장해 핫리로드되면 초기화됨) ──
let root = ''              // 세션 시작 시점의 실행 경로 (고정)
let error = ''             // pane에 빨간 글씨로 보여줄 오류
let selected = ''          // 마지막으로 누른 행의 경로 (없으면 root가 대상)
let selectedIsDir = true
let creating = null        // { kind: 'file' | 'dir' }  (위치는 생성 시점에 계산)
let draft = ''             // 입력창에 쓰던 이름 (행을 선택해도 유지)
const expanded = new Set() // 펼쳐진 폴더 경로
const cache = new Map()    // 폴더 경로 -> [{ name, isDir, isLink }]

// ── 경로 유틸 (항상 '/' 구분자, 끝 슬래시 없음) ──
const norm = (p) => String(p).replace(/\\/g, '/').replace(/\/+$/, '')
const joinPath = (base, name) => norm(base) + '/' + name
const dirOf = (p) => norm(p).slice(0, norm(p).lastIndexOf('/'))
const baseName = (p) => norm(p).split('/').pop() || norm(p)
const isWindows = () => /^[A-Za-z]:/.test(root)
const errText = (err) => String(err && err.message ? err.message : err)

// 글자/숫자/공백/_ - . 만 허용 (cmd에 넘기는 mkdir 인자를 안전하게 유지)
const validName = (n) =>
  /^[\p{L}\p{N}_. \-]+$/u.test(n) && !/^\.+$/.test(n) && n === n.trim() && !n.endsWith('.')

// 루트 자신이거나 루트 아래 경로일 때만 true (Windows 대소문자 무시)
function isInside(p) {
  const a = norm(p).toLowerCase()
  const r = root.toLowerCase()
  return a === r || a.startsWith(r + '/')
}

// 생성 위치: 폴더를 선택했으면 그 폴더, 파일이면 그 파일이 있는 폴더, 없으면 루트
function targetParent() {
  if (!selected) return root
  return selectedIsDir ? selected : dirOf(selected)
}

// $를 최상위 함수에 넘기는 것은 mod 검증 규칙상 허용됨
async function loadDir($, target) {
  if (!isInside(target)) {
    error = 'outside root: ' + target
    return
  }
  try {
    const raw = await $.fs.list(target) // [{ name, kind, size, isLink }]
    const rows = raw
      .filter((it) => it.name && it.name !== '.' && it.name !== '..')
      .map((it) => ({
        name: it.name,
        isLink: !!it.isLink,
        isDir: /dir|folder/i.test(String(it.kind)) && !it.isLink, // 링크는 펼치지 않음
      }))
    rows.sort((a, b) => (a.isDir === b.isDir ? a.name.localeCompare(b.name) : a.isDir ? -1 : 1))
    cache.set(target, rows)
    error = ''
  } catch (err) {
    error = errText(err)
  }
}

// 실패하면 오류 문자열, 성공하면 '' 를 돌려줌
async function createEntry($, kind, parent, rawName) {
  const name = String(rawName).trim()
  if (!validName(name)) return 'invalid name'
  if (!isInside(parent)) return 'outside root'
  const full = joinPath(parent, name)
  try {
    if (await $.fs.exists(full)) return 'already exists: ' + name
    if (kind === 'file') {
      await $.fs.write(full, '')
    } else {
      // $.process.run은 셸을 쓰지 않으므로 Windows에서는 cmd /c 로 mkdir을 호출
      const native = isWindows() ? full.replace(/\//g, '\\') : full
      const argv = isWindows() ? ['cmd', '/c', 'mkdir', native] : ['mkdir', native]
      const r = await $.process.run(argv)
      if (r.exitCode !== 0) return (r.stderr || 'mkdir failed').trim()
    }
  } catch (err) {
    return errText(err)
  }
  expanded.add(parent) // 만든 항목이 보이도록 대상 폴더를 펼침
  await loadDir($, parent)
  return ''
}

// 루트를 맨 위 행으로 두고, 펼쳐진 폴더만 아래로 풀어서 한 줄 목록으로 만든다
function flatten() {
  const out = [{ name: baseName(root), isDir: true, full: root, depth: 0 }]
  const walk = (path, depth) => {
    for (const it of cache.get(path) ?? []) {
      if (out.length >= MAX_ROWS) return
      const full = joinPath(path, it.name)
      out.push({ ...it, full, depth })
      if (it.isDir && expanded.has(full)) walk(full, depth + 1)
    }
  }
  if (expanded.has(root)) walk(root, 1)
  return out
}

export function register(on) {
  // 세션 시작: 루트 고정 + /explorer 명령 등록
  on('session.start', async ($, e, next) => {
    if (!root) root = norm(await $.session.cwd())
    await $.command.register({ name: 'explorer', description: 'Open the file explorer pane' })
    return next(e)
  })

  // /explorer 실행: 루트를 펼친 상태로 읽고 Pane을 연다
  on('command.run', { command: 'explorer' }, async ($) => {
    if (!root) root = norm(await $.session.cwd())
    if (!cache.has(root)) {
      expanded.add(root)
      await loadDir($, root)
    }
    await $.ui.open({ id: PANE, title: 'Explorer', focus: true, closeOnEscape: true })
    return {}
  })

  // Pane 그리기
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const { Box, Text, Button, Input } = $.ui.resolve(e)
    const redraw = () => $.ui.invalidate('ui.render')

    const toggle = async (full) => {
      if (expanded.has(full)) {
        expanded.delete(full)
      } else {
        expanded.add(full)
        if (!cache.has(full)) await loadDir($, full)
      }
      redraw()
    }

    const refresh = async () => {
      cache.clear()
      await loadDir($, root)
      for (const p of [...expanded]) await loadDir($, p)
      redraw()
    }

    const startCreate = (kind) => {
      creating = { kind }
      draft = ''
      error = ''
      redraw()
    }

    // 파일/폴더 행: 누르면 선택되고, 폴더면 토글
    const rows = flatten().map((it, i) => {
      const mark = it.isDir ? (expanded.has(it.full) ? ICON_OPEN : ICON_CLOSED) : ' '
      const tail = it.full === selected ? ' <' : it.isLink ? ' @' : ''
      return Button({
        key: 'n-' + i,
        plain: true,
        label: '  '.repeat(it.depth) + mark + ' ' + it.name + tail,
        onPress: () => {
          selected = it.full
          selectedIsDir = it.isDir
          if (it.isDir) return toggle(it.full)
          redraw()
        },
      })
    })

    // 새 파일/폴더 입력창. 위치는 매 렌더마다, 그리고 Enter 시점에 다시 계산
    const parent = targetParent()
    const form = creating
      ? [
          Text({
            dimColor: true,
            children: [
              (creating.kind === 'file' ? 'new file in ' : 'new folder in ') +
                (parent.slice(root.length + 1) || '.'),
            ],
          }),
          Input({
            key: 'create-name',
            label: creating.kind === 'file' ? 'File' : 'Folder',
            placeholder: 'name, then Enter',
            value: draft,
            submitLabel: 'create',
            autoFocus: true,
            onInput: (value) => {
              draft = value
            },
            onSubmit: async (value) => {
              // Enter를 누른 시점에 선택된 경로를 다시 읽는다
              const target = targetParent()
              const msg = await createEntry($, creating.kind, target, value)
              if (msg) {
                error = msg
              } else {
                creating = null
                draft = ''
                error = ''
              }
              redraw()
            },
          }),
          Button({
            key: 'create-cancel',
            label: 'cancel',
            plain: true,
            onPress: () => {
              creating = null
              draft = ''
              redraw()
            },
          }),
        ]
      : []

    return Box({
      flexDirection: 'column',
      children: [
        Box({
          flexDirection: 'row',
          columnGap: 3,
          children: [
            Button({ key: 'new-file', label: 'new file', hotkey: 'n', plain: true, onPress: () => startCreate('file') }),
            Button({ key: 'new-dir', label: 'new folder', hotkey: 'd', plain: true, onPress: () => startCreate('dir') }),
            Button({ key: 'refresh', label: 'refresh', hotkey: 'r', plain: true, onPress: refresh }),
          ],
        }),
        ...form,
        ...(error ? [Text({ color: 'red', wrap: 'wrap', children: [error] })] : []),
        ...rows,
      ],
    })
  })
}