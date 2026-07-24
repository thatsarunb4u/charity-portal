-- Record whether a customer gave consent for the masjid to retain their
-- contact details and contact them about future activities.
ALTER TABLE public.orders
ADD COLUMN contact_consent boolean NOT NULL DEFAULT false;
