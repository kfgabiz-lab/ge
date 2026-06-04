# API 설계 문서 — 메뉴 관리 다국어 키 연동

## 1. 개요

| 항목 | 내용 |
|---|---|
| 기능명 | 메뉴 관리 다국어 키 연동 |
| 작성일 | 2026-06-01 |
| 참조 DB 문서 | docs/db/menus/db_menu_msg_key.md |

---

## 2. 변경 파일 목록

| 파일 | 변경 유형 | 내용 |
|---|---|---|
| `entity/Menu.java` | 수정 | `nameMsgKey`, `descriptionMsgKey` 필드 추가 |
| `dto/MenuRequest.java` | 수정 | `nameKo`, `nameEn`, `descriptionKo`, `descriptionEn`, `descriptionType` 추가 |
| `dto/MenuResponse.java` | 수정 | `nameMsgKey`, `nameEn`, `descriptionMsgKey`, `descriptionEn`, `descriptionType` 추가 |
| `service/MenuService.java` | 수정 | createMenu/updateMenu/deleteMenu에 message_resource 연동 추가 |
| `repository/MessageResourceRepository.java` | 수정 | `deleteByKeyIn`, `findByKey` 메서드 추가 |

---

## 3. DTO 변경

### 3-1. MenuRequest (record) — 추가 필드

```java
// 기존 필드 유지
String name();           // 삭제 (nameKo로 대체)

// 추가 필드
String nameKo();         // 한국어 메뉴명 (기존 name 대체, @NotBlank)
String nameEn();         // 영어 메뉴명 (선택)
String descriptionKo();  // 한국어 메뉴 설명 (기존 description 대체)
String descriptionEn();  // 영어 메뉴 설명 (선택)
String descriptionType(); // WORD | SENTENCE (기본값: WORD)
```

> 기존 `name` 필드를 `nameKo`로 rename. BE에서 `menu.name = nameKo` 로 저장.

### 3-2. MenuResponse — 추가 필드

```java
// 기존 필드 유지
String name();           // 한국어 메뉴명 (menu.name 값)
String description();    // 한국어 설명 (menu.description 값)

// 추가 필드
String nameMsgKey();         // message_resource.key (예: menu.1.name)
String nameEn();             // 영어 메뉴명 (message_resource.en)
String descriptionMsgKey();  // message_resource.key (예: menu.1.description)
String descriptionEn();      // 영어 메뉴 설명 (message_resource.en)
String descriptionType();    // WORD | SENTENCE
```

---

## 4. 서비스 로직 변경

### 4-1. createMenu()

```
1. Menu 엔티티 저장 (기존 로직 유지, name = nameKo)
2. 저장된 menu.id 확보
3. message_resource 생성 (2건):
   - key: "menu.{id}.name", ko: nameKo, en: nameEn, type: WORD, active: true
   - key: "menu.{id}.description", ko: descriptionKo, en: descriptionEn, type: descriptionType, active: true
4. menu.nameMsgKey = "menu.{id}.name" 업데이트
5. menu.descriptionMsgKey = "menu.{id}.description" 업데이트
6. MenuResponse 반환 (nameEn, descriptionEn 포함)
```

### 4-2. updateMenu()

```
1. 기존 로직 유지 (menuType, parentId 변경 차단)
2. menu.name = nameKo 업데이트
3. menu.description = descriptionKo 업데이트
4. message_resource 업데이트:
   - key: menu.nameMsgKey → ko, en 값 업데이트
   - key: menu.descriptionMsgKey → ko, en, type 값 업데이트
5. nameMsgKey, descriptionMsgKey가 null인 경우 (신규 등록):
   - message_resource 생성 후 키 저장
```

### 4-3. deleteMenu()

```
1. 기존 로직 유지 (시스템 메뉴 삭제 차단, CASCADE 삭제)
2. menu.nameMsgKey, menu.descriptionMsgKey가 null이 아닌 경우:
   - messageResourceRepository.deleteByKeyIn([nameMsgKey, descriptionMsgKey])
```

---

## 5. Repository 추가 메서드

### MessageResourceRepository.java

```java
// 키 목록으로 일괄 삭제
void deleteByKeyIn(List<String> keys);

// 키로 단건 조회
Optional<MessageResource> findByKey(String key);
```

---

## 6. 기존 API 호환성

| 엔드포인트 | 변경 여부 | 비고 |
|---|---|---|
| `POST /menus` | request body 필드 추가 | nameKo, nameEn 등 추가 (name 제거) |
| `PUT /menus/{id}` | request body 필드 추가 | 동일 |
| `DELETE /menus/{id}` | 내부 로직만 변경 | 인터페이스 동일 |
| `GET /menus` | response 필드 추가 | nameEn, descriptionEn 등 추가 |
