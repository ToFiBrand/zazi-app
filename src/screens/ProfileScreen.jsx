import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Share2, Grid, Clock, Flame, Wand2, ChevronRight, Award, PartyPopper, Compass, Palette, Rocket, Cpu, Sparkles, Target, TrendingUp, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { CONTENT_TYPES } from '../data/content'
import { avatarLevelForXp, nextAvatarLevel, avatarLevelProgress } from '../data/avatarLevels'
import { Avatar, Card, Button, ProgressBar } from '../components/ui'

// Matches the `icon` string stored on each supabase/migrations/
// 0022_avatar_system.sql badge row — an explicit map (not a dynamic
// lucide-react namespace import) so the bundle only pays for the icons
// actually used here.
const BADGE_ICONS = { PartyPopper, Compass, Palette, Rocket, Cpu, Sparkles }

const STATUS_STYLE = {
  published:     { bg: '#5F977022', text: '#3F6650', label: 'Published' },
  submitted:     { bg: '#F4B84C26', text: '#8A5F14', label: 'Under Review' },
  under_review:  { bg: '#F4B84C26', text: '#8A5F14', label: 'Under Review' },
  needs_changes: { bg: '#E8603C1F', text: '#C94B2B', label: 'Needs Changes' },
  rejected:      { bg: '#E8603C1F', text: '#C94B2B', label: 'Not Approved' },
  draft:         { bg: '#17283A14', text: '#5A6B7A', label: 'Draft' },
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, school, stats, categoryMastery, weeklyProgress, contributions, earnedBadges, leaderboard, setLeaderboardOptIn } = useApp()
  const { profile, isGuest } = useAuth()
  const [activeTab, setActiveTab] = useState('creations')

  const myContent = useMemo(
    () => contributions.filter(c => c.contributorId === profile?.id),
    [contributions, profile]
  )

  const level = avatarLevelForXp(user.points || 0)
  const next = nextAvatarLevel(user.points || 0)
  const levelPct = Math.round(avatarLevelProgress(user.points || 0) * 100)

  return (
    <div className="min-h-screen bg-zazi-cream pb-[76px] md:pb-10">
      {/* Header bg */}
      <div className="h-36 relative rounded-b-[2.5rem]" style={{ background: 'linear-gradient(135deg, #FF8A00, #F4B84C)' }}>
        <div className="absolute top-5 right-6">
          <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Settings size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex items-end justify-between">
          <Avatar avatarId={user.avatarId} customization={user.avatarCustomization} size="2xl" ring />
          <div className="flex gap-2 mb-1.5">
            <Button variant="primary" size="sm" onClick={() => navigate('/create-avatar')}>Edit Profile</Button>
            <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft">
              <Share2 size={15} className="text-zazi-navy" />
            </button>
          </div>
        </div>

        {/* User info — limited, no email exposed */}
        <div className="mt-3.5">
          <h1 className="text-xl font-extrabold text-zazi-navy">
            {user.avatarCustomization?.avatarName || [user.firstName, user.lastName].filter(Boolean).join(' ')}
          </h1>
          <p className="text-zazi-navy/45 text-xs mt-0.5">{[user.grade && `Grade ${user.grade}`, school?.name].filter(Boolean).join(' · ')}</p>
          <p className="text-zazi-orange font-extrabold text-sm mt-1.5">{level.name} · Level {level.level}</p>
          <p className="text-zazi-navy/60 text-sm mt-1 leading-relaxed">{user.bio}</p>
        </div>

        {/* XP + streak */}
        <div className="mt-4 p-4 rounded-2xl bg-white shadow-soft">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-zazi-navy font-bold text-xs">{user.points || 0} XP</span>
            <span className="text-zazi-navy/40 text-[11px]">
              {next ? `${next.minXp - (user.points || 0)} XP to ${next.name}` : 'Max level reached'}
            </span>
          </div>
          <ProgressBar pct={levelPct} color="#FF8A00" height={7} />
          {stats.streakDays > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <Flame size={14} className="text-zazi-coral fill-zazi-coral" />
              <span className="text-zazi-navy text-xs font-bold">{stats.streakDays} day streak</span>
            </div>
          )}
        </div>

        {/* Guest upgrade prompt */}
        {isGuest && (
          <button
            onClick={() => navigate('/save-progress')}
            className="w-full flex items-center gap-3 bg-zazi-orange/10 border border-zazi-orange/30 rounded-2xl px-4 py-3.5 mt-4 text-left"
          >
            <div className="w-9 h-9 bg-zazi-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-zazi-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-zazi-navy text-sm font-bold">Save your progress</p>
              <p className="text-zazi-navy/50 text-xs">Turn this guest session into a real Zazi account</p>
            </div>
            <ChevronRight size={16} className="text-zazi-navy/30 flex-shrink-0" />
          </button>
        )}

        {/* My Zazi Journey */}
        <div className="mt-4 p-5 rounded-3xl bg-zazi-navy">
          <p className="text-white font-extrabold text-sm mb-3">My Zazi Journey</p>
          <div className="flex gap-7">
            {[
              { label: 'Lessons', val: stats.lessonsCompleted },
              { label: 'Creations', val: stats.creations },
              { label: 'Challenges', val: stats.challengesCompleted },
            ].map(s => (
              <div key={s.label}>
                <p className="text-zazi-gold font-extrabold text-2xl">{s.val}</p>
                <p className="text-white/50 text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My Badges */}
        {earnedBadges.length > 0 && (
          <div className="mt-4">
            <p className="text-zazi-navy font-extrabold text-sm mb-2">My Badges</p>
            <div className="flex gap-2 flex-wrap">
              {earnedBadges.map(b => {
                const Icon = BADGE_ICONS[b.icon] || Award
                return (
                  <span key={b.id} className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: b.color }}>
                    <Icon size={11} /> {b.name}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* My Avatar */}
        <button
          onClick={() => navigate('/create-avatar')}
          className="w-full mt-3 flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-soft text-left"
        >
          <div className="w-9 h-9 bg-zazi-orange/12 rounded-full flex items-center justify-center flex-shrink-0">
            <Wand2 size={16} className="text-zazi-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zazi-navy text-sm font-bold">My Avatar</p>
            <p className="text-zazi-navy/50 text-xs">Customise your character</p>
          </div>
          <ChevronRight size={16} className="text-zazi-navy/30 flex-shrink-0" />
        </button>

        {/* Missions & Challenges */}
        <button
          onClick={() => navigate('/challenges')}
          className="w-full mt-3 flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-soft text-left"
        >
          <div className="w-9 h-9 bg-zazi-teal/12 rounded-full flex items-center justify-center flex-shrink-0">
            <Target size={16} className="text-zazi-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zazi-navy text-sm font-bold">Missions & Challenges</p>
            <p className="text-zazi-navy/50 text-xs">{stats.challengesCompleted} completed</p>
          </div>
          <ChevronRight size={16} className="text-zazi-navy/30 flex-shrink-0" />
        </button>

        <button
          onClick={() => navigate('/contributor-application')}
          className="w-full mt-3 border-2 border-zazi-teal/25 text-zazi-teal font-bold text-xs py-3 rounded-2xl"
        >
          Become a Zazi Contributor →
        </button>
      </div>

      {/* Category mastery — "where am I growing?" */}
      <div className="px-6">
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-zazi-navy font-extrabold text-sm">Where I'm Growing</p>
            <span className="text-zazi-orange text-xs font-bold">Grade {user.grade}</span>
          </div>
          <div className="space-y-3">
            {categoryMastery.filter(p => p.total > 0).map(p => (
              <div key={p.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-zazi-navy/70 text-xs font-medium flex items-center gap-1.5"><p.icon size={12} style={{ color: p.color }} />{p.short}</span>
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: p.color }}>
                    {p.masteryLabel} · {p.pct}%
                  </span>
                </div>
                <ProgressBar pct={p.pct} color={p.color} height={6} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* This week vs last week — "me vs me", not a race against anyone else */}
      <div className="px-6">
        <Card className="mt-4 p-4">
          <p className="text-zazi-navy font-extrabold text-sm mb-3 flex items-center gap-1.5"><TrendingUp size={14} className="text-zazi-teal" /> This Week vs Last Week</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'XP earned', ...weeklyProgress.xp },
              { label: 'Lessons', ...weeklyProgress.lessons },
              { label: 'Challenges', ...weeklyProgress.challenges },
              { label: 'Learning days', ...weeklyProgress.learningDays },
            ].map(row => (
              <div key={row.label} className="bg-zazi-cream rounded-xl p-3">
                <p className="text-zazi-navy/50 text-[10px] font-semibold uppercase tracking-wide">{row.label}</p>
                <p className="text-zazi-navy font-extrabold text-lg mt-0.5">
                  {row.lastWeek} <span className="text-zazi-navy/30 text-sm font-medium">→</span> {row.thisWeek}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leaderboard — opt-in, weekly-XP-at-your-school only, never lifetime total */}
      <div className="px-6">
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-zazi-navy font-extrabold text-sm flex items-center gap-1.5"><Trophy size={14} className="text-zazi-gold" /> Weekly Leaderboard</p>
            <button
              onClick={() => setLeaderboardOptIn(!user.leaderboardVisible)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${user.leaderboardVisible ? 'bg-zazi-teal/12 text-zazi-teal' : 'bg-zazi-navy/8 text-zazi-navy/50'}`}
            >
              {user.leaderboardVisible ? 'Visible' : 'Join'}
            </button>
          </div>
          {user.leaderboardVisible ? (
            leaderboard.length > 0 ? (
              <div className="mt-3 space-y-2">
                {leaderboard.map((row, i) => (
                  <div key={row.profileId} className="flex items-center gap-2.5">
                    <span className="w-5 text-zazi-navy/40 text-xs font-bold">{i + 1}</span>
                    <Avatar avatarId={row.avatarId} size="xs" />
                    <span className="flex-1 text-zazi-navy text-xs font-semibold truncate">{row.firstName}</span>
                    <span className="text-zazi-gold text-xs font-bold">{row.weeklyXp} XP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zazi-navy/45 text-xs mt-2">No activity at your school yet this week — be the first!</p>
            )
          ) : (
            <p className="text-zazi-navy/45 text-xs mt-2">Opt in to see how your school is doing this week. Ranked by this week's XP only — never lifetime totals.</p>
          )}
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zazi-navy/8 mt-5 mx-6">
        <button
          onClick={() => setActiveTab('creations')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'creations' ? 'text-zazi-orange border-zazi-orange' : 'text-zazi-navy/40 border-transparent'
          }`}
        >
          <Grid size={16} /> My Creations
        </button>
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        {myContent.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-zazi-navy font-bold text-sm">You haven't created anything yet.</p>
            <p className="text-zazi-navy/50 text-xs mt-1 mb-3">Your voice belongs here.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/create')}>Create Something</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {myContent.map(item => {
              const st = STATUS_STYLE[item.status] || STATUS_STYLE.draft
              const typeInfo = CONTENT_TYPES.find(t => t.id === item.type)
              return (
                <Card key={item.id} className="p-3 flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '1C' }}>
                    {typeInfo && <typeInfo.icon size={22} style={{ color: item.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zazi-navy font-bold text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.text }}>
                        {st.label}
                      </span>
                      {(item.status === 'submitted' || item.status === 'under_review') && <Clock size={11} className="text-zazi-navy/30" />}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
