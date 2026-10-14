# Claude Code 완전 정복: 커맨드, 훅, 에이전트, 스킬, 플러그인 가이드

claude code란 Anthropic에서 만든 개발자용 AI 어시스턴트 입니다.

클로드 코드는 agent, skill, hook, command 등을 통해 보다 확장성 있는 LLM 워크플로우를 구축할 수 있도록 도와줍니다.

해당 레포는 클로드 코드의 .claude 구성을 설명하고 있으며, 디자인에 도움되는 스킬을 제공하고 있습니다.

### 디자인 시스템 스킬

* `/plugin` 명령어가 지원되는 환경

```
> /plugin marketplace add https://github.com/pjt3591oo/claude-code-advanced-guide.git

> /plugin install design-sense-plugin@my-first-plugin-marketplace
```

* 빠르게 스킬 설치

```
> npx skills add https://github.com/pjt3591oo/claude-code-advanced-guide/tree/main/design-sense-plugin -a claude-code -a opencode -a codex
```

## 시작하며

이 글을 통해 클로드 코드를 활용하여 코드 생산 뿐 아니라, 나만의 개발 워크플로우를 자동화하고 싶은 개발자 또는 LLM을 터미널 환경에 깊숙이 통합하고 싶은 DevOps 엔지니어가 읽기 적합합니다. 

주로 다루는 내용은 다음과 같습니다.

1. slash commands

2. hooks

3. sub agent

4. skill

5. plugin

해당 내용을 실행하기 위해선 claude code 2.x 이상의 버전이 필요합니다. 

만약, 1.x라면 2.x로 업데이트 해야합니다.

**버전 확인.** 2026-10 기준 최신 버전은 2.1.299입니다. 다만 모든 기능이 2.x라면 어디서나 동일하게 동작하는 것은 아니고, 기능별로 요구되는 최소 버전이 다릅니다. 예를 들어 mods(JavaScript/TypeScript로 훅을 등록하는 플러그인)는 터미널 기준 v2.1.287 이상, Desktop 기준 v2.1.286 이상이어야 사용 가능합니다. 그 외 기능별 최소 버전의 예는 다음과 같습니다.

| 기능 | 최소 버전 |
| --- | --- |
| mods(플러그인 기반 훅 등록) | v2.1.287 (Desktop v2.1.286) |
| `/agents` 대화형 관리 UI | v2.1.197 이하 (이후에는 안내 문구 출력) |
| Task 도구 → Agent 도구로 이름 변경 | v2.1.63 |
| `/subtask`, `/fork`(백그라운드 세션 복사) | v2.1.212 |
| `/import`(Codex·Gemini·Cursor 설정 이관) | v2.1.213 |
| `/skill-doctor` | v2.1.252 |
| `/reload-plugins` | v2.1.260 |

자신의 버전은 `/status` 또는 `/doctor`로 확인하고, 본문에 나온 명령이 프롬프트에 나타나지 않는다면 버전부터 점검해야합니다.

참고로 본문 내용에서는 2가지 형태의 코드 블록이 있습니다.

```
$ shell 명령어

> 클로드 코드 프롬프트
```


## slash commands

**커스텀 슬래시 명령어는 스킬(skills)에 통합되었습니다.** `.claude/commands/deploy.md` 파일과 `.claude/skills/deploy/SKILL.md` 스킬은 모두 `/deploy` 라는 같은 명령어를 만들며, 동작도 동일합니다. 이미 만들어 둔 `.claude/commands/*.md` 파일은 그대로 계속 동작하므로 기존 구성을 서둘러 바꿀 필요는 없습니다.

다만 새로 만드는 명령어는 스킬 형식으로 만드는 것을 권장합니다. 스킬은 커맨드 파일이 갖지 못하는 부가 기능을 제공합니다.

* 보조 파일(스크립트, 템플릿, 참조 문서)을 함께 둘 수 있는 디렉토리
* 누가 명령어를 호출할지 제어하는 frontmatter (`disable-model-invocation` 등)
* 현재 작업과 관련 있을 때 클로드가 스스로 불러오는 자동 호출

스킬에 대한 자세한 설명은 [skill](#skill별도의-컨텍스트를-가지지-않음) 섹션과 [슬래시 커맨드와 스킬은 통합되었다](#슬래시-커맨드와-스킬은-통합되었다)에서 다루므로, 이 섹션에서는 커맨드 파일 형식을 중심으로 설명합니다.

이 섹션은 2026년 10월 기준 최신 사양(Claude Code v2.1.299)을 따릅니다. 특정 기능에 최소 버전이 필요한 경우에는 그 자리에 명시해 두었습니다.

클로드 코드는 이미 정의된 명령어 또는 사용자 정의 슬래시 명령어를 다음과 같이 사용이 가능 합니다.

사용자 정의 슬래시 명령어는 `~/.claude/commands` 또는 `.claude/commands` 경로에 마크다운 파일로 관리됩니다.

```claude
> /[command-name] [arguments]
```

`~/.claude/commands`는 이 기계의 모든 프로젝트에서, `.claude/commands`는 이 저장소에서 실행한 세션에서만 사용할 수 있습니다. 팀과 공유해야 하는 명령어라면 저장소에 커밋합니다.

같은 이름의 명령어가 여러 곳에 있다면 우선순위는 다음과 같습니다.

* 관리(엔터프라이즈) → 개인(`~/.claude/`) → 프로젝트(`.claude/`) 순으로 적용됩니다. `deploy`가 `~/.claude/skills/`와 프로젝트의 `.claude/skills/` 둘 다에 있다면 `/deploy`는 개인 쪽이 실행됩니다.
* 같은 이름의 스킬과 커맨드 파일이 모두 있다면 스킬이 적용됩니다.
* 내 스킬이나 커맨드 파일이 `/code-review`, `/usage`처럼 내장되어 함께 제공되는 번들 스킬·내장 명령어와 이름이 겹치면 내 쪽이 실행됩니다. 다만 `/review`, `/cost`처럼 붙어 있는 별명은 계속 내장 쪽이 실행됩니다.

### 네임스페이스

명령어를 하위 디렉토리로 묶어 이름 공간을 나눌 수 있습니다. `commands` 아래에 만든 디렉토리 경로가 명령어 이름의 접두사가 되며, 경로의 `/`는 `:`로 바뀝니다.

`.claude/commands/frontend/component.md`

```claude
> /frontend:component [arguments]
```

즉 명령어 이름은 "확장자를 뺀 파일 이름"이 아니라 "commands 아래 디렉토리 경로 + 파일 이름"입니다.

* `.claude/commands/deploy.md` → `/deploy`
* `.claude/commands/frontend/component.md` → `/frontend:component`
* `~/.claude/commands/frontend/component.md` → `/frontend:component` (개인 스코프도 같은 규칙)
* 플러그인의 `commands/review.md` → `/my-plugin:review` (플러그인 이름이 항상 앞에 붙으므로 내 명령어와 충돌하지 않습니다)
* 모노레포의 `apps/web/.claude/skills/deploy/SKILL.md` → `/apps/web:deploy` (하위 프로젝트에 있는 스킬은 하위 디렉토리가 이름에 포함됩니다)

`~/.claude/[NAMESPACE]/commands`나 `.claude/[NAMESPACE]/commands`처럼 `commands` **앞에** 이름을 두는 방식은 현재 사양에 없습니다. 네임스페이스는 항상 `commands` **아래**의 하위 디렉토리로 만듭니다.

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
$ echo 'Review PR #$0 with priority $1 and assign to $2' > .claude/commands/review-pr.md
```

`$ARGUMENTS`는 명령어 이름 뒤에 입력한 인자 전체를 뜻합니다. 개별 인자는 `$0`, `$1`, `$2`처럼 번호로 꺼내 씁니다. 번호는 **0부터 시작**하므로 `$0`이 첫 번째 인자입니다. 예전 문서처럼 `$1`을 첫 번째 인자로 쓴 예시는 현재 사양과 맞지 않습니다.

frontmatter에 `arguments` 목록을 선언하면 `$0` 대신 `$issue`, `$branch` 같은 이름으로 받을 수도 있습니다.

```markdown
---
description: Fix a GitHub issue and move the branch
arguments: [issue, branch]
disable-model-invocation: true
---

Fix GitHub issue #$issue on the $branch branch following our coding standards.
```

이름으로 받은 인자를 넘기지 않으면 그 자리는 빈 문자열이 됩니다. 번호로 받은 인자가 없으면 그 자리는 그대로 텍스트로 남습니다. `$1.00`처럼 금액을 적을 때는 `\$1.00`처럼 역슬래시로 이스케이프해야 인자로 바뀌지 않습니다.

인자 외에도 본문에 쓸 수 있는 값이 있습니다.

* `${CLAUDE_SKILL_DIR}`: 그 스킬이 있는 디렉토리. 스킬과 함께 둔 스크립트를 참조할 때 씁니다.
* `${CLAUDE_PROJECT_DIR}`: 프로젝트 루트. 항상 같은 경로를 가리켜야 할 때 씁니다.
* `${CLAUDE_SESSION_ID}`: 현재 세션 ID. 로그나 세션별 파일을 만들 때 씁니다.
* `${CLAUDE_EFFORT}`: 현재 사고 단계(`low`, `medium`, `high`, `xhigh`, `max`).

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

(구버전 캡처) `allowed-tools`로 미리 승인해 두지 않은 도구는 위처럼 실행 확인 프롬프트를 거칩니다.

```claude
> /review-pr 456 high alice 

/review-pr is running… 456 high alice 

⏺ I'll review PR #456 with high priority and prepare it for assignment to alice.

  Let me start by fetching the PR information using the GitHub CLI.

⏺ Bash(gh pr view 456 --json
      title,body,author,state,headRefName,baseRefName,files,commits)
  ⎿  Interrupted · What should Claude do instead?
```

(구버전 캡처) `$0`이 `456`, `$1`이 `high`, `$2`가 `alice`로 치환됩니다. 여러 단어를 한 인자로 넘기려면 `"..."`로 감싸면 됩니다.

인자를 여러 명령어에 한 번에 넘기는 것도 가능합니다. `/write-tests /fix-issue 123`처럼 한 줄의 시작에 여러 명령어를 나열하면 모두 로드되고, 뒤에 남은 `123`은 각각의 `$ARGUMENTS`로 전달됩니다. 첫 번째를 포함해 최대 여섯 개까지 이렇게 연속으로 쓸 수 있습니다.

### 파일 참조

@를 이용하면 파일을 참조할 수 있습니다. 명령어가 실행될 때 참조한 파일 내용이 함께 전달됩니다.

```sh
$ echo 'Compare @src/need_debugger.py with @src/need_review.py' > .claude/commands/reference-file.md 
```

```claude
> /reference-file

/reference-file is running…

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

(구버전 캡처) 파일 검색 도구 이름이 `Search`에서 `Glob`으로 바뀌었습니다. claude.ai 계정으로 동기화된 스킬 안에서 쓴 `@` 참조는 파일로 첨부되지 않고 그냥 텍스트로 전달됩니다(v2.1.228 이후).

### Bash 명령어 실행

명령어를 정의하는 마크다운 파일에 !`배시 명령어` 형태로 배시 명령어를 추가할 수 있습니다. 스킬의 `SKILL.md`에서도 같은 구문을 사용합니다. 이 구문은 내용을 클로드에게 보내기 **전에** 명령을 실행하고, 그 출력으로 자리를 채웁니다. 클로드가 읽는 것은 !`...`로 쓴 텍스트가 아니라 치환된 출력입니다.

* 구조

```
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
disable-model-invocation: true
model: haiku
---

Create a git commit with message: $ARGUMENTS
```

allowed-tools: 이 명령어가 실행된 턴 동안 승인 요청 없이 사용할 수 있는 도구 목록. 다음 메시지를 보내면 승인은 해제됩니다. 목록에 없는 도구까지 막히는 것은 아니며, 나머지 도구는 평소대로 권한 설정이 적용됩니다. 세션 전체에 대해 미리 승인하려면 권한 설정에 allow 규칙으로 추가합니다.

argument-hint: 자동완성 때 표시할 인수 안내. 예: `[issue-number]` 또는 `[filename] [format]`

arguments: `$issue`, `$branch`처럼 이름으로 인자를 받기 위한 목록. 순서대로 위치와 연결됩니다.

description: 명령어가 무엇을 하는지, 언제 쓰는지 적는 설명. 클로드가 자동으로 불러올지 판단할 때 이 내용을 사용합니다. 본문 첫 줄을 생략하면 첫 번째 비어 있지 않은 줄이 설명으로 쓰입니다.

when_to_use: 언제 이 명령어를 쓸지에 대한 추가 안내. 호출 예시나 트리거 문구를 적습니다. `description`과 함께 합쳐져 표시되며, 둘 합쳐 1,536자를 넘으면 잘립니다.

disable-model-invocation: `true`로 두면 클로드가 이 명령어를 스스로 불러오지 않습니다. `/commit`, `/deploy`처럼 실행 시점을 내가 직접 제어하고 싶은 워크플로우에 설정합니다. 기본값은 `false`입니다. 서브 에이전트에 미리 로드되거나 스케줄 작업의 프롬프트로 실행되는 것도 함께 막습니다.

user-invocable: `false`로 두면 `/` 메뉴에 나타나지 않고 내가 `/이름`으로 호출할 수도 없습니다. 클로드만 사용해야 하는 배경 지식 명령어에 씁니다. 기본값은 `true`입니다.

model: 이 명령어가 실행된 턴 동안 사용할 모델. 별칭(`sonnet`, `opus`, `haiku`, `fable`)이나 `/model`에서 쓰는 값을 그대로 사용하며, `inherit`로 두면 현재 모델을 유지합니다. 다음 메시지를 보내면 세션 모델로 돌아옵니다. `claude-3-5-haiku-20241022`처럼 오래된 모델 ID를 직접 적는 대신 별칭을 쓰는 것을 권합니다.

effort: 이 명령어가 실행되는 동안의 사고 단계 (`low`, `medium`, `high`, `xhigh`, `max`). 사용 가능한 단계는 모델에 따라 다릅니다.

context: `fork`로 두면 새 서브에이전트 컨텍스트에서 실행됩니다. 어떤 서브에이전트를 쓸지는 `agent`로 지정합니다.

agent: `context: fork`를 썼을 때 사용할 서브 에이전트 종류.

background: `context: fork`를 썼을 때만 적용됩니다. `false`로 두면 그 턴에서 결과를 기다립니다. 기본값은 `true`로, 백그라운드에서 실행됩니다 (v2.1.218 이후).

disallowed-tools: 이 명령어가 실행되는 동안 클로드가 쓰지 못하게 막을 도구 목록. 다음 메시지를 보내면 제한이 풀립니다.

hooks: 이 명령어가 호출될 때 등록해 그 세션 동안 유지할 훅 설정.

`name`과 `paths`를 뺀 위 필드는 `.claude/commands/*.md` 커맨드 파일에서도 그대로 사용할 수 있습니다. `name`은 스킬 디렉토리에서 커맨드 이름을 정할 때 쓰는 필드이므로 커맨드 파일에서는 파일 이름이 그대로 이름이 됩니다. frontmatter는 파일의 **첫 줄**이 `---`로 시작할 때만 읽힙니다. 그 앞에 다른 내용이 있으면 `---`까지 본문으로 취급되고, YAML이 파싱되지 않으면 필드 없이 본문만 로드됩니다. 위 목록에 없는 필드 이름은 조용히 무시됩니다.

여러 줄 명령은 !`...` 대신 ` ```! ` 로 여는 코드 블록을 사용합니다.

````markdown
## Environment
```!
node --version
git status --short
```
````

* 깃 변경 사항을 읽어 커밋 메시지 만들기

.claude/commands/bash-command.md

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
disable-model-invocation: true
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

* 명령어 사용

```
> /bash-command

> /bash-command is running… 
  ⎿  Allowed 3 tools for this command

⏺ I can see there's a modification to README.md that adds documentation about bash
   command execution in command definitions. Let me create a commit for this
  change.

⏺ Bash(git add README.md && git commit -m "Add documentation for bash command
      execution in custom commands…)
  ⎿ [main 5fb2eb9] Add documentation for bash command execution in custom command
    s
     1 file changed, 22 insertions(+)


⏺ Bash(git status)
  ⎿  On branch main                                              
     Changes not staged for commit:
       (use "git add <file>..." to update what will be committed)
     … +4 lines (ctrl+o to expand)

⏺ Commit created successfully! The changes to README.md have been committed with
   the message documenting the new bash command execution feature.

   I notice there's also a modification to .claude/bash-command-log.txt, which
   appears to be a log file. Would you like me to commit that as well, or should we
    ignore log files?
```

(구버전 캡처)

깃 로그를 살펴보면 다음과 같이 로그가 생성된 것을 확인할 수 있습니다.

```bash
$ git log

commit 5fb2eb93632702846b8d7f1bf344cba7f97fa2fc (HEAD -> main)
Author: pjt3591oo <pjt3591oo@maskit.co.kr>
Date:   Thu Oct 30 04:48:28 2025 +0900

    Add documentation for bash command execution in custom commands
    
    Added Korean documentation explaining how to use !`bash command` syntax in command definition markdown files, with a practical example showing git-related commands.
    
    🤖 Generated with [Claude Code](https://claude.com/claude-code)
    
    Co-Authored-By: Claude <noreply@anthropic.com>

commit 72c2cda2ec614f5f3ef28e56262e9c6e44a1046a
Author: pjt3591oo <pjt3591oo@maskit.co.kr>
Date:   Thu Oct 30 04:47:24 2025 +0900

    first commit
```

* 실행 규칙과 실패 처리

주입된 명령은 세션의 현재 작업 디렉토리에서 실행되며, Bash 도구와 같은 타임아웃(기본 2분)과 출력 크기 제한을 적용받습니다. 항상 같은 경로를 가리켜야 한다면 `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PROJECT_DIR}` 변수를 사용해 경로를 씁니다.

* 명령이 실패하면 그 자리만 실패하는 것이 아니라 **명령어 실행 전체가 중단됩니다.** 클로드는 본문 아예 읽지 못합니다. 실패를 허용해야 하는 명령에는 `|| true`를 붙입니다.
* !`...` 구문은 줄 맨 앞이나 공백 뒤에 `!`가 올 때만 인식됩니다. `KEY=!`cmd``처럼 다른 문자 뒤에 붙으면 텍스트로 남습니다.
* 명령 출력은 순수 텍스트로 삽입되며, 다시 스캔되지 않습니다. 즉 출력이 새 !`...` 자리를 만들어도 확장되지 않습니다.
* 권한 확인은 승인 요청 없이 진행됩니다. deny 규칙과 겹치면 실행이 중단되므로, 자주 쓰는 명령은 `allowed-tools`로 미리 승인해 둡니다.
* Windows에서 bash가 없으면 PowerShell 도구로 실행됩니다. 사용할 셸을 직접 고르고 싶다면 frontmatter의 `shell` 값을 `bash` 또는 `powershell`로 지정합니다. Git Bash가 없는 Windows에서 `shell: bash`를 지정하면 실행 자체가 실패합니다.
* 설정의 `disableSkillShellExecution: true`로 이 기능을 끌 수 있습니다. 끌리면 명령 대신 `[shell command execution disabled by policy]`가 들어갑니다.

### 스킬 형식으로 만들기

같은 명령어를 스킬 형식으로 만들려면 디렉토리를 만들고 `SKILL.md`를 씁니다.

```sh
$ mkdir -p .claude/skills/summarize-changes
```

.claude/skills/summarize-changes/SKILL.md

```markdown
---
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above in two or three bullet points, then list any risks you notice such as missing error handling, hardcoded values, or tests that need updating. If the diff is empty, say there are no uncommitted changes.
```

디렉토리 이름이 `/summarize-changes` 명령이 됩니다. `description` 덕분에 "무엇을 바꿨지?"라고 물었을 때 클로드가 스스로 불러오고, `/summarize-changes`로 직접 호출해도 됩니다. 스킬은 이 외에도 보조 파일, `${CLAUDE_SKILL_DIR}`로 참조하는 스크립트, `context: fork` 실행을 지원합니다.

스킬 목록은 `/skills` 명령으로 확인합니다. `~/.claude/skills/`와 프로젝트의 `.claude/skills/`는 클로드 코드가 디렉토리를 지켜보므로 세션 도중에 파일을 고쳐도 다시 시작하지 않아도 반영됩니다. `/reload-skills`는 그 감시가 놓친 파일을 다시 읽어들일 때 씁니다. `--add-dir`로 추가한 디렉토리의 `.claude/commands/`는 지켜보지 않으므로, 그 안의 커맨드 파일을 고쳤을 때는 세션을 다시 시작해야 합니다.


### 네이티브 명령어 지원

클로드 코드는 네이티브 수준에서 기본 명령어를 제공합니다.

`/mcp`, `/plugin`, `/hooks`, `/agents`, `/skills` 처럼 세션과 설정을 다루는 명령어가 기본으로 포함되어 있습니다.

사용 가능한 명령어는 클로드 프롬프트에 `/`를 입력하면 현재 환경에서 사용 가능한 목록을 확인할 수 있습니다. `/` 뒤에 문자를 이어 입력하면 목록이 필터링되며, 오타가 있으면 후보만 표시되고 Enter로는 실행되지 않습니다.

최신 목록은 `/` 입력 시 표시되며, 각 명령의 상세한 설명은 공식 레퍼런스에서 확인합니다. https://code.claude.com/docs/en/commands

플랫폼, 플랜, 환경에 따라 일부 명령은 메뉴에 나타나지 않습니다. 예를 들어 `/desktop`은 macOS와 x64 Windows에서 Claude 구독으로 로그인한 경우에만 표시됩니다.

#### 주요 명령어 (v2.1.299 기준)

**세션 설정**

| 명령어 | 목적 |
| --- | --- |
| `/init` | 프로젝트에 `CLAUDE.md` 가이드 생성 |
| `/memory` | `CLAUDE.md` 편집, auto memory 켜기/끄기 |
| `/mcp` | MCP 서버 연결과 OAuth 인증 관리 |
| `/permissions` | 도구 권한 allow / ask / deny 규칙 관리 (별칭 `/allowed-tools`) |
| `/model` | 사용 모델 전환 및 기본값 저장 |
| `/effort` | 추론 강도 설정(`low` ~ `max`, `auto`) |
| `/config` | 테마, 모델, output style 등 설정 (별칭 `/settings`) |
| `/status`, `/usage` | 버전·모델·계정 상태, 세션 비용과 플랜 사용량 확인 |

**작업 중**

| 명령어 | 목적 |
| --- | --- |
| `/plan [설명]` | plan mode로 진입(예 `/plan fix the auth bug`) |
| `/context` | 컨텍스트 사용량을 시각화 |
| `/compact` | 대화를 요약하여 컨텍스트 확보 |
| `/clear` | 빈 컨텍스트로 새 대화 시작 (별칭 `/reset`, `/new`) |
| `/diff` | 작업 트리에서 변경된 내용 검토 |
| `/btw [질문]` | 대화 히스토리에 남지 않는 옆 질문 |

**병렬 실행**

| 명령어 | 목적 |
| --- | --- |
| `/tasks` | 현재 세션의 백그라운드 작업 조회·관리 (별칭 `/bashes`) |
| `/subtask <작업>` | 전체 대화를 이어받는 백그라운드 서브에이전트 실행 (v2.1.212+) |
| `/fork [프롬프트]` | 현재 대화를 새 백그라운드 세션으로 복사 (v2.1.212+) |
| `/background` | 세션 전체를 백그라운드 에이전트로 분리 (별칭 `/bg`) |
| `/batch <지시>` | 큰 변경을 5~30개 단위로 분해해 각 worktree에서 병렬 실행 |
| `/goal [조건\|clear]`, `/loop [간격] [프롬프트]` | 조건이 충족될 때까지 반복 실행 |

**결과 검토와 복구**

| 명령어 | 목적 |
| --- | --- |
| `/code-review [레벨] [--fix] [pr#]` | 현재 diff 또는 PR을 정확성 관점에서 검토 (별칭 `/review`) |
| `/security-review` | 현재 브랜치의 변경에서 보안 취약점 검토 |
| `/verify`, `/run` | 앱을 실제로 빌드·실행하여 변경이 의도대로 동작하는지 확인 |
| `/rewind` | 코드와 대화를 이전 체크포인트로 되돌리기 (별칭 `/checkpoint`, `/undo`) |
| `/resume [세션]` | 이전 대화로 복귀 (별칭 `/continue`) |
| `/branch [이름]` | 현재 대화를 분기해서 다른 방향 시도 |
| `/doctor` | 설치·설정 문제를 진단하고 수정 제안 (별칭 `/checkup`) |
| `/debug [설명]`, `/feedback` | 런타임 문제 진단, 버그 리포트 제출 |

**스킬·플러그인·훅 관리**

| 명령어 | 목적 |
| --- | --- |
| `/skills` | 사용 가능한 스킬 목록 조회·필터·가시성 토글 |
| `/reload-skills` | 디스크에서 변경된 스킬·커맨드 디렉토리 재스캔 |
| `/skill-doctor` | 스킬별 컨텍스트 비용과 사용 빈도 확인 (v2.1.252+) |
| `/plugin [하위 명령]` | 플러그인 마켓플레이스·설치·활성화 관리 |
| `/reload-plugins` | 재시작 없이 플러그인 변경 반영 (v2.1.260+) |
| `/hooks` | 훅 설정 **조회**(읽기 전용). 훅 추가는 settings.json 편집 또는 `/update-config`로 수행 |
| `/update-config [요청]` | 설정 변경을 자연어로 설명하면 해당 settings.json을 편집 |
| `/agents` | 서브에이전트 생성·관리를 클로드에게 요청하거나 `.claude/agents/`를 직접 편집(v2.1.197 이하에서는 대화형 UI) |

`/verify`, `/run`, `/doctor`, `/code-review`, `/batch`, `/loop`, `/update-config` 처럼 스킬로 표시되는 항목은 내장 스킬입니다. 직접 작성한 스킬과 동일한 방식으로 프롬프트를 클로드에게 전달하므로, 사용자 정의 커맨드와 같은 계층에서 다루면 됩니다.

#### 폐기된 명령어

| 명령어 | 상태 | 대체 |
| --- | --- | --- |
| `/pr-comments` | v2.1.91에서 제거 | 클로드에게 PR 댓글을 봐달라고 직접 요청 |
| `/vim` | v2.1.92에서 제거 | `/config` → Editor mode에서 전환 |
| `/ultraplan` | 제거 | plan mode(`/plan`) 사용 |

#### 참고: 구버전(v2.0.x 캡처) 프롬프트 모습

아래는 v2.0.x 시점에 `/`를 입력했을 때 표시되던 목록의 트랜스크립트입니다. 현재는 목록과 설명이 크게 바뀌었으므로 실제 목록은 `/` 입력 시 표시되는 것을 참고하거나 공식 레퍼런스를 확인해야합니다.

```
──────────────────────────────────────────────────────────────────────────────────────
> / 
──────────────────────────────────────────────────────────────────────────────────────
  /doctor                          Diagnose and verify your Claude Code installation
                                   and settings
  /exit (quit)                     Exit the REPL
  /export                          Export the current conversation to a file or
                                   clipboard
  /feedback (bug)                  Submit feedback about Claude Code
  /help                            Show help and available commands
  /hooks                           Manage hook configurations for tool events
  /ide                             Manage IDE integrations and show status
  /init                            Initialize a new CLAUDE.md file with codebase
                                   documentation
  /install-github-app              Set up Claude GitHub Actions for a repository
  /login                           Sign in with your Anthropic account
```


## hooks

Claude Code의 hooks는 도구 호출이나 세션 시작 같은 시점에 개입하는 훅이다. Claude Code가 특정 이벤트가 발생하면 settings.json에 정의해 둔 명령이나 HTTP 요청을 실행하고, 그 결과를 훅의 exit code와 stdout로 받아 다음 동작을 결정한다. Claude Code가 끝나기를 기다리는 훅도 있고, 기다리지 않고 계속 진행하는 훅도 있다.

Claude Code 2.x의 hooks에는 33개의 이벤트가 있다. 이 절에서는 먼저 settings.json에 훅을 정의하는 방법과 이벤트 전체를 표로 정리하고, 이어서 도구 호출과 세션 라이프사이클에서 가장 자주 쓰는 9개 이벤트를 살펴본다.

### 훅 이벤트 전체 목록

아래 표는 Claude Code 2.x가 제공하는 모든 훅 이벤트를 실행 시점 순서대로 정리한 것이다. `exit 2` 열은 훅이 exit code 2로 끝나면 그 동작을 차단할 수 있는지를 나타낸다.

| 이벤트 | 실행 시점 | exit 2로 차단 가능 |
| --- | --- | --- |
| `SessionStart` | 세션 시작, `startup`·`resume`·`clear`·`compact` | 아니오 |
| `Setup` | `--init-only`, `-p` 모드의 `--init`·`--maintenance`로 일회성 준비를 할 때 | 아니오 |
| `UserPromptSubmit` | 사용자가 프롬프트를 입력한 직후, Claude가 처리하기 전 | 예 |
| `UserPromptExpansion` | slash command가 프롬프트로 확장된 직후 | 예 |
| `PreToolUse` | 도구 실행 전 | 예 |
| `PermissionRequest` | 도구 실행에 권한 승인이 필요할 때 | 아니오 |
| `PermissionDenied` | auto mode의 classifier가 도구 호출을 거절했을 때 | 아니오 |
| `PostToolUse` | 도구가 성공적으로 실행된 후 | 아니오 |
| `PostToolUseFailure` | 도구가 실패한 후 | 아니오 |
| `PostToolBatch` | 한 턴의 도구 호출 묶음이 끝난 후 | 예 |
| `Notification` | Claude Code가 사용자에게 알림을 보낼 때 | 아니오 |
| `MessageDisplay` | assistant 메시지가 화면에 표시되기 직전 | 아니오 |
| `SubagentStart` | subagent가 시작할 때 | 아니오 |
| `SubagentStop` | subagent가 작업을 끝낼 때 | 예 |
| `TaskCreated` | `TaskCreate` 도구로 작업이 만들어질 때 | 예 |
| `TaskCompleted` | Claude가 `TaskUpdate`로 작업을 완료로 표시할 때 | 예 |
| `Stop` | 메인 에이전트가 응답을 끝낼 때 | 예 |
| `StopFailure` | API 오류 등으로 턴이 비정상적으로 끝날 때 | 아니오 |
| `TeammateIdle` | agent team의 팀원이 유휴 상태가 될 때 | 예 |
| `InstructionsLoaded` | `CLAUDE.md` 같은 instruction 파일이 로드될 때 | 아니오 |
| `ConfigChange` | settings 파일이 바뀔 때 | 예 |
| `CwdChanged` | 작업 디렉터리가 바뀔 때 | 아니오 |
| `DirectoryAdded` | 세션에 루트 디렉터리가 추가될 때 | 아니오 |
| `FileChanged` | 감시하는 파일이 생성·수정·삭제될 때 | 아니오 |
| `WorktreeCreate` | worktree가 만들어질 때 | 예 |
| `WorktreeRemove` | worktree가 제거될 때 | 예 |
| `PreCompact` | context 압축 전 | 예 |
| `PostCompact` | context 압축 후 | 아니오 |
| `PreModelSwitch` | 모델 전환 전 | 예 |
| `PostModelSwitch` | 모델 전환 후 | 아니오 |
| `Elicitation` | MCP 서버가 사용자 입력을 요청할 때 | 예 |
| `ElicitationResult` | MCP elicitation에 사용자가 응답한 후 | 예 |
| `SessionEnd` | 세션이 끝날 때 | 아니오 |

이벤트 이름은 대·소문자를 구분한다. `PreToolUse`를 `pretooluse`로 쓰면 훅이 실행되지 않는다.

차단 동작에는 예외가 몇 개 있다.

* `WorktreeCreate`와 `WorktreeRemove`는 exit 2가 아니라 0이 아닌 모든 exit code로 실패를 알린다.
* `ConfigChange`는 managed settings의 `policy_settings`가 바뀔 때 exit 2를 무시한다.
* `TaskCompleted`는 Claude가 `TaskUpdate` 도구로 작업을 완료할 때 exit 2를 무시한다. 대신 Claude Code가 자체적으로 판단한 완료에는 exit 2가 적용된다.
* `Stop`과 `SubagentStop`은 exit 2로 멈추되, stderr의 내용이 Claude에게 피드백으로 전달되어 대화가 계속될 수 있다.

### 기본 이벤트

실무에서 가장 자주 쓰는 9개 이벤트는 다음과 같다.

* `PreToolUse`: 도구가 실행되기 전에 호출한다. exit 2로 도구 실행을 막을 수 있다.
* `PostToolUse`: 도구가 성공한 뒤에 호출한다. 결과를 검사하거나 로그를 남기는 데 쓴다.
* `PostToolUseFailure`: 도구가 실패했을 때 호출한다.
* `PermissionRequest`: 권한 승인 화면을 띄우기 전에 훅이 대신 허용하거나 거절할 수 있다.
* `UserPromptSubmit`: 사용자가 입력한 프롬프트를 Claude가 보기 전에 검사하거나 정보를 덧붙인다.
* `Stop`: 메인 에이전트가 응답을 끝내려는 순간에 추가 작업을 지시할 수 있다.
* `SubagentStop`: subagent가 끝나는 지점에서 메인 에이전트와 같은 방식으로 동작한다.
* `SessionStart`: 세션이 시작될 때 환경 정보나 프로젝트 규칙을 context에 넣는다.
* `Notification`: Claude Code가 사용자에게 알림을 보내려는 순간에 호출한다.

`PreToolUse`와 `UserPromptSubmit`, `Stop`과 `SubagentStop`은 exit 2로 동작을 차단할 수 있고, `PostToolUse`와 `SessionStart`, `Notification`은 차단하지 않는다.

### 나머지 24개 이벤트

새로 추가된 이벤트는 성격에 따라 몇 무리로 나눌 수 있다.

* 세션과 설정: `Setup`, `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `DirectoryAdded`, `FileChanged`, `SessionEnd`, `StopFailure`
* 도구와 권한: `PermissionDenied`, `PostToolBatch`, `MessageDisplay`
* 멀티 에이전트: `SubagentStart`, `TaskCreated`, `TaskCompleted`, `TeammateIdle`
* context 관리: `PreCompact`, `PostCompact`, `PreModelSwitch`, `PostModelSwitch`
* 입력과 확장: `UserPromptExpansion`, `Elicitation`, `ElicitationResult`
* worktree: `WorktreeCreate`, `WorktreeRemove`

이 중 `FileChanged`와 `ConfigChange`는 훅 안에서 감시 목록을 관리할 때 유용하다. `PreCompact`와 `PostCompact`는 압축 전에 중요한 정보를 살려 두거나 압축 결과를 감사 로그로 남기는 데 쓴다. `PreModelSwitch`는 모델 전환을 막거나 전환 사실을 사용자에게 알리는 용도로 쓴다.

### 훅 추가하기

Claude Code 2.x에서 훅은 settings.json의 `hooks` 키 아래에 정의한다. 구조는 세 단계다.

1. 이벤트 이름을 키로 둔다.
2. matcher 그룹을 배열로 둔다. matcher는 어떤 도구·항목에 훅을 적용할지 고른다.
3. 각 그룹의 `hooks` 배열에 실제로 실행할 핸들러를 둔다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/validate_changes.py",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/validate_changes.py`는 표준 입력으로 JSON을 받아 검사하고, 조건에 걸리면 stderr에 이유를 쓰고 exit 2로 끝난다. 경로를 직접 실행하고 있으므로 스크립트에 실행 권한이 있어야 한다.

```python
#!/usr/bin/env python3
import json
import sys

data = json.load(sys.stdin)
path = data.get("tool_input", {}).get("file_path", "")

if "/generated/" in path:
    print(f"생성된 파일은 직접 수정할 수 없습니다: {path}", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
```

Claude Code는 이렇게 처리한다.

* exit 0: 통과. stdout는 debug 로그에 남고 화면에는 표시되지 않는다. `UserPromptSubmit`, `UserPromptExpansion`, `SessionStart`, `PostModelSwitch`에서만 plain text stdout가 Claude가 보는 context가 된다. exit 0으로 끝난 훅의 stderr는 Claude에게 전달되지 않는다.
* exit 2: 차단. stderr의 내용이 Claude에게 피드백으로 전달된다. JSON을 함께 출력해도 차단은 취소되지 않는다.
* 그 밖의 exit code: 차단하지 않고 실행 오류로 처리한다. Unix 관례와 달리 exit 1도 차단하지 않으므로 정책을 강제하려면 exit 2를 써야 한다. 화면에는 `Failed with non-blocking status code:`와 stderr의 첫 줄이 보인다.

`PostToolUse`처럼 이미 도구가 실행된 이벤트에서 Claude에게 경고를 보이고 싶다면 exit 0이 아니라 exit 2로 끝나야 stderr가 Claude에게 전달된다.

스크립트가 존재하지 않아 실행조차 못 하는 경우, 0이나 2가 아닌 exit code, 시간 초과, JSON 해석 실패도 실행 오류로 처리한다. `onFailure: "block"`을 붙인 command 훅은 이런 실행 오류를 그 이벤트의 exit 2와 같은 방식으로 차단한다. `Stop`, `SubagentStop`, `TaskCompleted`, `TeammateIdle` 훅과 `async: true`를 쓴 훅에는 효과가 없고, `PermissionRequest`에서는 거절로 처리된다. `onFailure`는 Claude Code 2.1.295 이후 버전에서 동작한다.

exit 2로 차단할 수 있는 이벤트는 위 표의 `exit 2로 차단 가능` 열이 `예`인 이벤트다. 이미 끝난 동작을 되돌릴 수 없는 이벤트는 exit 2로 차단하지 않는다.

도구 실행을 막는 가장 단순한 예는 이렇다.

```bash
#!/bin/bash
# .claude/hooks/block-rm.sh
input=$(cat)
command=$(jq -r '.tool_input.command' <<<"$input")

if [[ "$command" == rm* ]]; then
  echo "rm 명령은 허용하지 않습니다" >&2
  exit 2
fi

exit 0
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh"
          }
        ]
      }
    ]
  }
}
```

Claude Code가 이 훅을 실행하면 다음과 같이 보인다.

```text
PreToolUse:Bash hook error: [${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh]: Blocked: rm 명령은 허용하지 않습니다
```

Claude Code가 끝나기를 기다리지 않고 로그만 남기는 훅도 만들 수 있다. `async: true`를 붙이면 백그라운드에서 실행되고, 결과를 기다리지 않는다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "async": true,
            "command": "jq -r '\"\\(.hook_event_name) \\(.tool_input.command)\"' >> \"${CLAUDE_PROJECT_DIR}/.claude/bash-command-log.txt\""
          }
        ]
      }
    ]
  }
}
```

### matcher와 `if`

matcher는 이벤트마다 다른 값을 걸러낸다.

| 값 | 의미 |
| --- | --- |
| `"*"`, `""`, 또는 생략 | 항상 실행 |
| `"Bash"` | 정확히 일치 |
| `"Edit\|Write"` 또는 `"Edit, Write"` | 둘 중 하나 |
| `"mcp__memory__.*"` | 정규식 일치 |

글자와 숫자, `_`, `-`, 공백, `,`, `|`로만 이루어진 matcher는 정확한 문자열 비교다. 그 밖의 문자가 들어가면 JavaScript 정규식으로 평가한다. 정규식 경로는 부분 일치로 판정하므로 `Edit.*`는 `Edit`과 `NotebookEdit`에 모두 걸린다. 전체 일치가 필요하면 `^Edit$`처럼 감싼다. `FileChanged`와 `StopFailure`는 더 좁아서 `|`로만 대안을 나눈다.

| 이벤트 | matcher가 걸러내는 것 | 예 |
| --- | --- | --- |
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied` | 도구 이름 | `Bash`, `Edit\|Write`, `mcp__.*` |
| `SessionStart` | 세션 시작 방식 | `startup`, `resume`, `clear`, `compact`, `fork` |
| `Setup` | 실행한 CLI flag | `init`, `maintenance` |
| `SessionEnd` | 세션 종료 이유 | `clear`, `resume`, `logout`, `other` |
| `Notification` | 알림 종류 | `permission_prompt`, `idle_prompt`, `agent_needs_input` |
| `SubagentStart`, `SubagentStop` | agent 종류 | `general-purpose`, `Explore`, 직접 만든 agent 이름 |
| `PreCompact`, `PostCompact` | 압축을 일으킨 것 | `manual`, `auto` |
| `PreModelSwitch`, `PostModelSwitch` | 전환 대상 모델 이름 | `claude-opus-5`, `.*opus.*` |
| `ConfigChange` | 설정 파일 종류 | `user_settings`, `project_settings`, `local_settings`, `policy_settings` |
| `DirectoryAdded` | 디렉터리가 추가된 방식 | `slash_command`, `register_repo_root` |
| `FileChanged` | 감시할 파일 이름 | `.envrc\|.env` |
| `StopFailure` | 오류 종류 | `rate_limit`, `overloaded`, `server_error` |
| `InstructionsLoaded` | 로드된 이유 | `session_start`, `compact` |
| `UserPromptExpansion` | command 이름 | skill이나 command 이름 |
| `Elicitation`, `ElicitationResult` | MCP 서버 이름 | 설정해 둔 MCP 서버 이름 |
| `UserPromptSubmit`, `PostToolBatch`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `MessageDisplay`, `CwdChanged` | matcher 미지원 | 항상 실행 |

matcher가 지원되지 않는 이벤트에 `matcher`를 적어 두어도 조용히 무시된다. MCP 도구는 서버 이름만 적으면 걸리지 않는다. `mcp__memory`가 아니라 `mcp__memory__.*`처럼 써야 그 서버의 모든 도구에 걸린다.

`if`는 matcher보다 좁은 조건이다. 도구 관련 이벤트에서만 쓸 수 있고, 도구 이름과 인자를 한 번 더 걸러낸다.

```json
{
  "if": "Bash(git commit*)"
}
```

`Bash(git *)`는 `git commit -m "fix"`와 `git push`를 모두 걸러낸다. `Bash(git commit*)`는 `git commit`으로 시작하는 명령만 걸러낸다. `Edit(**/*.ts)`는 TypeScript 파일에 대한 편집만 걸러낸다. `if`는 도구가 실제로 실행되기 전에 판단하므로 권한 승인 화면을 거치는 도구에만 쓸 수 있다.

### 훅의 종류

핸들러에는 5가지 종류가 있다.

| `type` | 동작 | 주요 필드 |
| --- | --- | --- |
| `command` | 셸 명령이나 실행 파일을 돌린다 | `command`, `args`, `async`, `asyncRewake`, `shell`, `onFailure` |
| `http` | 지정된 URL로 JSON 요청을 보낸다 | `url`, `headers`, `allowedEnvVars` |
| `mcp_tool` | 이미 연결된 MCP 서버의 도구를 호출한다 | `server`, `tool`, `input` |
| `prompt` | 단일 LLM 평가로 판단한다 | `prompt`, `model` |
| `agent` | 도구까지 쓸 수 있는 하위 에이전트를 돌린다 | `prompt`, `model` |

`args`를 쓰면 셸을 거치지 않고 명령을 직접 실행한다. 인자를 변수로 안전하게 넘길 때 좋다. `prompt`와 `agent`는 `$ARGUMENTS`에 훅 입력 JSON이 들어간다. `agent`는 `maxTurns`로 반복 횟수를 제한할 수 있다.

`http` 훅은 훅 입력 JSON을 POST body로 보낸다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "http",
            "url": "http://localhost:8080/hooks/pre-tool-use",
            "headers": { "Authorization": "Bearer $MY_TOKEN" },
            "allowedEnvVars": ["MY_TOKEN"],
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

`headers`의 값은 `$VAR_NAME` 또는 `${VAR_NAME}` 형태로 환경 변수를 읽을 수 있고, `allowedEnvVars`에 적은 변수만 풀린다. 응답 본문은 command 훅의 stdout와 같은 JSON으로 처리한다. 2xx가 아니거나 응답을 읽지 못하면 차단할 수 있는 이벤트는 차단하고, 그렇지 않은 이벤트는 계속 진행한다.

### 시간 제한

기본 시간 제한은 600초(10분)다. `timeout` 필드(초 단위)로 바꿀 수 있다.

| 종류 | 기본값 |
| --- | --- |
| `command`, `http`, `mcp_tool` | 600초 |
| `prompt` | 30초 |
| `agent` | 60초 |

이벤트에 따라 기본값이 더 짧다. `UserPromptSubmit`, `PreModelSwitch`, `PostModelSwitch`는 30초, `MessageDisplay`는 10초다. `SessionEnd` 훅은 종료와 `/clear`, `/resume` 전환 때 1.5초 안에서 끝나야 한다. settings.json의 `timeout`을 길게 주면 이 한도가 함께 올라가지만 60초를 넘기지 못한다. `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` 환경 변수로도 조정할 수 있다. `async: true`를 붙인 command 훅은 시간 제한을 적용하지 않는다.

시간을 넘기면 차단할 수 있는 이벤트는 exit 2로 차단된 것과 같은 방식으로 처리되고, 그 밖의 이벤트는 계속 진행된다.

### JSON으로 응답하기

stdout에 JSON을 쓰면 exit code보다 세밀하게 동작을 제어할 수 있다. 모든 이벤트가 공통으로 읽는 필드는 이렇다.

| 필드 | 의미 |
| --- | --- |
| `continue: false` | Claude Code를 완전히 멈춘다. `stopReason`으로 이유를 남긴다 |
| `suppressOutput` | stdout 출력을 화면에만 숨긴다. Claude가 보는 내용에는 영향이 없다 |
| `systemMessage` | 사용자에게 보여주는 경고 |
| `terminalSequence` | 터미널 알림 같은 제어 문자를 보낸다 |

이벤트별 제어는 `hookSpecificOutput`에 넣는다. `hookEventName`은 반드시 함께 있어야 한다.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "데이터베이스 쓰기 작업은 허용하지 않습니다"
  }
}
```

`additionalContext`는 Claude의 context에 문자열을 덧붙인다. Claude Code가 이 텍스트를 system reminder로 감싸서 conversation에 삽입한다. 화면에는 채팅 메시지로 보이지 않는다.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "이 파일은 생성된 파일입니다. src/schema.ts를 고치고 bun generate를 실행하세요."
  }
}
```

10,000자를 넘는 텍스트는 세션 디렉터리의 파일로 저장되고, Claude에게는 파일 경로와 앞부분 2,000자 미리보기가 전달된다. 변하지 않는 규칙은 훅보다 `CLAUDE.md`에 쓰는 편이 낫다.

plain text stdout는 `UserPromptSubmit`, `UserPromptExpansion`, `SessionStart`, `PostModelSwitch`에서만 context에 추가된다. 다른 이벤트에서는 화면에만 표시되고 Claude는 볼 수 없다.

`PostToolUse`와 `Stop`, `UserPromptSubmit`, `ConfigChange`, `PreCompact`는 최상위의 `decision`과 `reason`으로 차단할 수 있다.

```json
{
  "decision": "block",
  "reason": "테스트가 통과하기 전에는 다음 단계로 진행할 수 없습니다"
}
```

`PreToolUse`는 `permissionDecision`으로 allow, deny, ask를 고를 수 있고, `updatedInput`으로 도구 인자를 바꿀 수도 있다. 여러 `PreToolUse` 훅이 다른 결정을 내리면 우선순위는 deny > defer > ask > allow다. `defer`는 `claude -p`로 실행한 도구 호출을 잠시 멈추고 호출한 쪽에서 답을 모아 다시 이어갈 때 쓰는 값으로, 대화 세션에서는 무시된다. `PostToolUse`는 `updatedToolOutput`으로 도구 결과를 대체한다. `Stop`과 `SubagentStop`은 exit 2로 멈추고 stderr의 내용을 Claude에게 되돌려 준다. Claude Code는 그 메시지를 user message로 추가하지 않고 Claude가 다음 턴에 읽을 수 있는 피드백으로 전달한다.

> **security**
>
> hooks는 settings.json에 정의한 명령을 사용자의 승인 없이 실행한다. settings.json을 편집할 수 있는 사람은 누구나 훅을 추가해 임의의 명령을 실행할 수 있다. settings.json을 편집할 권한이 없는 사람에게도 권한 승인 화면을 거치지 않는 훅을 허용할지 `permissions.defaultMode`로 결정할 수 있다. 자세한 내용은 permissions를 참고한다.

### skill과 subagent의 frontmatter

hooks는 settings.json 밖에서도 정의할 수 있다.

| 위치 | 적용 범위 |
| --- | --- |
| `~/.claude/settings.json` | 모든 프로젝트 |
| `.claude/settings.json` | 프로젝트, 팀과 공유 |
| `.claude/settings.local.json` | 프로젝트, git에 올리지 않음 |
| managed settings | 조직 전체, 우선 적용 |
| plugin의 `hooks/hooks.json` | plugin이 활성화된 동안 |
| skill의 frontmatter | 그 skill을 실행한 후 세션이 끝날 때까지 |
| subagent의 frontmatter | 그 subagent가 실행되는 동안 |

여러 위치에 정의한 훅은 합쳐서 실행된다. 같은 이벤트에 여러 훅이 걸리면 모두 실행되고, exit 2는 그중 하나가 2로 끝나면 적용된다. `disableAllHooks: true`를 settings.json에 두면 managed settings의 훅을 빼고 모두 끈다.

skill의 frontmatter는 다음과 같이 쓴다.

```yaml
---
name: "my-skill"
description: "Run database migrations"
hooks:
  PostToolUse:
    - matcher: "Bash"
      hooks:
        - type: "command"
          command: "echo 'Remember to run tests after migrations'"
---
```

skill frontmatter의 훅은 그 skill을 실행한 후 세션이 끝날 때까지 유지된다. `once: true`는 skill frontmatter에서만 적용되고, settings.json에서는 무시된다.

subagent의 frontmatter도 같은 형태다. subagent 안에서는 `Stop`을 `SubagentStop`으로 바꿔서 처리한다.

### /hooks로 훅 살펴보기

settings.json을 직접 편집하지 않고 확인하는 방법도 있다. 대화 세션에서 `/hooks`를 실행하면 현재 설정된 훅을 이벤트별로 읽기 전용으로 둘러볼 수 있다. 각 항목은 어디에 정의됐는지 표시하고 전체 정의를 보여주며, `All events`를 고르면 아직 훅이 없는 이벤트도 볼 수 있다.

`/hooks`는 훅을 추가하거나 고칠 수 있는 화면이 아니다. 훅을 추가하려면 settings.json을 편집하거나 `/update-config`를 사용한다. 이미 열려 있는 세션은 settings.json 파일을 감시하고 있으므로, 파일을 직접 고치면 다음 도구 호출부터 새 설정이 적용된다.

### 훅 호출 테스트

Claude Code가 훅을 실행하는 모습은 다음과 같다. 아래는 Claude Code 2.0.27에서 Claude Sonnet 4.5와 함께 확인한 기록으로, 이후 버전에서는 표시 문구가 다를 수 있다.

```text
> guard.sh 훅이 실행되나요
● Bash(/Users/kimbo/.claude/hooks/guard.sh)
  ⎿ 1
● 네, 방금 guard.sh 훅을 실행했습니다.
```

`PreToolUse` 훅이 차단한 경우는 다음과 같다.

```text
> rm build/
● PreToolUse:Bash hook error: [.../block-rm.sh]: Blocked: rm 명령은 허용하지 않습니다
● rm 명령이 훅에 의해 차단되었습니다.
```

Claude Code가 어떤 훅에 매칭되어 무엇을 실행했는지는 debug 로그에 기록된다. `claude --debug`로 실행하면 `~/.claude/debug/<session-id>.txt`에, `claude --debug-file <path>`로 실행하면 지정한 파일에 남는다.


## sub agents(별도의 컨텍스트를 가짐)

클로드 코드의 서브 에이전트는 사용자에 의해 명시적 또는 간접적으로 호출 가능하다.

각 서브 에이전트는 자신만의 컨텍스트 윈도우와 시스템 프롬프트, 도구 목록, 모델을 가진다. 서브 에이전트가 수행한 도구 호출과 중간 탐색 결과는 메인 대화에 들어오지 않고 최종 결과만 전달된다. 그래서 코드를 넓게 읽는 작업처럼 컨텍스트를 더럽히는 일을 분리할 때 유용하다.

### 에이전트 정의

서브 에이전트는 `.claude/agents/`(프로젝트) 또는 `~/.claude/agents/`(사용자) 아래에 마크다운 + YAML frontmatter 형식으로 정의한다.

두 디렉터리는 재귀적으로 스캔된다. `agents/review/`, `agents/research/`처럼 하위 폴더로 정리해도 되고, 하위 폴더 경로는 에이전트를 식별하거나 호출하는 방식에 영향을 주지 않는다. 식별은 오직 `name` 필드로 결정된다.

디스크에서 파일을 추가하거나 수정하면 몇 초 안에 감지되어 다음 위임부터 반영된다. 세션을 다시 시작할 필요는 없다. 다만 `--add-dir`로 추가한 폴더의 `.claude/agents/`는 감지하지 않으므로 재시작해야 한다.

#### 최소 예제

frontmatter의 필수 필드는 `name`과 `description` 두 개뿐이다.

```markdown
---
name: code-reviewer
description: 코드 변경을 검토하고 개선점을 제안한다. 코드를 작성하거나 수정한 뒤에 사용한다.
---

당신은 코드 리뷰 전문가다.

## Instructions
각 문제를 발견하면 문제를 설명하고, 현재 코드를 보여주고, 개선 버전을 제시한다.

## Best Practices
보안, 성능, 가독성 순으로 검토한다.

## Examples
[작업 예시]
```

`---`가 파일의 첫 줄이 아니거나, `name`이 없거나, `name`이 `:`를 포함하거나 256자를 넘으면 그 파일은 보고 없이 건너뛰어진다.

#### frontmatter 필드

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `name` | 예 | 최대 256자의 고유 식별자. `code-reviewer`, `reviewer-v2` 같은 형태. `:`는 플러그인 스코프용이므로 사용할 수 없다. 파일명은 `name`과 달라도 된다 |
| `description` | 예 | 어떤 상황에서 이 에이전트에 위임해야 하는지 |
| `tools` | 아니오 | 쉼표로 구분한 도구 목록(`Read, Grep, Bash`) 또는 YAML 리스트. 생략하면 서브 에이전트에 허용된 모든 도구를 상속한다 |
| `disallowedTools` | 아니오 | 상속된 목록에서 제거할 도구. `tools`와 같은 형식 |
| `model` | 아니오 | `sonnet`, `opus`, `haiku`, `fable` 별칭, `claude-opus-5-5` 같은 전체 모델 ID, 또는 `inherit`. 생략하면 서브 에이전트 모델 순서에 따라 결정된다 |
| `permissionMode` | 아니오 | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`(`manual`은 `default`의 별칭). 플러그인 에이전트에서는 무시된다 |
| `maxTurns` | 아니오 | 중단하기 전까지의 최대 에이전틱 턴 수. 한계에 도달하면 부분 결과로 반환되고 이어서 재개할 수 있다 |
| `skills` | 아니오 | 시작 시 컨텍스트에 미리 채우는 스킬. 설명이 아니라 전체 내용이 주입된다 |
| `mcpServers` | 아니오 | 이 에이전트만 사용할 MCP 서버. 이미 설정된 서버 이름 또는 인라인 정의. 플러그인 에이전트에서는 무시된다 |
| `hooks` | 아니오 | 이 에이전트에만 적용되는 라이프사이클 훅. 플러그인 에이전트에서는 무시된다 |
| `memory` | 아니오 | 영속 메모리 범위: `user`, `project`, `local`. 세션을 넘어 학습하도록 한다 |
| `background` | 아니오 | `true`로 두면 Claude가 foreground 실행을 요청해도 항상 백그라운드에서 실행된다 |
| `omitClaudeMd` | 아니오 | `true`로 두면 user, project, local CLAUDE.md 없이 시작한다. v2.1.271 이상 |
| `effort` | 아니오 | `low`, `medium`, `high`, `xhigh`, `max`. 세션 effort를 덮어쓰되 `CLAUDE_CODE_EFFORT_LEVEL`보다는 낮다 |
| `isolation` | 아니오 | `worktree`로 두면 임시 git worktree에서 실행한다. 변경이 없으면 자동 정리된다 |
| `color` | 아니오 | 작업 목록과 트랜스크립트에 표시할 색상: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `initialPrompt` | 아니오 | `--agent`로 메인 세션 에이전트로 실행될 때 첫 user 턴으로 자동 제출된다 |
| `experimental` | 아니오 | 실험 옵션 맵. `cacheTtl: 5m` 또는 `1h`로 프롬프트 캐시 수명을 정한다. v2.1.248 이상 |

여러 단어로 된 필드명은 `maxTurns`, `disallowedTools`처럼 camelCase로 정확히 써야 한다. Claude는 인식하지 못하는 필드를 오류 없이 무시한다.

`tools`에는 `Read`, `Write`, `Edit`, `Grep`, `Glob`, `Bash`, `WebFetch`, `WebSearch`, `Agent`와 MCP 도구를 쓸 수 있다. MCP 서버 전체는 `mcp__github`처럼 지정한다. 스킬을 미리 채우려면 `tools`에 `Skill`을 나열하지 말고 `skills` 필드를 사용한다.

`Agent(...)` 허용 목록 문법은 `claude --agent`로 메인 스레드가 된 에이전트에만 적용된다.

```claude
tools: Agent(worker, researcher), Read, Bash
```

서브 에이전트 정의 안에서 `Agent`를 나열하면 중첩 한계 안에서 스스로 서브 에이전트를 생성할 수 있지만, 괄호 안의 타입 목록은 무시된다. 특정 에이전트만 막고 나머지는 허용하려면 `permissions.deny`를 사용한다.

```json
"permissions": { "deny": ["Agent(Explore)"] }
```

### 스코프와 우선순위

같은 `name`을 정의한 파일이 여러 곳에 있으면 다음 순서로 결정된다.

| 스코프 | 적용 범위 | 우선순위 |
| --- | --- | --- |
| managed settings | 조직 전체 | 1 (최우선) |
| `--agents` CLI 플래그 | 현재 세션 | 2 |
| `.claude/agents/` | 현재 프로젝트 | 3 |
| `~/.claude/agents/` | 내 모든 프로젝트 | 4 |
| 플러그인의 `agents/` | 플러그인을 설치한 세션 | 5 |

`.claude/agents/`는 현재 작업 디렉터리에서 repository 루트까지 올라가며 모두 스캔되고, 같은 `name`이 여러 중첩 디렉터리에 있으면 작업 디렉터리에서 가장 가까운 정의가 쓰인다.

플러그인의 `agents/`도 재귀적으로 스캔되지만, 하위 폴더가 식별자의 일부가 된다. 플러그인 `my-plugin`의 `agents/review/security.md`는 `my-plugin:review:security`로 등록된다.

플러그인 에이전트는 보안 이유로 `hooks`, `mcpServers`, `permissionMode` 필드를 지원하지 않는다.

### 내장 서브 에이전트

사용자가 정의하지 않아도 Claude는 다음과 같은 내장 서브 에이전트를 사용할 수 있다.

| 에이전트 | 모델 | 용도 |
| --- | --- | --- |
| `Explore` | 모델 순서를 따름 | 읽기 전용 코드 탐색. CLAUDE.md와 git status 스냅샷 없이 시작한다 |
| `Plan` | 모델 순서를 따름 | plan 모드에서의 탐색. CLAUDE.md와 git status 스냅샷 없이 시작한다 |
| `general-purpose` | 모델 순서를 따름 | 탐색과 수정이 함께 필요한 복잡한 다단계 작업 |
| `claude` | 모델 순서를 따름 | 더 특화된 에이전트에 맞지 않는 작업을 받는 catch-all |
| `statusline-setup` | Sonnet | `/statusline` 실행 시 |
| `claude-code-guide` | Haiku | Claude 코드 기능에 대한 질문 |

내장 에이전트를 제한하는 방법:

- 특정 내장 타입만 막으려면 `permissions.deny`에 `Agent(Explore)`처럼 추가한다.
- 모든 서브 에이전트 위임을 막으려면 `Agent` 도구 자체를 deny한다.
- `Explore`와 `Plan`만 제거하려면 `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` (v2.1.198 이상).
- headless와 Agent SDK에서는 `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`로 모든 내장 타입을 제거한다.

`/agents`를 실행하면 Claude에게 요청하거나 `.claude/agents/`, `~/.claude/agents/`를 직접 편집하라는 안내가 출력된다. v2.1.197 이하에서는 Running, Library 탭이 있는 대화형 위저드가 열렸다.

### 에이전트 호출

에이전트는 직접 호출과 간접 호출 모두 가능하다.

간접 호출은 특별한 문법 없이 이름으로 요청하면 Claude가 위임한다.

```claude
> test-runner 에이전트를 사용해 실패한 테스트를 고쳐줘
> code-reviewer 에이전트가 최근 변경을 검토하게 해줘
# → code-reviewer 자동 활성화
```

직접 호출은 `@`로 정확히 지정한다. `@`를 입력하고 typeahead에서 파일을 @-mention 하듯 에이전트를 고르면 Claude의 판단 없이 그 에이전트가 실행된다.

```claude
> @"code-reviewer (agent)" auth 변경 부분을 봐줘
```

mention을 직접 타이핑해도 된다. 로컬 에이전트는 `@agent-<name>`, 플러그인 에이전트는 스코프 이름 앞에 `@agent-`를 붙인다.

```claude
> @agent-code-reviewer auth 변경 부분을 봐줘
> @agent-my-plugin:code-reviewer auth 변경 부분을 봐줘
```

이 형식으로 타이핑하는 동안 typeahead에는 파일 후보만 보이지만, 제출하면 에이전트 mention으로 해석된다. @-mention은 어떤 에이전트를 실행할지 결정할 뿐이고, 에이전트가 받는 작업 프롬프트는 Claude가 전체 메시지를 보고 작성한다.

세션 전체를 한 에이전트로 실행할 수도 있다.

```bash
claude --agent code-reviewer
```

서브 에이전트는 Agent 도구[^agent-tool]로 생성된다.

### 백그라운드 실행

fork 모드가 켜져 있으면 Claude가 생성하는 서브 에이전트는 기본적으로 백그라운드에서 실행된다. foreground로 실행되는 경우는 다음과 같다.

- 에이전트 정의에 `background: true`가 없고 Claude가 foreground 실행을 요청한 경우
- agent team의 teammate가 생성한 서브 에이전트
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`로 모든 세션에서 foreground로 고정된 경우

에이전트 정의에 `background: true`를 두면 Claude가 foreground를 요청해도 항상 백그라운드에서 실행된다.

```markdown
---
name: repo-auditor
description: 큰 저장소를 훑어 발견한 것을 보고한다
background: true
model: sonnet
---
```

백그라운드 서브 에이전트는 내가 계속 작업하는 동안 병렬로 실행된다. 권한 승인이 필요한 도구 호출을 만나면 어떤 서브 에이전트가 요청하는지 이름과 함께 메인 세션에 승인이 나타난다. 승인하면 계속 진행하고, Esc를 누르면 그 서브 에이전트를 중단하지 않고 그 도구 호출만 거부할 수 있다.

실행 중인 작업은 Ctrl+B로 백그라운드로 옮긴다. `/tasks`로 실행 중인 서브 에이전트 목록을 열고, 행을 선택하면 그 에이전트의 트랜스크립트를 볼 수 있다. v2.1.242 이상에서는 각 행에 실행 모델과 effort 수준이 표시된다.

현재 대화를 복사해서 옆 작업용 서브 에이전트를 만들려면 `/subtask`를 사용한다.

```claude
> /subtask parser 변경 사항에 대한 단위 테스트 초안 작성
```

v2.1.212 이상에서 `/subtask`, v2.1.161부터 v2.1.211까지는 `/fork`이다.

서브 에이전트가 스스로 서브 에이전트를 생성하는 중첩은 기본적으로 메인 대화 아래 3계층까지 허용된다. `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`로 바꾸고, `1`로 두면 중첩을 끈다. 한 서브 에이전트만 위임을 막으려면 그 정의의 `tools`에서 `Agent`를 빼거나 `disallowedTools`에 넣는다.

동시 실행은 기본적으로 20개까지 허용된다. 넘기면 `Concurrent subagent limit reached` 오류가 나고 Claude는 재시도하지 않는다. `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`로 조정할 수 있다 (v2.1.217 이상).

[^agent-tool]: Agent 도구(v2.1.63 이전에는 Task 도구). v2.1.63에서 Task 도구가 Agent로 이름이 바뀌었고, 설정과 에이전트 정의에 남은 `Task(...)` 표기는 별칭으로 계속 동작한다.


## skill(별도의 컨텍스트를 가지지 않음)

Claude Code 2.1.299 기준. 스킬은 이름·설명·본문·지원 파일로 이루어진 재사용 가능한 지침이다. 클로드가 매번 같은 설명을 하지 않아도 되도록, 한 번 적어두고 계속 쓰게 하는 기능이다.

스킬은 기본에서 현재 대화의 컨텍스트 안에서 동작한다. 별도의 컨텍스트를 만들지 않기 때문에, 스킬이 로드되면 그 대화의 컨텍스트 크기가 늘어난다. 컨텍스트를 분리해서 쓰려면 `context: fork`를 지정한다.

### 스킬의 구조

스킬은 이름이 들어간 폴더 하나와 그 안의 `SKILL.md`로 이루어진다.

```
.claude/skills/skill-name/
├── SKILL.md            # 필수: 지침 + frontmatter
├── examples.md         # 선택: 예시
├── reference.md        # 선택: 상세 문서
└── scripts/            # 선택: 실행 스크립트
```

`SKILL.md`는 YAML frontmatter와 마크다운 본문으로 이루어진다. frontmatter의 `description`이 스킬을 언제 쓸지 결정하는 부분이고, 본문은 스킬이 실제로 실행될 때만 컨텍스트에 로드된다.

```markdown
---
name: skill-name
description: 이 스킬이 무엇인지, 어떤 상황에서 사용해야 하는지 한 문장으로 적는다.
---

스킬이 실행될 때 이 본문이 컨텍스트에 로드됩니다.
```

frontmatter는 `SKILL.md` 첫 줄부터 시작해야 한다. 앞에 빈 줄이나 주석이 있으면 구분하지 못한다.

`name`은 생략할 수 있다. 생략하면 폴더 이름이 스킬 이름이 된다. `description`도 생략할 수 있지만, 생략하면 클로드가 언제 이 스킬을 써야 할지 판단할 수 없다. 자동 생성된 스킬이 아니라면 반드시 적는다.

### frontmatter 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `name` | 아니오 | `/` 메뉴에 나타나는 이름. 생략하면 폴더 이름이 된다. |
| `description` | 권장 | 무엇을 하는 스킬인지, 언제 쓰는지. 클로드는 이 텍스트로 사용을 판단한다. 생략하면 본문의 첫 줄을 쓴다. |
| `when_to_use` | 아니오 | `description` 뒤에 덧붙이는 호출 조건. 예시 요청이나 트리거 문구를 적는다. |
| `argument-hint` | 아니오 | 자동완성에서 기대하는 인자 모양을 보여준다. 예: `[issue-number]`, `[filename] [format]`. |
| `arguments` | 아니오 | 이름으로 받는 인자 목록. `arguments: [issue, branch]`로 선언하면 본문에서 `$issue`, `$branch`로 받는다. |
| `disable-model-invocation` | 아니오 | `true`로 두면 클로드가 자동으로 로드하지 않는다. `/이름`으로만 부른다. 서브 에이전트에 미리 로드되는 것도 막는다. |
| `user-invocable` | 아니오 | `false`로 두면 `/` 메뉴에서 숨고 클로드만 부른다. |
| `allowed-tools` | 아니오 | 이 스킬이 호출된 턴에서 권한 확인 없이 쓸 수 있는 도구. 다음 메시지를 보내면 승인은 풀린다. |
| `disallowed-tools` | 아니오 | 이 스킬이 동작하는 동안 클로드에게서 제거할 도구. |
| `model`, `effort` | 아니오 | 이 스킬이 동작하는 동안만 모델과 effort를 바꾼다. |
| `context` | 아니오 | `fork`로 두면 서브 에이전트 컨텍스트에서 실행한다. |
| `agent` | 아니오 | `context: fork`를 지정한 스킬이 어떤 서브 에이전트를 쓸지 정한다. |
| `background` | 아니오 | `context: fork`에서 `false`로 두면 결과를 같은 턴에서 기다린다. 기본은 `true`. 2.1.218 이후. |
| `paths` | 아니오 | glob 패턴으로 이 스킬이 자동 활성화되는 조건을 제한한다. 설정한 동안은 패턴과 일치하는 파일을 다룰 때만 클로드가 자동으로 로드한다. |
| `shell` | 아니오 | 스킬 본문의 `` !`command` ``와 ` ```! ` 블록을 실행할 셸. `bash`(기본) 또는 `powershell`. PowerShell 도구가 켜져 있으면 `powershell`로 지정한 명령이 PowerShell로 실행된다. |
| `hooks` | 아니오 | 스킬이 호출될 때 등록하고 이후 세션 동안 유지하는 hook. |
| `metadata` | 아니오 | 직접 읽는 임의 YAML 값. Claude Code는 동작에 쓰지 않는다. 맵이 아니면 버린다. |
| `license` | 아니오 | 스킬에 적용되는 라이선스. Agent Skills 규격의 필드이며 Claude Code는 받아들이되 별도로 동작하지 않는다. |
| `compatibility` | 아니오 | 스킬의 환경 요구 사항을 적는 500자 이내 문자열. Agent Skills 규격의 필드이며 Claude Code는 받아들이되 별도로 동작하지 않는다. |

`description`과 `when_to_use`를 합친 텍스트는 스킬 목록에서 1,536자로 잘린다. 핵심 사용 사례를 앞에 두는 이유다.

필드 이름은 표에 있는 그대로 정확히 써야 한다. 하이픈도 포함이다. Claude Code는 인식하지 못하는 필드를 오류 없이 무시한다. `description`을 `descriptions`로 잘못 적으면 스킬은 로드되지만 그 값은 쓰이지 않는다. frontmatter는 여는 `---`가 파일의 첫 줄일 때만 읽는다. 앞에 다른 내용이 있으면 `---`를 포함해 파일 전체를 스킬 본문으로 취급한다.

`disable-model-invocation`과 `user-invocable` 같은 부울 필드는 `true`/`false` 외에 `yes`, `no`, `on`, `off`, `1`, `0`도 대소문자 없이 받아들인다. v2.1.218 이전에는 `true`와 `false`만 부울로 인식했다. `context` 값은 `fork`만 인식한다.

`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`는 Agent Skills 규격이 인정하는 필드다. Claude Code 안에서는 위 표의 모든 필드를 쓰지만, claude.ai에 올리거나 Skills API로 패키징할 때는 이 여섯 개만 허용된다. `argument-hint`를 넣으면 `Unexpected key(s) in SKILL.md frontmatter: argument-hint` 오류로 패키징이 실패한다.

### 스킬을 두는 위치와 이름 우선순위

| 위치 | 경로 | 어디에 로드되는가 |
|------|------|------|
| enterprise | managed settings 디렉터리의 `.claude/skills/<skill-name>/SKILL.md` | 조직이 배포한 모든 사용자의 모든 프로젝트 |
| personal | `~/.claude/skills/<skill-name>/SKILL.md` | 이 머신의 모든 프로젝트. Cowork·cloud 세션에서는 로드되지 않는다 |
| project | `<project>/.claude/skills/<skill-name>/SKILL.md` | 이 저장소의 세션. 팀과 함께 쓰려면 커밋한다 |
| nested | `<subdir>/.claude/skills/<skill-name>/SKILL.md` | `<subdir>`이나 그 아래에서 시작한 세션. 위쪽에서 시작한 세션은 그 아래 파일을 건드릴 때 로드한다 |
| 추가 디렉터리 | `--add-dir`로 지정한 디렉터리의 `.claude/skills/` | 그 세션만 |
| plugin | `<plugin>/skills/<skill-name>/SKILL.md` | 플러그인을 켠 모든 프로젝트. `/plugin-name:skill-name`로 이름이 구분된다 |
| claude.ai 계정 | claude.ai 계정에 켜둔 스킬 | Cowork·cloud 세션과 그 계정으로 로그인한 터미널 세션 |
| 번들 스킬 | Claude Code와 함께 설치된다 | 모든 세션 |

프로젝트 스킬은 Claude Code를 시작한 디렉터리의 `.claude/skills/`와, 저장소 루트까지 모든 상위 디렉터리의 `.claude/skills/`에서 로드된다. `packages/frontend/`에서 시작해도 루트의 스킬을 그대로 쓴다. `/cd`로 세션을 옮기면(2.1.246 이후) 새 디렉터리의 프로젝트 스킬이 추가된다.

시작 지점보다 아래에 있는 `.claude/skills/`는 시작할 때 로드되지 않고, 클로드가 그 하위 디렉터리의 파일을 처음 읽거나 편집할 때 로드되어 세션 끝까지 유지된다. 그 전까지는 `/` 메뉴에 나타나지 않으므로 이름으로 부를 수 없다. 먼저 로드하려면 `/add-dir`로 그 하위 디렉터리를 지정한다(2.1.257 이후).

`anthropic-skills`는 claude.ai에서 동기화되는 스킬이 예약한 이름이다. plugin 밖에서 `anthropic-skills`나 `anthropic-skills:`로 시작하는 스킬 폴더·커맨드 파일은 로드되지 않고, 무엇을 고쳐야 하는지 알려주는 시작 안내가 표시된다. `~/.claude/skills/synced/`는 claude.ai에서 내려받는 스킬이 자리로 쓰는 폴더이므로 같은 이름의 스킬을 직접 두지 않는 편이 좋다.

스킬 폴더 자체를 plugin으로 쓰기도 한다. 스킬 폴더에 `.claude-plugin/plugin.json`을 추가하면 `<name>@skills-dir`라는 plugin으로 로드되어 agent·hook·MCP server까지 함께 묶을 수 있다. 프로젝트의 `.claude/skills/`에서는 workspace trust를 승인한 뒤에만 된다.

같은 이름의 스킬이 여러 곳에 있으면 어디서 왔는지가 `/이름`이 무엇을 실행할지 결정한다. enterprise가 personal보다, personal이 project보다 우선한다. `~/.claude/skills/deploy/`와 프로젝트의 `.claude/skills/deploy/`가 모두 있으면 `/deploy`는 personal 스킬을 실행한다.

내장 명령이나 번들 스킬과 이름이 같으면 내 스킬이 그 명령을 대체하되 별칭까지는 대체하지 않는다. 프로젝트에 `code-review` 스킬을 두면 `/code-review`는 내 스킬이 되지만 번들 별칭 `/review`는 여전히 번들 스킬을 실행한다. `usage` 스킬을 두면 `/usage`는 대체되지만 내장 별칭 `/cost`는 그대로 내장 명령이다.

`.claude/commands/deploy.md`와 `.claude/skills/deploy/SKILL.md`가 모두 있다면 `SKILL.md`가 실행된다. plugin 스킬은 `/plugin-name:skill-name`로 이름이 구분되므로 같은 이름의 사용자·프로젝트 스킬과 충돌하지 않고 둘 다 로드된다. 루트에 `deploy`가 있고 `apps/web/.claude/skills/`에도 `deploy`가 있으면 두 스킬이 모두 살아남는다. `/deploy`는 루트의 스킬을 실행하고, `/apps/web:deploy`는 nested 스킬을 따로 실행한다.

스킬 폴더는 symlink로 두어도 된다. enterprise·personal·project 위치에 둔 `<skill-name>`이 디스크의 다른 폴더를 가리키는 symlink일 수 있고, 여러 위치가 같은 대상을 가리켜도 스킬은 한 번만 로드된다. monorepo에서 공통 스킬 폴더를 공유할 때 쓰는 방법이다.

### 사용 가능 스킬 목록 조회

스킬 목록은 클로드에게 요청하지 않고 `/skills`로 직접 본다.

```claude
> /skills
```

`/skills`는 현재 세션에서 사용할 수 있는 스킬을 출처별로 정리해 보여준다. plugin에서 온 스킬, 사용자·프로젝트 폴더의 스킬, 내장 번들 스킬이 나뉘어 표시된다. 목록에는 이름과 설명만 표시되고, 본문은 스킬이 실행될 때까지 컨텍스트를 차지하지 않는다.

| 조작 | 결과 |
|------|------|
| 텍스트 입력 | 이름·설명·출처로 목록을 필터한다 |
| `t` | 토큰 수 순으로 정렬한다 |
| `Space`, `Enter` | 그 스킬이 클로드와 `/` 메뉴에 보이는 상태를 바꾼다 |
| `Esc` | 저장하고 닫는다 |

plugin이 준 스킬, frontmatter에 `disable-model-invocation: true`를 둔 스킬, managed settings나 `--settings`로 지정한 파일에 `skillOverrides` 항목이 있는 스킬은 상태를 바꿀 수 없다.

`Space`로 상태를 바꾸면 `.claude/settings.local.json`의 `skillOverrides`에 저장되어 다음 세션에서도 그대로 적용된다. 설정 파일에서 직접 지정해도 된다.

```json
{
  "skillOverrides": {
    "my-skill": "name-only",
    "legacy-helper": "off",
    "notes-helper": "user-invocable-only"
  }
}
```

`name-only`는 클로드에게 이름만 보이고 `/` 메뉴에는 그대로 남는다. `user-invocable-only`는 클로드에게 보이지 않고 `/` 메뉴와 `/이름` 호출만 가능하다. `/skills` 화면에서는 이 상태를 `user-only`라고 표시한다. `off`는 양쪽에서 모두 사라진다. 목록에 없는 스킬은 `on`으로 취급한다. `off`는 터미널의 `/` 메뉴뿐 아니라 Remote Control 클라이언트와 Agent SDK에 광고되는 명령 목록에서도 스킬을 지우고, 숨긴 스킬을 전체 이름으로 부르면 실행되는 대신 `skillOverrides` 오류가 돌아온다.

frontmatter를 편집하고 싶지 않은 스킬, 예를 들어 팀 저장소에 커밋된 스킬을 이렇게 제어한다. plugin이 준 스킬에는 `skillOverrides`가 적용되지 않으므로 `/plugin`에서 관리한다.

user·project·local 설정에서는 항목을 스킬 이름과만 비교한다. `review` 항목은 `review`라는 이름의 스킬에만 적용되고, 번들 `/code-review`의 별칭 `/review`에는 적용되지 않는다. managed settings나 `--settings`로 지정한 파일에서는 별칭으로 지정한 항목도 그 별칭 뒤의 스킬에 적용된다(2.1.260 이후). 단 별칭으로는 가시성을 좁히는 방향만 되고 넓힐 수는 없고, 같은 managed settings에 스킬 본 이름 항목도 있으면 그 항목이 우선한다.

스킬을 고쳤을 때 다시 시작해야 하는지는 신경 쓸 필요가 없다. 세션은 `SKILL.md`가 바뀐 것을 감지해서 다음 요청부터 새 내용을 사용한다. `.claude/skills/`나 `~/.claude/skills/`, `--add-dir`로 지정한 디렉터리의 `.claude/skills/`에 새 스킬을 추가해도 다음 요청에서 사용할 수 있다. 다만 세션이 시작했을 때 그 스킬 디렉터리 자체가 없었다면 `/reload-skills`로 다시 스캔해야 하고, 그 디렉터리에서 이후에 고칠 때마다 다시 실행해야 한다.

```claude
> /reload-skills
```

`/reload-skills`는 스킬과 커맨드 디렉터리를 다시 스캔해서 세션 도중에 디스크에 추가되거나 바뀐 스킬을 다시 시작하지 않고 사용할 수 있게 한다. 사용할 수 있는 스킬 수와 몇 개가 추가·삭제됐는지 알려준다. 세션이 이미 감지하고 있는 스킬의 `SKILL.md`를 고친 경우에는 필요 없다.

감지는 `SKILL.md` 텍스트만 커버한다. 스킬 폴더가 plugin이기도 하다면 `hooks/`, `.mcp.json`, `agents/`, `output-styles/`의 변경은 `/reload-plugins`로 반영해야 한다.

스킬이 얼마나 쓰이는지, 얼마만큼 컨텍스트를 차지하는지는 `/skill-doctor`로 본다.

```claude
> /skill-doctor
```

`/skill-doctor`는 세션의 스킬을 목록으로 정리해서 각각의 컨텍스트 비용과 사용 빈도를 보여주고, 한 번도 호출되지 않은 스킬을 표시하고 끌 위치를 알려준다. 비용이 큰 순서부터 정리하면 된다. 대화형 세션에서는 `/plugin` 관리 화면의 Stats 탭에 열리고, `-p` 같은 비대화 모드에서는 텍스트로 출력된다. 번들 스킬과 enterprise 스킬은 보고서에 포함되지 않는다. Claude Code 2.1.252 이후 버전에서 사용할 수 있다.

스킬 목록이 차지하는 크기가 궁금하다면 `/doctor`가 목록의 컨텍스트 비용과 가장 큰 기여 항목을 추정해 알려준다.

### 스킬 이름으로 호출하기

스킬은 슬래시 커맨드와 똑같이 `/`로 부른다.

```claude
> /pdf
> /pdf Convert report.pdf to markdown
```

`.claude/skills/pdf/SKILL.md`는 `/pdf`로 실행된다. 명령 이름은 스킬 폴더 이름에서 오고, frontmatter의 `name`으로 바꿀 수 있다. `.claude/skills/deploy-staging/SKILL.md`는 `/deploy-staging`이고, `name: deploy`를 적으면 `/deploy`로도 부를 수 있다. plugin의 스킬은 plugin 이름이 앞에 붙는다. `my-plugin/skills/review/SKILL.md`는 `/my-plugin:review`다. `.claude/commands/frontend/component.md`처럼 하위 폴더에 둔 커맨드 파일은 `/frontend:component`가 된다.

`/`를 입력하면 자동완성에 스킬, 슬래시 커맨드, plugin 커맨드가 함께 나타난다. 목록이 길다면 검색어로 좁히면 된다. 자동완성에는 frontmatter의 `argument-hint`가 기대하는 인자 모양으로 표시된다.

스킬 이름을 어디에 쓰느냐가 실행을 결정한다. 메시지 맨 앞에 쓰면 바로 실행되고, 일반 텍스트 뒤에 독립적인 단어로 쓰면 직접 실행되지 않는다.

| 쓴 위치 | 예 | 결과 |
|------|------|------|
| 메시지 맨 앞 | `/deploy staging` | Claude Code가 스킬을 직접 실행한다 |
| 텍스트 뒤, 문장 부호 없이 독립적인 단어로 | `go ahead and /deploy to staging` | 직접 실행되지 않는다. 그 이름은 그 메시지에서 클로드에게 준 권한이 된다. 클로드는 응답하는 동안 스킬을 쓸 수 있고, 내 표현을 보고 요청인지 판단한다 |

스킬을 언급만 하고 실행 권한은 주고 싶지 않으면 `/`를 빼면 된다.

### 스킬 인자 전달하기

스킬 이름 뒤에 이어지는 텍스트는 그대로 인자가 된다.

```claude
> /pdf Convert report.pdf to markdown
```

| 표기 | 의미 |
|------|------|
| `$ARGUMENTS` | 호출 뒤에 적힌 모든 텍스트 |
| `$ARGUMENTS[0]`, `$0` | 첫 번째 인자 |
| `$ARGUMENTS[1]`, `$1` | 두 번째 인자 |
| `$name` | frontmatter의 `arguments`로 선언한 이름 인자 |
| `${CLAUDE_SKILL_DIR}` | 이 스킬의 `SKILL.md`가 들어있는 폴더. plugin 스킬에서는 plugin 안의 스킬 하위 폴더다 |
| `${CLAUDE_PROJECT_DIR}` | 프로젝트 루트. hook이 받는 `CLAUDE_PROJECT_DIR`과 같은 경로다 |
| `${CLAUDE_SESSION_ID}` | 현재 세션 ID |
| `${CLAUDE_EFFORT}` | 현재 effort 단계. `low`, `medium`, `high`, `xhigh`, `max` |
| `${CLAUDE_PLUGIN_ROOT}` | plugin이 설치된 폴더. plugin 스킬에서만 치환된다 |
| `${CLAUDE_PLUGIN_DATA}` | plugin 업데이트에도 남는 영속 데이터 폴더. plugin 스킬에서만 치환된다 |

인자 번호는 `0`부터 시작한다. `$0`가 첫 번째, `$1`은 두 번째다.

`arguments`로 이름 붙여두면 위치 대신 이름으로 받는다.

```markdown
---
name: migrate-component
description: 한 컴포넌트를 다른 언어로 옮긴다.
argument-hint: [컴포넌트] [현재 언어] [목표 언어]
arguments: [component, from, to]
---

`$component`을 `$from`에서 `$to`로 옮기세요.
```

여러 단어로 된 인자는 따옴표로 묶는다. `/my-skill "hello world" second`에서 `$0`은 `hello world`, `$1`은 `second`가 된다. `$ARGUMENTS`는 항상 입력한 그대로 전체 문자열이 된다.

본문에 자리표시자가 하나도 없는데 인자를 넘기면, 클로드 코드가 `ARGUMENTS: <입력>`을 스킬 본문 끝에 붙여준다. `$1.00`처럼 돈 표기를 본문에 적고 싶다면 `\$1.00`처럼 역슬래시로 이스케이프한다.

`argument-hint`는 자동완성에서 인자가 어떻게 들어가는지 보여준다.

```markdown
---
name: pdf
description: PDF 파일을 변환하고 다룹니다.
argument-hint: [파일] [변환 형식]
---

`$ARGUMENTS`를 처리합니다.
```

인자를 여러 개 받는 스킬은 위치로 받는 편이 명확하다.

```markdown
---
name: pdf
description: PDF 파일을 변환하고 다룹니다.
argument-hint: [파일] [변환 형식]
---

`$0`을 `$1` 형식으로 변환하세요.
```

`/pdf report.md markdown`이라고 호출하면 `$0`은 `report.md`, `$1`은 `markdown`이 된다.

`${CLAUDE_SKILL_DIR}`은 그 스킬의 `SKILL.md`가 들어있는 폴더를 가리킨다. 스크립트와 템플릿을 상대 경로로 참조할 때 유용하다.

```markdown
---
name: greet_user
description: 템플릿을 사용하여 사용자에게 맞춤형 인사를 건넵니다.
argument-hint: [이름]
---

`${CLAUDE_SKILL_DIR}/scripts/hello.py`를 실행하여 `$ARGUMENTS`에게 인사합니다.
```

`${CLAUDE_SKILL_DIR}`은 plugin 스킬과 symlink로 연결된 스킬도 정확하게 가리킨다. `${CLAUDE_PROJECT_DIR}`는 프로젝트의 루트를 가리킨다.

### 지원 파일과 스크립트

스킬 폴더에는 `SKILL.md` 외에 필요한 파일을 함께 둘 수 있다.

```
.claude/skills/financial-analyzer/
├── SKILL.md
├── examples.md
├── reference.md
└── scripts/
    └── analyze.py
```

지원 파일은 `SKILL.md` 본문에서 참조한다.

```markdown
자세한 예시는 [examples.md](examples.md)를, API 설명은 [reference.md](reference.md)를 보세요.

실행:
python ${CLAUDE_SKILL_DIR}/scripts/analyze.py <data-file>
```

지원 파일은 `SKILL.md`와 함께 컨텍스트에 로드되지 않는다. 클로드가 필요할 때 읽는다. 그래서 `SKILL.md`는 짧게 유지하고 상세한 내용은 분리하는 편이 좋다.

스크립트는 실행 권한이 없어도 된다. 클로드 코드는 보통 `python ${CLAUDE_SKILL_DIR}/scripts/analyze.py data.csv`처럼 실행 방법을 명시한 명령으로 스크립트를 호출한다.

스킬 자신의 스크립트를 실행할 때마다 승인 프롬프트를 받고 싶지 않다면 `allowed-tools`에도 치환을 쓸 수 있다.

```yaml
---
name: render-page
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/render.sh *)
---
```

`${CLAUDE_SKILL_DIR}`는 frontmatter의 `allowed-tools` Bash 규칙에도 적용된다. 위처럼 적으면 `scripts/render.sh` 호출은 승인 없이 실행되고, 그 스킬 폴더 밖의 Bash 명령은 평소처럼 승인을 받는다.

### 스킬 본문이 로드되는 시점

스킬의 `description`은 세션이 시작할 때 목록으로 클로드에게 전달된다. 본문은 스킬이 실행될 때 컨텍스트에 로드된다. 목록에 올라있는 스킬은 한 번도 쓰지 않아도 매 턴 컨텍스트 비용을 만든다.

스킬을 호출하면 렌더링된 `SKILL.md` 내용이 하나의 메시지로 대화에 들어오고, 이후 턴에도 그대로 남아 있다. 클로드 코드가 나중에 그 파일을 다시 읽지 않으므로, 한 번만 적용되는 절차보다 작업 전체에 적용되는 항구적인 지침으로 쓰는 편이 맞다.

같은 스킬을 다시 호출해서 렌더링된 내용이 이미 있는 것과 같으면, 내용이 한 번 더 붙지 않고 이미 로드되었다는 짧은 안내만 추가된다. 인자가 바뀌었거나 동적 컨텍스트가 다른 결과를 냈다면 본문이 다시 붙는다.

컨텍스트가 가득 차서 요약이 일어나면, 클로드 코드는 각 스킬의 가장 최근 호출을 요약 뒤에 다시 붙인다. 스킬마다 앞의 5,000토큰까지 유지하고, 다시 붙은 스킬 전체는 25,000토큰 한도를 공유한다. 최근 호출부터 채우므로 한 세션에서 많은 스킬을 불렀다면 오래된 스킬은 요약 이후 사라진다.

`allowed-tools`로 미리 승인한 도구 권한은 스킬을 호출한 턴에만 적용되고, 다음 메시지를 보내면 풀린다. 스킬 본문이 컨텍스트에 남아 있는 것과 별개다. 같은 스킬을 다시 호출하면 그 턴에 다시 적용된다.

### 여러 스킬을 겹쳐 호출하기

한 줄에 여러 스킬을 쓸 수 있다.

```claude
> /skill-one /skill-two fix the flaky test
```

첫 번째 스킬이 실행되고, 남은 텍스트가 다음 스킬로 이어진다. 최대 6개까지 이어진다. 첫 번째 스킬의 본문이 컨텍스트에 로드된 뒤 그 텍스트가 `/skill-two`로 인식되면 두 번째 스킬이 실행된다.

스택은 inline에서 실행되는 스킬만 이어진다. fork된 스킬이나 `context: fork`를 지정한 스킬을 만나면 중단된다. 예를 들어 `/code-review`는 v2.1.218 이후 fork로 실행되므로 `/code-review /fix-issue`에서 `/fix-issue`는 실행되지 않는다. `/loop`처럼 사람이 호출하는 스킬도 스택을 끊는다.

스택이 이어지는 동안 `$ARGUMENTS`와 `$1` 같은 값은 각 스킬이 받은 인자를 기준으로 다시 계산된다. 스택이 중단되면 그 시점부터는 일반 대화처럼 진행된다.

### 스킬 사용

스킬은 `/greet_user 정태`처럼 직접 호출해도 되고, `description`이 요청과 맞으면 클로드가 스스로 선택해도 된다. 아래는 저자가 실제로 관찰한 실행 기록이다.

```claude
> 정태 사용자에게 인사 
  ⎿  ⧉ Selected 4 lines from .claude/skills/greet_user/templates/template.txt in Visual Studio Code

⏺ I'll use the greet_user skill to greet 정태:

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Use skill “greet_user”?
 Claude may use instructions, code, or files from this Skill.

   인사할 사용자의 이름 (project)

 Do you want to proceed?
 ❯ 1. Yes
   2. Yes, and don't ask again for greet_user in /Users/jeongtae/Desktop/claude-sub-agent-playground
   3. No, and tell Claude what to do differently (esc)
```

클로드가 스스로 스킬을 선택했을 때 이 확인 창이 뜬다. 첫 번째 선택지는 이번 한 번 승인하는 것이고, 두 번째 선택지는 이 프로젝트에서 `greet_user`를 다시 확인하지 않도록 허용하는 것이다. 세 번째 선택지는 중단하고 클로드에게 다르게 할 일을 말하는 자리다. 스킬 본문이 로드되는 것은 승인한 뒤이고, `disable-model-invocation: true`로 두면 이 확인 과정 자체가 없어진다.

```claude
> 정태 사용자에게 인사 
  ⎿  ⧉ Selected 4 lines from .claude/skills/greet_user/templates/template.txt in Visual Studio Code

⏺ I'll use the greet_user skill to greet 정태:

> The "greet_user" skill is running 

> The "greet_user" skill is running 

⏺ I'll run the greet_user skill for 정태. Let me execute the hello.py script with the name "정태":

⏺ Bash(cd /Users/jeongtae/Desktop/claude-sub-agent-playground/.claude/skills/greet_user && python scripts/hello.py 정태)
  ⎿  Running…

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Bash command

   cd /Users/jeongtae/Desktop/claude-sub-agent-playground/.claude/skills/greet_user && python scripts/hello.py 정태
   Run greeting script for 정태

 Do you want to proceed?
 ❯ 1. Yes
   2. Yes, and don't ask again for python scripts/hello.py commands in /Users/jeongtae/Desktop/claude-sub-agent-playground
   3. No, and tell Claude what to do differently (esc)
```

`The "greet_user" skill is running`은 스킬 본문이 현재 컨텍스트에 로드되었다는 표시다. 그 뒤 `hello.py`를 실행하는 Bash 명령은 일반 도구 호출이므로 권한 확인을 따로 받는다. 스킬 frontmatter의 `allowed-tools`는 스킬이 권한 확인 없이 사용할 수 있는 도구를 미리 승인하는 필드이므로, 실행 환경과 권한 규칙에 따라 이 Bash 창이 나타나지 않을 수도 있다.

### 호출을 제어하기

두 필드로 누가 스킬을 부를 수 있는지 정한다.

| frontmatter | 결과 |
|------|------|
| `disable-model-invocation: true` | 클로드는 자동으로 부르지 못하고, 사람만 `/이름`으로 부른다. 스킬이 클로드의 컨텍스트에서 완전히 사라진다. 서브 에이전트에 미리 로드되지 않고, 예약 작업이 이 스킬을 프롬프트로 실행하지도 않는다. |
| `user-invocable: false` | `/` 메뉴에서 숨고 `/이름`으로 호출할 수 없다. 클로드는 여전히 부를 수 있다. 사람이 직접 부르지 않는 배경 지식에 맞다. |
| `user-invocable: false`와 `disable-model-invocation: true`를 함께 | 사람도 클로드도 부를 수 없다. |

`description`이 길고 사람이 의도적으로 띄우는 워크플로라면 `disable-model-invocation: true`, 항상 참조되지만 직접 부르지는 않길 바란다면 `user-invocable: false`가 맞다.

frontmatter를 고치지 않고 제어하려면 권한 규칙을 쓴다. `/permissions`에서 `Skill` 도구를 deny하면 모든 스킬을 쓸 수 없다. 개별 스킬은 `Skill(name)` allow, `Skill(deploy *)` deny처럼 다룬다. 이름 뒤의 `*`는 어떤 인자와도 매칭되는 접두사 규칙이다.

### 번들 스킬

Claude Code에는 직접 만들지 않아도 쓸 수 있는 번들 스킬이 들어온다. `/doctor`, `/code-review`, `/batch`, `/debug`, `/loop`, `/claude-api`처럼 이미 들어있는 것들이다. 번들 스킬은 프롬프트 기반으로 동작해서 클로드가 자기 도구로 일을 풀어 나간다. 일반 스킬과 똑같이 `/` 뒤에 이름을 입력해 부르고, 일부는 관련 있으면 클로드가 스스로 쓰지만 `/verify`처럼 사람이 호출할 때만 실행되는 것도 있다. 시간과 토큰을 오래 쓰는 확인 작업은 이렇게 직접 조절할 수 있다. `/workflow-authoring`처럼 특정 기능이 켜져 있을 때만 나타나는 것도 있다.

| 스킬 | 하는 일 |
|------|---------|
| `/debug` | 세션의 디버그 로그를 켜고 그 로그를 읽어 문제를 진단한다. |
| `/code-review` | 현재 diff, 또는 인자로 준 PR 번호·브랜치·경로에서 정확성 문제를 찾는다. 모델과 effort 단계에 따라 정리 기회도 함께 본다. `--fix`로 결과를 적용하고, `/review` 별칭이 함께 있다. |
| `/simplify` | 변경된 코드에서 정리 기회를 검토하고 직접 고친다. 정확성 문제는 다루지 않으므로 버그는 `/code-review`로 찾는다. |
| `/verify` | 앱을 빌리고 실행해서 코드 변경이 의도대로 동작하는지 확인한다. 테스트나 타입 검사로 대체하지 않는다. |
| `/run` | 앱을 실행하고 실제로 변경이 동작하는지 확인한다. |
| `/run-skill-generator` | 앱을 빌리고 실행하는 절차를 기록해 `.claude/skills/run-<name>/`에 저장한다. 이후 `/run`과 `/verify`가 그 기록을 따른다. |
| `/doctor` | 설치 상태, 사용하지 않는 스킬·MCP 서버·플러그인, `CLAUDE.md`, 권한 설정을 점검하고 고칠 것을 제안한다. 고치기 전 승인을 요청한다. |
| `/loop` | 세션을 열어두는 동안 프롬프트를 반복한다. 간격을 빼면 클로드가 다음 반복 시점을 스스로 정한다. `/proactive` 별칭이 함께 있다. |
| `/batch` | 작업을 5~30개의 독립 단위로 나누고 각 단위마다 서브 에이전트를 worktree에 띄워 병렬로 처리한다. |
| `/claude-api` | 프로젝트 언어에 맞는 Claude API 참조 자료를 로드한다. 코드가 `anthropic`이나 `@anthropic-ai/sdk`를 import하면 클로드가 스스로 활성화한다. |

번들 스킬은 `/plugin`이나 `/skills` 목록에서 내 스킬과 나란 보인다. 공식 문서의 명령어 목록에서는 Purpose 열에 **Skill**로 표시된다. `/security-review`처럼 비슷해 보이는 명령 중에는 스킬이 아니라 고정 로직을 직접 실행하는 내장 명령인 것도 있다.

`/doctor`는 설정 점검 명령이기도 하다. `claude doctor`를 터미널에서 실행하면 세션을 시작하지 않고 설치 상태만 점검한다. `/doctor prompt-audit`는 설정 대신 `CLAUDE.md`와 스킬의 지침을 점검한다. `prompt-audit`는 2.1.283 이후 버전에서 쓸 수 있다.

번들 스킬이 필요 없다면 설정으로 끈다.

```json
{
  "disableBundledSkills": true
}
```

`disableBundledSkills: true`는 번들 스킬을 모두 끈다. 개별 스킬만 끄려면 `skillOverrides`에 `"doctor": "off"`처럼 한 항목을 `"off"`로 두면 된다. `disableBundledSkills`가 켜져 있어도 `/doctor` 설정 점검은 입력할 수 있다. 이마저 숨기려면 `DISABLE_DOCTOR_COMMAND` 환경 변수를 설정하거나 `skillOverrides`에서 `"doctor": "off"`로 지정한다.

일부 번들 스킬에는 별칭이 있다. `/code-review`는 `/review`, `/doctor`는 `/checkup`으로 부를 수 있다. 별칭으로 만든 `skillOverrides` 항목은 관리 설정과 `--settings`로 지정한 파일에서만 그 스킬에 적용되고, 사용자·프로젝트·로컬 설정에서는 `review`라는 이름을 가진 스킬에만 적용된다.

같은 이름의 스킬을 직접 만들면 번들 스킬을 대체한다. 프로젝트에 `code-review` 스킬을 두면 `/code-review`는 내 스킬이 실행되지만, 별칭 `/review`는 여전히 번들 스킬을 실행한다.

`/verify`와 `simplify`라는 이름의 스킬이 세션 시작 시 준비되어 있으면, 커밋 직전에 그것을 실행하라는 지침이 클로드에게 주어진다. 2.1.286 이후 버전의 동작이고, 프로젝트나 사용자 스킬이어야 하고 클로드가 호출할 수 있어야 한다. 번들 `/verify`와 plugin 스킬은 이 지침의 대상이 아니다.

### sub agent와 skill의 관계

서브 에이전트는 호출하는 에이전트와 별도의 컨텍스트를 가진다. 스킬은 기본에서 호출하는 에이전트의 컨텍스트 안에서 동작한다. 그래서 스킬은 서브 에이전트를 대신하는 것이 아니라, 서브 에이전트가 일을 할 때 참조할 지식이 된다.

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

연결은 두 방향으로 열린다.

- 스킬 쪽: `context: fork`로 스킬을 서브 에이전트 컨텍스트에서 실행하고, `agent: code-reviewer`처럼 이미 정의된 서브 에이전트를 그 실행에 지정한다. 스킬 본문이 그 에이전트의 프롬프트가 된다.
- 서브 에이전트 쪽: 에이전트 frontmatter의 `skills:`에 적은 스킬을 에이전트가 일을 시작하기 전에 통째로 미리 로드한다.

두 방향은 서로 반대 방향의 설정이다. `skills:`는 에이전트가 시스템 프롬프트를 가지고 스킬 내용을 끌어오고, `context: fork`는 스킬 내용이 지정해 둔 에이전트에 주입된다. 두 경우 모두 서브 에이전트는 내 대화 기록을 보지 못한 채 시작한다.

### 스킬을 사용하는 서브 에이전트 정의

에이전트의 워크 플로우에서 참조할 스킬을 frontmatter에 명시한다.

````markdown
---
name: greeting-manager
description: Greeting message specialist. Creates personalized greetings in multiple languages. Use for greeting generation, welcome messages, or hello text.
tools: Read, Bash
skills:
  - greet_user
---

# Greeting Manager

You are a specialist in generating personalized greeting messages. You use the greet_user skill to create greetings efficiently.

## Your Responsibilities

1. Generate greetings for individuals or groups
2. Support multiple languages (English, Korean)
3. Create custom greeting messages
4. Handle batch greeting generation

## How to Work

### Step 1: Use the greet_user skill

greet_user는 `skills:`로 미리 로드되어 있다. 절차와 스크립트 위치를 이미 알고 있는 상태로 시작하므로 파일을 직접 읽지 않아도 된다.

### Step 2: Use the Script

Use the `hello.py` script:
```bash
python ~/.claude/skills/greet_user/scripts/hello.py NAME
```

### Step 3: Provide Results

Return the generated greeting to the user in a friendly format.

## Examples

### Example 1: Single Greeting
```bash
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
- Use the greet_user skill
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
Load greet_user skill
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
````

`skills:`에 적은 스킬은 에이전트가 컨텍스트를 받기 전에 본문 전체가 미리 로드된다. 에이전트가 `/greet_user`를 다시 호출하지 않아도 지침과 예시를 이미 알고 있는 상태로 시작한다. `description`에 언제 그 스킬을 쓸지 적어두는 이유도 여기에 있다.

`skills:`는 프로젝트와 사용자의 스킬, plugin 스킬, 번들 스킬 모두 참조할 수 있다. plugin 스킬은 `plugin-name:skill-name` 형태로 쓴다. `disable-model-invocation: true`인 스킬은 미리 로드되지 않는다.

미리 로드는 다음처럼 동작한다.

- 이름은 중복 제거 후 첫 32개까지만 로드된다.
- `skills:`는 접근 권한이 아니라 미리 로드 여부를 제어한다. 목록에 없는 스킬도 에이전트는 Skill 도구로 호출할 수 있다. 스킬 사용을 막으려면 `tools`에서 `Skill`을 빼거나 `disallowedTools`에 `Skill`을 추가한다.
- 내장 에이전트는 `skills:`를 미리 로드하지 않는다.
- 이름이 없거나 비활성화된 스킬은 건너뛰고 계속 진행하며, `--debug`에는 어떤 스킬이 생략되었고 그 에이전트가 어떤 스킬을 알고 있는지 기록된다.

`skills:`를 두지 않은 에이전트에도 스킬을 쓸게 할 수는 있다. 에이전트 본문에 `cat ~/.claude/skills/greet_user/SKILL.md`처럼 직접 읽는 절차를 적어두는 방식이다. 이 방식은 스킬을 읽을지 판단하는 단계가 한 번 더 생기고, 읽기 도구가 있어야 하고, 읽는 시점까지 지침을 모른 채 시작한다. 스킬을 반드시 쓰게 하려면 `skills:`로 미리 로드하는 편이 맞고, 미리 로드한 상태에서는 그 읽기 절차가 필요 없다.

### 슬래시 커맨드와 스킬은 통합되었다

과거에는 `.claude/commands/`의 슬래시 커맨드와 `.claude/skills/`의 스킬이 별개였다. 현재 공식 문서의 설명은 명확하다. "Custom commands have been merged into skills."

구분 대신 형식 두 개가 남았다.

| | `.claude/commands/deploy.md` | `.claude/skills/deploy/SKILL.md` |
|---|---|---|
| 상태 | 하위 호환 형식 | 권장 형식 |
| 호출 | `/deploy` | `/deploy` |
| 클로드가 스스로 사용 | 가능 | 가능 |
| frontmatter | `description`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `context`, `agent`를 똑같이 지원 | 위 필드 전체에 `name`, `paths` 추가 |
| 지원 파일 | 없음 | `examples.md`, `reference.md`, `scripts/`, `templates/` |

`.claude/commands/*.md` 파일은 `name`과 `paths`를 빼고 `SKILL.md`와 같은 frontmatter를 받아들인다. 파일명이 스킬 이름이 되고, 첫 줄이 기본 `description`이 된다. 같은 이름의 `.claude/commands/deploy.md`와 `.claude/skills/deploy/SKILL.md`가 모두 있다면 `SKILL.md`가 우선한다.

새로 만들 때는 `SKILL.md`를 쓰고, 기존 `.claude/commands/` 파일은 그대로 두어도 된다. 지원 파일이 필요해지면 폴더를 만들어 같은 이름의 `SKILL.md`로 옮기면 된다.

### 스킬이 예상대로 움직이지 않을 때

**클로드가 스킬을 쓰지 않을 때**

- `description`에 사용자가 실제로 말할 만한 키워드가 들어 있는지 확인한다.
- `/skills`나 "사용 가능한 스킬이 뭐냐"는 질문으로 목록에 올라 있는지 확인한다.
- 요청 문구를 `description`에 더 가깝게 바꿔서 다시 시도한다.
- 사람이 직접 호출할 수 있는 스킬이라면 `/스킬-이름`으로 직접 호출한다.

frontmatter의 YAML이 깨지면 스킬 본문은 메타데이터 없이 로드된다. `/스킬-이름`은 여전히 동작하지만 클로드는 `description`으로 매칭하지 못한다. `--debug`로 파싱 오류를 확인한다. frontmatter가 깨진 `SKILL.md`를 한 번에 찾으려면 스킬 디렉터리에 `claude plugin validate`를 실행한다. 프로젝트 스킬은 `claude plugin validate .claude/skills`, 사용자 스킬은 `claude plugin validate ~/.claude/skills`처럼 지정한다. 2.1.233 이후 기능이다.

**너무 자주 쓸 때**

`description`을 더 구체적으로 바꾸고, 손으로만 부르고 싶다면 `disable-model-invocation: true`를 넣는다.

**첫 답변에서만 따르고 이후에는 무시할 때**

- 매번 지켜야 할 규칙을 클로드가 건너뛴다면 hook으로 옮긴다. 스킬의 `hooks` frontmatter에 두면 그 스킬을 호출한 시점부터 세션이 끝날 때까지 적용된다.
- 판단해서 적용해야 할 지침을 건너뛴다면 "테스트를 실행한다" 대신 "모든 편집 뒤에 테스트를 실행한다"처럼 작업 전체에 적용되는 문장으로 쓴다. 스킬 본문은 호출 시점에 대화에 붙고 이후 턴에서 파일 다시 읽지 않는다.
- 요약이 일어난 뒤라면 스킬을 다시 호출해서 내용을 되살린다. 요약 후에는 스킬 내용의 앞부분만 남을 수 있으므로 중요한 지침을 `SKILL.md` 위에 둔다.

**스킬 설명이 잘릴 때**

클로드에게 올라가는 스킬 목록에는 모든 이름이 항상 들어가지만, 모델 컨텍스트의 1% 규모 예산을 넘으면 자주 쓰지 않는 스킬부터 설명을 잃는다. 설명이 사라지면 클로드가 그 스킬을 매칭할 단어를 잃는다. `/doctor`로 목록의 컨텍스트 비용과 큰 기여자를 확인하고, `/skill-doctor`로 꺼둘 스킬을 찾는다. 예산은 `skillListingBudgetFraction` 설정이나 `SLASH_COMMAND_TOOL_CHAR_BUDGET` 환경 변수로 올린다. 잘 쓸 스킬은 `skillOverrides`에서 `"name-only"`로 두어 설명 자리를 비워도 된다. 1,536자 상한은 `skillListingMaxDescChars`로 바꾼다.

**`~/.claude/skills/`에 둔 스킬이 사라졌을 때**

`~/.claude/skills/.trash/`를 본다. 2.1.280 이전에는 `~/.claude/skills/`의 `manifest.json`이 그 파일에 이름이 오른 스킬 폴더를 `.trash/`의 시간표시 폴더로 옮겼고, 그 스킬은 더 이상 로드되지 않았다. 폴더를 `~/.claude/skills/`로 되돌리면 복구된다. 휴지통이 정리되는 기본 30일이 지나기 전에 옮겨야 한다. claude.ai에서 내려받는 스킬은 별도 `synced` 폴더를 쓰고 직접 만든 폴더를 옮기거나 지우지 않는다.


## plugin

plugins는 skill, agent, hook, MCP 서버 같은 구성 요소들을 하나의 단위로 묶어둔 디렉터리입니다. skill이나 agent는 plugin 없이 개별적으로도 쓸 수 있습니다. 여러 개를 한 번에 설치하고 버전까지 관리하고 싶을 때 plugin을 씁니다.

### plugin 구조

my-first-plugin/
├── .claude-plugin/
│   └── plugin.json
└── commands/
    └── hello.md

.claude-plugin/plugin.json 파일은 plugin의 이름을 비롯한 meta data를 정의합니다.

```json
{
  "name": "my-first-plugin",
  "description": "A simple greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

`name`은 필수입니다. `description`, `version`, `author`는 선택입니다.

plugin이 실제로 Claude Code에 추가하는 것은 구성 요소 파일들입니다.

* `skills/` : skill
* `agents/` : agent
* `hooks/` : hook
* `.mcp.json` : MCP 서버
* `commands/` : command (예전 형식입니다. 새 plugin은 `skills/`를 쓰세요.)

구성 요소는 plugin 디렉터리 안에만 둘 수 있습니다. `../shared` 처럼 plugin 바깥을 가리키는 경로는 그 구성 요소만 빼고 로드됩니다.

### marketplace

marketplace는 plugin 목록과 각 plugin을 어디서 가져오는지 적어둔 카탈로그입니다. 저장소나 폴더에 `.claude-plugin/marketplace.json` 파일 하나로 만들 수 있습니다.

```json
{
  "name": "my-first-plugin-marketplace",
  "owner": {
    "name": "Test User"
  },
  "plugins": [
    {
      "name": "my-first-plugin",
      "source": "./my-first-plugin",
      "description": "My first test plugin"
    },
    {
      "name": "design-sense-plugin",
      "source": "./design-sense-plugin",
      "description": "A plugin that provides design sense skills"
    },
    {
      "name": "mod-explorer",
      "source": "./mods/mod-explorer",
      "description": "Adds an /explorer command that opens a file explorer pane"
    }
  ]
}
```

`source`는 이 repo 안의 상대 경로, GitHub 저장소, git URL, npm 패키지 같은 것들로 적을 수 있습니다.

marketplace에 등록한다고 해서 자동으로 설치되지는 않습니다. 누가 설치할지는 각자가 정합니다. 참고로 Claude Code는 첫 interactive 세션을 시작할 때 Anthropic 공식 marketplace(`claude-plugins-official`)를 알아서 추가해 둡니다.

### plugin 설치하기

세션 안에서 `/plugin` 을 실행하면 plugin 패널이 열립니다.

```claude
> /plugin
```

* `Discover` : 추가해둔 marketplace들의 plugin 목록. 여기서 골라서 설치합니다.
* `Marketplaces` : marketplace 추가와 auto-update 설정
* `Installed` : 설치된 plugin 켜고 끄기

shell에서 하는 것도 같습니다.

```sh
$ claude plugin marketplace add ./
$ claude plugin install my-first-plugin@my-first-plugin-marketplace
```

설치할 때 범위를 고릅니다. 범위는 그 plugin이 누구에게 켜지는지를 결정합니다.

* `user` (기본) : 이 컴퓨터에서 당신이 작업하는 모든 프로젝트
* `project` : `.claude/settings.json` 에 커밋하므로 이 repo를 클론한 사람 모두에게 켜집니다. 다만 각자 자기 컴퓨터에는 직접 설치해야 합니다.
* `local` : `.claude/settings.local.json` 에 저장되고, 이 repo에서만 켜집니다

```sh
$ claude plugin install my-first-plugin@my-first-plugin-marketplace --scope project
$ claude plugin list
$ claude plugin enable my-first-plugin@my-first-plugin-marketplace
$ claude plugin disable my-first-plugin@my-first-plugin-marketplace
$ claude plugin uninstall my-first-plugin@my-first-plugin-marketplace
```

설치하기 전에 구조가 맞는지 검사할 수도 있습니다.

```sh
$ claude plugin validate ./my-first-plugin
```

plugin은 세션 시작할 때 로드됩니다. 방금 설치하거나 켰는데 지금 세션에 아무것도 안 보이면 `/reload-plugins` 를 실행하세요.

```claude
> /reload-plugins
```

### 사용

plugin의 구성 요소는 plugin 이름으로 이름공간이 나뉩니다.

* skill, command : `/plugin-이름:구성-요소-이름`
* agent : `@agent-plugin-이름:구성-요소-이름`
* hook : 이벤트가 발생할 때 자동으로 실행됩니다. 직접 호출하지 않습니다.
* MCP 서버 : plugin이 켜져 있는 동안 연결되어 Claude에게 도구를 줍니다.

서브폴더에 넣으면 이름에 계층이 붙습니다.

* `skills/db/migrate/SKILL.md` → `/my-plugin:db:migrate`
* `agents/review/security.md` → 이름은 `my-plugin:review:security`, 호출은 `@agent-my-plugin:review:security`

my-first-plugin의 hello를 실행할 때는 이렇게 씁니다.

```claude
> /my-first-plugin:hello
```

> plugin이 추가한 skill, agent, command의 이름과 설명은 매 턴 Claude의 컨텍스트에 들어옵니다. 한 번도 안 쓰는데도 컨텍스트 자리를 차지합니다. 많이 켜두지 않는 편이 좋고, `/plugin` 의 `Installed` 탭에 `Not used recently` 그룹이 있습니다.

### mods

mods는 hook을 JavaScript 함수로 쓴 plugin입니다. settings.json의 hook은 shell 명령이나 HTTP 요청처럼 Claude Code 바깥에서 동작합니다. mod의 hook은 Claude Code 안에서 직접 실행됩니다. 그래서 화면에 pane을 그리고, 새 명령도 등록할 수 있습니다.

mod는 `hooks/hooks.json` 의 `modules` 로 JS/TS 파일을 알려줍니다.

```json
{
  "modules": ["./register.js"]
}
```

`register.js`는 `register(on)` 함수를 export합니다. Claude Code는 mod를 로드하면서 그 함수를 호출하고 `on()`을 넘겨줍니다. 이벤트마다 함수를 등록하는 식으로 씁니다.

```js
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

  // Pane이 그려질 때: 내 Pane이 아니면 다음 hook으로 넘기고, Box/Text/Button으로 그린다
  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const { Box, Text, Button, Input } = $.ui.resolve(e)
    ...
  })
}
```

`$` 안에는 Claude Code가 mod에게 주는 API가 들어옵니다.

* `$.fs` : 파일 읽기, 쓰기, 존재 확인
* `$.process` : 명령 실행 (셸을 쓰지 않습니다)
* `$.ui` : pane 열기, 포커스, 닫기
* `$.command` : 새 명령 등록
* `$.session` : 세션 정보 (현재 작업 폴더 같은 것들)

같은 이벤트에 등록된 다음 hook으로 넘어가려면 `next(e)` 를 호출하면 됩니다. 위 코드는 `mods/mod-explorer/hooks/register.js` 에서 일부만 잘라온 것입니다.

mod-explorer는 `/explorer` 명령으로 Claude Code를 실행한 폴더를 루트로 하는 파일 탐색기 pane을 엽니다.

```claude
> /explorer
```

* `v` : 열림, `>` : 닫힘
* `n` : 새 파일, `d` : 새 폴더, `r` : 새로고침
* 루트 밖으로는 나갈 수 없습니다

mods를 사용하기 위해서는 터미널 버전 `v2.1.287` 이상 필요합니다. Desktop app은 `v2.1.286` 이상입니다. 예전에 쓰던 `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` 환경 변수는 `v2.1.287`부터 무시됩니다.

로드된 mods의 수는 `/plugin` 패널 아래에 `N mod active` 처럼 작게 표시됩니다.


## 마지막

본문을 통해 클로드 코드 워크플로우 구축을 위한 필요한 내용을 살펴보았습니다. 혹시 본인만의 워크플로우가 있다면 공유해주세요~
