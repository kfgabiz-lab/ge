# API 설계 문서 — 사이트 관리 다국어 키 연동

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 사이트 관리 다국어 키 연동 |
| 작성일 | 2026-06-01 |
| 참조 DB 문서 | docs/db/site/db_site_msg_key.md |

---

## 2. 변경 파일 목록

| 파일 | 변경 유형 | 내용 |
|---|---|---|
| `entity/Site.java` | 수정 | `nameMsgKey` 필드 추가 |
| `dto/SiteDto.java` | 수정 | CreateRequest/UpdateRequest에 `nameKo`, `nameEn` 추가, Response에 `nameMsgKey`, `nameEn` 추가 |
| `service/SiteService.java` | 수정 | createSite/updateSite/deleteSite에 message_resource 연동 추가 |
| `repository/MessageResourceRepository.java` | 수정 | `deleteByKeyIn`, `findByKey` 메서드 추가 (메뉴와 공통) |

---

## 3. DTO 변경

### 3-1. SiteDto.CreateRequest / UpdateRequest — 필드 변경

```java
// 기존 name 필드 제거 → nameKo/nameEn으로 분리
@NotBlank
@Size(max = 255)
private String nameKo;   // 한국어 사이트명 (필수)

@Size(max = 255)
private String nameEn;   // 영어 사이트명 (선택)

// 나머지 필드 유지
private String description;
private String domain;
private Boolean isActive;
```

### 3-2. SiteDto.Response — 추가 필드

```java
private Long id;
private String name;         // 한국어 사이트명 (site.name)
private String nameMsgKey;   // message_resource.key (예: site.1.name)
private String nameEn;       // 영어 사이트명 (message_resource.en)
private String description;
private String domain;
private Boolean isActive;
private String createdBy;
private OffsetDateTime createdAt;
private String updatedBy;
private OffsetDateTime updatedAt;
```

---

## 4. 서비스 로직 변경

### 4-1. createSite()

```
1. Site 엔티티 저장 (site.name = nameKo)
2. 저장된 site.id 확보
3. message_resource 생성 (1건):
   - key: "site.{id}.name", ko: nameKo, en: nameEn, type: WORD, active: true
4. site.nameMsgKey = "site.{id}.name" 업데이트
5. SiteDto.Response 반환 (nameEn 포함)
```

### 4-2. updateSite()

```
1. site.name = nameKo 업데이트
2. message_resource 업데이트:
   - key: site.nameMsgKey → ko, en 값 업데이트
3. nameMsgKey가 null인 경우 (기존 데이터):
   - message_resource 생성 후 키 저장
```

### 4-3. deleteSite()

```
1. 기존 로직 유지 (admin_user_site CASCADE)
2. site.nameMsgKey가 null이 아닌 경우:
   - messageResourceRepository.deleteByKeyIn([nameMsgKey])
```

---

## 5. 기존 API 호환성

| 엔드포인트 | 변경 여부 | 비고 |
|---|---|---|
| `POST /sites` | request body 변경 | name → nameKo + nameEn |
| `PATCH /sites/{id}` | request body 변경 | 동일 |
| `DELETE /sites/{id}` | 내부 로직만 변경 | 인터페이스 동일 |
| `GET /sites` | response 필드 추가 | nameEn, nameMsgKey 추가 |
| `GET /sites/{id}` | response 필드 추가 | 동일 |
