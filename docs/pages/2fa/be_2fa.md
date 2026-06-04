# 2FA TOTP API 설계서

## 1. 개요

로그인 2차 인증(TOTP) API 설계입니다.
기존 `/auth/login` 응답 구조를 변경하고, TOTP 전용 엔드포인트 3개를 추가합니다.

## 2. 인증 플로우

```
[1단계] POST /api/v1/auth/login
        이메일/비밀번호/reCAPTCHA 검증
        → 성공 시 tempToken(10분) 발급 (JWT 미발급)
        → is_totp_enabled=false → requireTotpSetup: true
        → is_totp_enabled=true  → requireTotpVerify: true

[2-A] TOTP 미등록 경우
      POST /api/v1/auth/totp/qr            → QR코드 URL + secret 반환
      POST /api/v1/auth/totp/registrations → 6자리 코드 검증 → 복구코드 발급 → JWT 발급

[2-B] TOTP 등록 완료 경우
      POST /api/v1/auth/totp/sessions  → 6자리 OTP 또는 복구코드 검증 → JWT 발급
```

## 3. API 목록

### 3-1. 로그인 (기존 변경)

**`POST /api/v1/auth/login`**

- 인증: 불필요 (permitAll)
- 변경 전: 성공 시 바로 accessToken 발급
- 변경 후: 성공 시 tempToken 발급, 2FA 완료 후 accessToken 발급

**Request Body**
```json
{
  "email": "admin@example.com",
  "password": "P@ssw0rd123",
  "recaptchaToken": "google-recaptcha-v2-token"
}
```

**Response (기존 변경)**
```json
{
  "tempToken": "eyJhbGci...",
  "requireTotpSetup": true,
  "requireTotpVerify": false,
  "accessToken": null,
  "expiresIn": null,
  "adminInfo": null
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `tempToken` | String | 10분 유효 임시 토큰 (2FA용) |
| `requireTotpSetup` | Boolean | true = QR 등록 화면으로 이동 |
| `requireTotpVerify` | Boolean | true = OTP 입력 화면으로 이동 |
| `accessToken` | String | 2FA 완료 후에만 채워짐 (setup/verify API 응답) |
| `expiresIn` | Long | accessToken 유효시간(초) |
| `adminInfo` | Object | 관리자 정보 |

---

### 3-2. TOTP QR 코드 발급

**`POST /api/v1/auth/totp/qr`**

- 인증: 불필요 (permitAll, tempToken으로 자체 검증)
- 목적: QR 코드 URL과 비밀키 반환 (앱 등록용)

**Request Body**
```json
{
  "tempToken": "eyJhbGci..."
}
```

**Response**
```json
{
  "qrCodeUrl": "otpauth://totp/BO%20Admin:admin@example.com?secret=JBSWY3DPEHPK3PXP&issuer=BO%20Admin",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `qrCodeUrl` | String | otpauth:// URI (FE에서 QR 코드 렌더링) |
| `secret` | String | Base32 비밀키 (수동 입력용) |

**에러**

| HTTP | code | 설명 |
|------|------|------|
| 400 | TOTP_INVALID_TEMP_TOKEN | tempToken 유효하지 않음 |
| 400 | TOTP_ALREADY_ENABLED | 이미 2FA 등록 완료된 계정 |

---

### 3-3. TOTP 등록 완료

**`POST /api/v1/auth/totp/registrations`**

- 인증: 불필요 (permitAll, tempToken으로 자체 검증)
- 목적: 앱에서 보이는 6자리 코드로 등록 확인 → 복구코드 발급 → JWT 발급

**Request Body**
```json
{
  "tempToken": "eyJhbGci...",
  "totpCode": "123456"
}
```

**Response**
```json
{
  "accessToken": "eyJhbGci...",
  "expiresIn": 3600,
  "adminInfo": {
    "id": 1,
    "name": "홍길동",
    "email": "admin@example.com",
    "role": "SUPER_ADMIN",
    "isSystem": true
  },
  "recoveryCodes": [
    "A1B2C3D4",
    "E5F6G7H8",
    ...
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `recoveryCodes` | String[] | 복구 코드 10개 (1회만 표시, 이후 조회 불가) |

**에러**

| HTTP | code | 설명 |
|------|------|------|
| 400 | TOTP_INVALID_TEMP_TOKEN | tempToken 유효하지 않음 |
| 400 | TOTP_CODE_INVALID | 6자리 코드 불일치 |

---

### 3-4. TOTP 로그인 세션 발급 (기존 등록 완료 계정)

**`POST /api/v1/auth/totp/sessions`**

- 인증: 불필요 (permitAll, tempToken으로 자체 검증)
- 목적: OTP 코드 또는 복구코드로 2차 인증 → JWT 발급

**Request Body**
```json
{
  "tempToken": "eyJhbGci...",
  "totpCode": "123456",
  "recoveryCode": null
}
```

`totpCode` 또는 `recoveryCode` 중 하나만 전달 (둘 다 전달 시 totpCode 우선)

**Response**
```json
{
  "accessToken": "eyJhbGci...",
  "expiresIn": 3600,
  "adminInfo": {
    "id": 1,
    "name": "홍길동",
    "email": "admin@example.com",
    "role": "SUPER_ADMIN",
    "isSystem": true
  },
  "recoveryCodes": null
}
```

**에러**

| HTTP | code | 설명 |
|------|------|------|
| 400 | TOTP_INVALID_TEMP_TOKEN | tempToken 유효하지 않음 |
| 400 | TOTP_CODE_INVALID | OTP 코드 불일치 |
| 400 | TOTP_RECOVERY_CODE_INVALID | 복구 코드 불일치 또는 소진 |
| 400 | TOTP_NOT_ENABLED | 2FA 미등록 계정 |

---

## 4. tempToken 상세

- **발급 시점**: `/auth/login` 1단계 성공 시
- **유효시간**: 10분
- **JWT Claims**:
  ```json
  {
    "sub": "admin@example.com",
    "type": "TOTP_PENDING",
    "iat": 1234567890,
    "exp": 1234568490
  }
  ```
- **검증 로직**: TotpService 내부에서 직접 파싱 (`type=TOTP_PENDING` 확인)
- **기존 accessToken과 구분**: `type` claim으로 구분 (기존 = `ACCESS`, 신규 = `TOTP_PENDING`)

## 5. 수정 파일 목록

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `build.gradle` | 수정 | `dev.samstevens.totp:totp:1.7.1` 추가 |
| `AdminUser.java` | 수정 | `totpSecret`, `totpEnabled`, `recoveryCodes` 필드 추가 |
| `LoginResponse.java` | 수정 | `tempToken`, `requireTotpSetup`, `requireTotpVerify` 필드 추가 |
| `AuthController.java` | 수정 | `/totp/setup`, `/totp/confirm`, `/totp/verify` 추가 |
| `AuthService.java` | 수정 | login() — JWT 즉시 발급 → tempToken 발급으로 변경 |
| `TotpService.java` | 신규 | TOTP 생성/검증/복구코드 관리 |
| `TotpDto.java` | 신규 | Setup/Confirm/Verify 요청·응답 DTO |
| `JwtTokenProvider.java` | 수정 | tempToken 생성 메서드 추가 (`type=TOTP_PENDING`) |
| `SecurityConfig.java` | 수정 | `/api/v1/auth/totp/**` permitAll 추가 |
| `application-local.yml` | 수정 | `totp.issuer: "BO Admin"` 추가 |
