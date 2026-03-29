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
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
            AdminRepository adminRepository,
            MenuRepository menuRepository,
            RoleMenuRepository roleMenuRepository,
            CodeGroupRepository codeGroupRepository,
            CodeDetailRepository codeDetailRepository,
            @Lazy PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;
        this.menuRepository = menuRepository;
        this.roleMenuRepository = roleMenuRepository;
        this.codeGroupRepository = codeGroupRepository;
        this.codeDetailRepository = codeDetailRepository;
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

        /* 1depth: Layer */
        Menu layer = menuRepository.save(Menu.builder().name("Layer").icon("PanelRight").parent(catTpl).menuType("BO").sortOrder(4).build());
        menuRepository.save(Menu.builder().name("Right").url("/admin/templates/layer/right").icon("PanelRight").parent(layer).menuType("BO").sortOrder(1).build());

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
