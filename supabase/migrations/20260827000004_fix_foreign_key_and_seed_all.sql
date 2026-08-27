-- ==============================================================================
-- ESTATE 1896 ARTISANAL CAFE — COMPLETE SEED & ORDER_ITEMS FOREIGN KEY FIX
-- ==============================================================================

-- 1. Relax order_items.product_id to allow NULL or valid DB product IDs
ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

-- 2. Ensure Categories Exist
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
('c1000000-0000-0000-0000-000000000001', 'Coffee', 'coffee', 'Artisanal single-origin brews, pour-overs, and espresso.', 1, true),
('c1000000-0000-0000-0000-000000000002', 'Non-Coffee', 'non-coffee', 'Botanical iced teas, sparkling lemonades, and matcha.', 2, true),
('c1000000-0000-0000-0000-000000000003', 'Food', 'food', 'Freshly toasted sourdoughs, croissants, and savory bites.', 3, true),
('c1000000-0000-0000-0000-000000000004', 'Desserts', 'desserts', 'Artisanal cakes, brownies, and pastries.', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed ALL 24 Menu Products with exact names and slugs
INSERT INTO public.products (id, category_id, name, slug, description, price, is_available, is_featured, sort_order) VALUES
-- Non-Coffee & Refreshers
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Sparkling Hibiscus Berry Iced Tea', 'sparkling-hibiscus-berry-iced-tea', 'Cold-steeped wild hibiscus flowers, mixed berries, sparkling spring water, and organic mint.', 240.00, true, true, 1),
('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Sparkling Meyer Lemon & Rosemary Soda', 'sparkling-meyer-lemon-rosemary-soda', 'Cold-pressed Himalayan Meyer lemons, bruised fresh rosemary, organic cane syrup, and sparkling soda.', 220.00, true, true, 2),
('b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Belgian 70% Dark Hot Chocolate', 'belgian-dark-hot-chocolate', 'Rich, thick drinking chocolate made by melting 70% dark Belgian callets with steamed whole milk.', 260.00, true, true, 3),
('b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Ceremonial Japanese Uji Matcha Latte', 'ceremonial-matcha-latte', 'Stone-ground ceremonial grade green tea paired with silky oat milk and wild honey.', 280.00, true, true, 4),
('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Estate Spiced Assam Milk Chai', 'estate-spiced-assam-chai', 'Brewed with crushed ginger, green cardamom, cinnamon, and black pepper in creamy farm dairy.', 180.00, true, false, 5),
('b1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Nilgiri Lavender Citrus Iced Tea', 'nilgiri-lavender-citrus-iced-tea', 'High-grown Nilgiri blue mountain black tea infused with French culinary lavender and Valencia orange.', 220.00, true, false, 6),
('b1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'Golden Turmeric & Saffron Spiced Latte', 'golden-turmeric-saffron-latte', 'Lakadong organic turmeric, Kashmiri saffron strands, black pepper, and steamed almond milk.', 240.00, true, true, 7),

-- Coffee Category
('b1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000001', 'Single-Origin Espresso', 'single-origin-espresso', 'A concentrated 30ml short pull with thick hazelnut crema and roasted cacao notes.', 180.00, true, true, 10),
('b1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000001', 'Long Black / Americano', 'long-black-americano', 'Double espresso extracted directly over filtered water at 92°C.', 190.00, true, false, 11),
('b1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000001', 'Artisanal Cappuccino', 'artisanal-cappuccino', 'Classic third-wave cappuccino with dense, velvety microfoam.', 220.00, true, true, 12),
('b1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000001', 'Estate Café Latte', 'estate-cafe-latte', 'Smooth, comforting and sweet with textured microfoam poured gracefully over espresso.', 240.00, true, true, 13),
('b1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000001', 'Single-Origin Dark Mocha', 'single-origin-dark-mocha', 'Single-origin South Indian dark chocolate melted with double espresso and steamed milk.', 260.00, true, false, 14),
('b1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000001', 'Shevaroy Hills Flat White', 'shevaroy-hills-flat-white', 'Double ristretto short pull with thin micro-gloss milk foam.', 230.00, true, true, 15),
('b1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000001', 'Kyoto 24-Hour Cold Drip', 'kyoto-cold-drip', 'Slowly dripped drop by drop over 24 hours with blueberry and cacao notes.', 250.00, true, true, 16),
('b1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000001', 'Iced Vanilla Bean Latte', 'iced-vanilla-latte', 'Fresh double shot espresso poured over chilled whole milk and organic vanilla bean syrup.', 250.00, true, false, 17),
('b1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000001', 'Wild Jaggery & Cinnamon Smoked Latte', 'wild-jaggery-latte', 'Signature palm jaggery melted under espresso with cinnamon and oat milk.', 280.00, true, true, 18),
('b1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000001', 'Monsooned Malabar Reserve Cortado', 'monsooned-malabar-cortado', '16-week oceanic wind-cured Malabar beans balanced by steamed farm milk.', 210.00, true, true, 19),

-- Food Category
('b1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000003', 'Truffled Wild Mushroom Sourdough Melt', 'truffled-mushroom-sourdough', 'Sautéed forest mushrooms, aged white cheddar, and black truffle butter on sourdough.', 340.00, true, true, 20),
('b1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000003', 'Avocado, Pickled Shallot & Dukkah Toast', 'avocado-dukkah-toast', 'Hass avocado mash, Egyptian hazelnut-coriander dukkah, and radishes on sourdough.', 320.00, true, true, 21),
('b1000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000003', 'Slow-Roasted Tomato & Basil Pesto Croissant', 'tomato-pesto-croissant', 'Laminated butter croissant filled with slow-roasted tomatoes, fresh mozzarella, and pesto.', 280.00, true, false, 22),
('b1000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000003', 'Chili Cheese & Charred Corn Toastie', 'chili-cheese-corn-toastie', 'Spiced Amul cheddar, sweet corn, finely diced birds-eye chilies, and coriander.', 260.00, true, false, 23),

-- Desserts Category
('b1000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000004', 'Filter Coffee Demitasse Tiramisu', 'filter-coffee-tiramisu', 'Savoiardi ladyfingers soaked in single-origin Chikmagalur espresso with mascarpone.', 290.00, true, true, 24),
('b1000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000004', 'Salted Caramel Sea-Salt Fudge Brownie', 'salted-caramel-brownie', '70% dark Callebaut chocolate brownie with house-made salted caramel and flaky sea salt.', 220.00, true, true, 25),
('b1000000-0000-0000-0000-000000000026', 'c1000000-0000-0000-0000-000000000004', 'Pistachio Rosewater Basbousa Cake', 'pistachio-rosewater-cake', 'Semolina sponge soaked in organic rosewater-cardamom syrup with crushed pistachios.', 240.00, true, false, 26),
('b1000000-0000-0000-0000-000000000027', 'c1000000-0000-0000-0000-000000000004', 'Madagascar Vanilla Bean Basque Cheesecake', 'basque-cheesecake', 'Caramelized burnt exterior with a custardy, rich molten center.', 310.00, true, true, 27)
ON CONFLICT (id) DO NOTHING;
