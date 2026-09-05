# minhwan123.github.io

개인 포트폴리오 웹사이트 — https://minhwan123.github.io

빌드 도구나 외부 의존성 없이 순수 HTML / CSS / JavaScript로 구성되어 있습니다.
`main` 브랜치에 푸시하면 GitHub Pages가 자동으로 배포합니다.

## 구조

```
index.html              페이지 전체 마크업
assets/css/style.css    디자인 토큰(:root 변수) + 전체 스타일
assets/js/main.js       모바일 메뉴, 스크롤 스파이, 등장 효과
assets/img/             파비콘 및 프로젝트 이미지
.nojekyll               GitHub Pages의 Jekyll 처리 비활성화
```

## 로컬 실행

```bash
python -m http.server 8000
# http://localhost:8000
```

## 커스터마이징

색상, 타이포그래피, 간격, 라운드 값은 모두 `assets/css/style.css` 상단의
`:root` 변수로 관리합니다. 이 블록만 수정하면 전체 톤을 바꿀 수 있습니다.
