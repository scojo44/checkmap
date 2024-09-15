-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "CountyType" AS ENUM ('County', 'Parish', 'IndependentCity', 'Borough', 'CityAndBorough', 'CensusArea', 'Island', 'District', 'Municipality', 'Municipio', 'UnorganizedAtoll');

-- CreateEnum
CREATE TYPE "RegionType" AS ENUM ('State', 'County');

-- CreateTable
CREATE TABLE "states" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "boundary" JSONB NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counties" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "type" "CountyType" NOT NULL DEFAULT 'County',
    "boundary" JSONB NOT NULL,
    "state_id" INTEGER NOT NULL,

    CONSTRAINT "counties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6495ed',
    "region_type" "RegionType" NOT NULL,
    "owner_name" TEXT NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'User',

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "_CountyToList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ListToState" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CountyToList_AB_unique" ON "_CountyToList"("A", "B");

-- CreateIndex
CREATE INDEX "_CountyToList_B_index" ON "_CountyToList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ListToState_AB_unique" ON "_ListToState"("A", "B");

-- CreateIndex
CREATE INDEX "_ListToState_B_index" ON "_ListToState"("B");

-- AddForeignKey
ALTER TABLE "counties" ADD CONSTRAINT "counties_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_owner_name_fkey" FOREIGN KEY ("owner_name") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToList" ADD CONSTRAINT "_CountyToList_A_fkey" FOREIGN KEY ("A") REFERENCES "counties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToList" ADD CONSTRAINT "_CountyToList_B_fkey" FOREIGN KEY ("B") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToState" ADD CONSTRAINT "_ListToState_A_fkey" FOREIGN KEY ("A") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToState" ADD CONSTRAINT "_ListToState_B_fkey" FOREIGN KEY ("B") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;
