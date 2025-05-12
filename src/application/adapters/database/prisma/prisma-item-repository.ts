import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ItemRepository } from '../../../repositories/item.repository';
import { Item } from '../../../entities/item.entity';

@Injectable()
export class PrismaItemRepository extends ItemRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(item: Item): Promise<Item> {
    const created = await this.prisma.item.create({
      data: {
        sku: item.sku,
        description: item.description,
      },
    });

    return new Item({
      sku: created.sku,
      description: created.description,
      id: created.id,
    });
  }

  async createMany(items: Item[]): Promise<Item[]> {
    const createdItems = await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.item.create({
          data: {
            sku: item.sku,
            description: item.description,
          },
        }),
      ),
    );

    return createdItems.map(
      (item) =>
        new Item({
          sku: item.sku,
          description: item.description,
          id: item.id,
        }),
    );
  }

  async findAll(): Promise<Item[]> {
    const items = await this.prisma.item.findMany();

    return items.map(
      (item) =>
        new Item({
          sku: item.sku,
          description: item.description,
          id: item.id,
        }),
    );
  }

  async findByDemandId(demandId: number): Promise<Item[]> {
    const demandItems = await this.prisma.demandItem.findMany({
      where: { demandId },
      include: { item: true },
    });

    return demandItems.map(
      (demandItem) =>
        new Item({
          sku: demandItem.item.sku,
          description: demandItem.item.description,
          id: demandItem.item.id,
        }),
    );
  }

  async findBySku(sku: string): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({
      where: { sku },
    });

    return item
      ? new Item({
          sku: item.sku,
          description: item.description,
          id: item.id,
        })
      : null;
  }

  async findById(id: number): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    return item
      ? new Item({
          sku: item.sku,
          description: item.description,
          id: item.id,
        })
      : null;
  }

  async update(id: number, itemData: Partial<Item>): Promise<Item | null> {
    try {
      const updated = await this.prisma.item.update({
        where: { id },
        data: {
          sku: itemData.sku,
          description: itemData.description,
        },
      });

      return new Item({
        sku: updated.sku,
        description: updated.description,
        id: updated.id,
      });
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.item.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  async deleteByDemandId(demandId: number): Promise<boolean> {
    try {
      await this.prisma.demandItem.deleteMany({
        where: { demandId },
      });

      return true;
    } catch {
      return false;
    }
  }
}
