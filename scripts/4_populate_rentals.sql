INSERT INTO public.rentals (id, vehicle_id, customer_id, pickup_date, dropoff_date, odometer_before, odometer_after, total_price, status)
VALUES
    -- Completed Rentals
    (1, 1, 1, '2024-11-12', '2024-11-16', 69972, 71000, 639.21, 'Completed'),
    (2, 1, 4, '2024-11-17', '2024-11-22', 71000, 72150, 799.01, 'Completed'),
    (3, 2, 3, '2024-11-26', '2024-11-28', 114280, 118000, 534.11, 'Completed'),
    (8, 3, 6, '2024-11-15', '2024-11-19', 94320, 95480, 850.89, 'Completed'),
    (9, 4, 7, '2024-11-20', '2024-11-25', 153320, 154000, 743.42, 'Completed'),

    -- Ongoing Rentals (Dates adjusted to overlap 12/1/2024)
    (5, 1, 2, '2024-11-29', '2024-12-10', 72150, null, 639.21, 'Ongoing'),
    (10, 5, 3, '2024-11-30', '2024-12-10', 50210, null, 366.73, 'Ongoing'),
    (13, 8, 8, '2024-11-28', '2024-12-10', 84210, null, 801.42, 'Ongoing'),
    (15, 10, 4, '2024-11-27', '2024-12-10', 42110, null, 1124.63, 'Ongoing'),
    (17, 12, 9, '2024-11-25', '2024-12-10', 93320, null, 2670.89, 'Ongoing'),

    -- Reserved or Unpaid Rentals
    (4, 2, 1, '2024-12-25', '2024-12-27', null, null, 799.01, 'Reserved'),
    (6, 1, 10, '2024-12-12', '2024-12-17', null, null, 799.01, 'Unpaid'),
    (7, 2, 7, '2024-12-12', '2024-12-17', null, null, 799.01, 'Canceled'),
    (12, 7, 2, '2024-12-10', '2024-12-13', null, null, 1285.65, 'Reserved'),
    (16, 11, 3, '2024-12-23', '2024-12-26', null, null, 1287.99, 'Reserved'),
    (18, 13, 6, '2025-01-03', '2025-01-05', null, null, 1718.33, 'Unpaid'),
    (19, 8, 9, '2025-01-06', '2025-01-09', null, null, 801.42, 'Reserved'),
    (20, 10, 10, '2025-01-10', '2025-01-14', null, null, 1794.85, 'Unpaid');