package com.ge.bo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ge.bo.entity.*;
import com.ge.bo.repository.*;

@Component
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;
    private final MenuRepository menuRepository;
    private final RoleMenuRepository roleMenuRepository;
    private final CodeGroupRepository codeGroupRepository;
    private final CodeDetailRepository codeDetailRepository;
    private final ApiInfoRepository apiInfoRepository;
    private final SlugRegistryRepository slugRegistryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
            AdminRepository adminRepository,
            MenuRepository menuRepository,
            RoleMenuRepository roleMenuRepository,
            CodeGroupRepository codeGroupRepository,
            CodeDetailRepository codeDetailRepository,
            ApiInfoRepository apiInfoRepository,
            SlugRegistryRepository slugRegistryRepository,
            @Lazy PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;
        this.menuRepository = menuRepository;
        this.roleMenuRepository = roleMenuRepository;
        this.codeGroupRepository = codeGroupRepository;
        this.codeDetailRepository = codeDetailRepository;
        this.apiInfoRepository = apiInfoRepository;
        this.slugRegistryRepository = slugRegistryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // 1. 초기 역할(Roles) 생성
        insertRoleIfAbsent("SUPER_ADMIN", "최고 관리자", "모든 기능에 접근 가능한 최상위 관리자", "#4361ee", true);
        insertRoleIfAbsent("EDITOR", "편집자", "콘텐츠 등록 및 수정이 가능한 편집 관리자", "#6b7280", true);

        // 2. 초기 관리자(Admin) 생성 (admin@ge.com / P@ssw0rd123)
        insertAdminIfAbsent("admin@ge.com", "시스템 관리자", "P@ssw0rd123", "SUPER_ADMIN", "BO-2026-00002");

        // 3. 초기 메뉴 생성
        initMenus();

        // 4. 공통코드 초기 데이터
        initCodes();

        // 5. 공통코드 관리 메뉴 등록 (신규 추가 — 멱등성 보장)
        initCodesMenu();

        // 6. Entity 메뉴 등록 (신규 추가 — 멱등성 보장)
        initEntityMenu();

        // 7. API_CATEGORY 공통코드 + api_info 초기 데이터
        initApiCategoryCodes();
        initApiInfoData();

        // 8. API 메뉴 등록 (멱등성 보장)
        initApiInfoMenu();

        // 9. Slug 레지스트리 초기 데이터 + 메뉴 등록
        initSlugRegistry();
        initSlugRegistryMenu();
    }

    private void insertRoleIfAbsent(String code, String displayName, String description, String color,
            boolean isSystem) {
        if (!roleRepository.existsByCode(code)) {
            roleRepository.save(Role.builder()
                    .code(code)
                    .displayName(displayName)
                    .description(description)
                    .color(color)
                    .isSystem(isSystem)
                    .build());
        }
    }

    private void initMenus() {
        if (menuRepository.count() > 0) return; // 멱등성

        /* ══ 카테고리: MAIN ══ */
        Menu catMain = menuRepository.save(Menu.builder().name("MAIN").icon("Home").menuType("BO").sortOrder(1).isCategory(true).build());
        menuRepository.save(Menu.builder().name("Dashboard").url("/admin/dashboard").icon("LayoutDashboard").parent(catMain).menuType("BO").sortOrder(1).build());

        /* ══ 카테고리: MANAGEMENT ══ */
        Menu catMgmt = menuRepository.save(Menu.builder().name("MANAGEMENT").icon("Folder").menuType("BO").sortOrder(2).isCategory(true).build());
        menuRepository.save(Menu.builder().name("Content").url("/admin/content").icon("FileText").parent(catMgmt).menuType("BO").sortOrder(1).build());
        menuRepository.save(Menu.builder().name("Display").url("/admin/display").icon("Image").parent(catMgmt).menuType("BO").sortOrder(2).build());
        menuRepository.save(Menu.builder().name("Boards").url("/admin/boards").icon("MessageSquare").parent(catMgmt).menuType("BO").sortOrder(3).build());

        /* ══ 카테고리: TEMPLATES ══ */
        Menu catTpl = menuRepository.save(Menu.builder().name("TEMPLATES").icon("SwatchBook").menuType("BO").sortOrder(3).isCategory(true).build());

        /* 1depth: Templates (하위메뉴 그룹) */
        Menu templates = menuRepository.save(Menu.builder().name("Templates").icon("SwatchBook").parent(catTpl).menuType("BO").sortOrder(1).build());
        menuRepository.save(Menu.builder().name("UI 컴포넌트").url("/admin/templates/ui-components").icon("Palette").parent(templates).menuType("BO").sortOrder(1).build());
        menuRepository.save(Menu.builder().name("목록형 레이아웃").url("/admin/templates/list-layout").icon("LayoutDashboard").parent(templates).menuType("BO").sortOrder(2).build());
        menuRepository.save(Menu.builder().name("카드형 레이아웃").url("/admin/templates/grid-layout").icon("LayoutDashboard").parent(templates).menuType("BO").sortOrder(3).build());
        menuRepository.save(Menu.builder().name("폼형 레이아웃").url("/admin/templates/form-layout").icon("FileText").parent(templates).menuType("BO").sortOrder(4).build());
        menuRepository.save(Menu.builder().name("대시보드 레이아웃").url("/admin/templates/dashboard-layout").icon("LayoutDashboard").parent(templates).menuType("BO").sortOrder(5).build());
        menuRepository.save(Menu.builder().name("검색 템플릿").url("/admin/templates/search-layout").icon("Search").parent(templates).menuType("BO").sortOrder(6).build());

        /* 1depth: List */
        Menu list = menuRepository.save(Menu.builder().name("List").icon("List").parent(catTpl).menuType("BO").sortOrder(2).build());
        menuRepository.save(Menu.builder().name("서버사이드 페이징").url("/admin/templates/list/server-pagination").icon("List").parent(list).menuType("BO").sortOrder(1).build());
        menuRepository.save(Menu.builder().name("가상 스크롤링").url("/admin/templates/list/virtual-scroll").icon("List").parent(list).menuType("BO").sortOrder(2).build());

        /* 1depth: Form */
        Menu form = menuRepository.save(Menu.builder().name("Form").icon("FileText").parent(catTpl).menuType("BO").sortOrder(3).build());
        menuRepository.save(Menu.builder().name("Layout(Right)").url("/admin/templates/form/layout-right").icon("FileText").parent(form).menuType("BO").sortOrder(1).build());

        /* 1depth: Make */
        Menu make = menuRepository.save(Menu.builder().name("Make").icon("Wand2").parent(catTpl).menuType("BO").sortOrder(5).build());
        menuRepository.save(Menu.builder().name("List").url("/admin/templates/make/list").icon("Wand2").parent(make).menuType("BO").sortOrder(1).build());

        /* 1depth: Demo */
        Menu demo = menuRepository.save(Menu.builder().name("Demo").icon("Monitor").parent(catTpl).menuType("BO").sortOrder(6).build());
        menuRepository.save(Menu.builder().name("목록1(FE)").url("/admin/templates/demo/page1").icon("Monitor").parent(demo).menuType("BO").sortOrder(1).build());
        menuRepository.save(Menu.builder().name("목록2(FE)").url("/admin/templates/demo/page2").icon("Monitor").parent(demo).menuType("BO").sortOrder(2).build());

        /* ══ 카테고리: SYSTEM ══ */
        Menu catSys = menuRepository.save(Menu.builder().name("SYSTEM").icon("Settings").menuType("BO").sortOrder(4).isCategory(true).build());
        menuRepository.save(Menu.builder().name("Settings").icon("Settings").parent(catSys).menuType("BO").sortOrder(1).build());
        Menu settings = menuRepository.findAll().stream().filter(m -> "Settings".equals(m.getName()) && m.getParent() != null).findFirst().orElse(catSys);
        menuRepository.save(Menu.builder().name("관리자 관리").url("/admin/settings/users").icon("Users").parent(settings).menuType("BO").sortOrder(1).build());
        menuRepository.save(Menu.builder().name("권한 관리").url("/admin/settings/roles").icon("Shield").parent(settings).menuType("BO").sortOrder(2).build());
        menuRepository.save(Menu.builder().name("메뉴 관리").url("/admin/settings/menus").icon("Menu").parent(settings).menuType("BO").sortOrder(3).build());

        /* ── ADMIN 역할에 모든 메뉴 매핑 ── */
        Role adminRole = roleRepository.findAll().stream()
            .filter(r -> "SUPER_ADMIN".equals(r.getCode()))
            .findFirst().orElse(null);
        if (adminRole != null) {
            menuRepository.findAll().forEach(menu ->
                roleMenuRepository.save(RoleMenu.builder()
                    .roleId(adminRole.getId())
                    .menuId(menu.getId())
                    .build())
            );
        }
    }

    private void initCodes() {
        if (codeGroupRepository.count() > 0) return; // 멱등성

        /* STATUS */
        CodeGroup status = codeGroupRepository.save(CodeGroup.builder().groupCode("STATUS").groupName("상태코드").description("시스템 공통 상태 코드").build());
        codeDetailRepository.save(CodeDetail.builder().group(status).code("APPROVED").name("승인완료").sortOrder(1).build());
        codeDetailRepository.save(CodeDetail.builder().group(status).code("PROGRESS").name("진행중").sortOrder(2).build());
        codeDetailRepository.save(CodeDetail.builder().group(status).code("PENDING").name("대기").sortOrder(3).build());
        codeDetailRepository.save(CodeDetail.builder().group(status).code("REJECTED").name("반려").sortOrder(4).build());

        /* CATEGORY */
        CodeGroup category = codeGroupRepository.save(CodeGroup.builder().groupCode("CATEGORY").groupName("분류코드").description("게시물/콘텐츠 분류").build());
        codeDetailRepository.save(CodeDetail.builder().group(category).code("NOTICE").name("공지사항").sortOrder(1).build());
        codeDetailRepository.save(CodeDetail.builder().group(category).code("FAQ").name("FAQ").sortOrder(2).build());
        codeDetailRepository.save(CodeDetail.builder().group(category).code("EVENT").name("이벤트").sortOrder(3).build());

        /* PRIORITY */
        CodeGroup priority = codeGroupRepository.save(CodeGroup.builder().groupCode("PRIORITY").groupName("우선순위").description("업무 우선순위 구분").build());
        codeDetailRepository.save(CodeDetail.builder().group(priority).code("URGENT").name("긴급").sortOrder(1).build());
        codeDetailRepository.save(CodeDetail.builder().group(priority).code("NORMAL").name("보통").sortOrder(2).build());
        codeDetailRepository.save(CodeDetail.builder().group(priority).code("LOW").name("낮음").sortOrder(3).build());
    }

    /**
     * 공통코드 관리 메뉴를 Settings 하위에 등록
     * 이미 존재하면 스킵 (멱등성 보장)
     */
    private void initCodesMenu() {
        boolean exists = menuRepository.findAll().stream()
                .anyMatch(m -> "/admin/settings/codes".equals(m.getUrl()));
        if (exists) return;

        /* Settings 상위 메뉴 탐색 */
        Menu settings = menuRepository.findAll().stream()
                .filter(m -> "Settings".equals(m.getName()) && m.getParent() != null)
                .findFirst().orElse(null);
        if (settings == null) return;

        /* 공통코드 관리 메뉴 등록 */
        Menu codesMenu = menuRepository.save(Menu.builder()
                .name("공통코드 관리")
                .url("/admin/settings/codes")
                .icon("Code2")
                .parent(settings)
                .menuType("BO")
                .sortOrder(4)
                .build());

        /* SUPER_ADMIN 역할에 메뉴 권한 부여 */
        roleRepository.findAll().stream()
                .filter(r -> "SUPER_ADMIN".equals(r.getCode()))
                .findFirst()
                .ifPresent(superAdmin ->
                        roleMenuRepository.save(RoleMenu.builder()
                                .roleId(superAdmin.getId())
                                .menuId(codesMenu.getId())
                                .build())
                );
    }

    /**
     * Entity 메뉴 단독 등록
     * - Database 그룹 하위에 Entity 메뉴만 추가 (Table 메뉴가 이미 있는 경우 대비)
     * - 이미 존재하면 스킵 (멱등성 보장)
     */
    private void initEntityMenu() {
        /* 이미 등록되어 있으면 스킵 */
        boolean exists = menuRepository.findAll().stream()
                .anyMatch(m -> "/admin/database/entities".equals(m.getUrl()));
        if (exists) return;

        /* Table 메뉴의 부모(Database 그룹)를 찾아서 Entity 메뉴를 같은 부모 아래 등록 */
        Menu parent = menuRepository.findAll().stream()
                .filter(m -> "/admin/database/tables".equals(m.getUrl()))
                .findFirst()
                .map(Menu::getParent)
                .orElse(null);
        if (parent == null) return;

        Menu entityMenu = menuRepository.save(Menu.builder()
                .name("Entity")
                .url("/admin/database/entities")
                .icon("Layers")
                .parent(parent)
                .menuType("BO")
                .sortOrder(2)
                .build());

        /* SUPER_ADMIN 역할에 권한 부여 */
        roleRepository.findAll().stream()
                .filter(r -> "SUPER_ADMIN".equals(r.getCode()))
                .findFirst()
                .ifPresent(superAdmin ->
                        roleMenuRepository.save(RoleMenu.builder()
                                .roleId(superAdmin.getId())
                                .menuId(entityMenu.getId())
                                .build())
                );
    }

    /**
     * API_CATEGORY 공통코드 그룹 + 상세 초기 데이터
     * 이미 존재하면 스킵 (멱등성 보장)
     */
    private void initApiCategoryCodes() {
        if (codeGroupRepository.existsByGroupCode("API_CATEGORY")) return;

        CodeGroup group = codeGroupRepository.save(CodeGroup.builder()
                .groupCode("API_CATEGORY")
                .groupName("API 카테고리")
                .description("API 정보 관리 카테고리 구분")
                .build());

        codeDetailRepository.save(CodeDetail.builder().group(group).code("MENU").name("메뉴").sortOrder(1).build());
        codeDetailRepository.save(CodeDetail.builder().group(group).code("CODE").name("공통코드").sortOrder(2).build());
        codeDetailRepository.save(CodeDetail.builder().group(group).code("PAGE_DATA").name("페이지데이터").sortOrder(3).build());
        codeDetailRepository.save(CodeDetail.builder().group(group).code("PAGE_TEMPLATE").name("페이지템플릿").sortOrder(4).build());
        codeDetailRepository.save(CodeDetail.builder().group(group).code("ADMIN_USER").name("관리자").sortOrder(5).build());
        codeDetailRepository.save(CodeDetail.builder().group(group).code("ETC").name("기타").sortOrder(99).build());
    }

    /**
     * api_info 초기 데이터 — 기존 BE API 목록
     * 이미 데이터가 있으면 스킵 (멱등성 보장)
     */
    private void initApiInfoData() {
        if (apiInfoRepository.count() > 0) return;

        /* 메뉴 */
        saveApi("MENU",          "메뉴 목록 조회",      "GET",    "/api/v1/menus",                         "전체 메뉴 트리 조회");
        saveApi("MENU",          "메뉴 등록",           "POST",   "/api/v1/menus",                         "신규 메뉴 등록");
        saveApi("MENU",          "메뉴 수정",           "PUT",    "/api/v1/menus/{id}",                    "메뉴 정보 수정");
        saveApi("MENU",          "메뉴 삭제",           "DELETE", "/api/v1/menus/{id}",                    "메뉴 삭제");
        /* 공통코드 */
        saveApi("CODE",          "공통코드 그룹 목록",   "GET",    "/api/v1/codes",                         "공통코드 그룹 전체 목록");
        saveApi("CODE",          "공통코드 그룹 등록",   "POST",   "/api/v1/codes",                         "공통코드 그룹 신규 등록");
        saveApi("CODE",          "공통코드 상세 등록",   "POST",   "/api/v1/codes/{groupId}/details",        "공통코드 상세항목 등록");
        /* 페이지데이터 */
        saveApi("PAGE_DATA",     "페이지 데이터 목록",  "GET",    "/api/v1/page-data/{slug}",              "slug 기반 페이지 데이터 목록");
        saveApi("PAGE_DATA",     "페이지 데이터 등록",  "POST",   "/api/v1/page-data/{slug}",              "slug 기반 페이지 데이터 등록");
        saveApi("PAGE_DATA",     "페이지 데이터 수정",  "PUT",    "/api/v1/page-data/{slug}/{id}",          "slug+id 기반 데이터 수정");
        saveApi("PAGE_DATA",     "페이지 데이터 삭제",  "DELETE", "/api/v1/page-data/{slug}/{id}",          "slug+id 기반 데이터 삭제");
        /* 페이지템플릿 */
        saveApi("PAGE_TEMPLATE", "템플릿 목록 조회",    "GET",    "/api/v1/page-templates",                "페이지 템플릿 목록 조회");
        saveApi("PAGE_TEMPLATE", "템플릿 slug 조회",    "GET",    "/api/v1/page-templates/by-slug/{slug}", "slug로 템플릿 단건 조회");
        saveApi("PAGE_TEMPLATE", "템플릿 저장",         "POST",   "/api/v1/page-templates",                "템플릿 신규 저장");
        saveApi("PAGE_TEMPLATE", "템플릿 수정",         "PUT",    "/api/v1/page-templates/{id}",           "템플릿 수정");
        /* 관리자 */
        saveApi("ADMIN_USER",    "관리자 목록 조회",    "GET",    "/api/v1/admin-users",                   "관리자 계정 목록 조회");
        saveApi("ADMIN_USER",    "관리자 등록",         "POST",   "/api/v1/admin-users",                   "관리자 계정 등록");
        /* API 정보 */
        saveApi("ETC",           "API 정보 목록",       "GET",    "/api/v1/api-infos",                     "API 정보 목록 조회");
        saveApi("ETC",           "API 정보 등록",       "POST",   "/api/v1/api-infos",                     "API 정보 등록");
        saveApi("ETC",           "API 정보 수정",       "PUT",    "/api/v1/api-infos/{id}",                "API 정보 수정");
        saveApi("ETC",           "API 정보 삭제",       "DELETE", "/api/v1/api-infos/{id}",               "API 정보 삭제");
    }

    private void saveApi(String category, String name, String method, String urlPattern, String description) {
        apiInfoRepository.save(ApiInfo.builder()
                .category(category)
                .name(name)
                .method(method)
                .urlPattern(urlPattern)
                .description(description)
                .active(true)
                .build());
    }

    /**
     * API 메뉴 등록 — System > API
     * 이미 존재하면 스킵 (멱등성 보장)
     */
    private void initApiInfoMenu() {
        boolean exists = menuRepository.findAll().stream()
                .anyMatch(m -> "/admin/system/api".equals(m.getUrl()));
        if (exists) return;

        /* System 그룹 탐색 (isCategory=true, name=SYSTEM) */
        Menu systemGroup = menuRepository.findAll().stream()
                .filter(m -> Boolean.TRUE.equals(m.getIsCategory()) && "SYSTEM".equals(m.getName()))
                .findFirst().orElse(null);
        if (systemGroup == null) return;

        Menu apiMenu = menuRepository.save(Menu.builder()
                .name("API")
                .url("/admin/system/api")
                .icon("Plug")
                .parent(systemGroup)
                .menuType("BO")
                .sortOrder(3)
                .build());

        /* SUPER_ADMIN 역할에 권한 부여 */
        roleRepository.findAll().stream()
                .filter(r -> "SUPER_ADMIN".equals(r.getCode()))
                .findFirst()
                .ifPresent(superAdmin ->
                        roleMenuRepository.save(RoleMenu.builder()
                                .roleId(superAdmin.getId())
                                .menuId(apiMenu.getId())
                                .build())
                );
    }

    /**
     * Slug 레지스트리 초기 데이터
     * 이미 데이터가 있으면 스킵 (멱등성 보장)
     */
    private void initSlugRegistry() {
        if (slugRegistryRepository.count() > 0) return;

        slugRegistryRepository.save(SlugRegistry.builder()
                .slug("boardListSave").name("게시판 목록").type("PAGE_DATA").active(true).build());
        slugRegistryRepository.save(SlugRegistry.builder()
                .slug("board-search").name("게시판 검색").type("PAGE_DATA").active(true).build());
    }

    /**
     * DB Slug 관리 메뉴 등록 — Settings 하위
     * 이미 존재하면 스킵 (멱등성 보장)
     */
    private void initSlugRegistryMenu() {
        boolean exists = menuRepository.findAll().stream()
                .anyMatch(m -> "/admin/settings/slug-registry".equals(m.getUrl()));
        if (exists) return;

        Menu settings = menuRepository.findAll().stream()
                .filter(m -> "Settings".equals(m.getName()) && m.getParent() != null)
                .findFirst().orElse(null);
        if (settings == null) return;

        Menu slugMenu = menuRepository.save(Menu.builder()
                .name("DB Slug 관리")
                .url("/admin/settings/slug-registry")
                .icon("Database")
                .parent(settings)
                .menuType("BO")
                .sortOrder(5)
                .build());

        roleRepository.findAll().stream()
                .filter(r -> "SUPER_ADMIN".equals(r.getCode()))
                .findFirst()
                .ifPresent(superAdmin ->
                        roleMenuRepository.save(RoleMenu.builder()
                                .roleId(superAdmin.getId())
                                .menuId(slugMenu.getId())
                                .build())
                );
    }

    private void insertAdminIfAbsent(String email, String name, String password, String role, String employeeId) {
        if (!adminRepository.existsByEmail(email)) {
            adminRepository.save(AdminUser.builder()
                    .email(email)
                    .name(name)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .employeeId(employeeId)
                    .isActive(true)
                    .build());
        }
    }
}
