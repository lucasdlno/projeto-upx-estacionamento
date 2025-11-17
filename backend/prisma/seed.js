const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeder...');

  // Criar 10 Vagas
  const vagasParaCriar = [
    { numero_vaga: 'A1', predio: 'Bloco A' },
    { numero_vaga: 'A2', predio: 'Bloco A' },
    { numero_vaga: 'A3', predio: 'Bloco A' },
    { numero_vaga: 'A4', predio: 'Bloco A' },
    { numero_vaga: 'A5', predio: 'Bloco A' },
    { numero_vaga: 'B1', predio: 'Bloco B' },
    { numero_vaga: 'B2', predio: 'Bloco B' },
    { numero_vaga: 'B3', predio: 'Bloco B' },
    { numero_vaga: 'B4', predio: 'Bloco B' },
    { numero_vaga: 'B5', predio: 'Bloco B' },
  ];

  for (const v of vagasParaCriar) {
    const vaga = await prisma.vaga.upsert({
      where: { numero_vaga: v.numero_vaga },
      update: {},
      create: v,
    });
    console.log(`Vaga ${vaga.numero_vaga} criada ou já existente.`);
  }

  // Criar usuário Admin (se não existir)
  const admin = await prisma.user.upsert({
    where: { ra: 'admin' },
    update: {},
    create: {
      ra: 'admin',
      nome: 'Administrador',
      senha: 'admin', // Em um projeto real, use hash!
      placa: 'ADMIN-00',
      modelo: 'Sistema',
      role: 'admin',
    },
  });
  console.log(`Usuário ${admin.nome} criado ou já existente.`);

  console.log('Seeder finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });