import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createProjectWithBudget() {
    // Dados do projeto sem os valores diretos de orçamento
    const projectData = {
        name: "Adequação, correção e vedação do telhado",
        description: "Revisão do telhado vedação em todos os pontos de articulação",
        branch: "DS2221",
    };

    // Lista de serviços para o projeto
    const servicesData = [
        { lp_id: "1.24.16", unit: 100 },
        { lp_id: "1.25.3", unit: 0.10 },
    ];

    try {
        // Calcula o valor total do orçamento e cria a lista `services_per_project` com `valueTotal` calculado
        let totalBudgetValue = 0;
        const servicesPerProject = await Promise.all(
            servicesData.map(async (service) => {
                // Obtém os detalhes do serviço a partir do `lp_id`
                const serviceData = await prisma.service.findUnique({
                    where: { lp_id: service.lp_id },
                });

                if (!serviceData) {
                    throw new Error(`Service with lp_id ${service.lp_id} not found.`);
                }

                // Calcula o valor total para o serviço atual
                const valueTotal = serviceData.value * service.unit;
                totalBudgetValue += valueTotal;

                // Retorna os dados do serviço para criar em `services_per_project`
                return {
                    lp_id: service.lp_id,
                    unit: service.unit,
                    type_unit: serviceData.unit,
                    description: serviceData.description,
                    value_per_unit: serviceData.value,
                    valueTotal: valueTotal,
                };
            })
        );

        // Cria o projeto com o orçamento calculado
        const project = await prisma.project.create({
            data: {
                ...projectData,
                totalValue: totalBudgetValue,
                budget: {
                    create: {
                        value: totalBudgetValue,
                        services_per_project: {
                            create: servicesPerProject,
                        },
                    },
                },
            },
            include: {
                budget: {
                    include: {
                        services_per_project: true,
                    },
                },
            },
        });

        console.log("Projeto com orçamento criado e atualizado:", project);
    } catch (error) {
        console.error("Erro ao criar o projeto com orçamento:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executa a função
