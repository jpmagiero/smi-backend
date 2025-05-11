export class DemandItem {
  id: number;
  sku: string;
  totalPlan: number;
  demandId: number;

  constructor(props: Omit<DemandItem, 'id'>) {
    this.sku = props.sku;
    this.totalPlan = props.totalPlan;
    this.demandId = props.demandId;
  }
}
