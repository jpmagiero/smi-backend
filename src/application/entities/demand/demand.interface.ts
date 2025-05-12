import { DemandStatus } from './demand.entity';

export interface DemandSummary {
  id: number;
  startDate: Date;
  endDate: Date;
  totalPlan: number;
  totalProd: number;
  status: DemandStatus;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    cursor: string | null;
    hasNextPage: boolean;
    totalCount?: number;
  };
}
