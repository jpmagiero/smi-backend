import { Module } from '@nestjs/common';
import { PrismaService } from './application/adapters/database/prisma/prisma.service';
import { DemandsController } from './application/adapters/controllers/demands.controller';
import { CreateDemandUseCase } from './application/use-cases/create-demand.use-case';
import { GetAllDemandsUseCase } from './application/use-cases/get-all-demands.use-case';
import { GetDemandByIdUseCase } from './application/use-cases/get-demand-by-id.use-case';
import { UpdateDemandUseCase } from './application/use-cases/update-demand.use-case';
import { DeleteDemandUseCase } from './application/use-cases/delete-demand.use-case';
import { PrismaDemandRepository } from './application/adapters/database/prisma/prisma-demand-repository';
import { PrismaDemandItemRepository } from './application/adapters/database/prisma/prisma-demand-item-repository';
import { DemandRepository } from './application/repositories/demand-repository';
import { DemandItemRepository } from './application/repositories/demand-item-repository';

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
    PrismaDemandItemRepository,
    { provide: DemandRepository, useClass: PrismaDemandRepository },
    { provide: DemandItemRepository, useClass: PrismaDemandItemRepository },
  ],
})
export class AppModule {}
