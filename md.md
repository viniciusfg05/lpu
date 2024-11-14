Crie um codigo que adicione faça um Project com Budget



Projeto:

Nome: Adequação, correção e vedação do telhado
description: Revisão do telhado vedação em todos os ponto de articulação
branch: DS2221
totalValue: 5.691,19 

Budget: {
    Value: 5.691,19
    
    services_per_project: {
        lp_id: "1.24.16"
        unit: 100
        type_unit: 
        description: 
    },
        services_per_project: {
        lp_id: "1.25.3"
        unit: 0.10
        type_unit: 
        description: 
    }
}


com base no "lp_id" pegue os dados de type_unit, description, value_per_unit pegue os dados de services


Schema: 

model Service {
  id String @id @default(uuid())

  lp_id       String @unique
  description String @db.Text
  unit        String // e.g., "m²", "unidade"
  value       Float // store as float for calculations

  subcategory     SubCategory @relation(fields: [sub_category_id], references: [id])
  sub_category_id String

  @@map("services")
}

model Project {

  id          String @id @default(uuid())

  name        String

  description String @db.Text

  totalValue  Float?

  branch      String



  budget Budget[]



  @@map("projects")

}

model Budget {

  id    String @id @default(uuid())

  value Float



  project_id String

  project    Project @relation(fields: [project_id], references: [id])



  services_per_project ServicesPerProject[]



  @@map("budgets")

}



model ServicesPerProject {

  id    String @id @default(uuid())

  lp_id String

  unit Float

  type_unit String?

  description String?

  value_per_unit Float?

  valueTotal Float?



  budget_id String

  budget    Budget @relation(fields: [budget_id], references: [id])



  @@map("services_per_project")

}