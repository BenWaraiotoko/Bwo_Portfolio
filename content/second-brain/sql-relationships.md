---
title: SQL Database Relationships
date: 2026-02-10
publish: true
description: Types of database relationships and how to implement them in SQL
tags:
  - sql
  - databases
  - reference
category: second-brain
---
## Overview

Database relationships define how tables connect to each other. They enforce data integrity and reduce redundancy through foreign keys and constraints.

## One-to-One (1:1)

Each row in Table A relates to exactly one row in Table B, and vice versa.

**Use case**: splitting a table for security or performance (e.g., user profile details separate from login credentials).

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

The `UNIQUE` constraint on `user_id` enforces the one-to-one relationship.

```sql
-- Query with 1:1 join
SELECT u.email, p.bio, p.avatar_url
FROM users u
JOIN user_profiles p ON u.id = p.user_id;
```

## One-to-Many (1:N)

One row in Table A relates to many rows in Table B. The most common relationship type.

**Use case**: a customer placing multiple orders, a department having multiple employees.

```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

The foreign key lives on the "many" side of the relationship.

```sql
-- All employees in a department
SELECT d.name AS department, e.name AS employee
FROM departments d
JOIN employees e ON d.id = e.department_id
WHERE d.name = 'Engineering';

-- Count employees per department
SELECT d.name, COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name;
```

## Many-to-Many (M:N)

Rows in Table A relate to many rows in Table B, and vice versa. Requires a **junction table** (also called join table or bridge table).

**Use case**: students enrolled in multiple courses, products belonging to multiple categories.

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

-- Junction table
CREATE TABLE enrollments (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

The composite primary key prevents duplicate enrollments.

```sql
-- All courses for a student
SELECT s.name, c.title
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
WHERE s.name = 'Ben';

-- Students per course
SELECT c.title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.title;
```

## Self-Referencing Relationships

A table that references itself. Used for hierarchical or recursive data.

**Use case**: organizational hierarchy, category trees, threaded comments.

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);
```

```sql
-- Find all direct reports for a manager
SELECT m.name AS manager, e.name AS report
FROM employees e
JOIN employees m ON e.manager_id = m.id;

-- Recursive CTE for full hierarchy
WITH RECURSIVE org_tree AS (
    SELECT id, name, manager_id, 0 AS depth
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM employees e
    JOIN org_tree t ON e.manager_id = t.id
)
SELECT name, depth FROM org_tree ORDER BY depth;
```

## Referential Integrity

Foreign key constraints control what happens when referenced rows are updated or deleted.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE      -- delete orders when customer is deleted
        ON UPDATE CASCADE      -- update FK when customer ID changes
);
```

| Action | Behavior |
|--------|----------|
| `CASCADE` | Propagate the change to child rows |
| `SET NULL` | Set FK to NULL (column must be nullable) |
| `SET DEFAULT` | Set FK to its default value |
| `RESTRICT` | Block the operation if child rows exist |
| `NO ACTION` | Same as RESTRICT (checked at end of statement) |

## Quick Comparison

| Relationship | FK Location | Constraint | Example |
|-------------|------------|------------|---------|
| One-to-One | Either table | `UNIQUE` on FK | User / Profile |
| One-to-Many | "Many" table | Standard FK | Department / Employees |
| Many-to-Many | Junction table | Composite PK + FKs | Students / Courses |
| Self-referencing | Same table | FK to own PK | Employee / Manager |

## Related

- [[sql-cheatsheet]]
- [[postgresql-data-pipeline-setup]]
- [[fundamentals]]

---

*Reference for SQL relationship types. Based on PostgreSQL syntax.*
