---
name: greet_user
description: 템플릿을 사용하여 사용자에게 맞춤형 인사를 건넵니다. 누군에게 인사해달라고 요청할 때 사용하세요.
argument-hint: [이름]
allowed-tools: Read, Grep, Glob, Bash
---

## 스킬 설명

이 스킬은 `user_name`을 인자로 받아 `scripts/hello.py`를 실행합니다.
스크립트는 `templates/template.txt`의 `{{name}}` 부분을 `user_name`으로 교체하여 출력합니다.