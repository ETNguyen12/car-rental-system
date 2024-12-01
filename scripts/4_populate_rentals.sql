insert into public.rentals (id, vehicle_id, customer_id, pickup_date, dropoff_date, odometer_before, odometer_after, total_price, status)
values
    (1, 1, 1, '2024-11-12', '2024-11-16', 69972, 71000, 639.21, 'Completed'),
    (2, 1, 4, '2024-11-17', '2024-11-22', 71000, 72150, 799.01, 'Completed'),
    (3, 2, 3, '2024-11-26', '2024-11-28', 114280, 118000, 534.11, 'Completed'),
    (4, 2, 1, '2024-12-25', '2024-12-27', null, null, 799.01, 'Canceled'),
    (5, 1, 2, '2024-11-29', '2024-12-03', null, null, 799.01, 'Reserved'),
    (6, 1, 6, '2024-12-12', '2024-12-17', null, null, 799.01, 'Unpaid'),
    (7, 2, 7, '2024-12-12', '2024-12-17', null, null, 799.01, 'Reserved');