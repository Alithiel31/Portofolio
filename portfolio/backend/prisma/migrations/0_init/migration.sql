-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('WORK', 'EDUCATION');
CREATE TYPE "SkillType" AS ENUM ('MAIN', 'FRAMEWORK');

-- CreateTable Profile
CREATE TABLE "Profile" (
    "id"        SERIAL PRIMARY KEY,
    "name"      TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "bio"       TEXT NOT NULL,
    "photoUrl"  TEXT,
    "email"     TEXT,
    "location"  TEXT,
    "cvUrl"     TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable SocialLink
CREATE TABLE "SocialLink" (
    "id"        SERIAL PRIMARY KEY,
    "platform"  TEXT NOT NULL,
    "url"       TEXT NOT NULL,
    "icon"      TEXT NOT NULL,
    "order"     INTEGER NOT NULL DEFAULT 0,
    "profileId" INTEGER NOT NULL
);

-- CreateTable Experience
CREATE TABLE "Experience" (
    "id"          SERIAL PRIMARY KEY,
    "year"        TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "company"     TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type"        "ExperienceType" NOT NULL DEFAULT 'WORK',
    "order"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL
);

-- CreateTable SkillCategory
CREATE TABLE "SkillCategory" (
    "id"    SERIAL PRIMARY KEY,
    "name"  TEXT NOT NULL,
    "icon"  TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable Skill
CREATE TABLE "Skill" (
    "id"         SERIAL PRIMARY KEY,
    "name"       TEXT NOT NULL,
    "type"       "SkillType" NOT NULL DEFAULT 'MAIN',
    "parent"     TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER NOT NULL
);

-- CreateTable Project
CREATE TABLE "Project" (
    "id"          SERIAL PRIMARY KEY,
    "title"       TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "techStack"   TEXT NOT NULL,
    "imageUrl"    TEXT,
    "demoUrl"     TEXT,
    "githubUrl"   TEXT,
    "featured"    BOOLEAN NOT NULL DEFAULT false,
    "order"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL
);

-- CreateTable Service
CREATE TABLE "Service" (
    "id"          SERIAL PRIMARY KEY,
    "title"       TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon"        TEXT NOT NULL,
    "order"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL
);

-- AddForeignKey SocialLink → Profile
ALTER TABLE "SocialLink"
    ADD CONSTRAINT "SocialLink_profileId_fkey"
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey Skill → SkillCategory
ALTER TABLE "Skill"
    ADD CONSTRAINT "Skill_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "SkillCategory"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
