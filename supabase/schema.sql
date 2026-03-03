-- TEDxConegliano Copy Agent — Database Schema
-- Run this in the Supabase SQL Editor to create the required table.

CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  topic TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'email')),
  style_params JSONB NOT NULL,
  edition_theme_active BOOLEAN DEFAULT false,
  output_options JSONB NOT NULL,
  generated_copy TEXT NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  correction TEXT,
  model TEXT NOT NULL
);

-- Index for fast few-shot example lookup
CREATE INDEX idx_generations_platform_rating ON generations (platform, rating DESC)
  WHERE rating IS NOT NULL;
