INSERT INTO public.rental_fees (id, rental_id, type, description, amount, status, due_date, created_at, last_updated_at)
VALUES  
    -- Rental 1 (1 Fee - Paid)
    (1, 1, 'Damage', 'Windshield cracked', 581.44, 'Paid', '2024-11-20', '2024-11-18 10:50:15.089804', '2024-11-18 10:50:15.089804'),

    -- Rental 2 (1 Fee - Unpaid)
    (2, 2, 'Late', 'Late by 2 days', 302.24, 'Unpaid', '2024-12-02', '2024-11-23 12:51:04.326595', '2024-11-23 12:51:04.326595'),

    -- Rental 3 (1 Fee - Paid)
    (3, 3, 'Cleaning', 'Interior cleaning required', 75.00, 'Paid', '2024-11-25', '2024-11-24 09:52:15.089804', '2024-11-24 09:52:15.089804'),

    -- Rental 8 (2 Fees - Paid and Unpaid)
    (4, 8, 'Damage', 'Broken side mirror', 320.00, 'Paid', '2024-11-22', '2024-11-20 15:50:15.089804', '2024-11-20 15:50:15.089804'),
    (5, 8, 'Late', 'Late by 3 days', 450.00, 'Unpaid', '2024-12-01', '2024-11-20 15:51:04.326595', '2024-11-20 15:51:04.326595'),

    -- Rental 9 (1 Fee - Paid)
    (6, 9, 'Fuel', 'Returned empty', 60.00, 'Paid', '2024-11-28', '2024-11-25 16:52:15.089804', '2024-11-25 16:52:15.089804');