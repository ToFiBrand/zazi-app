import { supabase } from './supabase'

export const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
]

// Used when a student's school isn't in the existing list. Requires an
// authenticated session (see "Authenticated users can add a school" in
// supabase/migrations/0030_school_self_add.sql). Checks for an existing
// same-name school first (case-insensitive) so two students typing the
// same school don't create duplicate rows — not full fuzzy matching, just
// enough to catch the common case of two people typing the exact name.
export async function findOrCreateSchool({ name, province, district }) {
  const trimmedName = name.trim()
  const { data: existing } = await supabase
    .from('schools')
    .select('id')
    .ilike('name', trimmedName)
    .maybeSingle()
  if (existing) return { id: existing.id, error: null }

  const { data, error } = await supabase
    .from('schools')
    .insert({ name: trimmedName, province, district: district?.trim() || null })
    .select('id')
    .single()
  if (error) return { id: null, error }
  return { id: data.id, error: null }
}
