import { DemandItem } from './demand-item.entity';

export enum DemandStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class Demand {
  id: number;
  startDate: Date;
  endDate: Date;
  status: DemandStatus;
  items: DemandItem[];

  constructor(props: Omit<Demand, 'id' | 'items'> & { items?: DemandItem[] }) {
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.status = props.status;
    this.items = props.items || [];
  }
}
