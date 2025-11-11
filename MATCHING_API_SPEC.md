# 매칭 서비스 백엔드 API 스펙


## 📌 개요

매칭 서비스는 사용자 간의 연결을 돕는 기능으로, 관심사, 학과, 기술 스택 등을 기반으로 추천을 제공합니다.

---

## 🔧 구현 우선순위

### ✅ Phase 1 (필수 - 쉬움)
1. **사용자 검색** - 가장 기본적인 기능
2. **같은 학과 친구 추천** - 단순 필터링
3. **인기 사용자 추천** - 팔로워 수 정렬

### 🔵 Phase 2 (선택 - 중간)
4. **관심사 기반 매칭** - 태그 매칭 로직 필요
5. **기술 스택 기반 매칭** - 기술 스택 매칭 로직 필요
6. **신규 회원 조회** - 가입일 필터링

---

## 📡 API 엔드포인트 명세

### 1. 사용자 검색

**엔드포인트**: `GET /api/v1/matching/search`

**설명**: 이름, 전공, 학번으로 사용자 검색

**Query Parameters**:
- `keyword` (required): 검색 키워드
- `type` (required): 검색 타입 (`name`, `major`, `studentId`)
- `page` (optional, default: 0): 페이지 번호 (0부터 시작)
- `size` (optional, default: 20): 페이지 크기

**Request Example**:
```http
GET /api/v1/matching/search?keyword=김철수&type=name&page=0&size=20
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "members": [
    {
      "memberId": 1,
      "memberName": "김철수",
      "memberEmail": "kim@example.com",
      "memberImageUrl": "/images/profile/1.jpg",
      "memberIntroduce": "백엔드 개발자입니다.",
      "memberDepartmentResponseDtoList": [
        {
          "departmentId": 1,
          "departmentName": "컴퓨터공학과"
        }
      ],
      "memberInterestResponseDtoList": [
        {
          "interestId": 1,
          "interestName": "웹 개발"
        }
      ],
      "memberTechStackResponseDtoList": [
        {
          "techStackId": 1,
          "techStackName": "Spring Boot"
        }
      ],
      "followerCount": 10
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "currentPage": 0
}
```

**구현 팁**:
```sql
-- 이름 검색
SELECT * FROM members WHERE member_name LIKE '%{keyword}%'

-- 전공 검색
SELECT m.* FROM members m
JOIN member_departments md ON m.member_id = md.member_id
JOIN departments d ON md.department_id = d.department_id
WHERE d.department_name LIKE '%{keyword}%'

-- 학번 검색 (학번 컬럼이 있다면)
SELECT * FROM members WHERE student_id LIKE '%{keyword}%'
```

---

### 2. 관심사 기반 매칭

**엔드포인트**: `GET /api/v1/matching/by-interests`

**설명**: 현재 로그인한 사용자의 관심 태그와 1개 이상 겹치는 사람 추천

**Query Parameters**:
- `page` (optional, default: 0): 페이지 번호
- `size` (optional, default: 20): 페이지 크기

**Request Example**:
```http
GET /api/v1/matching/by-interests?page=0&size=20
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "members": [
    {
      "memberId": 2,
      "memberName": "이영희",
      "memberEmail": "lee@example.com",
      "memberImageUrl": "/images/profile/2.jpg",
      "memberIntroduce": "프론트엔드 개발자입니다.",
      "memberDepartmentResponseDtoList": [...],
      "memberInterestResponseDtoList": [...],
      "memberTechStackResponseDtoList": [...],
      "followerCount": 15,
      "matchCount": 3,
      "commonInterests": ["웹 개발", "React", "TypeScript"]
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0
}
```

**구현 팁**:
```sql
-- 관심사 매칭 쿼리
SELECT
    m.*,
    COUNT(ft.tag_name) as match_count,
    GROUP_CONCAT(ft.tag_name) as common_interests
FROM members m
JOIN favorite_tags ft ON m.member_id = ft.member_id
WHERE ft.tag_name IN (
    SELECT tag_name
    FROM favorite_tags
    WHERE member_id = :currentUserId
)
AND m.member_id != :currentUserId
GROUP BY m.member_id
HAVING match_count > 0
ORDER BY match_count DESC
LIMIT :size OFFSET :offset
```

---

### 3. 같은 학과 친구 추천

**엔드포인트**: `GET /api/v1/matching/same-major`

**설명**: 같은 전공 + 관심 태그 1개 이상 겹치는 사람

**Query Parameters**:
- `page` (optional, default: 0): 페이지 번호
- `size` (optional, default: 20): 페이지 크기

**Request Example**:
```http
GET /api/v1/matching/same-major?page=0&size=20
Authorization: Bearer {access_token}
```

**Response**: (2번 API와 동일)

**구현 팁**:
```sql
-- 같은 학과 + 관심사 매칭
SELECT
    m.*,
    COUNT(ft.tag_name) as match_count,
    GROUP_CONCAT(ft.tag_name) as common_interests
FROM members m
JOIN member_departments md ON m.member_id = md.member_id
JOIN favorite_tags ft ON m.member_id = ft.member_id
WHERE md.department_id IN (
    SELECT department_id
    FROM member_departments
    WHERE member_id = :currentUserId
)
AND ft.tag_name IN (
    SELECT tag_name
    FROM favorite_tags
    WHERE member_id = :currentUserId
)
AND m.member_id != :currentUserId
GROUP BY m.member_id
HAVING match_count > 0
ORDER BY match_count DESC
LIMIT :size OFFSET :offset
```

---

### 4. 인기 사용자 추천

**엔드포인트**: `GET /api/v1/matching/popular`

**설명**: 팔로워 수가 많은 상위 사용자

**Query Parameters**:
- `limit` (optional, default: 20): 조회할 사용자 수

**Request Example**:
```http
GET /api/v1/matching/popular?limit=20
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "members": [
    {
      "memberId": 3,
      "memberName": "박민수",
      "memberEmail": "park@example.com",
      "memberImageUrl": "/images/profile/3.jpg",
      "memberIntroduce": "풀스택 개발자입니다.",
      "memberDepartmentResponseDtoList": [...],
      "memberInterestResponseDtoList": [...],
      "memberTechStackResponseDtoList": [...],
      "followerCount": 150
    }
  ]
}
```

**구현 팁**:
```sql
-- 팔로워 수 기준 정렬
SELECT
    m.*,
    COUNT(f.follower_id) as follower_count
FROM members m
LEFT JOIN follows f ON m.member_id = f.following_id
WHERE m.member_id != :currentUserId
GROUP BY m.member_id
ORDER BY follower_count DESC
LIMIT :limit
```

---

### 5. 기술 스택 기반 매칭

**엔드포인트**: `GET /api/v1/matching/by-tech-stack`

**설명**: 나의 기술 스택과 1개 이상 겹치는 사람

**Query Parameters**:
- `page` (optional, default: 0): 페이지 번호
- `size` (optional, default: 20): 페이지 크기

**Request Example**:
```http
GET /api/v1/matching/by-tech-stack?page=0&size=20
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "members": [
    {
      "memberId": 4,
      "memberName": "최지훈",
      "memberEmail": "choi@example.com",
      "memberImageUrl": "/images/profile/4.jpg",
      "memberIntroduce": "DevOps 엔지니어입니다.",
      "memberDepartmentResponseDtoList": [...],
      "memberInterestResponseDtoList": [...],
      "memberTechStackResponseDtoList": [...],
      "followerCount": 25,
      "stackMatchCount": 2,
      "commonStacks": ["Docker", "Kubernetes"]
    }
  ],
  "totalElements": 8,
  "totalPages": 1,
  "currentPage": 0
}
```

**구현 팁**:
```sql
-- 기술 스택 매칭
SELECT
    m.*,
    COUNT(mts.tech_stack_id) as stack_match_count,
    GROUP_CONCAT(ts.tech_stack_name) as common_stacks
FROM members m
JOIN member_tech_stacks mts ON m.member_id = mts.member_id
JOIN tech_stacks ts ON mts.tech_stack_id = ts.tech_stack_id
WHERE ts.tech_stack_id IN (
    SELECT tech_stack_id
    FROM member_tech_stacks
    WHERE member_id = :currentUserId
)
AND m.member_id != :currentUserId
GROUP BY m.member_id
HAVING stack_match_count > 0
ORDER BY stack_match_count DESC
LIMIT :size OFFSET :offset
```

---

### 6. 신규 회원 조회

**엔드포인트**: `GET /api/v1/matching/new-members`

**설명**: 최근 N일 이내 가입자

**Query Parameters**:
- `days` (optional, default: 7): 며칠 이내 가입자
- `page` (optional, default: 0): 페이지 번호
- `size` (optional, default: 20): 페이지 크기

**Request Example**:
```http
GET /api/v1/matching/new-members?days=7&page=0&size=20
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "members": [
    {
      "memberId": 5,
      "memberName": "정수진",
      "memberEmail": "jung@example.com",
      "memberImageUrl": "/images/profile/5.jpg",
      "memberIntroduce": "AI 연구자입니다.",
      "memberDepartmentResponseDtoList": [...],
      "memberInterestResponseDtoList": [...],
      "memberTechStackResponseDtoList": [...],
      "followerCount": 2,
      "joinedDate": "2025-10-28T10:30:00Z"
    }
  ],
  "totalElements": 3,
  "totalPages": 1,
  "currentPage": 0
}
```

**구현 팁**:
```sql
-- 신규 회원 조회
SELECT m.*
FROM members m
WHERE m.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
AND m.member_id != :currentUserId
ORDER BY m.created_at DESC
LIMIT :size OFFSET :offset
```

---

## 🔐 인증

모든 API는 JWT 토큰 인증이 필요합니다.

**Headers**:
```
Authorization: Bearer {access_token}
```

---

## ⚠️ 에러 응답

**4xx Client Errors**:
```json
{
  "status": 400,
  "message": "잘못된 요청입니다.",
  "timestamp": "2025-10-31T12:00:00Z"
}
```

**5xx Server Errors**:
```json
{
  "status": 500,
  "message": "서버 오류가 발생했습니다.",
  "timestamp": "2025-10-31T12:00:00Z"
}
```

---

## 📊 성능 최적화 권장사항

1. **인덱스 추가**:
   - `members.member_name`
   - `departments.department_name`
   - `favorite_tags.tag_name`
   - `member_tech_stacks.tech_stack_id`
   - `follows.following_id`

2. **캐싱**:
   - 인기 사용자 목록 (5분 캐시)
   - 전체 태그 목록 (10분 캐시)

3. **페이지네이션**:
   - 모든 리스트 API는 페이지네이션 적용
   - 기본 size는 20, 최대 100으로 제한 권장

---

## 🧪 테스트용 Mock 데이터

프론트엔드에서 백엔드 없이 테스트하려면 다음과 같이 Mock 데이터를 반환하도록 설정할 수 있습니다.

```typescript
// src/api/matching/MatchingAPI.ts 에서 임시로 사용
const MOCK_MEMBERS = [
  {
    memberId: 1,
    memberName: "김철수",
    memberEmail: "kim@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "백엔드 개발자입니다.",
    memberDepartmentResponseDtoList: [
      { departmentId: 1, departmentName: "컴퓨터공학과" }
    ],
    memberInterestResponseDtoList: [
      { interestId: 1, interestName: "웹 개발" }
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 1, techStackName: "Spring Boot" }
    ],
    followerCount: 10
  }
];
```

---

## 📝 체크리스트

- [ ] 1. 사용자 검색 API 구현
- [ ] 2. 관심사 기반 매칭 API 구현
- [ ] 3. 같은 학과 친구 추천 API 구현
- [ ] 4. 인기 사용자 추천 API 구현
- [ ] 5. 기술 스택 기반 매칭 API 구현
- [ ] 6. 신규 회원 조회 API 구현
- [ ] 7. JWT 인증 적용
- [ ] 8. 페이지네이션 적용
- [ ] 9. 에러 핸들링 구현
- [ ] 10. 인덱스 최적화

---

## 📞 문의

구현 중 문제가 있으면 프론트엔드 팀에게 연락주세요!

프론트엔드 코드 위치:
- API: `src/api/matching/MatchingAPI.ts`
- 타입: `src/types/api/matching.ts`
- 컴포넌트: `src/components/matching/`
- 페이지: `src/routes/matching-board.tsx`
