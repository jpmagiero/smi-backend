import { DemandStatus } from '../entities/demand/demand.entity';

export function calculateDemandStatus(
  totalPlan: number,
  totalProd: number,
): DemandStatus {
  if (totalProd === 0) {
    return DemandStatus.PLANNING;
  } else if (totalProd < totalPlan) {
    return DemandStatus.IN_PROGRESS;
  } else {
    return DemandStatus.COMPLETED;
  }
}
