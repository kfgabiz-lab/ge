# 2FA TOTP FE 설계서

## 1. 개요

로그인 2차 인증(TOTP) FE 구현 설계입니다.
기존 `LoginForm.tsx`에 단계별 상태 관리를 추가하고,
TOTP 전용 컴포넌트 2개(`TotpSetupForm`, `TotpVerifyForm`)를 신규 작성합니다.

## 2. 화면 플로우

```
LoginForm (1단계)
  ├─ 응답: requireTotpSetup=true  → TotpSetupForm (QR 등록 화면)
  │         ├─ STEP 1: QR 코드 + 비밀키 표시
  │         ├─ STEP 2: 6자리 코드 입력 확인
  │         └─ STEP 3: 복구코드 10개 표시 (저장 확인 후 로그인 완료)
  │
  └─ 응답: requireTotpVerify=true → TotpVerifyForm (OTP 입력 화면)
            ├─ 기본: 6자리 OTP 입력
            └─ 우회: 복구코드 입력 토글
```

## 3. 컴포넌트 설계

### 3-1. LoginForm.tsx (수정)

**추가 상태**
```typescript
type LoginStep = 'credentials' | 'totp-setup' | 'totp-verify';
const [step, setStep] = useState<LoginStep>('credentials');
const [tempToken, setTempToken] = useState<string>('');
```

**변경 로직 (onSubmit)**
```typescript
// 기존: login(accessToken, adminInfo) + router.push
// 변경: 응답에 따라 단계 전환
if (res.requireTotpSetup) {
  setTempToken(res.tempToken);
  setStep('totp-setup');
} else if (res.requireTotpVerify) {
  setTempToken(res.tempToken);
  setStep('totp-verify');
}
```

**렌더링**
```tsx
if (step === 'totp-setup') return <TotpSetupForm tempToken={tempToken} />;
if (step === 'totp-verify') return <TotpVerifyForm tempToken={tempToken} />;
return <기존 로그인 폼 />;
```

---

### 3-2. TotpSetupForm.tsx (신규)

**경로**: `bo/src/components/auth/TotpSetupForm.tsx`

**Props**
```typescript
interface TotpSetupFormProps {
  tempToken: string;
}
```

**내부 단계 상태**
```typescript
type SetupStep = 'qr' | 'confirm' | 'recovery';
const [setupStep, setSetupStep] = useState<SetupStep>('qr');
const [qrCodeUrl, setQrCodeUrl] = useState('');
const [secret, setSecret] = useState('');
const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
```

**STEP 1 — QR 코드 화면 (qr)**
- 마운트 시 `POST /auth/totp/setup` 호출 → `qrCodeUrl`, `secret` 저장
- `react-qr-code` 라이브러리로 QR 렌더링
- 수동 입력용 비밀키(`secret`) 복사 버튼 제공
- "다음" 버튼 → setupStep = 'confirm'

**STEP 2 — 코드 확인 화면 (confirm)**
- 6자리 숫자 입력 (OTP input — 1칸씩 자동 포커스 이동)
- "인증 완료" 버튼 → `POST /auth/totp/confirm` 호출
- 성공 시 `recoveryCodes` 저장 → setupStep = 'recovery'
- 실패 시 toast 에러 + 입력값 초기화

**STEP 3 — 복구코드 화면 (recovery)**
- 복구 코드 10개 격자 표시 (5×2)
- "복사" 버튼 (클립보드)
- "저장 완료, 로그인" 버튼 → `login(accessToken, adminInfo)` + `router.push('/admin/dashboard')`

---

### 3-3. TotpVerifyForm.tsx (신규)

**경로**: `bo/src/components/auth/TotpVerifyForm.tsx`

**Props**
```typescript
interface TotpVerifyFormProps {
  tempToken: string;
}
```

**내부 상태**
```typescript
const [useRecovery, setUseRecovery] = useState(false);
const [totpCode, setTotpCode] = useState('');
const [recoveryCode, setRecoveryCode] = useState('');
```

**기본 화면 — OTP 입력**
- 6자리 숫자 입력 (OTP input — 1칸씩 자동 포커스 이동)
- "복구코드로 로그인" 링크 → `setUseRecovery(true)`
- "로그인" 버튼 → `POST /auth/totp/verify` `{ tempToken, totpCode }`
- 성공 시 `login(accessToken, adminInfo)` + `router.push('/admin/dashboard')`

**복구코드 화면**
- 일반 텍스트 입력 (8자리)
- "OTP로 돌아가기" 링크
- "로그인" 버튼 → `POST /auth/totp/verify` `{ tempToken, recoveryCode }`

---

## 4. OTP 입력 컴포넌트 설계

**`OtpInput.tsx`** (공통, 재사용 가능)

```typescript
interface OtpInputProps {
  length: number;       // 6
  value: string;
  onChange: (val: string) => void;
}
```

- 각 칸 별 `<input maxLength={1} />` 배열
- 숫자 입력 시 다음 칸 자동 포커스
- Backspace 시 이전 칸으로 포커스 이동
- 붙여넣기(paste) 이벤트로 6자리 일괄 입력 지원

---

## 5. API 연동

| 액션 | 메서드 | 엔드포인트 | 요청 | 응답 |
|------|--------|-----------|------|------|
| 1단계 로그인 | POST | `/auth/login` | email, password, recaptchaToken | tempToken, requireTotpSetup, requireTotpVerify |
| QR 발급 | POST | `/auth/totp/setup` | tempToken | qrCodeUrl, secret |
| 등록 확인 | POST | `/auth/totp/confirm` | tempToken, totpCode | accessToken, adminInfo, recoveryCodes |
| OTP 검증 | POST | `/auth/totp/verify` | tempToken, totpCode?, recoveryCode? | accessToken, adminInfo |

---

## 6. 패키지 추가

```bash
npm install react-qr-code --legacy-peer-deps
```

---

## 7. 수정/신규 파일 목록

| 파일 | 유형 | 내용 |
|------|------|------|
| `components/auth/LoginForm.tsx` | 수정 | step 상태 추가, tempToken 관리, 단계 전환 |
| `components/auth/TotpSetupForm.tsx` | 신규 | QR 등록 3단계 화면 |
| `components/auth/TotpVerifyForm.tsx` | 신규 | OTP / 복구코드 입력 화면 |
| `components/auth/OtpInput.tsx` | 신규 | 6자리 OTP 입력 공통 컴포넌트 |
