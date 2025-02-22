import { Migration } from '@mikro-orm/migrations';

export class Migration20250215235534 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "wine" add column if not exists "temperatura_servizio" text null, add column if not exists "bicchiere" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "wine" drop column if exists "temperatura_servizio", drop column if exists "bicchiere";`);
  }

}
