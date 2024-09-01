CREATE TABLE "booking_activity" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "date" DATE NOT NULL,
  "status" TEXT CHECK(status IN ('booked', 'canceled', 'done')) DEFAULT 'booked',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "dokter_id" INTEGER NOT NULL,
  "pasien_id" INTEGER NOT NULL,
  "patient_type" TEXT CHECK(patient_type IN ('umum', 'bpjs')) NOT NULL,
  "bpjs_number" VARCHAR(25) DEFAULT NULL,
  "arrived_at" TIMESTAMP DEFAULT NULL,
  "keluhan" TEXT DEFAULT NULL,
  "penyakit" TEXT DEFAULT NULL,
  "resep" TEXT DEFAULT NULL,
  "starts_at" TIME NOT NULL,
  "ends_at" TIME NOT NULL,
  FOREIGN KEY ("dokter_id") REFERENCES "doctor" ("id"),
  FOREIGN KEY ("pasien_id") REFERENCES "patients" ("id")
);

CREATE TABLE admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);


CREATE TABLE "doctor" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "jam_kerja_start" TIME DEFAULT NULL,
  "jam_kerja_end" TIME DEFAULT NULL,
  "name" VARCHAR(255) DEFAULT NULL,
  "phone" VARCHAR(55) DEFAULT NULL,
  "email" VARCHAR(255) DEFAULT NULL,
  "foto" VARCHAR(255) DEFAULT NULL,
  "poli_id" INTEGER NOT NULL,
  FOREIGN KEY ("poli_id") REFERENCES "poli" ("id")
);

CREATE TABLE "poli" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR(55)
);

CREATE TABLE "patients" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR(255) DEFAULT NULL,
  "nik" VARCHAR(16) DEFAULT NULL,
  "address" VARCHAR(255) DEFAULT NULL,
  "phone" VARCHAR(55) DEFAULT NULL,
  "email" VARCHAR(255) DEFAULT NULL,
  "birthdate" DATE DEFAULT NULL,
  "password" VARCHAR(255) NOT NULL
);

CREATE INDEX "index_dokter_id" ON "booking_activity" ("dokter_id");

CREATE INDEX "index_pasien_id" ON "booking_activity" ("pasien_id");

CREATE INDEX "index_poli_id" ON "doctor" ("poli_id");
