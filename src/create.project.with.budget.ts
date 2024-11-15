import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface createProjectWithBudgetProps{
    name: string;
    description: string;
    branch: string;
    servicesData: servicesDataProps[]
}

interface servicesDataProps {
    lp_id: string;
    unit: number;
    value_per_unit: number;
}

export async function CreateProjectWithBudget({ name, description, branch, servicesData }: createProjectWithBudgetProps) {
    // Dados do projeto sem os valores diretos de orçamento
    const projectData = {
        name,
        description,
        branch
    };

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
                if (serviceData.lp_id.startsWith("6.")) {
                    return {
                        lp_id: service.lp_id,
                        unit: service.unit,
                        value_per_unit: service.value_per_unit,
                        valueTotal: valueTotal,
                    };
                } else {
                    return {
                        lp_id: service.lp_id,
                        unit: service.unit,
                        type_unit: serviceData.unit,
                        description: serviceData.description,
                        value_per_unit: serviceData.value,
                        valueTotal: valueTotal,
                    };
                }


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
