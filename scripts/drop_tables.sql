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