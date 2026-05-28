// In-memory database fallback — no MongoDB required
import { v4 as uuid } from 'uuid';

type Idable = { _id: string; [key: string]: any };

class Collection<T extends Idable> {
  private data: Map<string, T> = new Map();

  async findById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    for (const item of this.data.values()) {
      let match = true;
      for (const key of Object.keys(filter)) {
        if ((item as any)[key] !== (filter as any)[key]) { match = false; break; }
      }
      if (match) return item;
    }
    return null;
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    const result: T[] = [];
    for (const item of this.data.values()) {
      let match = true;
      for (const key of Object.keys(filter)) {
        if ((item as any)[key] !== (filter as any)[key]) { match = false; break; }
      }
      if (match) result.push(item);
    }
    return result;
  }

  async create(doc: Omit<T, '_id'>): Promise<T> {
    const item = { _id: uuid(), ...doc } as unknown as T;
    this.data.set(item._id, item);
    return item;
  }

  async findByIdAndUpdate(id: string, update: Partial<T>, opts?: { new?: boolean }): Promise<T | null> {
    const existing = this.data.get(id);
    if (!existing) return null;
    Object.assign(existing, update);
    this.data.set(id, existing);
    return existing;
  }

  async findOneAndUpdate(filter: Partial<T>, update: Partial<T>, opts?: { upsert?: boolean; new?: boolean }): Promise<T> {
    let item = await this.findOne(filter);
    if (!item && opts?.upsert) {
      item = await this.create({ ...filter, ...update } as any);
      return item;
    }
    if (item) {
      Object.assign(item, update);
      this.data.set(item._id, item);
    }
    return item!;
  }

  async findByIdAndDelete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async deleteMany(filter: Partial<T>): Promise<number> {
    const toDelete = await this.find(filter);
    for (const item of toDelete) {
      this.data.delete(item._id);
    }
    return toDelete.length;
  }

  async countDocuments(filter: Partial<T> = {}): Promise<number> {
    return (await this.find(filter)).length;
  }

  // For leaderboard / sorted queries
  getAll(): T[] {
    return Array.from(this.data.values());
  }

  async select(fields: string): Promise<any> {
    // select is a Mongoose concept — in memory we just return the raw objects
    return this;
  }

  async sort(sortObj: Record<string, number>): Promise<T[]> {
    const items = this.getAll();
    const [key, dir] = Object.entries(sortObj)[0];
    items.sort((a, b) => {
      const aVal = key.split('.').reduce((o, k) => o?.[k], a as any) ?? 0;
      const bVal = key.split('.').reduce((o, k) => o?.[k], b as any) ?? 0;
      return dir === -1 ? bVal - aVal : aVal - bVal;
    });
    return items;
  }

  async skip(n: number): Promise<this & { _items: T[] }> {
    const self = this as any;
    self._skip = n;
    self._items = self.getAll().slice(n);
    return self;
  }

  async limit(n: number): Promise<T[]> {
    const all = (this as any)._items || this.getAll();
    const skip = (this as any)._skip || 0;
    return all.slice(skip, skip + n);
  }

  async save(this: { _id: string; save: () => Promise<any> } & T): Promise<any> {
    return this;
  }
}

export const db = {
  users: new Collection<any>(),
  gameProgress: new Collection<any>(),
  friends: new Collection<any>(),
  levels: new Collection<any>(),
};
