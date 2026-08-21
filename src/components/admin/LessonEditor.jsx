import { useState } from 'react'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'
import { PILLARS } from '../../data/pillars'
import { FileUpload } from '../ui'

const GRADES = [7, 8, 9, 10, 11, 12]

function emptyDraftFrom(lesson) {
  if (!lesson) {
    return {
      title: '', description: '', pillar: PILLARS[0].id, topicId: '', gradeMin: 7, gradeMax: 9, duration: 10,
      hook: '', contentBody: '', keyTakeaways: '', objectives: '', activity: '', discussion: '',
      resourceName: '', resourceContent: '', resourceFileUrl: '', coverImageUrl: '', videoUrl: '', sponsor: '',
    }
  }
  return {
    title: lesson.title || '', description: lesson.description || '', pillar: lesson.pillar, topicId: lesson.topicId || '',
    gradeMin: lesson.gradeMin, gradeMax: lesson.gradeMax, duration: lesson.duration || 10,
    hook: lesson.hook || '', contentBody: lesson.contentBody || '', keyTakeaways: (lesson.keyTakeaways || []).join('\n'),
    objectives: (lesson.objectives || []).join('\n'), activity: lesson.activity || '', discussion: lesson.discussion || '',
    resourceName: lesson.resource?.name || '', resourceContent: lesson.resource?.content || '', resourceFileUrl: lesson.resource?.fileUrl || '',
    coverImageUrl: lesson.coverImageUrl || '', videoUrl: lesson.videoUrl || '', sponsor: lesson.sponsor || '',
  }
}

function emptyQuestion() { return { question: '', options: ['', '', '', ''], correctIndex: 0 } }

export default function LessonEditor({ lesson, topics, existingQuestions, onSave, onDelete, onCancel }) {
  const [draft, setDraft] = useState(() => emptyDraftFrom(lesson))
  const [questions, setQuestions] = useState(() =>
    existingQuestions?.length ? existingQuestions.map(q => ({ question: q.question, options: q.options, correctIndex: q.correctIndex })) : []
  )
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setDraft(d => ({ ...d, [k]: e.target.value }))
  const setPillar = (e) => setDraft(d => ({ ...d, pillar: e.target.value, topicId: '' }))
  const topicsForPillar = topics.filter(t => t.pillar === draft.pillar)

  const canSave = draft.title.trim() && draft.description.trim() && draft.topicId

  const buildPayload = () => {
    const pillar = PILLARS.find(p => p.id === draft.pillar)
    return {
      title: draft.title.trim(),
      description: draft.description.trim(),
      pillar: draft.pillar,
      topicId: draft.topicId,
      gradeMin: Number(draft.gradeMin),
      gradeMax: Number(draft.gradeMax),
      duration: Number(draft.duration) || 10,
      color: pillar.color,
      hook: draft.hook.trim(),
      contentBody: draft.contentBody.trim(),
      keyTakeaways: draft.keyTakeaways.split('\n').map(s => s.trim()).filter(Boolean),
      objectives: draft.objectives.split('\n').map(s => s.trim()).filter(Boolean),
      activity: draft.activity.trim(),
      discussion: draft.discussion.trim(),
      resource: { name: draft.resourceName.trim(), type: 'PDF', content: draft.resourceContent.trim(), fileUrl: draft.resourceFileUrl || null },
      coverImageUrl: draft.coverImageUrl || null,
      videoUrl: draft.videoUrl || null,
      sponsor: draft.sponsor.trim() || null,
      contributorRole: 'Zazi Team',
    }
  }

  const handleSave = async (status) => {
    if (!canSave || saving) return
    setSaving(true)
    const validQuestions = questions.filter(q => q.question.trim() && q.options.every(o => o.trim()))
    await onSave(buildPayload(), status, validQuestions)
    setSaving(false)
  }

  const updateQuestion = (i, patch) => setQuestions(qs => qs.map((q, qi) => qi === i ? { ...q, ...patch } : q))
  const updateOption = (i, oi, val) => setQuestions(qs => qs.map((q, qi) => qi === i ? { ...q, options: q.options.map((o, oj) => oj === oi ? val : o) } : q))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-white border-b border-gray-100 z-10">
          <h3 className="font-black text-zazi-navy text-lg">{lesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
          <button onClick={onCancel} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-zazi-muted"><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <input value={draft.title} onChange={set('title')} placeholder="Lesson title" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
          <textarea value={draft.description} onChange={set('description')} rows={2} placeholder="Short description (shown in lesson cards)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select value={draft.pillar} onChange={setPillar} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
            </div>
            <div className="relative">
              <select value={draft.topicId} onChange={set('topicId')} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                <option value="">{topicsForPillar.length ? 'Select a topic' : 'No topics for this pillar'}</option>
                {topicsForPillar.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <select value={draft.gradeMin} onChange={set('gradeMin')} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                {GRADES.map(g => <option key={g} value={g}>From Gr {g}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
            </div>
            <div className="relative">
              <select value={draft.gradeMax} onChange={set('gradeMax')} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none">
                {GRADES.map(g => <option key={g} value={g}>To Gr {g}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zazi-muted pointer-events-none" />
            </div>
            <input value={draft.duration} onChange={set('duration')} type="number" placeholder="Minutes" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none" />
          </div>

          <input value={draft.hook} onChange={set('hook')} placeholder="Hook — the opening question that pulls learners in" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
          <textarea value={draft.contentBody} onChange={set('contentBody')} rows={6} placeholder="Main teaching content — separate paragraphs with a blank line" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
          <textarea value={draft.objectives} onChange={set('objectives')} rows={3} placeholder="Learning objectives — one per line" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
          <textarea value={draft.keyTakeaways} onChange={set('keyTakeaways')} rows={3} placeholder="Key takeaways — one per line" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
          <textarea value={draft.activity} onChange={set('activity')} rows={2} placeholder="Take-action activity" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
          <input value={draft.discussion} onChange={set('discussion')} placeholder="Discussion question" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />

          <div className="grid grid-cols-2 gap-3">
            <input value={draft.resourceName} onChange={set('resourceName')} placeholder="Resource name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
            <input value={draft.sponsor} onChange={set('sponsor')} placeholder="Sponsor (optional)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
          </div>
          <textarea value={draft.resourceContent} onChange={set('resourceContent')} rows={3} placeholder="Resource content (what the downloadable resource actually says)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />

          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <p className="text-zazi-navy/60 text-xs font-bold mb-1.5">Cover image</p>
              <FileUpload bucket="zazi-lesson-media" kind="image" maxSizeMb={5} value={draft.coverImageUrl} onUploaded={url => setDraft(d => ({ ...d, coverImageUrl: url }))} onClear={() => setDraft(d => ({ ...d, coverImageUrl: '' }))} />
            </div>
            <div>
              <p className="text-zazi-navy/60 text-xs font-bold mb-1.5">Lesson video</p>
              <FileUpload bucket="zazi-lesson-media" kind="video" maxSizeMb={200} value={draft.videoUrl} onUploaded={url => setDraft(d => ({ ...d, videoUrl: url }))} onClear={() => setDraft(d => ({ ...d, videoUrl: '' }))} />
            </div>
            <div>
              <p className="text-zazi-navy/60 text-xs font-bold mb-1.5">Resource file (PDF)</p>
              <FileUpload bucket="zazi-lesson-media" kind="document" maxSizeMb={20} value={draft.resourceFileUrl} onUploaded={url => setDraft(d => ({ ...d, resourceFileUrl: url }))} onClear={() => setDraft(d => ({ ...d, resourceFileUrl: '' }))} />
            </div>
          </div>

          {/* Quiz questions */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-zazi-navy font-black text-sm">Checkpoint Quiz</p>
              <button onClick={() => setQuestions(qs => [...qs, emptyQuestion()])} className="flex items-center gap-1 text-zazi-orange text-xs font-bold">
                <Plus size={13} /> Add Question
              </button>
            </div>
            {questions.length === 0 && <p className="text-zazi-muted text-xs">No quiz questions yet — optional.</p>}
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      value={q.question}
                      onChange={e => updateQuestion(i, { question: e.target.value })}
                      placeholder={`Question ${i + 1}`}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <button onClick={() => setQuestions(qs => qs.filter((_, qi) => qi !== i))} className="w-8 h-8 flex items-center justify-center text-zazi-coral flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-1.5">
                        <input type="radio" checked={q.correctIndex === oi} onChange={() => updateQuestion(i, { correctIndex: oi })} className="accent-zazi-teal flex-shrink-0" />
                        <input
                          value={opt}
                          onChange={e => updateOption(i, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none min-w-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-col gap-2 sticky bottom-0 bg-white">
          {!canSave && <p className="text-zazi-muted text-xs">Title, description and a topic are required.</p>}
          <div className="flex gap-2">
            <button onClick={() => handleSave('draft')} disabled={!canSave || saving} className="flex-1 border-2 border-zazi-teal/30 text-zazi-teal font-bold text-sm py-3 rounded-xl disabled:opacity-40">
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button onClick={() => handleSave('published')} disabled={!canSave || saving} className="flex-1 bg-zazi-orange text-white font-bold text-sm py-3 rounded-xl disabled:opacity-40">
              {saving ? 'Saving...' : 'Publish Now'}
            </button>
          </div>
          {lesson && onDelete && (
            <button onClick={() => onDelete(lesson.id)} className="text-zazi-coral text-xs font-bold py-1">Delete Lesson</button>
          )}
        </div>
      </div>
    </div>
  )
}
