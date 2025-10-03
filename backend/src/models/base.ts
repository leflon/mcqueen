export default class Base {
  id!: string;
  created_at!: number;
  deleted_at: number | null = null;

  get createdAt() {
    return new Date(this.created_at);
  }

  get deletedAt() {
    if (this.deleted_at) return new Date(this.deleted_at);
  }
}
