DROP TABLE IF EXISTS "rental_fees" CASCADE;
DROP TABLE IF EXISTS "rentals" CASCADE;
DROP TABLE IF EXISTS "vehicles" CASCADE;
DROP TABLE IF EXISTS "customer_details" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

drop type if exists vehicle_type cascade;
drop type if exists fuel_type cascade;
drop type if exists vehicle_status cascade;
drop type if exists statuses cascade;
drop type if exists fee_type cascade;
drop type if exists user_roles cascade;

CREATE TYPE "vehicle_type" AS ENUM (
  'Sedan',
  'SUV',
  'Van',
  'Truck',
  'Other'
);

CREATE TYPE "fuel_type" AS ENUM (
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid'
);

CREATE TYPE "vehicle_status" AS ENUM (
  'Available',
  'Rented',
  'Maintenance',
  'Reserved'
);

CREATE TYPE "statuses" AS ENUM (
  'Unpaid',
  'Paid',
  'Reserved',
  'Ongoing',
  'Completed',
  'Canceled',
  'Failed'
);

CREATE TYPE "fee_type" AS ENUM (
  'Damage',
  'Late',
  'Cleaning'
);

CREATE TYPE "user_roles" AS ENUM (
  'Customer',
  'Employee'
);

CREATE TABLE "vehicles" (
  "id" SERIAL PRIMARY KEY,
  "color" VARCHAR,
  "type" vehicle_type,
  "year" VARCHAR,
  "make" VARCHAR,
  "model" VARCHAR,
  "vin" VARCHAR UNIQUE,
  "license_plate" VARCHAR UNIQUE,
  "fuel" fuel_type,
  "seat_capacity" INT,
  "odometer_reading" INT,
  "maintenance_due_date" DATE,
  "daily_rental_rate" FLOAT,
  "total_times_rented" INT,
  "status" vehicle_status DEFAULT 'Available',
  "created_at" TIMESTAMP,
  "last_updated_at" TIMESTAMP
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "role" user_roles DEFAULT 'Customer',
  "first_name" VARCHAR,
  "last_name" VARCHAR,
  "email" VARCHAR UNIQUE,
  "hashed_password" VARCHAR,
  "phone_number" VARCHAR
);

CREATE TABLE "customer_details" (
  "customer_id" INT PRIMARY KEY,
  "birth_date" DATE,
  "address_line1" VARCHAR,
  "address_line2" VARCHAR,
  "city" VARCHAR,
  "state" VARCHAR(2),
  "zip_code" VARCHAR,
  "license_number" VARCHAR,
  "policy_number" VARCHAR
);

CREATE TABLE "rentals" (
  "id" SERIAL PRIMARY KEY,
  "vehicle_id" INT,
  "customer_id" INT,
  "pickup_date" DATE,
  "dropoff_date" DATE,
  "odometer_before" INT,
  "odometer_after" INT,
  "total_price" FLOAT,
  "status" statuses DEFAULT 'Unpaid',
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "last_updated_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "rental_fees" (
  "id" SERIAL PRIMARY KEY,
  "rental_id" INT,
  "type" fee_type,
  "description" TEXT,
  "amount" FLOAT,
  "status" statuses DEFAULT 'Unpaid',
  "due_date" DATE,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "last_updated_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE "customer_details" ADD FOREIGN KEY ("customer_id") REFERENCES "users" ("id");

ALTER TABLE "rentals" ADD FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id");

ALTER TABLE "rentals" ADD FOREIGN KEY ("customer_id") REFERENCES "users" ("id");

ALTER TABLE "rental_fees" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");
