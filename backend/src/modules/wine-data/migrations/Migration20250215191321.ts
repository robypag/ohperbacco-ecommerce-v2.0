import { Migration } from '@mikro-orm/migrations';

export class Migration20250215191321 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "wine" add column if not exists "denominazione" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "wine" drop column if exists "denominazione";`);
  }

}
