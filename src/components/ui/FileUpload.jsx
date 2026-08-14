import { useRef, useState } from 'react'
import { ImagePlus, FileText, Video, Music, Check, RotateCcw, X } from 'lucide-react'
import { uploadFile } from '../../lib/storage'

const KIND_ICON = { image: ImagePlus, video: Video, document: FileText, audio: Music }
const KIND_ACCEPT = { image: 'image/png,image/jpeg,image/webp', video: 'video/mp4,video/quicktime', document: 'application/pdf', audio: 'audio/mpeg,audio/mp4,audio/wav,audio/x-m4a' }
const KIND_LABEL = { image: 'Image up to', video: 'Video up to', document: 'PDF up to', audio: 'Audio up to' }

// One reusable upload control for every "add media" moment in the app —
// lesson cover/resource/video (admin authoring) and contribution media
// (student/teacher submissions). Uploads immediately on file selection and
// reports the resulting public URL upward; the parent form just holds a
// URL string, never a File object.
export default function FileUpload({ bucket, folder, kind = 'image', maxSizeMb = 5, value, onUploaded, onClear }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const Icon = KIND_ICON[kind] || ImagePlus

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File is too large — max ${maxSizeMb}MB.`)
      return
    }
    setUploading(true)
    const { url, error: uploadError } = await uploadFile(bucket, file, { folder })
    setUploading(false)
    if (uploadError) { setError('Upload failed — please try again.'); return }
    onUploaded(url)
  }

  if (value) {
    return (
      <div className="border-2 border-zazi-teal/30 bg-zazi-teal/5 rounded-xl p-3 flex items-center gap-3">
        {kind === 'image' ? (
          <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-zazi-teal/15 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-zazi-teal" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-zazi-teal text-xs font-bold flex items-center gap-1"><Check size={12} /> Uploaded</p>
          <p className="text-zazi-navy/50 text-[11px] truncate">{value.split('/').pop()}</p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0" title="Replace">
          <RotateCcw size={13} className="text-zazi-navy/50" />
        </button>
        {onClear && (
          <button type="button" onClick={onClear} className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0" title="Remove">
            <X size={13} className="text-zazi-coral" />
          </button>
        )}
        <input ref={inputRef} type="file" accept={KIND_ACCEPT[kind]} className="hidden" onChange={handleFile} />
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-zazi-orange/40 rounded-xl p-4 flex flex-col items-center gap-1.5 bg-zazi-orange/5 disabled:opacity-60"
      >
        <Icon size={20} className="text-zazi-orange" />
        <p className="text-zazi-navy text-xs font-semibold">{uploading ? 'Uploading...' : 'Choose File'}</p>
        <p className="text-zazi-navy/40 text-[11px]">{KIND_LABEL[kind]} {maxSizeMb}MB</p>
      </button>
      {error && <p className="text-zazi-coral text-[11px] font-semibold mt-1.5">{error}</p>}
      <input ref={inputRef} type="file" accept={KIND_ACCEPT[kind]} className="hidden" onChange={handleFile} />
    </div>
  )
}
