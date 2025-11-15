# 백엔드: ProjectMember 슬롯 생성 로직 확인 필요

## 문제 상황

프론트엔드에서 프로젝트 생성 시 `parts` 정보를 올바르게 보내고 있지만, 백엔드에서 이 정보를 받아서 **ProjectMember 슬롯을 생성하지 않는** 것으로 보입니다.

## 프론트엔드에서 보내는 payload

```javascript
{
  "projectTitle": "테스트 프로젝트",
  "projectDescription": "프로젝트 설명...",
  "isRecruiting": true,
  "tags": ["풀스택"],
  "parts": {
    "FRONTEND": 2,
    "BACKEND": 3,
    "DESIGN": 1
  },
  "creatorPart": "FRONTEND",
  "creatorRole": "LEADER",
  "maximumNumberOfMembers": 6
}
```

## 예상되는 백엔드 로직

프로젝트 생성 API (`POST /api/v1/projects/new`)가 다음을 수행해야 합니다:

### 1. Project 엔티티 저장
```java
Project project = Project.builder()
    .projectTitle(dto.getProjectTitle())
    .projectDescription(dto.getProjectDescription())
    .isRecruiting(dto.getIsRecruiting())
    .member(creator)
    .build();

projectRepository.save(project);
```

### 2. ProjectMember 슬롯 생성 ⚠️ **이 부분이 누락된 것으로 보임**
```java
// parts를 받아서 ProjectMember 슬롯 생성
Map<String, Integer> parts = dto.getParts();

for (Map.Entry<String, Integer> entry : parts.entrySet()) {
    String part = entry.getKey();  // "FRONTEND", "BACKEND" 등
    Integer count = entry.getValue(); // 2, 3 등

    for (int i = 0; i < count; i++) {
        ProjectMember.Role role;
        Long memberId;

        // 첫 번째 슬롯이 생성자 역할인 경우 LEADER로 설정
        if (part.equals(dto.getCreatorPart()) && i == 0) {
            role = ProjectMember.Role.LEADER;
            memberId = creator.getMemberId();
        } else {
            role = ProjectMember.Role.MEMBER;
            memberId = null; // 빈 슬롯
        }

        ProjectMember slot = ProjectMember.builder()
            .project(project)
            .part(ProjectMember.Part.valueOf(part))
            .role(role)
            .memberId(memberId)
            .build();

        projectMemberRepository.save(slot);
    }
}
```

## 현재 상황 확인

### 테스트 방법 1: 프론트엔드에서 프로젝트 생성
1. 프로젝트 작성 페이지로 이동
2. Step 2에서 역할 추가:
   - FRONTEND: 2명
   - BACKEND: 3명
3. 브라우저 콘솔에서 payload 확인
4. 프로젝트 생성 후 DB 확인:
```sql
SELECT * FROM project_member WHERE project_id = (최신 프로젝트 ID);
```

### 테스트 방법 2: 백엔드 로그 확인
```bash
docker-compose logs -f backend | grep -i "parts\|projectmember"
```

## 확인이 필요한 백엔드 파일

1. **ProjectService.java**
   - `createProject()` 메서드
   - parts를 받아서 ProjectMember 슬롯 생성하는 로직 확인

2. **ProjectController.java**
   - `POST /api/v1/projects/new` 엔드포인트
   - RequestBody DTO가 parts를 제대로 받는지 확인

3. **CreateProjectDto.java** (또는 유사한 DTO)
   - `Map<String, Integer> parts` 필드 존재 확인
   - `String creatorPart` 필드 존재 확인
   - `String creatorRole` 필드 존재 확인

## 예상 해결 방법

### Option 1: 프로젝트 생성 시 슬롯 자동 생성

```java
@Transactional
public Long createProject(CreateProjectDto dto, Long memberId) {
    Member creator = memberRepository.findById(memberId)
        .orElseThrow(() -> new RuntimeException("Member not found"));

    // 1. Project 생성
    Project project = Project.builder()
        .projectTitle(dto.getProjectTitle())
        .projectDescription(dto.getProjectDescription())
        .isRecruiting(true)
        .member(creator)
        .build();

    project = projectRepository.save(project);

    // 2. ProjectMember 슬롯 생성 (parts 기반)
    createProjectMemberSlots(project, dto.getParts(), dto.getCreatorPart(), creator.getMemberId());

    return project.getProjectId();
}

private void createProjectMemberSlots(Project project, Map<String, Integer> parts,
                                      String creatorPart, Long creatorId) {
    boolean leaderAssigned = false;

    for (Map.Entry<String, Integer> entry : parts.entrySet()) {
        ProjectMember.Part part = ProjectMember.Part.valueOf(entry.getKey());
        int slotCount = entry.getValue();

        for (int i = 0; i < slotCount; i++) {
            ProjectMember.Role role = ProjectMember.Role.MEMBER;
            Long memberId = null;

            // 생성자 역할에 첫 슬롯 할당
            if (!leaderAssigned && part.name().equals(creatorPart)) {
                role = ProjectMember.Role.LEADER;
                memberId = creatorId;
                leaderAssigned = true;
            }

            ProjectMember slot = ProjectMember.builder()
                .project(project)
                .part(part)
                .role(role)
                .memberId(memberId)
                .build();

            projectMemberRepository.save(slot);
        }
    }
}
```

### Option 2: 별도 API로 슬롯 생성

프로젝트 생성 후 별도로 슬롯을 추가하는 API를 호출

## 테스트 후 예상 결과

프로젝트 생성 후 DB 확인:

```sql
mysql> SELECT * FROM project_member WHERE project_id = 12;
+-------------------+------------+-----------+--------+----------+
| project_member_id | project_id | member_id | part   | role     |
+-------------------+------------+-----------+--------+----------+
|                 1 |         12 |         1 | FRONTEND| LEADER |
|                 2 |         12 |      NULL | FRONTEND| MEMBER |
|                 3 |         12 |      NULL | BACKEND | MEMBER |
|                 4 |         12 |      NULL | BACKEND | MEMBER |
|                 5 |         12 |      NULL | BACKEND | MEMBER |
|                 6 |         12 |      NULL | DESIGN  | MEMBER |
+-------------------+------------+-----------+--------+----------+
6 rows
```

API 응답:
```json
{
  "projectId": 12,
  "currentNumberOfMembers": 1,
  "maximumNumberOfMembers": 6,
  "parts": {
    "FRONTEND": 2,
    "BACKEND": 3,
    "DESIGN": 1
  },
  "creatorPart": "FRONTEND",
  "creatorRole": "LEADER"
}
```

## 우선순위
**HIGH** - 프로젝트 모집 기능의 핵심 로직
