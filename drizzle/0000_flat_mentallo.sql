CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text(100) NOT NULL,
	`descripcion` text(500),
	`status` text DEFAULT 'pendiente' NOT NULL,
	`fecha_creacion` integer NOT NULL,
	`fecha_actualizacion` integer NOT NULL
);
