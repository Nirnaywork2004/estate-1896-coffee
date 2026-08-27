-- ==============================================================================
-- ESTATE 1896 ARTISANAL CAFE — PRODUCTS SEED & ORDER_ITEMS CONSTRAINT REFINEMENT
-- ==============================================================================

-- 1. Relax order_items.product_id constraint to prevent blocking orders for unseeded/seasonal products
ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- 2. SEED CATEGORIES WITH VALID HEX UUIDs
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
('c1111111-1111-1111-1111-111111111111', 'Single Origin Pour-Overs', 'single-origin-pour-overs', 'Hand-poured filter brews highlighting micro-lot estates of Chikmagalur, Coorg, and Araku Valley.', 1, true),
('c2222222-2222-2222-2222-222222222222', 'Artisanal Espresso', 'artisanal-espresso', 'Precision-extracted 9-bar espresso drinks calibrated daily for sweetness and silky texture.', 2, true),
('c3333333-3333-3333-3333-333333333333', 'Cold Craft & Nitro', 'cold-craft-nitro', '24-hour slow-dripped iced coffees, nitro draughts, and refreshing botanical infusions.', 3, true),
('c4444444-4444-4444-4444-444444444444', 'Signature Café Drinks', 'signature-cafe-drinks', 'House-crafted signatures combining Indian botanicals, wild jaggery, and single-origin beans.', 4, true),
('c5555555-5555-5555-5555-555555555555', 'Fresh Bakes & Kitchen', 'fresh-bakes-kitchen', 'Freshly laminated sourdough pastries, tea cakes, and savory breakfast toasts.', 5, true)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PRODUCTS WITH VALID HEX UUIDs (using hex 'a' prefix instead of 'p')
INSERT INTO public.products (id, category_id, name, slug, description, roast_level, origin_region, flavor_notes, price, is_available, is_featured, sort_order) VALUES
-- Espresso Category
(
    'a2111111-1111-1111-1111-111111111111',
    'c2222222-2222-2222-2222-222222222222',
    'Single-Origin Espresso',
    'single-origin-espresso',
    'A concentrated 30ml short pull with thick hazelnut crema, high body, and notes of molasses and roasted cacao.',
    'Dark',
    'Coorg, Karnataka',
    ARRAY['Dark Chocolate', 'Toasted Hazelnut', 'Molasses'],
    180.00,
    true,
    true,
    1
),
(
    'a2222222-2222-2222-2222-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'Long Black / Americano',
    'long-black-americano',
    'Double espresso extracted directly over filtered water at 92°C to preserve crema aroma and bright citrus highlights.',
    'Medium',
    'Chikmagalur, Karnataka',
    ARRAY['Caramel', 'Meyer Lemon', 'Cedar Wood'],
    190.00,
    true,
    false,
    2
),
(
    'a2333333-3333-3333-3333-333333333333',
    'c2222222-2222-2222-2222-222222222222',
    'Artisanal Cappuccino',
    'artisanal-cappuccino',
    'Classic third-wave cappuccino with dense, velvety microfoam and rich single-origin espresso sweetness.',
    'Medium',
    'Shevaroy Hills, Tamil Nadu',
    ARRAY['Brown Sugar', 'Milk Chocolate', 'Toasted Almond'],
    220.00,
    true,
    true,
    3
),
(
    'a2444444-4444-4444-4444-444444444444',
    'c2222222-2222-2222-2222-222222222222',
    'Estate Café Latte',
    'estate-cafe-latte',
    'Smooth, comforting and sweet with textured microfoam poured gracefully over a dark espresso base.',
    'Medium',
    'Chikmagalur, Karnataka',
    ARRAY['Vanilla', 'Sweet Cream', 'Pecan'],
    240.00,
    true,
    true,
    4
),
(
    'a2555555-5555-5555-5555-555555555555',
    'c2222222-2222-2222-2222-222222222222',
    'Single-Origin Dark Mocha',
    'single-origin-dark-mocha',
    'Handmade single-origin South Indian dark chocolate melted with double espresso and steamed oat or dairy milk.',
    'Medium-Dark',
    'Idukki, Kerala',
    ARRAY['Dark Cocoa', 'Malt', 'Fudge'],
    260.00,
    true,
    false,
    5
),
(
    'a2666666-6666-6666-6666-666666666666',
    'c2222222-2222-2222-2222-222222222222',
    'Shevaroy Hills Flat White',
    'shevaroy-hills-flat-white',
    'Double ristretto short pull with thin micro-gloss milk foam for an espresso-forward, velvety finish.',
    'Medium',
    'Yercaud, Tamil Nadu',
    ARRAY['Caramelized Sugar', 'Almond', 'Nougat'],
    230.00,
    true,
    true,
    6
),
(
    'a2777777-7777-7777-7777-777777777777',
    'c2222222-2222-2222-2222-222222222222',
    'Monsooned Malabar Reserve Cortado',
    'monsooned-malabar-reserve-cortado',
    '1:1 ratio of double ristretto and velvety steamed milk, highlighting the earthy spiced profile of oceanic aged beans.',
    'Dark',
    'Malabar Coast, Kerala',
    ARRAY['Bakers Chocolate', 'Walnut', 'Cardamom Smoke'],
    210.00,
    true,
    true,
    7
),

-- Pour-Overs & Signatures
(
    'a1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Chikmagalur Heritage Washed V60',
    'chikmagalur-heritage-washed-v60',
    'Grown under shade canopy at 4,200ft elevation. Clean citrus brightness balanced with wild honey sweetness and a jasmine floral finish.',
    'Light-Medium',
    'Baba Budan Giri, Karnataka',
    ARRAY['Wild Honey', 'Jasmine Florals', 'Meyer Lemon', 'Sweet Peach'],
    240.00,
    true,
    true,
    8
),
(
    'a4111111-1111-1111-1111-111111111111',
    'c4444444-4444-4444-4444-444444444444',
    'Wild Jaggery & Cinnamon Smoked Latte',
    'wild-jaggery-cinnamon-latte',
    'Organic palm jaggery from Tamil Nadu estates, Ceylon cinnamon infusion, and double ristretto over steamed oat milk.',
    'Medium',
    'Biligirirangana Hills',
    ARRAY['Warm Jaggery', 'Ceylon Cinnamon', 'Brown Butter', 'Vanilla'],
    280.00,
    true,
    true,
    9
),
(
    'a5111111-1111-1111-1111-111111111111',
    'c5555555-5555-5555-5555-555555555555',
    'Twice-Baked Almond Sourdough Croissant',
    'twice-baked-almond-croissant',
    'Fermented over 72 hours, filled with roasted almond frangipane, topped with flaked almonds and dusted with vanilla icing sugar.',
    NULL,
    'House Bakehouse',
    ARRAY['French Butter', 'Toasted Almond', 'Madagascar Vanilla'],
    220.00,
    true,
    true,
    10
)
ON CONFLICT (id) DO NOTHING;
