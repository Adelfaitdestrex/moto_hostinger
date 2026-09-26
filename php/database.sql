CREATE TABLE `Moto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `brand` VARCHAR(191) NOT NULL,
  `model` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `year` INT NOT NULL,
  `price` DOUBLE NOT NULL,
  `currency` VARCHAR(191) NOT NULL DEFAULT 'DA',
  `condition` VARCHAR(191) NOT NULL DEFAULT 'new',
  `status` VARCHAR(191) NOT NULL DEFAULT 'available',
  `engine` VARCHAR(191) NULL,
  `power` VARCHAR(191) NULL,
  `mileage` INT NOT NULL DEFAULT 0,
  `transmission` VARCHAR(191) NULL,
  `fuel` VARCHAR(191) NULL,
  `color` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `images` JSON NOT NULL,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `views` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Settings` (
  `id` INT NOT NULL DEFAULT 1,
  `name` VARCHAR(191) NOT NULL DEFAULT 'Maison Moto',
  `logo` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `phone` VARCHAR(191) NULL,
  `whatsapp` VARCHAR(191) NULL,
  `email` VARCHAR(191) NULL,
  `address` VARCHAR(191) NULL,
  `wilaya` VARCHAR(191) NOT NULL DEFAULT 'Tlemcen',
  `instagram` VARCHAR(191) NULL,
  `facebook` VARCHAR(191) NULL,
  `openingHours` VARCHAR(191) NULL,
  `accentColor` VARCHAR(191) NOT NULL DEFAULT '#ef4444',
  `currency` VARCHAR(191) NOT NULL DEFAULT 'DA',
  `showPrices` BOOLEAN NOT NULL DEFAULT TRUE,
  `showSoldMotos` BOOLEAN NOT NULL DEFAULT TRUE,
  `whatsappBtnText` VARCHAR(191) NOT NULL DEFAULT 'Contacter sur WhatsApp',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
