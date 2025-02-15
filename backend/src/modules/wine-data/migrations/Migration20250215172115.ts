import { Migration } from '@mikro-orm/migrations';

export class Migration20250215172115 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "wine" ("id" text not null, "vitigni" text null, "caratteristiche" text null, "regione" text null, "gradazione_alcolica" integer not null default 0, "abbinamenti" text null, "eventi" text null, "affinamento" text null, "colore" text null, "profumo" text null, "gusto" text null, "vinificazione" text null, "ecosostenibile" boolean null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "wine_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wine_vitigni" ON "wine" (vitigni) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wine_regione" ON "wine" (regione) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wine_deleted_at" ON "wine" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "wine" cascade;`);
  }

}
