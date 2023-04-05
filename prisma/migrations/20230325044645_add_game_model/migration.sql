-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player_one" TEXT NOT NULL,
    "player_two" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "times" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "result" TEXT[],

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
