import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Rocket, Target, Trophy, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { pillarById } from '../data/pillars'
import { DIFFICULTY_LABEL } from '../data/xpValues'
import { Card, Button, Chip } from '../components/ui'

const TYPE_LABEL = { knowledge: 'Knowledge Check', practical: 'Practical Challenge', creator: 'Creator Challenge', community: 'Community Challenge' }

export default function ChallengesScreen() {
  const navigate = useNavigate()
  const {
    todaysMission, myTodaysMissionProgress,
    weeklyMission, myWeeklyMissionProgress, startMission, toggleMissionStep,
    challenges, userChallenges, startChallenge, completeKnowledgeChallenge,
  } = useApp()

  const statusFor = (challengeId) => userChallenges.find(uc => uc.challengeId === challengeId)?.status || null

  return (
    <div className="min-h-screen bg-zazi-cream pb-8">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate('/home')} className="w-9 h-9 flex items-center justify-center -ml-2">
          <ChevronLeft size={20} className="text-zazi-navy" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-zazi-navy">Missions & Challenges</h1>
          <p className="text-zazi-navy/45 text-xs">Real-world skills, one step at a time</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Today's mission */}
        {todaysMission && (
          <Card className="p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Target size={15} className="text-zazi-orange" />
              <p className="text-zazi-orange text-[11px] font-bold uppercase tracking-wide">Today's Mission</p>
            </div>
            <h2 className="text-zazi-navy font-extrabold text-base">{todaysMission.title}</h2>
            <p className="text-zazi-navy/55 text-sm mt-1 leading-relaxed">{todaysMission.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-zazi-gold text-xs font-bold">+{todaysMission.xpReward} XP</span>
              {myTodaysMissionProgress?.status === 'completed' ? (
                <span className="flex items-center gap-1 text-zazi-teal text-xs font-bold"><Check size={14} /> Complete</span>
              ) : (
                <Button variant="primary" size="sm" onClick={() => navigate(`/learn?pillar=${todaysMission.pillar}`)}>
                  Explore {pillarById(todaysMission.pillar)?.short} Lessons
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Weekly mission */}
        {weeklyMission && (
          <Card className="p-5 bg-zazi-navy" style={{ background: '#17283A' }}>
            <div className="flex items-center gap-2 mb-2">
              <Rocket size={15} className="text-zazi-gold" />
              <p className="text-zazi-gold text-[11px] font-bold uppercase tracking-wide">Weekly Mission</p>
            </div>
            <h2 className="text-white font-extrabold text-lg">{weeklyMission.title}</h2>
            <p className="text-white/60 text-sm mt-1 leading-relaxed">{weeklyMission.description}</p>

            {!myWeeklyMissionProgress ? (
              <Button variant="primary" size="sm" className="mt-4" onClick={() => startMission(weeklyMission.id, 'weekly')}>
                Start Mission
              </Button>
            ) : (
              <>
                <div className="mt-4 space-y-2.5">
                  {weeklyMission.steps.map((step, i) => {
                    const done = !!myWeeklyMissionProgress.stepProgress[i]
                    return (
                      <button
                        key={i}
                        onClick={() => toggleMissionStep(myWeeklyMissionProgress.id, i, weeklyMission.steps.length)}
                        disabled={myWeeklyMissionProgress.status === 'completed'}
                        className="w-full flex items-center gap-3 text-left"
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-zazi-teal' : 'bg-white/15'}`}>
                          {done && <Check size={12} strokeWidth={3} className="text-white" />}
                        </span>
                        <span className={`text-sm flex-1 ${done ? 'text-white/50 line-through' : 'text-white'}`}>{step.label}</span>
                        {step.xp && <span className="text-zazi-gold text-[11px] font-bold">+{step.xp} XP</span>}
                      </button>
                    )
                  })}
                </div>
                {myWeeklyMissionProgress.status === 'completed' ? (
                  <p className="flex items-center gap-1.5 text-zazi-teal text-sm font-bold mt-4"><Trophy size={15} /> Mission complete — +{weeklyMission.xpReward} XP earned</p>
                ) : (
                  <p className="text-white/40 text-xs mt-4">{Object.values(myWeeklyMissionProgress.stepProgress).filter(Boolean).length}/{weeklyMission.steps.length} steps done · +{weeklyMission.xpReward} XP total</p>
                )}
              </>
            )}
          </Card>
        )}

        {/* Challenges by difficulty */}
        <div>
          <h3 className="font-extrabold text-zazi-navy text-sm mb-3">Challenges</h3>
          <div className="space-y-3">
            {challenges.map(c => {
              const status = statusFor(c.id)
              const pillar = pillarById(c.pillar)
              return (
                <Card key={c.id} className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Chip color={pillar?.color}>{DIFFICULTY_LABEL[c.difficulty]}</Chip>
                    <span className="text-zazi-navy/40 text-[10px] font-semibold uppercase tracking-wide">{TYPE_LABEL[c.type]}</span>
                  </div>
                  <p className="text-zazi-navy font-bold text-sm">{c.title}</p>
                  <p className="text-zazi-navy/50 text-xs mt-1 leading-relaxed">{c.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-zazi-gold text-xs font-bold">+{c.xpReward} XP</span>
                    {status === 'completed' ? (
                      <span className="flex items-center gap-1 text-zazi-teal text-xs font-bold"><Check size={13} /> Complete</span>
                    ) : c.type === 'knowledge' ? (
                      status === 'started' ? (
                        <Button variant="teal" size="sm" onClick={() => completeKnowledgeChallenge(c.id)}>I've Got This — Complete</Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => startChallenge(c.id)}>Start</Button>
                      )
                    ) : (
                      status === 'started' ? (
                        <Button variant="teal" size="sm" onClick={() => navigate(`/create/challenge_submission?challengeId=${c.id}`)}>Submit Your Work →</Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => startChallenge(c.id)}>Start</Button>
                      )
                    )}
                  </div>
                </Card>
              )
            })}
            {challenges.length === 0 && (
              <Card className="p-6 text-center">
                <Lock size={20} className="text-zazi-navy/25 mx-auto mb-2" />
                <p className="text-zazi-navy/50 text-sm">No challenges available yet.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
