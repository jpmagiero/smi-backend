import { DemandItem } from './demand-item.entity';

export enum DemandStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class Demand {
  id?: number;
  startDate: Date;
  endDate: Date;
  status: DemandStatus;
  items: DemandItem[];

  constructor(params: {
    startDate: Date;
    endDate: Date;
    status: DemandStatus;
    items?: DemandItem[];
    id?: number;
  }) {
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.status = params.status;
    this.items = params.items || [];
    this.id = params.id;
  }

  get totalPlan(): number {
    return this.items.reduce((sum, item) => sum + (item.totalPlan || 0), 0);
  }

  get totalProd(): number {
    return this.items.reduce((sum, item) => sum + (item.totalProduced || 0), 0);
  }
}
