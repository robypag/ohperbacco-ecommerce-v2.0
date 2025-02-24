import { Migration } from "@mikro-orm/migrations";

export class Migration2025024150711 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table if exists "wine" add column if not exists "produttore" text null;`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table if exists "wine" drop column if exists "produttore";`);
    }
}
