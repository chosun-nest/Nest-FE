# 프로젝트 생성 시 parts 정보 전달 디버깅 체크리스트

## 문제 상황
새로 생성한 프로젝트만 인원 정보(parts, currentNumberOfMembers, maximumNumberOfMembers)가 0으로 표시됨

백엔드의 `createProjectMembers` 메서드는 정상적으로 구현되어 있음

## 확인 사항

### 1. 프론트엔드에서 보내는 payload 확인 ✅

**방법:**
1. 프로젝트 작성 페이지로 이동
2. Step 2에서 역할 추가:
   - FRONTEND: 2명
   - BACKEND: 3명
3. 브라우저 개발자 도구 열기 (F12)
4. Console 탭 확인
5. 프로젝트 등록 버튼 클릭
6. 콘솔에 출력된 payload 확인:

```javascript
📤 프로젝트 생성 요청 payload: {
  "projectTitle": "테스트 프로젝트",
  "projectDescription": "...",
  "isRecruiting": true,
  "tags": ["풀스택"],
  "parts": {              // ← 이 부분 확인!
    "FRONTEND": 3,        // 생성자 포함
    "BACKEND": 3
  },
  "creatorPart": "FRONTEND",
  "creatorRole": "LEADER",
  "maximumNumberOfMembers": 6
}
```

**체크:**
- [ ] parts 객체가 비어있지 않은가?
- [ ] 생성자 역할이 포함되어 있는가?
- [ ] maximumNumberOfMembers가 정확한가?

---

### 2. 백엔드 DTO 확인 (백엔드 프로젝트)

**파일:** `src/main/java/com/virtukch/nest/project/dto/CreateProjectDto.java` (또는 유사)

**확인할 내용:**
```java
public class CreateProjectDto {
    private String projectTitle;
    private String projectDescription;
    private Boolean isRecruiting;
    private List<String> tags;

    // ⚠️ 이 필드들이 있는지 확인!
    private Map<String, Integer> parts;  // 또는 Map<ProjectMember.Part, Integer> partCounts
    private String creatorPart;
    private String creatorRole;
    private Integer maximumNumberOfMembers;
}
```

**체크:**
- [ ] `parts` 필드가 존재하는가?
- [ ] 필드명이 정확한가? (`parts` vs `partCounts`)
- [ ] `creatorPart` 필드가 존재하는가?
- [ ] `creatorRole` 필드가 존재하는가?

---

### 3. 백엔드 Controller 확인 (백엔드 프로젝트)

**파일:** `src/main/java/com/virtukch/nest/project/controller/ProjectController.java`

**확인할 내용:**
```java
@PostMapping("/api/v1/projects/new")
public ResponseEntity<CreateProjectResponse> createProject(
    @RequestBody CreateProjectDto dto,  // ← DTO 타입 확인
    @AuthenticationPrincipal CustomUserDetails userDetails
) {
    // 로그 추가해서 확인
    log.info("📥 받은 DTO: {}", dto);
    log.info("📥 parts: {}", dto.getParts());  // parts가 제대로 받아지는지 확인

    Long projectId = projectService.createProject(dto, userDetails.getMemberId());
    return ResponseEntity.ok(new CreateProjectResponse(projectId));
}
```

**체크:**
- [ ] `@RequestBody` 어노테이션이 있는가?
- [ ] DTO가 올바른 타입인가?
- [ ] 로그를 추가해서 parts 값 확인

---

### 4. 백엔드 Service 확인 (백엔드 프로젝트)

**파일:** `src/main/java/com/virtukch/nest/project/service/ProjectService.java`

**확인할 내용:**
```java
@Transactional
public Long createProject(CreateProjectDto dto, Long memberId) {
    // 1. Project 엔티티 생성 및 저장
    Project project = Project.builder()
        .projectTitle(dto.getProjectTitle())
        .projectDescription(dto.getProjectDescription())
        .isRecruiting(dto.getIsRecruiting())
        .member(memberRepository.findById(memberId).orElseThrow())
        .build();

    project = projectRepository.save(project);

    // 2. ⚠️ 이 부분이 호출되는지 확인!
    if (dto.getParts() != null && !dto.getParts().isEmpty()) {
        // parts를 ProjectMember.Part enum으로 변환
        Map<ProjectMember.Part, Integer> partCounts = new HashMap<>();
        for (Map.Entry<String, Integer> entry : dto.getParts().entrySet()) {
            ProjectMember.Part part = ProjectMember.Part.valueOf(entry.getKey());
            partCounts.put(part, entry.getValue());
        }

        createProjectMembers(
            project.getProjectId(),
            memberId,
            partCounts,
            ProjectMember.Part.valueOf(dto.getCreatorPart()),
            ProjectMember.Role.valueOf(dto.getCreatorRole())
        );
    }

    return project.getProjectId();
}
```

**체크:**
- [ ] `createProjectMembers`가 호출되는가?
- [ ] parts를 enum으로 변환하는 로직이 있는가?
- [ ] null 체크가 있는가?

---

## 디버깅 단계

### Step 1: 프론트엔드 확인
```javascript
// 브라우저 콘솔에서 확인
console.log("formData.roles:", formData.roles);
console.log("parts:", parts);
console.log("payload:", payload);
```

### Step 2: 백엔드 로그 확인
```bash
# 백엔드 컨테이너 로그 확인
docker-compose logs -f backend | grep -i "parts\|projectmember"
```

### Step 3: 네트워크 요청 확인
브라우저 개발자 도구 → Network 탭:
1. 프로젝트 등록 요청 찾기 (`/api/v1/projects/new`)
2. Payload 탭에서 전송된 데이터 확인
3. Response 탭에서 응답 확인

### Step 4: DB 확인
```sql
-- 새로 생성된 프로젝트 ID 확인
SELECT * FROM project ORDER BY created_at DESC LIMIT 1;

-- ProjectMember 슬롯 확인
SELECT * FROM project_member WHERE project_id = (최신 프로젝트 ID);
```

---

## 예상 원인 및 해결

### 원인 1: DTO 필드명 불일치
**문제:** 프론트엔드는 `parts`로 보내는데, 백엔드는 `partCounts`로 받음

**해결:**
```java
// CreateProjectDto.java
private Map<String, Integer> parts;  // ← 필드명을 parts로 통일

// 또는 @JsonProperty 사용
@JsonProperty("parts")
private Map<String, Integer> partCounts;
```

### 원인 2: createProjectMembers 미호출
**문제:** Service에서 `createProjectMembers`를 호출하지 않음

**해결:**
```java
// ProjectService.createProject() 메서드에 추가
if (dto.getParts() != null && !dto.getParts().isEmpty()) {
    createProjectMembers(/* ... */);
}
```

### 원인 3: parts가 빈 객체
**문제:** 프론트엔드에서 역할을 추가하지 않아 parts가 `{}`

**해결:**
- Step 2에서 역할을 반드시 추가하도록 안내
- 또는 생성자 역할만이라도 최소 1개는 자동으로 추가되도록 수정

---

## 테스트 시나리오

### 테스트 1: 정상 케이스
1. 프로젝트 작성
2. Step 2에서 FRONTEND 2명, BACKEND 3명 추가
3. 등록 후 DB 확인:
```sql
-- 예상 결과: 5개 슬롯 (FRONTEND 2 + BACKEND 3)
SELECT COUNT(*) FROM project_member WHERE project_id = ?;
-- 결과: 5
```

### 테스트 2: 생성자만 있는 케이스
1. 프로젝트 작성
2. Step 2에서 역할 추가하지 않음
3. 등록 후 DB 확인:
```sql
-- 예상 결과: 1개 슬롯 (생성자만)
SELECT COUNT(*) FROM project_member WHERE project_id = ?;
-- 결과: 1
```

### 테스트 3: API 응답 확인
```bash
curl -X GET "http://localhost:6030/api/v1/projects?page=0&size=1&sort=createdAt,desc" | jq '.projects[0] | {projectId, currentMembers: .currentNumberOfMembers, maxMembers: .maximumNumberOfMembers, parts}'
```

예상 결과:
```json
{
  "projectId": 12,
  "currentMembers": 1,
  "maxMembers": 5,
  "parts": {
    "FRONTEND": 2,
    "BACKEND": 3
  }
}
```
