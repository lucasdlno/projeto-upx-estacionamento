-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "ra" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" SERIAL NOT NULL,
    "numero_vaga" TEXT NOT NULL,
    "predio" TEXT NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ocupacao" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "userRA" TEXT NOT NULL,
    "data_chegada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ocupacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "numero_vaga" TEXT NOT NULL,
    "data_chegada" TIMESTAMP(3) NOT NULL,
    "data_saida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userRA" TEXT NOT NULL,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ra_key" ON "User"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "User_placa_key" ON "User"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Vaga_numero_vaga_key" ON "Vaga"("numero_vaga");

-- CreateIndex
CREATE UNIQUE INDEX "Ocupacao_vagaId_key" ON "Ocupacao"("vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "Ocupacao_userRA_key" ON "Ocupacao"("userRA");

-- AddForeignKey
ALTER TABLE "Ocupacao" ADD CONSTRAINT "Ocupacao_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocupacao" ADD CONSTRAINT "Ocupacao_userRA_fkey" FOREIGN KEY ("userRA") REFERENCES "User"("ra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_userRA_fkey" FOREIGN KEY ("userRA") REFERENCES "User"("ra") ON DELETE RESTRICT ON UPDATE CASCADE;
