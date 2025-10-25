/*
  # Update Souls Table for Archetype System

  1. Changes to `souls` table
    - Add `archetype` column to store archetype name
    - Update element CHECK constraint to match new element types
    - Update alignment CHECK constraint to match new alignment types
    - Update rarity CHECK constraint (already matches)
    - Make element, alignment, rarity nullable for flexibility

  2. Notes
    - Preserves all existing data
    - Uses IF NOT EXISTS pattern for safety
    - Updates constraints to match Phase 1 type definitions
*/

-- Add archetype column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'souls' AND column_name = 'archetype'
  ) THEN
    ALTER TABLE souls ADD COLUMN archetype text;
  END IF;
END $$;

-- Drop old constraints if they exist
DO $$
BEGIN
  ALTER TABLE souls DROP CONSTRAINT IF EXISTS souls_element_check;
  ALTER TABLE souls DROP CONSTRAINT IF EXISTS souls_alignment_check;
  ALTER TABLE souls DROP CONSTRAINT IF EXISTS souls_rarity_check;
END $$;

-- Make columns nullable for backward compatibility
ALTER TABLE souls ALTER COLUMN element DROP NOT NULL;
ALTER TABLE souls ALTER COLUMN alignment DROP NOT NULL;
ALTER TABLE souls ALTER COLUMN rarity DROP NOT NULL;

-- Add new constraints matching our archetype system
ALTER TABLE souls ADD CONSTRAINT souls_element_check 
  CHECK (element IS NULL OR element IN (
    'celestial', 'nature', 'digital', 'fire', 'water', 'shadow', 
    'electric', 'crystal', 'solar', 'lunar', 'desert', 'ether', 
    'quantum', 'sky', 'frost', 'neon'
  ));

ALTER TABLE souls ADD CONSTRAINT souls_alignment_check 
  CHECK (alignment IS NULL OR alignment IN (
    'guardian', 'healer', 'oracle', 'wanderer', 'warrior', 'sage', 'mystic'
  ));

ALTER TABLE souls ADD CONSTRAINT souls_rarity_check 
  CHECK (rarity IS NULL OR rarity IN (
    'common', 'rare', 'epic', 'legendary'
  ));
