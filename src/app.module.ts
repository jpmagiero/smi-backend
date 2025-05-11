import { Module } from '@nestjs/common';
import { PrismaService } from './application/adapters/database/prisma/prisma.service';
import { DemandsController } from './application/adapters/controllers/demands.controller';
import { CreateDemandUseCase } from './application/use-cases/demand/create-demand.use-case';
import { GetAllDemandsUseCase } from './application/use-cases/demand/get-all-demands.use-case';
import { GetDemandByIdUseCase } from './application/use-cases/demand/get-demand-by-id.use-case';
import { UpdateDemandUseCase } from './application/use-cases/demand/update-demand.use-case';
import { DeleteDemandUseCase } from './application/use-cases/demand/delete-demand.use-case';
import { PrismaDemandRepository } from './application/adapters/database/prisma/prisma-demand-repository';
import { PrismaItemRepository } from './application/adapters/database/prisma/prisma-item-repository';
import { PrismaDemandItemRepository } from './application/adapters/database/prisma/prisma-demand-item-repository';
import { DemandRepository } from './application/repositories/demand/demand-repository';
import { ItemRepository } from './application/repositories/item.repository';
import { DemandItemRepository } from './application/repositories/demand/demand-item-repository';

@Module({
  imports: [],
  controllers: [DemandsController],
  providers: [
    PrismaService,
    CreateDemandUseCase,
    GetAllDemandsUseCase,
    GetDemandByIdUseCase,
    UpdateDemandUseCase,
    DeleteDemandUseCase,
    PrismaDemandRepository,
    PrismaItemRepository,
    PrismaDemandItemRepository,
    { provide: DemandRepository, useClass: PrismaDemandRepository },
    { provide: ItemRepository, useClass: PrismaItemRepository },
    { provide: DemandItemRepository, useClass: PrismaDemandItemRepository },
  ],
})
export class AppModule {}
