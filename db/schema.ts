import { pgTable, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { v4 as uuidv4 } from 'uuid';

export const userTable = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    password_hash: text("password_hash").notNull(),
    role: integer("role").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id),
    expiresAt: timestamp("expires_at").notNull()
});

// Task durumları için enum
export const taskStatusEnum = pgEnum('task_status', ['TODO', 'IN_PROGRESS', 'COMPLETED'])

// Proje tablosu
export const projectTable = pgTable("project", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),
    name: text("name").notNull(),
    description: text("description"),
    deadline: timestamp("deadline").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Task tablosu - Yeni tablo adı task_new olsun geçiş için
export const taskTable = pgTable("task", {
    id: text("id").primaryKey().$defaultFn(() => uuidv4()),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default('TODO'),
    order: integer("order").notNull().default(0),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projectTable.id, { onDelete: "cascade" }),
    deadline: timestamp("deadline").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// İlişkileri tanımlayalım
export const userRelations = relations(userTable, ({ many }) => ({
    tasks: many(taskTable),
    sessions: many(sessionTable)
}));

export const projectRelations = relations(projectTable, ({ many }) => ({
    tasks: many(taskTable)
}));

export const taskRelations = relations(taskTable, ({ one }) => ({
    user: one(userTable, {
        fields: [taskTable.userId],
        references: [userTable.id],
    }),
    project: one(projectTable, {
        fields: [taskTable.projectId],
        references: [projectTable.id],
    }),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
    user: one(userTable, {
        fields: [sessionTable.userId],
        references: [userTable.id],
    }),
}));