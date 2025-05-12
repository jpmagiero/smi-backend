import { Item } from './../item.entity';

export class DemandItem {
  id?: number;
  demandId: number;
  itemId: number;
  totalPlan: number;
  totalProduced: number;
  item?: Item;

  constructor(params: {
    demandId: number;
    itemId: number;
    totalPlan: number;
    totalProduced?: number;
    id?: number;
    item?: Item;
  }) {
    this.demandId = params.demandId;
    this.itemId = params.itemId;
    this.totalPlan = params.totalPlan;
    this.totalProduced = params.totalProduced || 0;
    this.id = params.id;
    this.item = params.item;
  }
}
