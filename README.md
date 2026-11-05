# 힘찬짐 회원 웹

Next.js로 만든 과제용 PT 회원 서비스입니다. 이메일과 비밀번호로 가입하고, 이용권과 예약 내역을 확인하며 수업을 예약하거나 취소할 수 있습니다.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`BACKEND_URL`을 NestJS 백엔드 주소로 설정합니다. 브라우저는 같은 출처의 `/api/proxy`로 요청하고, Next.js 서버가 백엔드로 전달합니다. 세션은 HttpOnly 쿠키에 보관합니다.

Vercel에서 Next.js 프로젝트로 배포합니다. `BACKEND_URL`은 서버 환경변수이며 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다. 주소를 설정하지 않으면 연결 준비 중이라고 안내하며 저장이 성공한 것처럼 표시하지 않습니다.

디자인은 [getdesign.kr의 뱅크샐러드 DESIGN.md](https://www.getdesign.kr/services/banksalad/DESIGN.md)를 적용했습니다. 원문을 포함했으며 카탈로그 콘텐츠는 CC BY 4.0입니다. 뱅크샐러드와 제휴한 서비스가 아닙니다.

Render 무료 백엔드는 잠든 상태에서 첫 연결까지 시간이 걸릴 수 있습니다. 회원 정보에는 가상 데이터만 입력해 주세요.

## 운영 확인 주소

https://himchangym-web-six.vercel.app/

회원 웹, 직원용 어드민, 백엔드는 별도 저장소로 분리했습니다. 확인용 계정 비밀번호는 제출 폼에서 별도로 전달합니다.
