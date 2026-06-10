-- Pillar 1: Schema with integrity constraints at the database level

CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "students_email_key" UNIQUE ("email"),
    CONSTRAINT "chk_student_age" CHECK ("date_of_birth" <= CURRENT_DATE - INTERVAL '18 years')
);

CREATE TABLE "student_profiles" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "bio" TEXT,
    "phone" VARCHAR(20),

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "student_profiles_student_id_key" UNIQUE ("student_id")
);

CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "courses_code_key" UNIQUE ("code"),
    CONSTRAINT "chk_course_credits" CHECK ("credits" > 0 AND "credits" <= 6)
);

CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "enrolled_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade" VARCHAR(2),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "enrollments_student_id_course_id_key" UNIQUE ("student_id", "course_id"),
    CONSTRAINT "chk_enrollment_grade" CHECK ("grade" IN ('A', 'B', 'C', 'D', 'F') OR "grade" IS NULL)
);

ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
