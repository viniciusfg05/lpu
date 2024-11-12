const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser'); // Para ler o CSV
const prisma = new PrismaClient();

// Função para criar ou buscar uma categoria
async function createCategory(categoryName) {
  return prisma.category.upsert({
    where: { name: categoryName },
    update: {},
    create: {
      name: categoryName,
    },
  });
}

// Função para criar ou buscar uma subcategoria vinculada à categoria
async function createSubCategory(categoryId, subCategoryName) {
    return prisma.subCategory.upsert({
        where: { name: subCategoryName },
        update: {},
        create: {
          name: subCategoryName,
          category_id: categoryId,
        },
      });
  }
  
  

// Função para criar os serviços
async function createService(subCategoryId, lpId, description, unit, value) {
  return prisma.service.create({
    data: {
        description: description,
        value: parseFloat(value.replace(",", ".")),
        lp_id: lpId,
        unit: unit,
        sub_category_id: subCategoryId,
    },
  });
}

// Função principal que processa o arquivo CSV
async function processCSV() {
  const results = [];

  // Lê o arquivo CSV
  fs.createReadStream('./lpu.csv')  // Certifique-se de que o arquivo esteja na raiz do projeto
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      // Processa cada linha do CSV
      for (const row of results) {
        const { Categoria, Subcategoria, Serviço, Descrição, Unidade, Valor } = row;

        // 1. Criar a categoria
        let category = await createCategory(Categoria);

        // 2. Criar a subcategoria vinculada à categoria
        let subCategory = await createSubCategory(category.id, Subcategoria);

        // 3. Criar o serviço vinculado à subcategoria
        await createService(subCategory.id, Serviço, Descrição, Unidade, Valor);
      }

      console.log('CSV processado e dados adicionados ao banco.');
      await prisma.$disconnect();
    });
}

// Chama a função para processar o CSV
processCSV().catch((error) => {
  console.error('Erro ao processar o CSV:', error);
});
