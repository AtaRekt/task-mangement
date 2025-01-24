import { pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Status enum'ı oluştur
  await db.execute(sql`
    CREATE TYPE "task_status" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');
  `);

  // Mevcut status sütununu güncelle
  await db.execute(sql`
    ALTER TABLE "tasks" 
    ALTER COLUMN "status" TYPE task_status 
    USING CASE 
      WHEN status = 0 THEN 'TODO'::task_status
      WHEN status = 1 THEN 'IN_PROGRESS'::task_status
      WHEN status = 2 THEN 'COMPLETED'::task_status
    END;
  `);

  // Order sütunu ekle
  await db.execute(sql`
    ALTER TABLE "tasks" 
    ADD COLUMN "order" integer NOT NULL DEFAULT 0;
  `);

  // Updated at sütunu ekle
  await db.execute(sql`
    ALTER TABLE "tasks" 
    ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;
  `);
}

export async function down(db: any) {
  // Order sütununu kaldır
  await db.execute(sql`
    ALTER TABLE "tasks" 
    DROP COLUMN "order";
  `);

  // Updated at sütununu kaldır
  await db.execute(sql`
    ALTER TABLE "tasks" 
    DROP COLUMN "updated_at";
  `);

  // Status sütununu integer'a geri çevir
  await db.execute(sql`
    ALTER TABLE "tasks" 
    ALTER COLUMN "status" TYPE integer 
    USING CASE 
      WHEN status = 'TODO' THEN 0
      WHEN status = 'IN_PROGRESS' THEN 1
      WHEN status = 'COMPLETED' THEN 2
    END;
  `);

  // Status enum'ı kaldır
  await db.execute(sql`
    DROP TYPE "task_status";
  `);
} 