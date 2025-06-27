# 치킨 블로그 검색 (네이버 검색 API 기반)

네이버 검색 API를 활용한 치킨/음식 키워드 블로그 검색 웹사이트입니다.

## 사용 방법

1. **환경변수 등록 (Vercel 등 배포 환경에서)**
   - `NAVER_CLIENT_ID`: 네이버 개발자센터에서 발급받은 Client ID
   - `NAVER_CLIENT_SECRET`: 네이버 개발자센터에서 발급받은 Client Secret

2. **Vercel 배포**
   - 환경변수 등록 후 반드시 Redeploy(재배포) 필요
   - [Vercel 환경변수 등록법 참고](https://velog.io/@yeonsubaek/Next.js-API-key%EB%A5%BC-%ED%8F%AC%ED%95%A8%ED%95%B4-Vercel%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)

3. **검색**
   - 검색창에 키워드 입력 → 검색 결과 리스트 확인

## 주요 파일
- `index.html`: 메인 페이지
- `styles.css`: 스타일
- `script.js`: 프론트엔드 JS
- `api/naver-search.js`: 서버리스 프록시 함수

## 참고
- 네이버 검색 API 공식 문서: https://developers.naver.com/docs/serviceapi/search/blog/blog.md
- Vercel 환경변수 등록법: https://velog.io/@yeonsubaek/Next.js-API-key%EB%A5%BC-%ED%8F%AC%ED%95%A8%ED%95%B4-Vercel%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0 