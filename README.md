# claude code guide

클로드 코드는 agent, skill, hook, command 등을 통해 보다 확장성 있는 LLM 에이전트

## slash commands

클로드 코드는 이미 정의된 명령어 또는 사용자 정의 슬래시 명령어를 다음과 같이 사용이 가능 합니다.

사용자 정의 슬래시는 `~/.claude/commands` 또는 `./claude/commands` 경로에 마크다운 파일로 관리됩니다.

```claude
> /[command-name] [arguments]
```

또는 네임스페이스를 다음과 같이 지정할 수 있습니다.

`~/.claude/[NAMESPACE]/commands` 또는 `./claude/[NAMESPACE]/commands`

```claude
> /[NAMESPACE]:[command-name] [arguments]
```

### 사용자 정의 명령어 생성

```sh
$ echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

```sh
$  echo "Review this code for security vulnerabilities:" > .claude/commands/security-review.md 
```

```sh
$ echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md
```

```sh
$ echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md
```

---

```claude
> /fix-issue 123 high-priority 

/fix-issue is running… 123 high-priority 

⏺ I'll fix issue #123 with high priority following your coding standards.

  Let me start by fetching the issue details from GitHub.

⏺ Bash(gh issue view 123 --json title,body,labels,state,comments)
  ⎿  Running…

──────────────────────────────────────────────────────────────────────────────────────
 Bash command

   gh issue view 123 --json title,body,labels,state,comments
   Fetch issue #123 details from GitHub

 Do you want to proceed?
 ❯ 1. Yes
   2. Yes, and don't ask again for gh issue view commands in
   /Users/jeongtae/Desktop/claude-code-advanced-guide
   3. No, and tell Claude what to do differently (esc)
```

```claude
> /review-pr 456 high alice 

/review-pr is running… 456 high alice 

⏺ I'll review PR #456 with high priority and prepare it for assignment to alice.

  Let me start by fetching the PR information using the GitHub CLI.

⏺ Bash(gh pr view 456 --json
      title,body,author,state,headRefName,baseRefName,files,commits)
  ⎿  Interrupted · What should Claude do instead?
```

### 파일 참조

```sh
$ echo 'Compare @src/need_debugger.py with @src/need_review.py' > .claude/commands/referrence-file.md 
```

```claude
> /referrence-file

/referrence-file is running…

⏺ I'll compare these two Python files for you. Let me read both files first.

⏺ Read(src/need_debugger.py)
  ⎿  Error reading file

⏺ Read(src/need_review.py)
  ⎿  Error reading file

⏺ The files don't exist at those paths. Let me search for them in the repository.

⏺ Search(pattern: "**/need_debugger.py")
  ⎿  Found 1 file (ctrl+o to expand)

⏺ Search(pattern: "**/need_review.py")
  ⎿  Found 1 file (ctrl+o to expand)

⏺ Found them! They're in the root directory. Let me read both files now.

⏺ Read(need_debugger.py)
  ⎿  Read 12 lines

⏺ Read(need_review.py)
  ⎿  Read 7 lines

⏺ Comparison of need_debugger.py vs need_review.py

  need_debugger.py (need_debugger.py:1-12)

  def main() -> None:
      student = {
          "name": "Alice",
          "age": 21,
          "courses": ["Math", "Science", "Art"]
      }

      print(student["a"])  # BUG: KeyError


  if __name__ == "__main__":
      main()

  Issues:
  - Bug at line 8: Attempts to access student["a"] which doesn't exist, causing a
  KeyError
  - Should likely be student["age"] or student["name"]

  need_review.py (need_review.py:1-7)

  def main() -> None:
      print("Hello, World!")


  if __name__ == "__main__":
      main()

  Characteristics:
  - Simple "Hello, World!" program
  - No bugs, but basic implementation
  - Could potentially benefit from code review for production standards

  Key Differences:

  1. Complexity: need_debugger.py has more complex logic with a dictionary
  structure, while need_review.py is minimal
  2. Purpose: need_debugger.py clearly has a bug that needs debugging, while
  need_review.py is functional but basic
  3. Error state: need_debugger.py will crash at runtime, need_review.py runs
  successfully

  The naming suggests these files are examples for testing specialized agents -
  one needs the debugger agent (has a bug), while the other needs the
  code-reviewer agent (works but could be reviewed for quality).
```

### Bash 명령어 실행

커맨드 정의를 위한 마크다운 파일에 !`배시 명령어` 형태로 배시 명령어를 추가할 수 있습니다.

```
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

## hooks

`/hooks` 명령어를 통해 훅 관리 가능

### 이벤트

```
PreToolUse: 도구 호출 전에 실행됩니다 (차단 가능)
PostToolUse: 도구 호출 완료 후 실행됩니다
UserPromptSubmit: 사용자가 프롬프트를 제출할 때, Claude가 처리하기 전에 실행됩니다
Notification: Claude Code가 알림을 보낼 때 실행됩니다
Stop: Claude Code가 응답을 완료할 때 실행됩니다
SubagentStop: 하위 에이전트 작업이 완료될 때 실행됩니다
PreCompact: Claude Code가 압축 작업을 실행하려고 할 때 실행됩니다
SessionStart: Claude Code가 새 세션을 시작하거나 기존 세션을 재개할 때 실행됩니다
SessionEnd: Claude Code 세션이 종료될 때 실행됩니다
```

### 훅 추가

```
> /hook

╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Hook Configuration                                                                                                                                                                                                                                                                                                                │
│                                                                                                                                                                                                                                                                                                                                   │
│ Hooks are shell commands you can register to run during Claude Code processing. Docs                                                                                                                                                                                                                                              │
│ • Each hook event has its own input and output behavior                                                                                                                                                                                                                                                                           │
│ • Multiple hooks can be registered per event, executed in parallel                                                                                                                                                                                                                                                                │
│ • Any changes to hooks outside of /hooks require a restart                                                                                                                                                                                                                                                                        │
│ • Timeout: 60 seconds                                                                                                                                                                                                                                                                                                             │
│                                                                                                                                                                                                                                                                                                                                   │
│ ╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ ⚠ CRITICAL SECURITY WARNING - USE AT YOUR OWN RISK                                                                                                                                                                                                                                                                            │ │
│ │ Hooks execute arbitrary shell commands with YOUR full user permissions without confirmation.                                                                                                                                                                                                                                  │ │
│ │ • You are SOLELY RESPONSIBLE for ensuring your hooks are safe and secure                                                                                                                                                                                                                                                      │ │
│ │ • Hooks can modify, delete, or access ANY files your user account can access                                                                                                                                                                                                                                                  │ │
│ │ • Malicious or poorly written hooks can cause irreversible data loss or system damage                                                                                                                                                                                                                                         │ │
│ │ • Anthropic provides NO WARRANTY and assumes NO LIABILITY for any damages resulting from hook usage                                                                                                                                                                                                                           │ │
│ │ • Only use hooks from trusted sources to prevent data exfiltration                                                                                                                                                                                                                                                            │ │
│ │ • Review the hooks documentation before proceeding                                                                                                                                                                                                                                                                            │ │
│ ╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│                                                                                                                                                                                                                                                                                                                                   │
│ Select hook event:                                                                                                                                                                                                                                                                                                                │
│ ❯ 1.  PreToolUse - Before tool execution                                                                                                                                                                                                                                                                                          │
│   2.  PostToolUse - After tool execution                                                                                                                                                                                                                                                                                          │
│   3.  Notification - When notifications are sent                                                                                                                                                                                                                                                                                  │
│   4.  UserPromptSubmit - When the user submits a prompt                                                                                                                                                                                                                                                                           │
│ ↓ 5.  SessionStart - When a new session is started                                                                                                                                                                                                                                                                                │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
   Enter to acknowledge risks and continue · Esc to exit
```

select hook event: 목록중 하나 적절히 선택 1번을 선택하면 다음과 같이 `1. + add new matcher` 를 선택 하라고 나옴.

```
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ PreToolUse - Tool Matchers                                                                                                                                                                                                                                                                                                        │
│                                                                                                                                                                                                                                                                                                                                   │
│ Input to command is JSON of tool call arguments.                                                                                                                                                                                                                                                                                  │
│ Exit code 0 - stdout/stderr not shown                                                                                                                                                                                                                                                                                             │
│ Exit code 2 - show stderr to model and block tool call                                                                                                                                                                                                                                                                            │
│ Other exit codes - show stderr to user only but continue with tool call                                                                                                                                                                                                                                                           │
│                                                                                                                                                                                                                                                                                                                                   │
│ ❯ 1. + Add new matcher…  No matchers configured yet                                                                                                                                                                                                                                                                               │
│                                                                                                                                                                                                                                                                                                                                   │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
   Enter to select · Esc to go back

```

1번을 선택하면 다음과 같이 PreToolUser는 matcher로 지정된 툴(여기서의 툴은 권한을 의미합니다.)이 호출되면, 특정 동작을 수행합니다.

여기서는 `Bash` 를 명시합니다. 만약 모든 도구를 사용허가를 한다면 `*` 입력하면 됩니다.

다음과 같이 실제 어떤 동작을 할지 추가하라고 나옵니다.

```
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ PreToolUse - Matcher: bash                                                                                                                                                                                                                                                                                                        │
│                                                                                                                                                                                                                                                                                                                                   │
│ Input to command is JSON of tool call arguments.                                                                                                                                                                                                                                                                                  │
│ Exit code 0 - stdout/stderr not shown                                                                                                                                                                                                                                                                                             │
│ Exit code 2 - show stderr to model and block tool call                                                                                                                                                                                                                                                                            │
│ Other exit codes - show stderr to user only but continue with tool call                                                                                                                                                                                                                                                           │
│                                                                                                                                                                                                                                                                                                                                   │
│ ❯ 1. + Add new hook…  No hooks configured yet                                                                                                                                                                                                                                                                                     │
│                                                                                                                                                                                                                                                                                                                                   │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
   Enter to select · Esc to go back
```

1번을 선택하면 훅의 실질적인 동작을 정의할 수 있습니다.

```
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Add new hook                                                                                                                                                                                                                                                                                                                      │
│                                                                                                                                                                                                                                                                                                                                   │
│ ╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ ⚠ CRITICAL SECURITY WARNING                                                                                                                                                                                                                                                                                                   │ │
│ │ Hooks execute arbitrary shell commands with YOUR full user permissions. By proceeding, you acknowledge:                                                                                                                                                                                                                       │ │
│ │ • You are SOLELY responsible for any commands you configure                                                                                                                                                                                                                                                                   │ │
│ │ • Hooks can modify, delete, or access ANY files your user can access                                                                                                                                                                                                                                                          │ │
│ │ • Anthropic provides NO WARRANTY and assumes NO LIABILITY for damages                                                                                                                                                                                                                                                         │ │
│ │ • USE AT YOUR OWN RISK - Test thoroughly before production use                                                                                                                                                                                                                                                                │ │
│ │ • Review the hooks documentation before proceeding                                                                                                                                                                                                                                                                            │ │
│ ╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│                                                                                                                                                                                                                                                                                                                                   │
│ Event: PreToolUse - Before tool execution                                                                                                                                                                                                                                                                                         │
│                                                                                                                                                                                                                                                                                                                                   │
│ Input to command is JSON of tool call arguments.                                                                                                                                                                                                                                                                                  │
│ Exit code 0 - stdout/stderr not shown                                                                                                                                                                                                                                                                                             │
│ Exit code 2 - show stderr to model and block tool call                                                                                                                                                                                                                                                                            │
│ Other exit codes - show stderr to user only but continue with tool call                                                                                                                                                                                                                                                           │
│                                                                                                                                                                                                                                                                                                                                   │
│ Matcher: bash                                                                                                                                                                                                                                                                                                                     │
│                                                                                                                                                                                                                                                                                                                                   │
│ Command:                                                                                                                                                                                                                                                                                                                          │
│                                                                                                                                                                                                                                                                                                                                   │
│ ╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │                                                                                                                                                                                                                                                                                                                               │ │
│ ╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│                                                                                                                                                                                                                                                                                                                                   │
│ Examples:                                                                                                                                                                                                                                                                                                                         │
│ • jq -r '.tool_input.file_path | select(endswith(".go"))' | xargs -r gofmt -w                                                                                                                                                                                                                                                     │
│ • jq -r '.tool_input | \"[\" + (.description // \"No description\") + \"] \" + .command' >> \"$CLAUDE_PROJECT_DIR/.claude/bash-command-log.txt\"                                                                                                                                                                                                        │
│ • /usr/local/bin/security_check.sh                                                                                                                                                                                                                                                                                                │
│ • python3 ~/hooks/validate_changes.py                                                                                                                                                                                                                                                                                             │
│                                                                                                                                                                                                                                                                                                                                   │
│                                                                                                                                                                                                                                                                                                                                   │
│ ⚠ Security Best Practices:                                                                                                                                                                                                                                                                                                        │
│ • Use absolute paths for custom scripts (~/scripts/check.sh not check.sh)                                                                                                                                                                                                                                                         │
│ • Avoid using sudo - hooks run with your user permissions                                                                                                                                                                                                                                                                         │
│ • Be cautious with patterns that match sensitive files (.env, .ssh/*, secrets.*)                                                                                                                                                                                                                                                  │
│ • Validate and sanitize input paths (reject ../ paths, check expected formats)                                                                                                                                                                                                                                                    │
│ • Avoid piping untrusted content to shells (curl ... | sh, | bash)                                                                                                                                                                                                                                                                │
│ • Use restrictive file permissions (chmod 644, not 777)                                                                                                                                                                                                                                                                           │
│ • Quote all variable expansions to prevent injection: "$VAR"                                                                                                                                                                                                                                                                      │
│ • Keep error checking enabled in scripts (avoid set +e)                                                                                                                                                                                                                                                                           │
│ By adding this hook, you accept all responsibility for its execution and any consequences.                                                                                                                                                                                                                                        │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
   Enter to confirm · Esc to cancel
```

여기서는 다음과 같이 정의하도록 했습니다. 해당 명령어는 실행된 명령어를 ./.claude/bash-command-log.txt에 저장합니다.

```
jq -r '.tool_input | \"[\" + (.description // \"No description\") + \"] \" + .command' >> \"$CLAUDE_PROJECT_DIR/.claude/bash-command-log.txt\"
```

훅을 정의하면 어느 경로에서 관리할지 나옵니다. 여기서는 적절히 원하는 경로를 선택하면 됩니다. 

```
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Save hook configuration                                                                                                                                                                                                                                                                                                           │
│                                                                                                                                                                                                                                                                                                                                   │
│   Event: PreToolUse - Before tool execution                                                                                                                                                                                                                                                                                       │
│   Matcher: bash                                                                                                                                                                                                                                                                                                                   │
│   Command: jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt                                                                                                                                                                                                    │
│                                                                                                                                                                                                                                                                                                                                   │
│ Where should this hook be saved?                                                                                                                                                                                                                                                                                                  │
│                                                                                                                                                                                                                                                                                                                                   │
│ ❯ 1. Project settings (local)   Saved in .claude/settings.local.json                                                                                                                                                                                                                                                              │
│   2. Project settings           Checked in at .claude/settings.json                                                                                                                                                                                                                                                               │
│   3. User settings              Saved in at ~/.claude/settings.json                                                                                                                                                                                                                                                               │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

저장이 된다면 다음과 같이 결과를 확인 가능 

`./claude/settings.local.json` 형태로 관리됨

```
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ PreToolUse - Matcher: bash                                                                                                                                                                                                                                                                                                        │
│                                                                                                                                                                                                                                                                                                                                   │
│ Input to command is JSON of tool call arguments.                                                                                                                                                                                                                                                                                  │
│ Exit code 0 - stdout/stderr not shown                                                                                                                                                                                                                                                                                             │
│ Exit code 2 - show stderr to model and block tool call                                                                                                                                                                                                                                                                            │
│ Other exit codes - show stderr to user only but continue with tool call                                                                                                                                                                                                                                                           │
│                                                                                                                                                                                                                                                                                                                                   │
│   1. + Add new hook…                                                                                                                                                                                                                                                                                                              │
│ ❯ 2. jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt   Local Settings                                                                                                                                                                                         │
│                                                                                                                                                                                                                                                                                                                                   │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
   Enter to select · Esc to go back

```

### 훅 호출 테스트

클로드를 재시작 한 후 아무런 bash 명령어를 수행합니다.

```bash
$ claude

 ▐▛███▜▌   Claude Code v2.0.27
▝▜█████▛▘  Sonnet 4.5 · Claude Max
  ▘▘ ▝▝    /Users/jeongtae/Desktop/claude-sub-agent-playground

> pwd 

⏺ I'll show you the current working directory.

⏺ Bash(pwd)
  ⎿  /Users/jeongtae/Desktop/claude-sub-agent-playground

⏺ The current working directory is /Users/jeongtae/Desktop/claude-sub-agent-playground.
```

```
$ cat .claude/bash-command-log.txt

[Print current working directory] pwd

```

## sub agents(별도의 컨텍스트를 가짐)

클로드 코드의 서브 에이전트는 사용자에 의해 명시적 또는 간전접으로 호출 가능하다.

### 에이전트 정의

서브 에이전트를 위해 `./claude/agents` 또는 `~/.claude/agents` 아래에 마크다운 형식으로 에이전트를 정의할 수 있다.

```markdown
---
name: agent-name
description: Brief description when to use this agent
tools: tool1,tool2,tool3
color: blue
---

# Agent Name

[Agent의 역할과 책임에 대한 상세 설명]

## Instructions
[구체적인 작업 지침]

## Best Practices
[따라야 할 모범 사례]

## Examples
[작업 예시]
```

name: 에이전트 이름 (필수)

description: 에이전트 설명 (필수)

tools: 에이전트 권한(선택)

tools는 read, write, edit, grep, file_search, bash, MCP 도구

color: 클로드 코드에서 해당 에이전트가 호출될 때 표시할 색상

그리고 그 아래는 에이전트가 실제로 어떻게 수행해야 하는지에 대한 본문


### 에이전트 호출

에이전트는 직접적, 간접적호출 가능

```claude
> 이 PR을 리뷰해줘
# → code-reviewer 자동 활성화
```

```claude
> @code-reviewer 이 파일 검토해줘
```

## skill(별도의 컨텍스트를 가지지 않음)

skill은 agent와 유사하지만 동작 메커니즘이 다름. 

skill은 MCP로 비유를 하면 실제 로직이 호출되는 tool(sub agent의 tool과 다른 개념, 실제 작업을 처리하는 함수) 

클로드 코드의 스킬 사용을 위해 `./claude/skills/[스킬 이름]/SKILL.md` 또는 `~/.claude/skills/[스킬이름]/SKILL.md` 아래에 마크다운 형식으로 스킬을 정의할 수 있다.

skill을 관리하는 별도의 명령어 없음.(서브 에이전트, 플러그인, 훅은 /agent, /plugin, /hook 명령어를 가짐)

### skill 구조

SKILL.md는 다음과 같이 정의할 수 있다.

```markdown
---
name: skill-name
description: Brief description of what this skill does and when to use it
allowed-tools: Read, Grep, Glob
---

# Skill Name

[Skill의 목적과 사용 시나리오]

## Overview
[기능 개요]

## Prerequisites
[필요한 도구/라이브러리]

## Instructions
[단계별 지침]

## Examples
[사용 예시]

## Best Practices
[모범 사례]

## Troubleshooting
[문제 해결]
```

스킬은 실제 작업을 수행하는 요소로서 좀 더 복잡한 구조를 가짐

```
.claude/skills/greet_user/
└── SKILL.md           # 메인 가이드 (필수)
├── examples.md        # 옵션
├── reference.md       # 옵션
├── scripts            # 옵션
│   └── hello.py
└── templates          # 옵션
    └── template.txt
```

### 사용 가능 스킬 목록 조회

스킬 목록은 별도의 커맨드는 존재하지 않고 클로드에게 다음과 같이 요청시 알려줌

```claude
> What Skills are available?

> List all available Skills
```

### 스킬 사용

```claude
> 정태 사용자에게 인사 
  ⎿  ⧉ Selected 4 lines from .claude/skills/greet_user/templates/template.txt in Visual Studio Code

⏺ I'll use the greet_user skill to greet 정태:

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Use skill “greet_user”?
 Claude may use instructions, code, or files from this Skill.

   인사할 사용자의 이름 (project)

 Do you want to proceed?
 ❯ 1. Yes
   2. Yes, and don't ask again for greet_user in /Users/jeongtae/Desktop/claude-sub-agent-playground
   3. No, and tell Claude what to do differently (esc)
```

```claude
> 정태 사용자에게 인사 
  ⎿  ⧉ Selected 4 lines from .claude/skills/greet_user/templates/template.txt in Visual Studio Code

⏺ I'll use the greet_user skill to greet 정태:

> The "greet_user" skill is running 

> The "greet_user" skill is running 

⏺ I'll run the greet_user skill for 정태. Let me execute the hello.py script with the name "정태":

⏺ Bash(cd /Users/jeongtae/Desktop/claude-sub-agent-playground/.claude/skills/greet_user && python scripts/hello.py 정태)
  ⎿  Running…

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Bash command

   cd /Users/jeongtae/Desktop/claude-sub-agent-playground/.claude/skills/greet_user && python scripts/hello.py 정태
   Run greeting script for 정태

 Do you want to proceed?
 ❯ 1. Yes
   2. Yes, and don't ask again for python scripts/hello.py commands in /Users/jeongtae/Desktop/claude-sub-agent-playground
   3. No, and tell Claude what to do differently (esc)
```

### sub agent와 skill의 관계

서브 에이전트는 호출하는 에이전트와 별도의 컨텍스트를 가진다.

스킬은 호출하는 에이전트의 컨텍스트를 가진다.

```
┌─────────────────────────────────────────────┐
│           Sub-agent                         │
│  ┌─────────────────────────────────┐       │
│  │ tools: read,bash  (권한)        │       │
│  └─────────────────────────────────┘       │
│             ↓ 참조                          │
│  ┌─────────────────────────────────┐       │
│  │ Skills (지식/가이드)             │       │
│  │ - 배포 절차                      │       │
│  │ - 코딩 표준                      │       │
│  │ - 체크리스트                     │       │
│  └─────────────────────────────────┘       │
│             ↓                               │
│      실제 작업 수행                          │
│  (권한 범위 내에서 가이드대로)              │
└─────────────────────────────────────────────┘
```

### 스킬을 사용하는 서브 에이전트 정의

에이전트의 워크 플로우에서 참조할 스킬 명시.

```markdown
---
name: greeting-manager
description: Greeting message specialist. Creates personalized greetings in multiple languages. Use for greeting generation, welcome messages, or hello text.
tools: bash,read
---

# Greeting Manager

You are a specialist in generating personalized greeting messages. You use the greet_user skill to create greetings efficiently.

## Your Responsibilities

1. Generate greetings for individuals or groups
2. Support multiple languages (English, Korean)
3. Create custom greeting messages
4. Handle batch greeting generation

## How to Work

### Step 1: Always Use the Greeting Generator Skill

**CRITICAL:** Before generating any greeting, read the greet_user skill:
```bash
cat ~/.claude/skills/greet_user/SKILL.md
```

This skill contains all the procedures and scripts you need.

### Step 2: Use the Script

After reading the skill, use the `hello.py` script:
```bash
python ~/.claude/skills/greet_user/scripts/hello.py NAME
```

### Step 3: Provide Results

Return the generated greeting to the user in a friendly format.

## Examples

### Example 1: Single Greeting
```bash
# Read the skill first
cat ~/.claude/skills/greet_user/SKILL.md

# Generate greeting
python ~/.claude/skills/greet_user/scripts/hello.py Alice
```

### Example 2: Multiple Greetings
```bash
# For multiple people
for name in Alice Bob Charlie; do
  python ~/.claude/skills/greet_user/scripts/hello.py "$name"
done
```

### Example 3: Korean Greeting
```bash
python ~/.claude/skills/greet_user/scripts/hello.py 정태
```

## Important Rules

### ✅ Always Do
- Read the greeting-generator skill FIRST
- Use the provided scripts (don't recreate them)
- Validate language codes (en, ko only)
- Format output nicely for the user

### ❌ Never Do
- Create greetings without using the skill
- Modify the skill scripts
- Support languages not in the skill

## Workflow
```
User Request
    ↓
Read greeting-generator skill
    ↓
Understand available languages & usage
    ↓
Execute hello.py script
    ↓
Return formatted result
```

## Your Personality

- Friendly and welcoming
- Efficient and direct
- Always follow the skill's procedures
- Provide clear, formatted output
```

## plugin 

클로드 코드가 제공하는 커맨드, 에이전트, 스킬, 훅 등을 손쉽게 공유하여 사용 가능

### 마켓 플레이스 지정

플러그인을 이용하기 위해 플러그인의 위치가 어디있는지 정의가 필요함.

```claude
> /plugin marketplace add ./
```

### 플러그인 설치

마켓 플레이스에 정의된 plugins 설치 가능.

```claude
> /plugin install my-first-plugin
```

### 플러그인 구조

```
my-first-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/                 # Custom slash commands (optional)
│   └── hello.md
├── agents/                   # Custom agents (optional)
│   └── helper.md
├── skills/                   # Agent Skills (optional)
│   └── my-skill/
│       └── SKILL.md
└── hooks/                    # Event handlers (optional)
    └── hooks.json
```

사용 usage

다음과 같이 호출 가능 `/[플러그인 이름]:[커맨드|에이전트|스킬|훅]`

```claude
> /my-first-plugin:hello
```