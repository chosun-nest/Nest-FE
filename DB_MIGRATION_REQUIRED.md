# 데이터베이스 마이그레이션 필요

## 문제 상황
`project` 테이블에 프로젝트 모집 인원 관련 필수 컬럼들이 누락되어 있습니다.

## 현재 테이블 구조
```sql
SELECT * FROM project WHERE project_id = 11;

-- 컬럼:
-- project_id, created_at, updated_at, image_urls,
-- is_recruiting, member_id, project_description,
-- project_title, view_count
```

## 필요한 마이그레이션

### Option 1: JSON 컬럼 사용 (권장)

```sql
ALTER TABLE project
ADD COLUMN parts JSON COMMENT '역할별 인원 구성 {"FRONTEND": 2, "BACKEND": 3}',
ADD COLUMN creator_part VARCHAR(50) COMMENT '생성자 역할 (FRONTEND, BACKEND, etc)',
ADD COLUMN creator_role VARCHAR(50) COMMENT '생성자 직책 (LEADER, MEMBER)',
ADD COLUMN maximum_number_of_members INT DEFAULT 0 COMMENT '최대 모집 인원',
ADD COLUMN current_number_of_members INT DEFAULT 0 COMMENT '현재 팀원 수';
```

### Option 2: 별도 테이블 사용

```sql
-- 프로젝트 역할 테이블
CREATE TABLE project_part (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    part VARCHAR(50) NOT NULL COMMENT 'FRONTEND, BACKEND, PM, DESIGN, AI, ETC',
    count INT NOT NULL COMMENT '해당 역할 필요 인원',
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
);

-- project 테이블에 생성자 정보 추가
ALTER TABLE project
ADD COLUMN creator_part VARCHAR(50) COMMENT '생성자 역할',
ADD COLUMN creator_role VARCHAR(50) DEFAULT 'LEADER' COMMENT '생성자 직책';
```

## 데이터 예시

### parts (JSON)
```json
{
  "FRONTEND": 2,
  "BACKEND": 3,
  "DESIGN": 1
}
```

### 계산 로직

#### currentNumberOfMembers
```sql
-- ACCEPTED 상태 멤버 수 + 프로젝트 생성자(1명)
SELECT COUNT(*) + 1
FROM project_application
WHERE project_id = ? AND status = 'ACCEPTED';
```

#### maximumNumberOfMembers
```sql
-- parts JSON의 모든 값 합산
SELECT SUM(value)
FROM JSON_TABLE(
    parts, '$.*' COLUMNS(value INT PATH '$')
) AS jt;
```

## Spring Boot Entity 예시

```java
@Entity
@Table(name = "project")
public class Project {
    // 기존 필드들...

    @Column(name = "parts", columnDefinition = "JSON")
    @Convert(converter = JsonConverter.class)
    private Map<String, Integer> parts;

    @Column(name = "creator_part", length = 50)
    private String creatorPart;

    @Column(name = "creator_role", length = 50)
    private String creatorRole;

    @Column(name = "maximum_number_of_members")
    private Integer maximumNumberOfMembers;

    @Column(name = "current_number_of_members")
    private Integer currentNumberOfMembers;
}
```

## 마이그레이션 순서

1. **개발 DB에서 먼저 테스트**
   ```bash
   # 백업
   mysqldump -u root -p nest_db > backup_before_migration.sql

   # 마이그레이션 실행
   mysql -u root -p nest_db < migration.sql
   ```

2. **기존 프로젝트 데이터 업데이트**
   ```sql
   -- 기존 프로젝트에 기본값 설정
   UPDATE project
   SET creator_part = 'FRONTEND',
       creator_role = 'LEADER',
       parts = '{"FRONTEND": 1}',
       maximum_number_of_members = 1,
       current_number_of_members = 1
   WHERE parts IS NULL;
   ```

3. **백엔드 코드 업데이트**
   - Entity 클래스에 새 필드 추가
   - DTO에 새 필드 추가
   - Repository 쿼리 수정
   - Service 로직에서 계산 추가

4. **테스트**
   - 새 프로젝트 생성 테스트
   - parts 정보가 DB에 저장되는지 확인
   - API 응답에 포함되는지 확인

## 긴급도
**CRITICAL** - 프로젝트 모집 핵심 기능이 완전히 동작하지 않음

## 체크리스트
- [ ] DB 마이그레이션 스크립트 작성
- [ ] 개발 DB에서 테스트
- [ ] Entity 클래스 수정
- [ ] Repository 쿼리 수정
- [ ] Service 계산 로직 추가
- [ ] 기존 데이터 마이그레이션
- [ ] 프론트엔드에서 테스트
