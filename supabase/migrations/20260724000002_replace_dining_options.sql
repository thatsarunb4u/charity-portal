-- Run this only if the earlier dining-option migration was already applied.
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_dining_option_check;

UPDATE public.orders
SET dining_option = CASE dining_option
    WHEN 'dine_in' THEN 'collect_for_self'
    WHEN 'take_away' THEN 'collect_for_self'
    ELSE dining_option
END;

ALTER TABLE public.orders
ADD CONSTRAINT orders_dining_option_check
CHECK (dining_option IN ('collect_for_self', 'donate'));
