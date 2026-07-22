insert into public.destinations
  (slug, name, summary, description, province, district, latitude, longitude, best_months, status, featured)
values
  ('sigiriya', 'Sigiriya', 'Ancient rock fortress rising above Sri Lanka’s Cultural Triangle.', 'Climb through landscaped gardens and fresco galleries to the fifth-century citadel.', 'Central', 'Matale', 7.957000, 80.760300, array[1,2,3,6,7,8]::smallint[], 'published', true),
  ('ella', 'Ella', 'Tea country, mountain trails and one of Asia’s most memorable train journeys.', 'A relaxed highland base for Little Adam’s Peak, Nine Arch Bridge and tea estates.', 'Uva', 'Badulla', 6.866700, 81.046600, array[1,2,3,7,8,9]::smallint[], 'published', true),
  ('galle-fort', 'Galle Fort', 'A living coastal fort shaped by centuries of Sri Lankan and European history.', 'Walk ramparts, lanes, museums and cafes inside the UNESCO-listed old town.', 'Southern', 'Galle', 6.026000, 80.217000, array[1,2,3,12]::smallint[], 'published', true)
on conflict (slug) do nothing;
