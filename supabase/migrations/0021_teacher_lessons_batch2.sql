do $$
declare
  t0_id uuid;
  t1_id uuid;
  t2_id uuid;
  t3_id uuid;
  t4_id uuid;
  t5_id uuid;
  t6_id uuid;
  t7_id uuid;
  t8_id uuid;
  t9_id uuid;
  t10_id uuid;
  t11_id uuid;
  l0_id uuid;
  l1_id uuid;
  l2_id uuid;
  l3_id uuid;
  l4_id uuid;
  l5_id uuid;
  l6_id uuid;
  l7_id uuid;
  l8_id uuid;
  l9_id uuid;
  l10_id uuid;
  l11_id uuid;
begin
  insert into public.topics (pillar, name, description, sort_order) values ('career', 'Exploring the World of Work', 'What different jobs actually look like, day to day.', 3) returning id into t0_id;
  insert into public.topics (pillar, name, description, sort_order) values ('career', 'CV & Interview Skills', 'Turning what you’ve done into something an employer can say yes to.', 4) returning id into t1_id;
  insert into public.topics (pillar, name, description, sort_order) values ('finance', 'Banking Basics', 'Accounts, cards and how to make saving automatic.', 3) returning id into t2_id;
  insert into public.topics (pillar, name, description, sort_order) values ('finance', 'Payslips, Tax & Your First Job', 'Reading a payslip and understanding where your money actually goes.', 4) returning id into t3_id;
  insert into public.topics (pillar, name, description, sort_order) values ('digital', 'Online Privacy & Passwords', 'Locking your digital front door before something goes wrong.', 3) returning id into t4_id;
  insert into public.topics (pillar, name, description, sort_order) values ('digital', 'Skills for the Digital Economy', 'What the digital job market actually rewards, and how to start.', 4) returning id into t5_id;
  insert into public.topics (pillar, name, description, sort_order) values ('entrepreneurship', 'Understanding Money in a Business', 'Costs, pricing and profit — the maths behind any business.', 3) returning id into t6_id;
  insert into public.topics (pillar, name, description, sort_order) values ('entrepreneurship', 'Marketing Your Idea on a Budget', 'Getting people to know about what you’ve built, for free.', 4) returning id into t7_id;
  insert into public.topics (pillar, name, description, sort_order) values ('leadership', 'Teamwork & Working With Others', 'Getting a group to actually function, not just coexist.', 3) returning id into t8_id;
  insert into public.topics (pillar, name, description, sort_order) values ('leadership', 'Handling Conflict & Giving Feedback', 'Saying the hard thing without wrecking the relationship.', 4) returning id into t9_id;
  insert into public.topics (pillar, name, description, sort_order) values ('civic', 'Volunteering & Giving Back', 'Small, real ways to contribute to the people around you.', 3) returning id into t10_id;
  insert into public.topics (pillar, name, description, sort_order) values ('civic', 'Understanding Local Government', 'Who actually runs your area, and how to reach them.', 4) returning id into t11_id;
  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Exploring the World of Work', 'A tour of what work actually looks like across different industries — beyond doctor, lawyer, teacher — so you know what you’re even choosing between.', 'career', t0_id, 7, 9, 11, ARRAY['Name at least 5 career fields beyond the most commonly mentioned ones','Explain the difference between a job, a career and an industry','Identify one way to learn more about a job that interests them']::text[], 'There are thousands of jobs that never get mentioned at career day — most of what people actually do for work, nobody explained to you.', 'Ask a Grade 8 class to name a career, and you''ll hear the same six answers every time: doctor, lawyer, teacher, engineer, police officer, nurse. Not because those are the only good jobs — because they''re the only ones anyone bothered to explain.

There''s a difference between a job (a specific role, like "till operator at a supermarket"), a career (a path built from related jobs over time, like "retail management"), and an industry (the whole sector those jobs sit in, like "retail and logistics"). Understanding this helps because most people don''t pick an industry first — they discover a job they didn''t know existed, and it opens a whole industry they''d never considered.

South Africa''s economy has entire industries most learners never hear about at school: logistics and supply chain (someone has to get every product from factory to shop — a massive, growing field), renewable energy (solar and wind installation is one of the fastest-growing trades in the country), film and media production (SA has a booming film industry — not just actors, but sound engineers, editors, riggers, caterers), and skilled trades (electricians, boilermakers, diesel mechanics are in constant demand and pay well).

Amara, a Grade 8 learner from East London, only knew "doctor" and "teacher" as career options until a school visitor from a wind farm company explained that someone needs to inspect turbine blades, manage the electrical grid connection, and handle community relations — none of which is "engineer" in the way she''d imagined it. She didn''t decide on a career that day. She just learned the world of work was bigger than six jobs, and started paying attention differently.

The habit worth building now isn''t picking a career at 13 — it''s staying curious. Every time you meet an adult with an interesting job, ask one question: "What does a normal day actually look like for you?" That single habit, repeated for years, builds a mental map of the world of work that most people never bother to draw.', ARRAY['Most career conversations only mention 5-6 jobs — the real world of work is much bigger','A job, a career and an industry are three different things','South Africa has growing industries (logistics, renewable energy, film, skilled trades) rarely mentioned at school','Asking adults "what does a normal day look like for you?" builds real career awareness over time']::text[], 'Ask one adult in your life (a family member, neighbour, or family friend) what a normal day at their job actually looks like. Write down 3 things you didn’t know before.', 'What’s a job you’ve heard of but don’t actually understand what the person does all day? What would you want to ask them?', 'World of Work Field Guide', 'PDF', 'WORLD OF WORK FIELD GUIDE

INDUSTRIES YOU MIGHT NOT HAVE CONSIDERED:
- Logistics & Supply Chain: warehouse management, freight coordination, procurement
- Renewable Energy: solar installation, wind turbine technician, energy auditor
- Film & Media: sound engineer, editor, production coordinator, set builder
- Skilled Trades: electrician, boilermaker, diesel mechanic, plumber
- Agriculture & Agri-business: agronomist, farm manager, food safety inspector
- Hospitality & Tourism: event management, guiding, hotel operations

THE ONE-QUESTION HABIT:
Next time you meet an adult with a job you''re curious about, ask: "What does a normal day actually look like for you?"
Write their answer here: ___________________________

THREE FIELDS I WANT TO LEARN MORE ABOUT:
1. ___________________________
2. ___________________________
3. ___________________________', '[OPEN on a Grade 8 classroom, teacher asking "name a career" — same 5 answers shouted out]
NARRATOR (V.O.): "Doctor. Teacher. Lawyer. Every time, the same six jobs. The real world of work is much bigger."
[CUT to a wind farm, turbines turning, a technician on a lift]
NARRATOR: "Someone inspects those blades. Someone manages the grid connection. That''s a career too."
[CUT to Amara, thoughtful]
AMARA: "I didn''t know ''engineer'' could mean that. I just started asking people what their day actually looks like."
[GRAPHIC: Job → Career → Industry, building as a pyramid]
[END CARD: "Take Action: ask one adult about their normal day."]', 'Open with the recognisable "same six careers" classroom moment. Use real, specific SA industry visuals (wind farm, warehouse, film set) rather than generic stock office imagery. Keep Amara’s realisation modest — curiosity sparked, not a full career decision made.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action interview exercise.', 'Thabo Nkosi', 'Career Counsellor', 'thabo', '#FF8A00', 'published', '/lessons/career-3.png', now()) returning id into l0_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l0_id, 'What is the difference between a job and an industry?', ARRAY['They mean the same thing','A job is a specific role; an industry is the whole sector it sits in','An industry is smaller than a job','Only adults have industries']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l0_id, 'Which of these is a growing industry in South Africa mentioned in this lesson?', ARRAY['Renewable energy','Only medicine','Only teaching','None of the above']::text[], 0, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l0_id, 'What habit does this lesson recommend for building career awareness?', ARRAY['Deciding on a career immediately','Asking adults what a normal day at their job looks like','Only considering the 6 most common careers','Waiting until Grade 12 to think about it']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('CV & Interview Skills', 'How to build a first CV with no work experience, and how to survive a first interview without freezing up.', 'career', t1_id, 11, 12, 14, ARRAY['Build a one-page CV using only school, community and informal experience','Explain the STAR method for answering interview questions','Practise answering one common interview question using STAR']::text[], 'Your CV has about seven seconds to convince someone you’re worth a second look — that’s not unfair, it’s just how many CVs they’re reading.', '"I don''t have a CV because I''ve never had a job" is the most common reason learners avoid applying for their first opportunity — and it''s based on a misunderstanding. A CV isn''t a list of jobs. It''s a list of evidence that you''re reliable, capable and worth the risk of hiring.

A first CV without work experience should have: contact details, a short 2-line summary of who you are, your education (school, subjects, expected matric year), and a section called "Experience & Involvement" — this is where school, community and informal work go. Were you a class representative? That''s leadership experience. Did you help run a stall at a school fundraiser? That''s event coordination. Did you tutor a younger sibling in maths? That''s teaching and patience. None of this needs a job title to count — it needs to be described using the same language a job description would use.

For interviews, the single most useful tool is the STAR method: Situation (briefly set the scene), Task (what needed to happen), Action (specifically what YOU did), Result (what happened because of it). When an interviewer asks "tell me about a time you solved a problem," a rambling answer loses them. A STAR answer sounds like: "Our school fundraiser was short on volunteers two days before the event (Situation). I needed to find five more people to help run stalls (Task). I messaged our class WhatsApp group and personally asked three quiet classmates who I knew were reliable (Action). We ended up with seven volunteers and the event ran smoothly (Result)." That''s 20 seconds, and it proves initiative without saying "I''m good at initiative."

Zodwa, a matric learner from Mthatha applying for her first part-time retail job, was terrified she had "nothing to put" on a CV. Her career counsellor helped her realise that organising her church youth group''s annual camp — budgeting, coordinating transport, managing 30 people — was genuinely impressive event and logistics experience, described in the right language. She got the interview, used STAR to answer "tell me about a time you managed something," and got the job.

You have more evidence than you think. The skill isn''t having experience — it''s learning to describe the experience you already have.', ARRAY['A CV is evidence of reliability and capability — not only a list of paid jobs','School, community and informal experience counts if described in the right language','STAR (Situation, Task, Action, Result) turns a rambling interview answer into a clear, convincing one','You likely have more real experience to draw on than you think — the skill is describing it well']::text[], 'Write your own one-page CV using only school and community experience. Then write one STAR-format answer to the question "tell me about a time you took initiative."', 'What’s something you’ve done — in school, at home, in your community — that you never thought of as "experience" until now?', 'First CV & STAR Method Template', 'PDF', 'FIRST CV TEMPLATE (no work experience needed)

[Your Name]
[Phone] | [Email]

SUMMARY: 2 lines about who you are and what you''re looking for.

EDUCATION:
[School name], expected matric [year]
Subjects: [list]

EXPERIENCE & INVOLVEMENT:
[Role/activity] — [Organisation, e.g. school, church, community group]
[1-2 lines describing what you did, using strong verbs: organised, coordinated, managed, led, assisted]

SKILLS: [e.g. communication, teamwork, basic computer literacy]

---

THE STAR METHOD FOR INTERVIEWS:
S — Situation: briefly set the scene
T — Task: what needed to happen
A — Action: specifically what YOU did
R — Result: what happened because of it

PRACTISE: Write a STAR answer to "Tell me about a time you worked in a team."
S: ___________________________
T: ___________________________
A: ___________________________
R: ___________________________', '[OPEN on a blank CV template on a laptop screen, cursor blinking]
NARRATOR (V.O.): "''I don''t have a CV because I''ve never had a job.'' That''s not true — you just haven''t written down what you''ve done yet."
[CUT to Zodwa, calm, confident]
ZODWA: "I thought I had nothing. Then my counsellor pointed out I''d basically run event logistics for 30 people at my church camp. I just didn''t call it that."
[GRAPHIC: STAR — Situation, Task, Action, Result, building one letter at a time]
NARRATOR (V.O.): "That''s the STAR method. Four steps, twenty seconds, and your answer actually lands."
[END CARD: "Take Action: write your first CV today."]', 'Open on the intimidating blank-CV moment — a relatable dread. Zodwa should read as composed and prepared, not nervous — she’s a peer demonstrating success, not a cautionary tale. Build the STAR acronym progressively as a clean, reusable graphic.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete both the CV and STAR-answer Take Action exercises.', 'Thabo Nkosi', 'Career Counsellor', 'thabo', '#FF8A00', 'published', '/lessons/career-4.png', now()) returning id into l1_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l1_id, 'What can go in the "Experience & Involvement" section of a first CV?', ARRAY['Only paid jobs','School, community and informal experience described well','Nothing if you’ve never had a job','Only matric results']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l1_id, 'What does the "A" in STAR stand for?', ARRAY['Ask','Action — specifically what you did','Answer','Attempt']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l1_id, 'Why did Zodwa’s church camp experience matter for her CV?', ARRAY['It didn’t, only jobs count','It demonstrated real event and logistics experience','She lied about it','Interviewers don’t care about volunteering']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Banking Basics: Accounts, Cards & Saving', 'What a bank account actually does, the difference between account types, and how to make saving automatic instead of a daily decision.', 'finance', t2_id, 7, 9, 11, ARRAY['Explain the difference between a savings account and a transaction account','Identify what to check before opening any bank account (fees, access)','Set up one automatic saving habit']::text[], 'A bank account isn’t just where money sits — it’s the tool that decides whether saving is easy or something you have to fight yourself to do.', 'A bank account sounds like a grown-up formality, but it does something specific and useful: it separates your money from your hands, which is exactly why saving is hard without one. Cash in a pocket gets spent. Money in a savings account you don''t carry a card for is much easier to leave alone.

There are two account types worth understanding early. A transaction account (sometimes called a cheque or current account) is for everyday spending — it usually comes with a card and lets you pay, withdraw and transfer easily, but often has monthly fees. A savings account is built to hold money you''re not touching — fewer fees, sometimes a bit of interest, but usually slower or more deliberate to access. The whole design of a savings account is friction: making it slightly harder to spend is the feature, not a flaw.

Before opening any account, check three things: monthly account fees (some youth/student accounts have none — worth specifically asking for), whether there''s a minimum balance requirement, and how you''ll access it (app, card, branch). Many South African banks offer youth accounts with reduced or zero fees specifically for under-18s or students — always ask if one exists before defaulting to a standard account.

The most useful habit isn''t the account itself — it''s automating what goes into it. Tumelo, a Grade 9 learner in Rustenburg, used to "try to save what''s left" at the end of each month from his part-time weekend job — and there was never anything left. His older sister suggested he flip the order: the moment he got paid, he moved a fixed R50 into a separate savings account first, before spending anything. Nothing else changed except the order — and by flipping "spend then save" into "save then spend," he actually kept the money.

Saving isn''t a personality trait some people have and others don''t. It''s mostly a system: pick an account with the right friction, and put the saving decision before the spending decision, not after.', ARRAY['A savings account is designed with friction on purpose — that’s what makes it easier to leave money alone','Check for fees, minimum balance and access method before opening any account','Many SA banks offer reduced or zero-fee youth/student accounts — always ask','"Save first, then spend" works far better than "spend, then save what’s left"']::text[], 'If you don’t have a savings account, research one youth/student account option (ask a parent or look online) and note its fees. If you do have one, set up moving a fixed small amount into it as soon as you receive any money this month.', 'Have you ever tried to "save what’s left" at the end of the month? What actually happened?', 'Choosing a Bank Account Checklist', 'PDF', 'CHOOSING A BANK ACCOUNT CHECKLIST

BEFORE OPENING ANY ACCOUNT, ASK:
1. Is there a monthly fee? Is there a youth/student account with lower or no fees?
2. Is there a minimum balance I need to maintain?
3. How do I access my money — app, card, branch, all three?
4. Does it earn any interest if I keep money in it?

TRANSACTION ACCOUNT vs SAVINGS ACCOUNT:
Transaction account: everyday spending, card + easy access, often has fees.
Savings account: built for money you''re not touching, fewer fees, some interest, deliberately less convenient to access.

THE SAVE-FIRST HABIT:
Old way: spend all month → save whatever''s left (usually nothing)
New way: get paid → move a fixed amount to savings FIRST → spend the rest

MY SAVE-FIRST PLAN:
Amount I''ll move immediately when I get money: R______
Where it goes: ___________________________', '[OPEN on cash in a hand, then the same amount disappearing item by item into small purchases]
NARRATOR (V.O.): "Cash in your hand gets spent. That''s not a character flaw — it''s just how cash works."
[CUT to a phone banking app, a savings account with a small growing balance]
NARRATOR: "A savings account works because it''s slightly harder to touch. That''s the whole design."
[CUT to Tumelo, explaining]
TUMELO: "I used to save whatever was left at the end of the month. There was never anything left. Now I move R50 the moment I get paid — before I spend anything."
[GRAPHIC: "Save first" arrow pointing before "Spend" — flipping the old order]
[END CARD: "Take Action: set up your save-first habit today."]', 'Open with a visceral, relatable "cash disappearing" sequence. Use a real-looking (but generic, non-branded) banking app screen for the savings account visual. Tumelo’s reveal should focus on the ORDER flip (save-first vs spend-first) as the key visual insight.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action save-first exercise.', 'Lerato Dlamini', 'Financial Literacy Educator', 'lerato', '#F4B84C', 'published', '/lessons/finance-3.png', now()) returning id into l2_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l2_id, 'What is the main purpose of the "friction" in a savings account?', ARRAY['To punish you','To make it slightly harder to spend, so you leave the money alone','It’s a mistake in how banks are designed','To earn the bank more fees']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l2_id, 'What should you check before opening a bank account?', ARRAY['Nothing, all accounts are the same','Fees, minimum balance, and access method','Only the bank’s logo','Only how far the branch is']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l2_id, 'What was Tumelo’s key change?', ARRAY['He stopped saving entirely','He moved savings first, before spending, instead of saving what was left','He opened ten accounts','He asked his sister for money']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Understanding Payslips, Tax & Your First Job', 'How to read a South African payslip, understand basic tax and deductions, and know what to expect from your first paycheque.', 'finance', t3_id, 11, 12, 13, ARRAY['Identify the key sections of a typical South African payslip','Explain what PAYE, UIF and gross vs net pay mean','Estimate roughly what a given gross salary will look like as take-home pay']::text[], 'The number you’re promised and the number that actually lands in your account are two different numbers — and nobody explains the gap until you’re staring at your first payslip confused.', '"I was offered R6,000 a month, but only R5,400 landed in my account." This confuses almost everyone the first time it happens — and it''s not a mistake. It''s tax and deductions, and understanding them now means your first payslip won''t feel like a betrayal.

A payslip has a few key numbers. Gross pay is the full amount you earned before anything is taken out — this is usually the number quoted in a job offer. Net pay (or take-home pay) is what actually lands in your account, after deductions. The gap between them is mostly two things: PAYE (Pay As You Earn) — income tax, deducted automatically by your employer and paid to SARS on your behalf, and UIF (Unemployment Insurance Fund) — a small deduction (1% of gross pay, matched by your employer) that builds a safety net you can claim from if you lose your job later.

Here''s a useful fact for anyone starting their first job: in South Africa, if your total annual income is below the tax threshold (which changes yearly, but is roughly R95,750 for the 2024/2025 tax year for those under 65), you won''t actually pay PAYE at all — many first jobs and part-time work fall below this. UIF still applies to almost all employment, but it''s a small, capped amount, not a large chunk of pay.

Kagiso, in his first month at a retail job in Bloemfontein after matric, panicked when his payslip showed a lower number than his offer letter. His manager walked him through it: his gross was R4,500, UIF took off about R45, and because his annual income was well under the tax threshold, no PAYE was deducted at all — the rest of the "gap" he thought he saw was actually a misreading of the payslip, not a hidden deduction. Once he understood what each line meant, the confusion disappeared, and so did the (unfounded) suspicion that something was being taken from him unfairly.

The skill here isn''t memorising tax law — it''s knowing to ask "can you walk me through this payslip?" on your first job, and understanding that gross and net are different numbers on purpose, not a trick.', ARRAY['Gross pay is before deductions; net (take-home) pay is what actually lands in your account','PAYE is income tax; UIF is a small unemployment insurance deduction — both usually appear on a payslip','Income below the annual tax threshold generally means no PAYE is deducted','It’s normal and reasonable to ask an employer to explain your payslip line by line']::text[], 'Find a real or sample South African payslip (ask a family member, or search "sample SA payslip") and identify the gross pay, net pay, and each deduction line. Write down what each one means.', 'Has anyone in your family ever been confused or surprised by their first payslip? What happened?', 'Reading Your First Payslip Guide', 'PDF', 'READING YOUR FIRST PAYSLIP — KEY TERMS

GROSS PAY: your full earnings before any deductions. This is usually the number in your job offer.

NET PAY (take-home pay): what actually lands in your bank account, after deductions.

PAYE (Pay As You Earn): income tax, deducted automatically by your employer. If your annual income is below the tax threshold, this may be R0.

UIF (Unemployment Insurance Fund): a small deduction (about 1% of gross pay), matched by your employer, that you can claim from if you lose your job.

OTHER POSSIBLE DEDUCTIONS: medical aid, pension/provident fund, union fees (only if you''re enrolled in these).

QUICK CHECK: Gross pay − PAYE − UIF − other deductions = Net pay

IF SOMETHING ON YOUR PAYSLIP DOESN''T MAKE SENSE: ask your employer or HR to walk you through it, line by line. This is a completely normal, reasonable question to ask.', '[OPEN on a job offer letter: "R6,000 per month" circled]
NARRATOR (V.O.): "This number, and the number that actually lands in your account, are not the same. That''s normal — here''s why."
[CUT to a payslip graphic, GROSS PAY at top, arrows pointing down through PAYE, UIF, to NET PAY at bottom]
NARRATOR: "PAYE is tax. UIF is a small safety-net deduction. Together, they explain the gap."
[CUT to Kagiso, relieved]
KAGISO: "I thought something was wrong. My manager just walked me through each line. Turns out because I was under the tax threshold, PAYE was R0 — I was just misreading the payslip."
NARRATOR (V.O.): "You don''t need to memorise tax law. You need to know it''s okay to ask."
[END CARD: "Take Action: find a real payslip and read every line."]', 'Open with the circled job-offer number to set up the "gap" hook visually. Use a clean, labelled payslip graphic (Gross → PAYE → UIF → Net) as the lesson’s central visual. Kagiso’s arc should move from confusion to clarity, not embarrassment.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action payslip-reading exercise.', 'Lerato Dlamini', 'Financial Literacy Educator', 'lerato', '#F4B84C', 'published', '/lessons/finance-4.png', now()) returning id into l3_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l3_id, 'What is "net pay"?', ARRAY['The full amount before deductions','What actually lands in your account after deductions','A type of bank account','The same as gross pay']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l3_id, 'What does UIF stand for?', ARRAY['Unemployment Insurance Fund','Universal Income Fee','Union Income Fund','United Investment Fee']::text[], 0, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l3_id, 'What happens to PAYE if your annual income is below the tax threshold?', ARRAY['It doubles','It may not be deducted at all','It becomes UIF instead','You have to pay it in cash']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Online Privacy & Passwords', 'How to actually protect your accounts — real password habits and privacy settings, not just "don’t share your password" advice you’ve already heard.', 'digital', t4_id, 7, 9, 10, ARRAY['Explain why reusing the same password everywhere is risky','Build one strong, memorable password using a passphrase method','Identify two privacy settings worth checking on their most-used app']::text[], 'The password "123456" protects more accounts worldwide than almost any other password — which means it protects almost none of them.', '"Don''t share your password" is advice everyone''s heard and mostly follows. The bigger, less-discussed risk is reusing the same password across multiple accounts — because when one app gets hacked (and apps get hacked constantly, even big ones), anyone with your leaked password will try it on your email, your banking app, and everything else, betting you reused it. You did.

A strong password doesn''t need to be a random unreadable string you''ll forget in a week. The passphrase method works better and is easier to remember: pick 3-4 random unrelated words, add a number and symbol. "Purple-Taxi-Mango7!" is both stronger than "P@ssw0rd1" (which follows a predictable pattern hackers already know) and easier to actually remember, because it tells a tiny story instead of being random characters.

Beyond passwords, privacy settings matter more than most learners realise. Two worth checking on any app you use often: who can see your posts/profile (public vs friends-only), and location sharing (many apps tag your exact location on posts by default, which means a public post can show strangers exactly where you are, in real time).

Naledi, a Grade 8 learner from Polokwane, used the same simple password for her school email, a gaming account, and a social media app. The gaming platform was breached in a data leak she never heard about. Months later, someone tried logging into her school email using that leaked password — and got in, because it was identical. Nothing catastrophic happened, but her school''s IT department had to lock and reset her account, and she lost access to submitted assignments for two days during exam prep. She switched to unique passphrases for her important accounts afterward — a five-minute fix that would have prevented the whole thing.

You don''t need to become a cybersecurity expert. You need two habits: a different password (or at least a different passphrase pattern) for your most important accounts, and a five-minute privacy settings check on the app you use most.', ARRAY['Reusing passwords means one hacked app can compromise all your other accounts','The passphrase method (3-4 random words + number + symbol) is strong AND memorable','Check who can see your posts and whether your location is being shared by default','A five-minute privacy check now can prevent a much bigger problem later']::text[], 'Create one new passphrase-style password for your most important account (email or banking). Then check your most-used app’s privacy settings for who can see your posts and whether location sharing is on.', 'Did you know your location might be attached to posts you share? How does that change how you think about what you post?', 'Password & Privacy Quick Check', 'PDF', 'PASSWORD & PRIVACY QUICK CHECK

BUILD A PASSPHRASE PASSWORD:
Pick 3-4 random unrelated words + a number + a symbol.
Example: Purple-Taxi-Mango7!
NOT random letters you''ll forget — words that form a tiny memorable "story."

MY NEW PASSPHRASE (for your most important account): ___________________________

PRIVACY SETTINGS TO CHECK ON YOUR MOST-USED APP:
1. Who can see your posts/profile? (Public / Friends only / Custom)
   Current setting: ___________
2. Is location sharing turned on for your posts?
   Current setting: ___________
3. Who can send you direct messages? (Everyone / Friends only)
   Current setting: ___________

RULE OF THUMB: Use a unique password (or unique passphrase pattern) for your email, banking, and school accounts — these matter more than gaming or entertainment accounts.', '[OPEN on a screen showing "Most common passwords: 123456, password, qwerty" as a list]
NARRATOR (V.O.): "If your password is on this list — or reused everywhere — you''re one leak away from a problem."
[CUT to Naledi, matter-of-fact]
NALEDI: "A gaming site I used got hacked. I didn''t even know. Months later, someone tried the same password on my school email — and got in, because I''d used the exact same one."
[GRAPHIC: "Purple-Taxi-Mango7!" building word by word — the passphrase method]
NARRATOR (V.O.): "Strong doesn''t mean unmemorable. Four random words beats a ''clever'' password every time."
[END CARD: "Take Action: build one new passphrase today."]', 'Open with the common-passwords list — an immediate, slightly uncomfortable recognition moment for most viewers. Build the passphrase example visually, word by word, to demonstrate the method live. Naledi’s story should feel like a near-miss with a low-stakes but real consequence (locked out during exam prep), not a catastrophe.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action passphrase + privacy check exercise.', 'Sipho Mthembu', 'Digital Literacy Teacher', 'sipho', '#006E68', 'published', '/lessons/digital-3.png', now()) returning id into l4_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l4_id, 'Why is reusing the same password across accounts risky?', ARRAY['It isn’t risky','If one app is hacked, the leaked password can be tried on your other accounts','It makes passwords too long','Apps don’t allow password reuse']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l4_id, 'What is the passphrase method?', ARRAY['Using your name as a password','Combining 3-4 random words with a number and symbol','Using the same password everywhere','Writing your password on paper']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l4_id, 'What privacy setting does this lesson recommend checking?', ARRAY['Screen brightness','Who can see your posts and whether location sharing is on','Font size','Battery saver mode']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Skills for the Digital Economy', 'What the digital economy actually rewards, and realistic first steps into it — with no expensive equipment or degree required to start.', 'digital', t5_id, 10, 12, 13, ARRAY['Explain what the "digital economy" means in practical terms','Identify at least 3 digital skills that can be learned for free online','Describe one realistic first step toward building a digital skill']::text[], 'You don’t need to move to Cape Town or Silicon Valley to work in tech anymore — you need an internet connection and one skill someone will pay for.', '"The digital economy" sounds abstract until you break it into what it actually is: work that can be done and delivered entirely online, for clients or employers anywhere in the world, using skills that don''t require an expensive degree to start — just internet access and deliberate practice.

Some of the most in-demand digital skills right now: graphic design (using free tools like Canva or GIMP to create logos, social media content, flyers for local businesses), basic web development (HTML/CSS/JavaScript — there are free courses that take you from zero to building simple websites), video editing (short-form content editing is in huge demand as every business now wants social media video), virtual assistance (helping businesses with admin, scheduling, and communication remotely), and copywriting (writing product descriptions, social captions, or basic marketing text for businesses).

None of these require you to move anywhere or buy expensive equipment to start. Free resources exist for every one of them: YouTube tutorials, free courses on platforms like Google''s Digital Skills for Africa, freeCodeCamp for coding, and Canva''s own free design tutorials. The real barrier isn''t money — it''s consistent practice and building a small portfolio of real work, even unpaid work at first, to show someone what you can do.

Sizwe, a Grade 11 learner from Soweto, taught himself basic graphic design using free Canva tutorials over one school holiday, purely out of curiosity. He designed a free flyer for his aunt''s small hair salon business, just to practise. She loved it, showed other spaza shop owners in the area, and within two months he''d designed flyers for three local businesses — two of which paid him a small fee. He didn''t start with a business plan. He started with free tutorials and one real (even unpaid) project to build a portfolio around.

The digital economy doesn''t care where you live nearly as much as older industries did. It cares what you can actually make or do, and whether you can show someone proof of it. Free tutorials plus one real project, even a small unpaid one, beats waiting until you feel "qualified enough" to start.', ARRAY['The digital economy is work deliverable entirely online — location matters far less than skill','Graphic design, web development, video editing, virtual assistance and copywriting are all learnable for free online','A small portfolio of real work (even unpaid at first) matters more than a certificate','Starting with free tutorials and one real project beats waiting to feel "qualified"']::text[], 'Pick one digital skill from this lesson that interests you. Find one free tutorial or course for it online, and complete the first 30 minutes of it this week.', 'If you could learn one digital skill for free starting today, which one would you pick, and why?', 'Free Digital Skills Starter List', 'PDF', 'FREE DIGITAL SKILLS STARTER LIST

GRAPHIC DESIGN: Canva (free tier) has built-in tutorials. Start by redesigning a flyer for a fictional local business.

WEB DEVELOPMENT: freeCodeCamp.org — completely free, structured coding courses from zero.

VIDEO EDITING: CapCut (free, mobile-friendly) has in-app tutorials. Start by editing a 30-second clip on your phone.

VIRTUAL ASSISTANCE: Search "virtual assistant skills free course" — many free intro courses exist covering scheduling, email management and communication tools.

COPYWRITING: Practise by rewriting real ads or product descriptions you see online, then compare your version to the original.

MY FIRST STEP:
Skill I want to try: ___________________________
Free resource I''ll use: ___________________________
What I''ll build/practise this week: ___________________________', '[OPEN on a phone screen, Canva app open, a flyer being designed]
NARRATOR (V.O.): "This didn''t need a degree. It needed free tutorials and one afternoon."
[CUT to Sizwe, showing a flyer design on his phone]
SIZWE: "I made this for my aunt''s salon, just to practise. She showed it around. Two months later, three businesses wanted flyers — two of them paid me."
NARRATOR (V.O.): "The digital economy doesn''t care where you live. It cares what you can show someone you can do."
[GRAPHIC: 5 digital skills icons — design, code, video, VA, copywriting — each with "Free" stamped]
[END CARD: "Take Action: start one free tutorial this week."]', 'Open on a phone-based design tool (not an expensive laptop/studio setup) to reinforce accessibility. Sizwe’s story should show the real, humble starting point (aunt’s salon flyer) before the small paid outcome — avoid making it feel like overnight success. Stamp "Free" clearly on each skill icon to reinforce the no-cost message.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action first-tutorial exercise.', 'Sipho Mthembu', 'Digital Literacy Teacher', 'sipho', '#006E68', 'published', '/lessons/digital-4.png', now()) returning id into l5_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l5_id, 'What does "digital economy" mean in this lesson?', ARRAY['Only cryptocurrency trading','Work that can be done and delivered entirely online','Buying things on the internet','Working only for tech companies']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l5_id, 'What mattered most in Sizwe’s story?', ARRAY['An expensive laptop','A free tutorial and one real project to build a portfolio around','A university degree','Moving to a bigger city']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l5_id, 'According to this lesson, what should you do before feeling "qualified enough"?', ARRAY['Wait until you have a certificate','Start with free tutorials and one real project','Buy expensive software first','Nothing, wait for someone to teach you']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Understanding Money in a Business', 'The basic maths every small business needs: costs, pricing and profit — explained with real, small numbers.', 'entrepreneurship', t6_id, 9, 11, 12, ARRAY['Explain the difference between cost price, selling price and profit','Calculate a simple profit margin for a small product or service','Identify why "selling a lot" doesn’t automatically mean "making money"']::text[], 'Selling a lot doesn’t mean making money — plenty of busy, popular businesses go broke because nobody did this one piece of maths.', 'A common mistake in a first small business: selling a lot of something and assuming that means success, without ever checking whether each sale actually made money. Busy isn''t the same as profitable.

The core maths is simple. Cost price is everything it costs you to make or provide one unit — ingredients, materials, even your time if you''re valuing it. Selling price is what you charge the customer. Profit is selling price minus cost price — what you actually keep. If you sell cupcakes for R15 each, and the ingredients plus packaging cost R9 per cupcake, your profit is R6 per cupcake, not R15. Too many first-time young entrepreneurs mentally count the full R15 as "money made," forget to subtract costs, and wonder later why they''re not actually richer despite selling dozens.

There''s a second trap: forgetting indirect costs. If you spent R50 on data to advertise your product on social media, or R20 on taxi fare to buy ingredients, those costs need to come out of your total profit too, even though they''re not "per unit." A business that looks profitable per item can still lose money overall if these extra costs aren''t tracked.

Palesa, a Grade 10 learner from Polokwane selling handmade bracelets at school, was excited to have sold 40 bracelets in a month at R25 each — R1,000 in sales, which felt like a big success. When she actually calculated her costs (beads, string, and a small amount spent on nicer packaging to look more professional), her real cost per bracelet was R14, meaning her actual profit was R11 per bracelet — R440 total, not R1,000. Still a genuine profit and a real achievement, but a very different number from what she''d assumed, and one that helped her price more accurately going forward, including finally accounting for her own time.

The habit worth building: before feeling confident a business idea is working, do the maths on ONE unit first — cost price, selling price, profit — before scaling up to many. It takes five minutes and it''s the difference between a business and an expensive hobby.', ARRAY['Profit = selling price − cost price, not the full amount you’re paid','Selling a lot doesn’t automatically mean making a lot of profit','Indirect costs (data, transport, packaging) need to be subtracted too, even if not "per unit"','Do the maths on one unit first, before assuming a business idea is working']::text[], 'Pick a product or service you could realistically sell. Calculate: cost price per unit, selling price, and profit per unit. Then estimate any indirect costs you’d also need to cover.', 'Have you or someone you know ever sold something and later realised the costs ate up most of the profit? What happened?', 'Simple Profit Calculator Worksheet', 'PDF', 'SIMPLE PROFIT CALCULATOR WORKSHEET

STEP 1: What are you selling? ___________________________

STEP 2: COST PRICE (everything it costs to make ONE unit)
Materials/ingredients: R______
Packaging: R______
Other direct costs: R______
TOTAL COST PRICE PER UNIT: R______

STEP 3: SELLING PRICE
What you charge per unit: R______

STEP 4: PROFIT PER UNIT
Selling price − Cost price = R______

STEP 5: INDIRECT COSTS (not per unit, but still real)
Advertising/data: R______
Transport: R______
TOTAL INDIRECT COSTS: R______

STEP 6: REAL TOTAL PROFIT (for a batch)
(Profit per unit × number sold) − Indirect costs = R______

Remember: busy doesn''t mean profitable. Always check the real number.', '[OPEN on a table covered in handmade bracelets, a proud "SOLD 40!" moment]
NARRATOR (V.O.): "40 sold. R1,000 in sales. Success, right? Not so fast."
[CUT to Palesa, doing maths on a notebook]
PALESA: "I felt like I''d made R1,000. When I actually subtracted what the beads and packaging cost, my real profit was R440. Still good — just a very different number."
[GRAPHIC: R25 selling price − R14 cost price = R11 profit, per bracelet, building visually]
NARRATOR (V.O.): "Selling a lot isn''t the same as making money. Do the maths on one unit first."
[END CARD: "Take Action: calculate your real profit per unit."]', 'Open with the satisfying "sold a lot" moment before undercutting it with the real maths — the reversal is the whole point. Show the profit calculation as a simple, visual subtraction (selling price − cost price = profit) rather than a dense spreadsheet. Palesa’s tone should be matter-of-fact, not discouraged — R440 is still a real win.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action profit calculation exercise.', 'Zanele Khumalo', 'Entrepreneurship Mentor', 'zanele', '#E8603C', 'published', '/lessons/entrepreneurship-3.png', now()) returning id into l6_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l6_id, 'What is profit?', ARRAY['The full selling price','Selling price minus cost price','The cost price only','The number of items sold']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l6_id, 'Why was Palesa’s real profit lower than she first thought?', ARRAY['She didn’t actually sell 40 bracelets','She hadn’t subtracted her cost price per bracelet','She gave bracelets away for free','Her maths was wrong on purpose']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l6_id, 'What should you calculate before assuming a business idea is working?', ARRAY['Nothing, just start selling','Cost price, selling price and profit for one unit','Only how many people you know','Only the selling price']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Marketing Your Idea on a Budget', 'Real, low-cost ways to get people to know about what you’ve built, using what you already have instead of money you don’t.', 'entrepreneurship', t7_id, 10, 12, 12, ARRAY['Explain why marketing matters even for a great product or idea','Identify at least 3 zero-cost marketing methods','Describe their own network as a marketing resource']::text[], 'The best product in the world sells nothing if nobody knows it exists — and you don’t need a marketing budget to fix that.', 'A great product with no marketing is a secret, not a business. Many first-time entrepreneurs assume marketing means paid ads, which feels impossible without money — but the most effective early marketing usually costs nothing at all, just time and intentionality.

Zero-cost marketing methods that actually work: word of mouth (ask every happy customer to tell two friends — explicitly, not just hoping they will), social proof (photos or videos of real people using or enjoying your product, posted on your own social media, cost nothing and build trust fast), community presence (showing up at school events, church markets, or local gatherings where your actual customers already are), and direct outreach (personally messaging 10 specific people who might want what you''re offering, rather than posting once and hoping).

The most underused resource in early marketing is your own network. Before thinking about strangers, list everyone you already know who might be interested — family, classmates, neighbours, your parents'' colleagues. Most first sales for small, real businesses come from this circle, not from viral social media posts.

Bongani, a Grade 11 learner from Mahikeng, started making and selling simple phone cases with his own designs. His first social media post got 12 likes and zero sales. Instead of giving up, he changed approach: he personally messaged 15 classmates he knew individually, showing them a photo and asking directly if they wanted one. Five said yes immediately — not because the product changed, but because a personal message to someone who already trusted him worked far better than a public post to strangers. He then asked each of those 5 buyers to post a photo wearing/using it, which became free social proof for his next round of outreach.

Marketing on a budget isn''t about tricks — it''s about being deliberate: know exactly who might want what you have, reach out to them directly and personally, and turn every happy customer into visible proof for the next one.', ARRAY['A great product with no marketing is effectively a secret — marketing matters even without money','Word of mouth, social proof, community presence and direct outreach all cost nothing','Your existing network (family, classmates, community) is your most underused marketing resource','Personal, direct outreach usually outperforms a single public post to strangers']::text[], 'List 10 specific people you already know who might be interested in an idea or product you have. Message 3 of them directly this week, showing what you’ve made and asking if they’re interested.', 'Think of a small local business you like. How do you think most of their customers actually found out about them?', 'Zero-Cost Marketing Checklist', 'PDF', 'ZERO-COST MARKETING CHECKLIST

1. WORD OF MOUTH: Ask every happy customer directly: "Do you know anyone else who might want this?"

2. SOCIAL PROOF: Take photos/videos of real people using your product. Post them — real people trust real people, not just product photos.

3. COMMUNITY PRESENCE: Where do your actual potential customers already gather? (school events, church, local markets) Show up there.

4. DIRECT OUTREACH: List 10 specific people you know who might want what you offer. Message them personally — not a public post, a direct message.

MY NETWORK LIST (people I already know who might be interested):
1. ___________________________
2. ___________________________
3. ___________________________
(continue to at least 10)

THIS WEEK: message 3 of them directly, showing what you''ve made.', '[OPEN on a social media post with a product photo — 12 likes, 0 comments, visibly quiet]
NARRATOR (V.O.): "A great product with no marketing is just a secret. This post proved it."
[CUT to Bongani, phone in hand, scrolling his contacts]
BONGANI: "I stopped waiting for strangers to notice. I messaged 15 classmates directly, showed them a photo, asked if they wanted one. Five said yes immediately."
[GRAPHIC: "Public post: 0 sales" vs "15 direct messages: 5 sales" — side by side]
NARRATOR (V.O.): "Your network is your most underused marketing tool. Use it on purpose."
[END CARD: "Take Action: message 3 people directly this week."]', 'Open with the deflating "quiet post" moment — relatable to anyone who’s posted something that got no traction. Contrast public-post results directly against personal-outreach results using a simple side-by-side graphic. Bongani’s tone should be practical and undiscouraged, not defeated.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action network-outreach exercise.', 'Zanele Khumalo', 'Entrepreneurship Mentor', 'zanele', '#E8603C', 'published', '/lessons/entrepreneurship-4.png', now()) returning id into l7_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l7_id, 'Why does marketing matter even for a great product?', ARRAY['It doesn’t matter if the product is good enough','Without marketing, nobody knows the product exists','Marketing is only for large companies','Good products market themselves automatically']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l7_id, 'What changed Bongani’s results?', ARRAY['He lowered his price','He personally messaged specific people he knew instead of only posting publicly','He bought paid ads','He changed his product design']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l7_id, 'What is "social proof" in marketing?', ARRAY['A legal document','Real people shown using or enjoying your product, which builds trust','A type of payment','A government requirement']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Teamwork & Working With Others', 'What actually makes a group function well together — practical habits, not just "communicate more" advice.', 'leadership', t8_id, 7, 9, 11, ARRAY['Identify at least 2 specific behaviours that make group work function well','Explain why unclear roles cause group projects to fail','Practise one teamwork habit in a real group setting']::text[], 'A group of talented people doesn’t automatically make a good team — plenty of talented groups fall apart, and plenty of average ones do great work together.', 'Group projects have a bad reputation — usually because "be a good team player" is vague advice that doesn''t actually tell you what to do differently. Real teamwork comes down to a few specific, learnable behaviours, not a personality trait some people have and others don''t.

The single biggest cause of group project failure isn''t laziness — it''s unclear roles. When a group starts a project without explicitly deciding who''s doing what, by when, everyone quietly assumes someone else has it covered, and nothing gets done until the deadline panic. The fix is simple but rarely done: in the first five minutes of any group task, explicitly assign who''s doing what, out loud, even if it feels unnecessary.

Beyond role clarity, three habits separate functional teams from dysfunctional ones: checking in early (asking "how''s your part going?" halfway through, not the night before it''s due, so problems surface while there''s still time to fix them), naming problems without blame ("we''re behind on the research section" instead of "you didn''t do the research," which shifts focus to solving instead of defending), and following through quietly (doing your part reliably without needing constant reminders is the single most valued behaviour by teammates, even though it''s rarely mentioned explicitly).

Thandiwe''s Grade 8 group project on a community history assignment nearly fell apart in the first week — four people, vague plan, no one clear on their part. She suggested, without being asked to lead, that they spend five minutes explicitly assigning sections before doing anything else. The project went from stalled to on-track, not because anyone became more talented, but because ambiguity — the actual cause of the earlier stall — was removed.

Good teamwork isn''t a mysterious skill some people are naturally better at. It''s a small number of specific habits — clear roles, early check-ins, blame-free problem naming — that anyone can practise starting with their very next group task.', ARRAY['Unclear roles — not laziness — is the most common cause of group project failure','Explicitly assigning who does what, out loud, at the start prevents most later problems','Check in on progress early, not the night before the deadline','Name problems without blame ("we’re behind" not "you didn’t do it") to keep focus on solving']::text[], 'In your next group task (school, sports, community), suggest explicitly assigning roles in the first five minutes. Notice what changes.', 'Think of a group project that went badly. Looking back, was it really about people not trying, or about something else — like unclear roles?', 'Teamwork Habits Checklist', 'PDF', 'TEAMWORK HABITS CHECKLIST

AT THE START OF ANY GROUP TASK:
- Explicitly assign who''s doing what, out loud, in the first 5 minutes
- Agree on a rough deadline for each part, not just the final deadline

DURING THE TASK:
- Check in halfway: "how''s your part going?" — not the night before it''s due
- If something''s behind, name the problem without blame: "we''re behind on X" not "you didn''t do X"

THROUGHOUT:
- Follow through on your part reliably, without needing reminders — this is the most valued (and least discussed) teamwork behaviour

MY NEXT GROUP TASK: ___________________________
Roles we agreed on: ___________________________
Check-in point (halfway date): ___________________________', '[OPEN on a group project, 4 learners sitting together, awkward silence, nobody starting]
NARRATOR (V.O.): "Not lazy. Not incapable. Just... unclear on who''s doing what."
[CUT to Thandiwe, speaking up]
THANDIWE: "I just said, let''s spend five minutes deciding who does what before we do anything else. That was it. That''s what changed."
[GRAPHIC: "Vague plan → stalled" vs "Clear roles → on track", side by side]
NARRATOR (V.O.): "Good teamwork isn''t a personality trait. It''s a few specific habits, starting with this one."
[END CARD: "Take Action: assign roles out loud, next time."]', 'Open on the universally recognisable "group project awkward silence" moment. Keep Thandiwe’s intervention small and practical, not a dramatic leadership speech — the point is how simple the fix was. Use a clean before/after graphic to show the causal link between role clarity and progress.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action role-assignment exercise.', 'Amahle Ndlovu', 'Youth Leadership Coach', 'amahle', '#0D665F', 'published', '/lessons/leadership-3.png', now()) returning id into l8_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l8_id, 'What is the most common cause of group project failure, according to this lesson?', ARRAY['Laziness','Unclear roles','Too many people in the group','Lack of talent']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l8_id, 'What does "naming problems without blame" look like?', ARRAY['"You didn’t do the research"','"We’re behind on the research section"','Ignoring the problem','Blaming the teacher']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l8_id, 'When should a team check in on progress?', ARRAY['The night before the deadline','Halfway through, while there’s still time to fix problems','Never, trust everyone fully','Only if something goes wrong']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Handling Conflict & Giving Feedback', 'A practical, low-drama way to give honest feedback and handle disagreement without damaging the relationship.', 'leadership', t9_id, 10, 12, 13, ARRAY['Explain why avoiding conflict often makes problems worse, not better','Use a simple structure for giving honest, respectful feedback','Practise separating the behaviour from the person in a disagreement']::text[], 'Avoiding a hard conversation doesn’t make the problem disappear — it just makes sure you find out about it later, when it’s bigger.', 'Most people handle conflict in one of two unhelpful ways: avoiding it entirely (hoping the problem resolves itself, which it rarely does) or addressing it emotionally in the heat of the moment (which often damages the relationship more than the original problem did). There''s a middle path, and it''s learnable.

A simple, effective feedback structure: state the specific behaviour (not the person''s character), explain the impact it had, and say what you''d like instead. "You''re unreliable" is character-based and invites defensiveness. "When you missed our last two check-ins without messaging, I had to redo the plan alone, and I''d like us to at least send a quick message if either of us is going to be late" is specific, explains impact, and proposes a fix. The second version is far more likely to actually change something, because it doesn''t force the other person to defend their identity — just address a specific action.

The most important shift is separating the behaviour from the person. Someone who missed a deadline isn''t "a bad teammate" — they missed a deadline, which is a specific, fixable thing. This isn''t about being soft; it''s about being accurate, because most people respond to specific, fixable feedback far better than to a character judgment, even a fair one.

Katlego, head of her school''s debate club, had a member who consistently arrived late to practice, frustrating the rest of the team. Her first instinct was to say something like "you never take this seriously," which she recognised would likely start a defensive argument rather than solve the actual problem. Instead, she said: "You''ve arrived after we''ve started the last three practices, and it means we redo the warm-up each time. Can you let me know if getting here on time is difficult, so we can figure something out?" The team member admitted transport had become unreliable after a taxi route change — something Katlego wouldn''t have learned by starting with a character accusation. They adjusted practice timing slightly, and the lateness stopped.

Avoiding conflict doesn''t make it disappear — it just delays it and usually makes it bigger. Specific, respectful, structured feedback — given early — solves more problems than either silence or an emotional confrontation ever does.', ARRAY['Avoiding conflict usually delays and enlarges the problem rather than resolving it','Effective feedback names the specific behaviour, explains its impact, and proposes what you’d like instead','Separating the behaviour from the person’s character makes feedback easier to hear and act on','Specific, respectful feedback given early solves more than silence or emotional confrontation']::text[], 'Think of a small, real disagreement or frustration you’ve been avoiding addressing. Write out what you’d say using the structure: specific behaviour → impact → what you’d like instead.', 'Is it easier for you to avoid conflict or to address it directly? What do you think that costs you either way?', 'Giving Feedback Without Drama Template', 'PDF', 'GIVING FEEDBACK WITHOUT DRAMA — TEMPLATE

THE STRUCTURE:
1. SPECIFIC BEHAVIOUR (not character): "When you ___________________________"
2. IMPACT: "it meant/it caused ___________________________"
3. WHAT YOU''D LIKE INSTEAD: "I''d like us to ___________________________"

EXAMPLE:
"When you missed our last two check-ins without a message, I had to redo the plan alone. I''d like us to at least send a quick message if either of us is running late."

AVOID: character judgments ("you''re unreliable", "you never take this seriously") — these invite defensiveness instead of change.

MY OWN FEEDBACK (something I''ve been avoiding saying):
Specific behaviour: ___________________________
Impact: ___________________________
What I''d like instead: ___________________________', '[OPEN on a debate practice, a member arriving late again, visible frustration on other faces]
NARRATOR (V.O.): "The easy thing to say: ''you never take this seriously.'' Watch what happens when Katlego says something different."
[CUT to Katlego, calm, direct]
KATLEGO: "You''ve arrived after we started the last three practices, and we end up redoing the warm-up. Is something making it hard to get here on time?"
[Reveal: the teammate explaining a taxi route changed]
NARRATOR (V.O.): "Specific behaviour. Real impact. A real reason came out — one a character accusation would never have uncovered."
[END CARD: "Take Action: give one piece of structured feedback this week."]', 'Open on the relatable frustration of repeated lateness in a group setting. Let Katlego’s line land calmly and specifically — avoid overly scripted or stiff delivery. The reveal (transport issue) should feel like a genuine, humanising surprise that rewards the specific-not-character approach.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action feedback-writing exercise.', 'Amahle Ndlovu', 'Youth Leadership Coach', 'amahle', '#0D665F', 'published', '/lessons/leadership-4.png', now()) returning id into l9_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l9_id, 'What usually happens when conflict is avoided entirely?', ARRAY['It resolves itself','It tends to delay and enlarge the problem','It always gets better on its own','Nothing changes either way']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l9_id, 'What is the recommended feedback structure?', ARRAY['Character judgment only','Specific behaviour → impact → what you’d like instead','Silence until it resolves itself','Public criticism']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l9_id, 'Why did naming the specific behaviour work better for Katlego than a character accusation?', ARRAY['It didn’t work better','It avoided defensiveness and revealed the real reason (transport issues)','It was harsher','Character accusations are always more effective']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Volunteering & Giving Back', 'Practical, realistic ways to volunteer and give back as a teenager — without needing money, transport, or a formal organisation.', 'civic', t10_id, 7, 9, 10, ARRAY['Identify at least 3 realistic volunteering opportunities available to teenagers','Explain why consistent small contributions matter more than one big gesture','Plan one specific, achievable way to give back this month']::text[], 'You don’t need money, a car, or adult permission to make someone else’s week better — most real volunteering starts smaller than people expect.', '"I want to volunteer" often stalls at "but I don''t know where to start, and I don''t have money or a car." Most meaningful volunteering as a teenager doesn''t require either — it requires noticing a need close to you and showing up consistently.

Realistic volunteering options for teenagers: tutoring younger learners (a skill you already have — helping a younger sibling''s friend or a neighbour''s child with homework costs nothing and genuinely helps), supporting at a local crèche or old age home (many welcome young volunteers to read, help with activities, or simply spend time with people who are often isolated), environmental clean-ups (organising or joining a local clean-up of a park, street, or river needs no budget, just people), and skill-sharing (if you''re good at something — sport, art, computers — teaching a free after-school session to younger learners is real, valuable volunteering).

The most overlooked truth about volunteering: consistency matters more than scale. One big, dramatic gesture (a single donation drive, one big event) often has less real impact than showing up every second Saturday for six months to help at the same crèche, because relationships and trust build over repeated small contributions, not single moments.

Amara, a Grade 8 learner in Gqeberha, started spending 30 minutes every Wednesday after school helping her elderly neighbour with grocery lists and reading her mail, after noticing the neighbour''s eyesight had worsened. It wasn''t a formal programme, didn''t need permission from any organisation, and cost nothing — just consistent attention. Eight months later, that same neighbour, who turned out to be a retired seamstress, started teaching Amara basic sewing in return. Amara''s small, consistent act of noticing and showing up turned into a genuine relationship and a new skill, something a single big gesture would never have produced.

Giving back doesn''t require waiting for a formal volunteering programme to sign up for. It starts with noticing one real need close to you, and showing up for it consistently, even in small amounts of time.', ARRAY['Meaningful volunteering rarely requires money, transport, or a formal organisation to start','Tutoring, supporting elderly neighbours, environmental clean-ups and skill-sharing are all realistic options','Consistent small contributions build more real impact and trust than one big, dramatic gesture','Volunteering often starts with simply noticing a real need close to you']::text[], 'Identify one specific, small way you could give back this month — to a neighbour, younger learner, or your community. Commit to doing it at least once this week.', 'Is there someone close to you — a neighbour, relative, or classmate — who you’ve noticed could use some help, but you haven’t offered yet? What’s stopped you?', 'Realistic Volunteering Ideas List', 'PDF', 'REALISTIC VOLUNTEERING IDEAS FOR TEENAGERS

NO MONEY OR TRANSPORT NEEDED:
- Tutor a younger learner in a subject you''re good at
- Help an elderly neighbour with reading mail, grocery lists, or simple tasks
- Organise or join a local clean-up (park, street, riverbank)
- Teach a free skill-sharing session (sport, art, basic computer skills) to younger learners
- Read to or spend time with residents at a local crèche or old age home

THE CONSISTENCY PRINCIPLE:
One big gesture often has less impact than showing up regularly, even briefly. Aim for "every Wednesday for 30 minutes" over "one big event once."

MY PLAN:
Who or what I''ll help: ___________________________
How often: ___________________________
Starting when: ___________________________', '[OPEN on a teenager staring at their phone, searching "how to volunteer near me", looking overwhelmed by results]
NARRATOR (V.O.): "You don''t need a formal programme. You need to notice something real, close to you."
[CUT to Amara, sitting with an elderly neighbour, reading mail together]
AMARA: "I just started helping her with her grocery list and mail every Wednesday. No programme, no permission slip. Eight months later, she''s teaching me to sew."
NARRATOR (V.O.): "Consistency beats scale. Small and regular does more than big and once."
[GRAPHIC: "One big event" vs "Every Wednesday, 30 minutes" — showing the second building more over time]
[END CARD: "Take Action: find one small way to give back this week."]', 'Open with the relatable "overwhelmed by search results" moment to validate why people stall before starting. Amara’s scene should feel warm and ordinary — a kitchen table, not a staged "volunteering" photo-op. Use a simple time-based graphic to visualise why consistency compounds.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action volunteering-plan exercise.', 'Nomusa Radebe', 'Civic Education Facilitator', 'nomusa', '#5F9770', 'published', '/lessons/civic-3.png', now()) returning id into l10_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l10_id, 'What does this lesson say matters more than scale in volunteering?', ARRAY['Money spent','Consistency — showing up regularly, even in small amounts','How many people know about it','Having a formal certificate']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l10_id, 'What did Amara’s consistent small act lead to?', ARRAY['Nothing changed','A genuine relationship and learning a new skill (sewing)','She stopped after one week','She needed a car to continue']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l10_id, 'According to this lesson, what is often the real starting point for volunteering?', ARRAY['Waiting for a formal programme','Noticing a real need close to you','Having a large budget','Getting permission from a big organisation first']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Understanding Local Government', 'Who actually runs your local area, what a ward councillor does, and how local government decisions reach your street.', 'civic', t11_id, 9, 11, 12, ARRAY['Explain the difference between national, provincial and local government','Describe what a ward councillor’s role actually is','Identify how to find out who represents their own ward']::text[], 'Most people can name the President but not the one person whose actual job is fixing potholes and streetlights in their own neighbourhood.', 'South Africa has three spheres of government, and most civic education focuses almost entirely on the top one — national government, Parliament, the President — while the sphere that actually affects daily life most directly, local government, gets barely mentioned.

National government handles country-wide matters: defence, foreign affairs, national policy. Provincial government handles things like provincial education departments and provincial roads. Local government (municipalities) handles the things you interact with constantly without necessarily connecting them to government: water and electricity supply, refuse collection, local roads and streetlights, parks, clinics, and local business licensing. When a streetlight is broken for months, or a water outage isn''t fixed, that''s a local government matter — not a national one, and knowing that changes who you''d actually contact.

Each area is divided into wards, and each ward elects a ward councillor — a real, named, contactable person whose specific job is representing that ward''s interests at the municipal council, raising local issues, and reporting back on council decisions. Unlike the President, a ward councillor is genuinely reachable — they hold ward committee meetings (open to the public), and their contact details are available through the municipality''s website or offices.

Lindiwe, a Grade 10 learner from Tembisa, didn''t know her ward councillor''s name until a civic education class assignment required finding it. She searched her municipality''s website, found the name and contact details in under ten minutes, and realised the councillor held a public ward meeting monthly, a few streets from her home — meetings she''d walked past without knowing what they were. She didn''t attend one immediately, but she now knew exactly who to contact and where, the next time a local issue (like the water pressure problems her street had been having) needed reporting to someone with actual authority to act on it.

Local government isn''t distant or abstract — it''s the sphere of government you interact with the most, run by real, named, reachable people. The habit worth building: know your ward number and your councillor''s name before you need them, not after.', ARRAY['South Africa has three spheres of government: national, provincial and local — each handles different things','Local government (municipalities) handles the day-to-day services people interact with most: water, roads, refuse, streetlights','Each ward has an elected, named, contactable ward councillor','Knowing your ward number and councillor’s name before you need them makes local issues far easier to report']::text[], 'Find out which ward you live in and who your ward councillor is (search your municipality’s website, or ask a family member). Write down their name and how to contact them.', 'Before this lesson, did you know who your ward councillor was? Does it surprise you how reachable local government actually is compared to national government?', 'Know Your Local Government Guide', 'PDF', 'KNOW YOUR LOCAL GOVERNMENT GUIDE

THE THREE SPHERES:
NATIONAL: defence, foreign affairs, national policy (President, Parliament)
PROVINCIAL: provincial education, provincial health, provincial roads
LOCAL (MUNICIPAL): water, electricity, refuse collection, local roads, streetlights, parks, clinics — the things you interact with daily

YOUR WARD COUNCILLOR:
- Represents your specific ward at the municipal council
- Holds ward committee meetings, open to the public
- Is a real, named, contactable person — not an abstract office

HOW TO FIND YOUR WARD COUNCILLOR:
1. Search "[your municipality name] ward councillor" online
2. Check your municipality''s official website
3. Ask at your local municipal office

MY WARD INFORMATION:
Ward number: ___________________________
Councillor''s name: ___________________________
How to contact them: ___________________________', '[OPEN on a broken streetlight, dark street, a quick montage of "who do I even call?"]
NARRATOR (V.O.): "Not a national issue. Not even provincial. This is local government — and it has a name attached."
[GRAPHIC: National → Provincial → Local, zooming in each time to show what each level actually handles]
[CUT to Lindiwe, looking at her phone]
LINDIWE: "I didn''t know my ward councillor''s name until a class assignment made me look it up. Took me ten minutes. There''s even a public meeting a few streets from my house."
NARRATOR (V.O.): "Local government is the sphere you interact with most — and the easiest to actually reach."
[END CARD: "Take Action: find your ward councillor''s name today."]', 'Open on a concrete, relatable local issue (broken streetlight) to ground an otherwise abstract civics topic. Use a simple zooming graphic (National → Provincial → Local) to make the three spheres visually clear and memorable. Lindiwe’s realisation should feel practical and mildly surprising ("it was that easy to find"), not a civics lecture.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action ward councillor research exercise.', 'Nomusa Radebe', 'Civic Education Facilitator', 'nomusa', '#5F9770', 'published', '/lessons/civic-4.png', now()) returning id into l11_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l11_id, 'Which sphere of government typically handles refuse collection and local streetlights?', ARRAY['National government','Provincial government','Local government (municipality)','None of these']::text[], 2, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l11_id, 'What is a ward councillor?', ARRAY['The President’s representative','An elected, named person representing a specific ward at the municipal council','A national government minister','A police officer']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l11_id, 'How did Lindiwe find her ward councillor’s details?', ARRAY['She couldn’t find them','She searched her municipality’s website','She called the President’s office','It’s impossible to find this information']::text[], 1, 2);

end $$;
