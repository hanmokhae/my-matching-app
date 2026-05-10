# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: matching.spec.ts >> 시니어 일자리 매칭 시스템 자동 테스트 >> 정상 시나리오: 시니어가 가입하면 추천 화면으로 넘어가서 결과가 보임
- Location: tests\matching.spec.ts:5:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=자동테스트_어르신')
Expected: visible
Error: strict mode violation: locator('text=자동테스트_어르신') resolved to 2 elements:
    1) <option value="c47a82e6-abf5-452d-8283-b11d0223e697">…</option> aka getByRole('combobox')
    2) <option value="2d72a496-f141-4ff1-bdf2-a79c606656f7">…</option> aka getByRole('combobox')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=자동테스트_어르신')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "맞춤 일자리 추천" [level=1] [ref=e3]:
      - img [ref=e4]
      - text: 맞춤 일자리 추천
    - combobox [ref=e7]:
      - option "👤 대상 시니어를 선택하세요" [selected]
      - 'option "자동테스트_어르신 (희망지역: 서울 | 희망직종: 경비 | 경력: 5년)"'
      - 'option "자동테스트_어르신 (희망지역: 서울 | 희망직종: 경비 | 경력: 5년)"'
      - 'option "박미경 (희망지역: 경기 | 희망직종: 청소 | 경력: 5년)"'
      - 'option "이정호 (희망지역: 서울 | 희망직종: 조리 | 경력: 15년)"'
      - 'option "최순자 (희망지역: 인천 | 희망직종: 돌봄 | 경력: 8년)"'
      - 'option "정대현 (희망지역: 서울 | 희망직종: 경비 | 경력: 3년)"'
      - 'option "김영수 (희망지역: 서울 | 희망직종: 경비 | 경력: 10년)"'
      - 'option "장미자 (희망지역: 인천 | 희망직종: 청소 | 경력: 4년)"'
      - 'option "오상훈 (희망지역: 기타 | 희망직종: 기타 | 경력: 20년)"'
      - 'option "임복순 (희망지역: 서울특별시 | 희망직종: 경비직 | 경력: 6년)"'
      - 'option "강옥분 (희망지역: 경기 | 희망직종: 돌봄 | 경력: 12년)"'
      - 'option "윤기석 (희망지역: 서울 | 희망직종: 조리 | 경력: 7년)"'
      - 'option "홍길동22 (희망지역: 경기 | 희망직종: 경비 | 경력: 4년)"'
      - 'option "홍길동22 (희망지역: 경기 | 희망직종: 경비 | 경력: 4년)"'
      - 'option "홍길동 (희망지역: 서울 | 희망직종: 경비 | 경력: 5년)"'
  - button "Open Next.js Dev Tools" [ref=e13] [cursor=pointer]:
    - img [ref=e14]
  - alert [ref=e17]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('시니어 일자리 매칭 시스템 자동 테스트', () => {
  4  | 
  5  |     test('정상 시나리오: 시니어가 가입하면 추천 화면으로 넘어가서 결과가 보임', async ({ page }) => {
  6  |         await page.goto('/register');
  7  | 
  8  |         // 1. 프로필 입력 (정상적인 데이터)
  9  |         await page.fill('input[placeholder*="예)"]', '자동테스트_어르신'); // 이름 입력
  10 |         await page.locator('select').nth(0).selectOption({ label: '서울' }); // 지역
  11 |         await page.locator('select').nth(1).selectOption({ label: '경비' }); // 직종
  12 |         await page.fill('input[type="number"]', '5'); // 경력
  13 | 
  14 |         // 2. 폼 제출
  15 |         await page.click('button:has-text("등록하기")');
  16 | 
  17 |         // 3. 성공 메시지 노출 확인
  18 |         await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible();
  19 | 
  20 |         // 4. 추천 화면 이동 및 결과 확인
  21 |         await page.goto('/recommendations');
  22 | 
  23 |         // 대상 시니어를 선택했다고 가정하고 매칭 결과가 표시되는지 확인
  24 |         // (선택 시 뜨는 제목이나 점수 라벨이 노출되는지 검증)
> 25 |         await expect(page.locator('text=자동테스트_어르신')).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  26 |         await expect(page.locator('text=점')).toBeVisible();
  27 |     });
  28 | 
  29 |     test('실패 시나리오: 이름을 비우고 등록을 시도하면 가입이 안 됨', async ({ page }) => {
  30 |         await page.goto('/register');
  31 | 
  32 |         // 1. 이름은 비우고 나머지 필수 데이터만 입력
  33 |         await page.locator('select').nth(0).selectOption({ label: '서울' });
  34 |         await page.locator('select').nth(1).selectOption({ label: '경비' });
  35 |         await page.fill('input[type="number"]', '3');
  36 | 
  37 |         // 2. 폼 제출
  38 |         await page.click('button:has-text("등록하기")');
  39 | 
  40 |         // 3. 정상 등록 완료 메시지가 화면에 노출되지 않음을 검증 (실패했으므로)
  41 |         await expect(page.locator('text=등록이 완료되었습니다')).toBeHidden();
  42 |     });
  43 | 
  44 |     test('엣지 시나리오: 매칭 결과가 없을 때 빈 화면이 잘 처리되는지 확인', async ({ page }) => {
  45 |         await page.goto('/recommendations');
  46 | 
  47 |         // 조건에 맞는 매칭 결과가 없는 시니어를 선택했다고 가정
  48 |         // 결과가 없을 때 출력되는 안내 메시지가 제대로 노출되는지 검증합니다.
  49 |         const emptyMessage = page.locator('text=담당자가 직접 연락드리니 잠시만 기다려 주세요');
  50 |         await expect(emptyMessage).toBeVisible();
  51 |     });
  52 | 
  53 | });
```