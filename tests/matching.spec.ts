import { test, expect } from '@playwright/test';

test.describe('시니어 일자리 매칭 시스템 자동 테스트', () => {

    test('정상 시나리오: 시니어가 가입하면 추천 화면으로 넘어가서 결과가 보임', async ({ page }) => {
        await page.goto('/register');

        // 1. 프로필 입력 (정상적인 데이터)
        await page.fill('input[placeholder*="예)"]', '자동테스트_어르신'); // 이름 입력
        await page.locator('select').nth(0).selectOption({ label: '서울' }); // 지역
        await page.locator('select').nth(1).selectOption({ label: '경비' }); // 직종
        await page.fill('input[type="number"]', '5'); // 경력

        // 2. 폼 제출
        await page.click('button:has-text("등록하기")');

        // 3. 성공 메시지 노출 확인
        await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible();

        // 4. 추천 화면 이동 및 결과 확인
        await page.goto('/recommendations');

        // 대상 시니어를 선택했다고 가정하고 매칭 결과가 표시되는지 확인
        // (선택 시 뜨는 제목이나 점수 라벨이 노출되는지 검증)
        await expect(page.locator('text=자동테스트_어르신')).toBeVisible();
        await expect(page.locator('text=점')).toBeVisible();
    });

    test('실패 시나리오: 이름을 비우고 등록을 시도하면 가입이 안 됨', async ({ page }) => {
        await page.goto('/register');

        // 1. 이름은 비우고 나머지 필수 데이터만 입력
        await page.locator('select').nth(0).selectOption({ label: '서울' });
        await page.locator('select').nth(1).selectOption({ label: '경비' });
        await page.fill('input[type="number"]', '3');

        // 2. 폼 제출
        await page.click('button:has-text("등록하기")');

        // 3. 정상 등록 완료 메시지가 화면에 노출되지 않음을 검증 (실패했으므로)
        await expect(page.locator('text=등록이 완료되었습니다')).toBeHidden();
    });

    test('엣지 시나리오: 매칭 결과가 없을 때 빈 화면이 잘 처리되는지 확인', async ({ page }) => {
        await page.goto('/recommendations');

        // 조건에 맞는 매칭 결과가 없는 시니어를 선택했다고 가정
        // 결과가 없을 때 출력되는 안내 메시지가 제대로 노출되는지 검증합니다.
        const emptyMessage = page.locator('text=담당자가 직접 연락드리니 잠시만 기다려 주세요');
        await expect(emptyMessage).toBeVisible();
    });

});