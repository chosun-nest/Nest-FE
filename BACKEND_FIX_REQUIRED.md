# 백엔드 API 수정 요청사항

## 문제 상황
프로젝트 목록/상세 API에서 모집 인원 관련 정보가 누락되거나 잘못 반환되고 있습니다.

## 현재 API 응답 (문제)
```json
{
  "projectId": 3,
  "projectTitle": "캠퍼스 중고거래 앱",
  "currentNumberOfMembers": 0,  // ❌ 항상 0
  "maximumNumberOfMembers": 0,   // ❌ 항상 0
  "parts": undefined,            // ❌ 필드 자체가 없음
  "creatorPart": undefined,      // ❌ 필드 자체가 없음
  "creatorRole": undefined       // ❌ 필드 자체가 없음
}
```

## 수정 필요 사항

### 1. ProjectSummary / ProjectDetail DTO에 필드 추가
```java
public class ProjectSummary {
    // 기존 필드들...

    // ✅ 추가 필요
    private Map<String, Integer> parts;          // 역할별 인원 (예: {"FRONTEND": 2, "BACKEND": 3})
    private String creatorPart;                  // 생성자 역할 (예: "FRONTEND")
    private String creatorRole;                  // 생성자 직책 (예: "LEADER")
    private Integer currentNumberOfMembers;      // 현재 팀원 수
    private Integer maximumNumberOfMembers;      // 최대 모집 인원
}
```

### 2. currentNumberOfMembers 계산 로직
```java
// 현재 팀원 수 = ACCEPTED 상태인 지원자 수 + 프로젝트 생성자(1명)
int currentMembers = projectMemberRepository.countByProjectIdAndStatus(projectId, "ACCEPTED") + 1;
```

### 3. maximumNumberOfMembers 계산 로직
```java
// 최대 인원 = parts의 모든 값 합산
int maxMembers = project.getParts().values().stream()
    .mapToInt(Integer::intValue)
    .sum();
```

### 4. parts 필드 반환
- DB에 저장된 parts (JSON 또는 Map 형태) 그대로 반환
- 예시: `{"FRONTEND": 2, "BACKEND": 3, "DESIGN": 1}` → 총 6명

### 5. creatorPart, creatorRole 반환
- 프로젝트 생성 시 저장된 생성자의 역할과 직책 정보를 응답에 포함

## 영향받는 API 엔드포인트
1. `GET /api/v1/projects` - 프로젝트 목록 조회
2. `GET /api/v1/projects/{id}` - 프로젝트 상세 조회
3. `GET /api/v1/projects/search` - 프로젝트 검색

## 테스트 방법
```bash
# 프로젝트 목록 API 테스트
curl -X GET "http://localhost:6030/api/v1/projects?page=0&size=5" | jq

# 프로젝트 상세 API 테스트
curl -X GET "http://localhost:6030/api/v1/projects/3" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

## 예상 정상 응답
```json
{
  "projectId": 3,
  "projectTitle": "캠퍼스 중고거래 앱",
  "currentNumberOfMembers": 3,
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
**HIGH** - 프로젝트 모집 게시판의 핵심 기능이 동작하지 않음
