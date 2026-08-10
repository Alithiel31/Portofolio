-- /api/stats regroupe les vues par pays (groupBy(['country'])) ; cette colonne n'avait pas
-- d'index dédié, contrairement à createdAt et zone.
CREATE INDEX IF NOT EXISTS "PageView_country_idx" ON "PageView"("country");
