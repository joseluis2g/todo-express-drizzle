import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("tasks", {
    id: int().primaryKey({ autoIncrement: true }),
    titulo: text("titulo", { length: 100 }).notNull(),
    descripcion: text("descripcion", { length: 500 }),
    status: text("status").notNull().default("pendiente"),
    fechaCreacion: integer("fecha_creacion", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    fechaActualizacion: integer("fecha_actualizacion", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Task = typeof tasksTable.$inferSelect;
export type NewTask = typeof tasksTable.$inferInsert;
