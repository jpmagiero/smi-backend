export class Item {
  id?: number;
  sku: string;
  description: string;

  constructor(params: { sku: string; description: string; id?: number }) {
    this.sku = params.sku;
    this.description = params.description;
    this.id = params.id;
  }
}
