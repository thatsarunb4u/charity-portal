-- Run this migration in the Supabase SQL editor before deploying the application change.
-- Existing orders are marked for self-collection because they did not collect this preference.
ALTER TABLE public.orders
ADD COLUMN dining_option text;

UPDATE public.orders
SET dining_option = 'collect_for_self'
WHERE dining_option IS NULL;

ALTER TABLE public.orders
ALTER COLUMN dining_option SET NOT NULL,
ADD CONSTRAINT orders_dining_option_check
CHECK (dining_option IN ('collect_for_self', 'donate'));
