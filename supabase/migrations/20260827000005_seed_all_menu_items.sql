-- ==============================================================================
-- ESTATE 1896 ARTISANAL CAFE — SEED CATEGORIES AND 24 MENU PRODUCTS
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
('c1111111-1111-1111-1111-111111111111', 'Coffee', 'coffee', 'Artisanal single-origin brews, pour-overs, and precision espresso.', 1, true),
('c2222222-2222-2222-2222-222222222222', 'Non-Coffee', 'non-coffee', 'Botanical iced teas, sparkling lemonades, and ceremonial matcha.', 2, true),
('c3333333-3333-3333-3333-333333333333', 'Food', 'food', 'Freshly toasted sourdoughs, croissants, and savory café bites.', 3, true),
('c4444444-4444-4444-4444-444444444444', 'Desserts', 'desserts', 'Artisanal cakes, brownies, and pastries.', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED ALL 24 PRODUCTS (Matches src/data/menuData.ts UUIDs)
INSERT INTO public.products (id, category_id, name, slug, description, price, is_available, is_featured, sort_order) VALUES
-- Coffee (10 Items)
('a2111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Single-Origin Espresso', 'single-origin-espresso', 'A concentrated 30ml short pull with thick hazelnut crema, high body, and notes of molasses and roasted cacao.', 180.00, true, true, 1),
('a2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Long Black / Americano', 'long-black-americano', 'Double espresso extracted directly over filtered water at 92°C to preserve crema aroma and bright citrus highlights.', 190.00, true, false, 2),
('a2333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Artisanal Cappuccino', 'artisanal-cappuccino', 'Classic third-wave cappuccino with dense, velvety microfoam and rich single-origin espresso sweetness.', 220.00, true, true, 3),
('a2444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'Estate Café Latte', 'estate-cafe-latte', 'Smooth, comforting and sweet with textured microfoam poured gracefully over a dark espresso base.', 240.00, true, true, 4),
('a2555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111', 'Single-Origin Dark Mocha', 'single-origin-dark-mocha', 'Handmade single-origin South Indian dark chocolate melted with double espresso and steamed oat or dairy milk.', 260.00, true, false, 5),
('a2666666-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111', 'Shevaroy Hills Flat White', 'shevaroy-hills-flat-white', 'Double ristretto short pull with thin micro-gloss milk foam for an espresso-forward, velvety finish.', 230.00, true, true, 6),
('a3111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Kyoto 24-Hour Cold Drip', 'kyoto-cold-drip', 'Slowly dripped drop by drop over 24 hours. Ultra-smooth mouthfeel with pronounced blueberry and cocoa notes.', 250.00, true, true, 7),
('a3222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Iced Vanilla Bean Latte', 'iced-vanilla-latte', 'Fresh double shot espresso poured over chilled whole milk, organic vanilla bean syrup, and crystal ice spheres.', 250.00, true, false, 8),
('a4111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Wild Jaggery & Cinnamon Smoked Latte', 'wild-jaggery-latte', 'Signature house recipe: palm jaggery melted under the espresso stream with cold-pressed cinnamon and oat milk.', 280.00, true, true, 9),
('a2777777-7777-7777-7777-777777777777', 'c1111111-1111-1111-1111-111111111111', 'Monsooned Malabar Reserve Cortado', 'monsooned-malabar-cortado', '16-week oceanic wind-cured Malabar beans. Heavy spiced cocoa depth balanced by silky steamed farm milk.', 210.00, true, true, 10),

-- Non-Coffee (6 Items)
('a4222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Belgian 70% Dark Hot Chocolate', 'belgian-dark-hot-chocolate', 'Rich, thick drinking chocolate made by melting 70% dark Belgian callets with steamed whole milk and sea salt.', 260.00, true, true, 11),
('a4333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'Ceremonial Japanese Uji Matcha Latte', 'ceremonial-matcha-latte', 'Stone-ground ceremonial grade green tea whisked traditionally and paired with silky oat milk and a touch of wild honey.', 280.00, true, true, 12),
('a4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'Estate Spiced Assam Milk Chai', 'estate-spiced-assam-chai', 'Brewed with fresh crushed ginger, green cardamom pods, cinnamon, and whole black peppercorns in creamy farm dairy.', 180.00, true, false, 13),
('a4555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', 'Sparkling Hibiscus Berry Iced Tea', 'sparkling-hibiscus-berry-iced-tea', 'Cold-steeped ruby hibiscus tea with wild forest berries, mint leaves, and a splash of sparkling mineral water.', 210.00, true, true, 14),
('a4666666-6666-6666-6666-666666666666', 'c2222222-2222-2222-2222-222222222222', 'Sparkling Meyer Lemon & Rosemary Soda', 'sparkling-meyer-lemon-rosemary-soda', 'Fresh Meyer lemon juice, organic cane sugar reduction, sparkling craft water, garnished with bruised rosemary.', 190.00, true, true, 15),
('a4777777-7777-7777-7777-777777777777', 'c2222222-2222-2222-2222-222222222222', 'Golden Turmeric & Almond Milk Latte', 'golden-turmeric-almond-latte', 'Organic high-curcumin Meghalaya turmeric infused with almond milk, raw ginger, and crushed black peppercorn.', 240.00, true, true, 16),

-- Food (6 Items)
('a5111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'Sourdough Caprese Panini', 'sourdough-caprese-panini', 'Toasted 72-hour sourdough bread with melted Fior di Latte mozzarella, heirloom tomatoes, house basil pesto, and aged balsamic.', 320.00, true, true, 17),
('a5222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 'Truffle Wild Mushroom Sourdough Toast', 'truffle-mushroom-toast', 'Pan-seared forest mushrooms deglazed in white wine, whipped herbed ricotta, black truffle oil on rustic toasted sourdough.', 340.00, true, true, 18),
('a5333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'Hass Avocado & Sun-Dried Tomato Toast', 'hass-avocado-tomato-toast', 'Creamy Hass avocado mash with lemon zest, Greek feta cheese, sun-dried tomatoes, and toasted pumpkin seed dukkah.', 360.00, true, true, 19),
('a5444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Spiced Pesto Paneer Brioche Panini', 'spiced-pesto-paneer-panini', 'Marinated artisanal malai paneer with chargrilled bell peppers, caramelized onions, and house mint-coriander pesto on brioche.', 310.00, true, false, 20),
('a5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', 'Classic French Butter Croissant', 'classic-butter-croissant', 'Flaky, golden, 27-layer laminated sourdough croissant served warm with whipped Normandy butter and organic forest berry preserve.', 190.00, true, false, 21),
('a5666666-6666-6666-6666-666666666666', 'c3333333-3333-3333-3333-333333333333', 'Smoked Paprika Herb Roasted Potato Wedges', 'smoked-paprika-potato-wedges', 'Oven-roasted skin-on Russet potatoes tossed in Spanish smoked paprika and sea salt, served with house garlic and chive aioli.', 220.00, true, false, 22),

-- Desserts (6 Items)
('a6111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'Twice-Baked Almond Sourdough Croissant', 'twice-baked-almond-croissant', 'Filled with velvety roasted almond frangipane cream, topped with generous toasted almond slices and dusted with vanilla icing sugar.', 220.00, true, true, 23),
('a6222222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444', 'Dark Chocolate & Maldon Sea Salt Tart', 'dark-chocolate-maldon-tart', 'Silky single-origin dark chocolate ganache in a crisp cocoa sablé pastry, finished with Maldon crystal sea salt flakes.', 250.00, true, true, 24),
('a6333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', 'Pistachio & Forest Honey Sourdough Twist', 'pistachio-honey-sourdough-twist', 'Braided soft brioche layered with stone-ground roasted pistachio paste and drizzled with raw wildflower honey syrup.', 210.00, true, false, 25),
('a6444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'Estate Espresso Demitasse Tiramisu', 'espresso-demitasse-tiramisu', 'House Savoiardi biscuits soaked in double ristretto, layered with airy whipped Italian mascarpone and dusted with Dutch cocoa.', 280.00, true, true, 26),
('a6555555-5555-5555-5555-555555555555', 'c4444444-4444-4444-4444-444444444444', 'Fudgy Sea Salt & Toasted Walnut Brownie', 'fudgy-sea-salt-walnut-brownie', 'Dense, gooey dark chocolate brownie loaded with toasted Kashmiri walnuts and finished with flaky Maldon sea salt.', 200.00, true, false, 27),
('a6666666-6666-6666-6666-666666666666', 'c4444444-4444-4444-4444-444444444444', 'Vanilla Bean Burnt Basque Cheesecake', 'vanilla-burnt-basque-cheesecake', 'Baked at intense heat to achieve a deeply caramelized amber exterior and a luscious, molten vanilla bean custard center.', 290.00, true, true, 28)
ON CONFLICT (id) DO NOTHING;
