import { Migration } from '@mikro-orm/migrations';

export class Migration20250226160839 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "wine" add column if not exists "synced" text null default 'not-synced';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "wine" drop column if exists "synced";`);
  }

}
