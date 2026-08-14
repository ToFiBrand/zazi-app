import { supabase } from './supabase'

// Uploads before the row that will reference it exists — every caller
// (lesson authoring, contribution submission) inserts its DB row only
// after this resolves, so there's never a lesson/contribution pointing at
// a file that failed to upload.
//
// `folder`, when given, becomes the first path segment — for
// contribution-media this MUST be the uploader's own auth.uid() to match
// the storage RLS policy in supabase/migrations/0027_storage_and_lesson_admin.sql.
export async function uploadFile(bucket, file, { folder } = {}) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = folder ? `${folder}/${crypto.randomUUID()}-${safeName}` : `${crypto.randomUUID()}-${safeName}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) return { url: null, error }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
