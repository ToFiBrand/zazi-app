delete from public.lesson_quiz_questions;
delete from public.lessons;
delete from public.topics;

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
  insert into public.topics (pillar, name, description, sort_order) values ('career', 'Subject Choices → Career Pathways', 'Connect what you study now to where it can take you.', 1) returning id into t0_id;
  insert into public.topics (pillar, name, description, sort_order) values ('career', 'Life After Matric', 'The real menu of options once Grade 12 ends.', 2) returning id into t1_id;
  insert into public.topics (pillar, name, description, sort_order) values ('finance', 'Budgeting Basics', 'The first skill every financial future is built on.', 1) returning id into t2_id;
  insert into public.topics (pillar, name, description, sort_order) values ('finance', 'Credit & Wealth', 'How borrowing works, and how to build wealth over time.', 2) returning id into t3_id;
  insert into public.topics (pillar, name, description, sort_order) values ('digital', 'Digital Identity', 'What you post now becomes who people think you are.', 1) returning id into t4_id;
  insert into public.topics (pillar, name, description, sort_order) values ('digital', 'Media Literacy & AI', 'Telling real from fake in a feed built to blur the line.', 2) returning id into t5_id;
  insert into public.topics (pillar, name, description, sort_order) values ('entrepreneurship', 'From Idea to Business', 'Turning a problem you notice into something you build.', 1) returning id into t6_id;
  insert into public.topics (pillar, name, description, sort_order) values ('entrepreneurship', 'Pitching & Communication', 'Getting someone else to see what you see.', 2) returning id into t7_id;
  insert into public.topics (pillar, name, description, sort_order) values ('leadership', 'Finding Your Voice', 'Confidence, communication and influence start here.', 1) returning id into t8_id;
  insert into public.topics (pillar, name, description, sort_order) values ('leadership', 'Everyday Leadership', 'Leading doesn’t require a title or permission.', 2) returning id into t9_id;
  insert into public.topics (pillar, name, description, sort_order) values ('civic', 'Know Your Rights', 'What the Constitution actually promises young South Africans.', 1) returning id into t10_id;
  insert into public.topics (pillar, name, description, sort_order) values ('civic', 'Active Citizenship', 'Turning a problem you see into action that moves it.', 2) returning id into t11_id;
  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Subject Choices → Career Pathways', 'How your Grade 10 subject choices quietly decide which careers stay open to you — and how to choose on purpose instead of by accident.', 'career', t0_id, 8, 10, 12, ARRAY['Explain why subject choices in Grade 10 affect university and career options later','Identify which subjects are required "gateway" subjects for common career fields','Match at least one personal interest to a realistic subject-and-career pathway']::text[], 'You don''t have to know your whole future to choose your subjects well — you just have to know which doors you want to keep open.', 'Most learners choose subjects the way they choose a lunch queue — whichever line their friends are standing in. It feels like a small decision at the time. It isn''t.

In South Africa, subjects like Maths (not Maths Literacy), Physical Sciences and Accounting act as "gateway" subjects — university faculties often won''t consider an application without them, no matter how good your marks are elsewhere. Drop Maths in Grade 10 and you''ve quietly closed the door on engineering, most health sciences, and most commerce degrees, even if you only realise it in Grade 12 when it''s too late to go back.

That doesn''t mean every learner must take Pure Maths and Physical Sciences "just in case." It means the decision should be made looking forward, not sideways. Ask: what kind of problems do I like solving? Do I like working with people, ideas, numbers, or my hands? A learner who loves people and organising things might thrive in Business Studies and Economics toward marketing, HR or entrepreneurship — without ever touching Physical Sciences. A learner who''s curious about how the human body works needs Life Sciences and Physical Sciences from Grade 10, not Grade 11.

Here''s the pathway logic in practice: Naledi, from Soweto, wants to become a quantity surveyor — she didn''t know the job title existed at 15, but she knew she liked building things and was good with numbers. Her teacher helped her trace it back: quantity surveying needs Maths and, ideally, Physical Sciences. She chose both in Grade 10, not because she''d mapped her whole career, but because "numbers + building" pointed there. That''s the actual skill this lesson teaches: work backward from what you enjoy to the subjects that keep that door open.', ARRAY['Subject choices in Grade 10 can permanently close or keep open entire career fields','Maths, Physical Sciences and Accounting are the most common "gateway" subjects for university faculties','You don’t need a final career answer — you need to protect the doors that match your interests','A teacher, counsellor or the SAQA CAO handbook can confirm exact subject requirements for any course']::text[], 'Write down 2 careers you’re curious about (even a wild guess is fine). Look up their entry requirements on a CAO/university prospectus, then check: does your current subject choice keep that door open? If not, who can you talk to this week about changing it?', 'If you found out tomorrow that one of your current subjects was quietly closing a door you didn’t know mattered — would you want to know now, or would you rather not think about it yet? Why?', 'Subject-to-Career Gateway Chart', 'PDF', 'SUBJECT-TO-CAREER GATEWAY CHART

MATHS (Pure) is required for: Engineering, most Health Sciences (Medicine, Pharmacy, Dentistry), Actuarial Science, Computer Science, most Commerce degrees (BCom Accounting, Economics), Architecture.

PHYSICAL SCIENCES is required for: Engineering, Medicine & Health Sciences, Pure/Applied Science degrees, some Agriculture degrees.

LIFE SCIENCES is required for: Medicine & Health Sciences, Nursing, Biotechnology, Agriculture, Environmental Science.

ACCOUNTING is required for: BCom Accounting, Chartered Accountancy (CA(SA)) pathway, some Finance degrees.

MATHS LITERACY does NOT qualify you for the fields above — it opens Humanities, some Education, Law (check specific university), and many Diploma-level courses.

RULE OF THUMB: If there''s any chance you''ll want Engineering, Health Sciences or a CA(SA) pathway, keep Pure Maths for as long as you can. It''s far easier to decide later you don''t need it than to add it back after Grade 10.

Always confirm exact requirements on the specific university''s official prospectus — requirements shift year to year.', '[OPEN on a split screen: a doctor''s stethoscope vs. a laptop showing a marketing dashboard]
NARRATOR (V.O.): "Two completely different futures. Same starting point: Grade 10 subject choice."
[CUT to a learner staring at a subject choice form, pen hovering]
NARRATOR: "This form feels small. It isn''t."
[GRAPHIC: "Maths (Pure) → Engineering, Health Sciences, Commerce, Computer Science"]
NARRATOR: "Some subjects are gateways — skip them now, and some careers quietly lock the door."
[CUT to Naledi, a young SA learner, sketching a building]
NALEDI: "I didn''t know ''quantity surveyor'' was a job. I just knew I liked numbers and building things. My teacher showed me: that''s Maths and Physical Sciences."
NARRATOR (V.O.): "You don''t need the whole map. You need to protect the doors that match what you''re curious about."
[END CARD: "Take Action: check your dream career''s real requirements — today."]', 'Split-screen career contrast opener (doctor vs marketer). Real CAO/prospectus screenshot graphic for gateway subjects. Feature a young SA learner (Naledi persona) sketching/building something hands-on to visualise "numbers + building = quantity surveying." Warm, optimistic lighting — avoid making this feel like a pressure/anxiety video.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action subject-check exercise.', 'Thabo Nkosi', 'Career Counsellor', 'thabo', '#FF8A00', 'published', '/lessons/career-1.png', now()) returning id into l0_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l0_id, 'Which of these is generally considered a "gateway" subject that many university faculties require?', ARRAY['Life Orientation','Pure Mathematics','Physical Education','Maths Literacy']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l0_id, 'What is the safest way to confirm exact subject requirements for a specific career?', ARRAY['Ask a friend who guessed','Check the official university/CAO prospectus','Assume Maths Literacy is always enough','Wait until Grade 12 to check']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l0_id, 'What does this lesson suggest as the right way to choose subjects?', ARRAY['Copy whatever your friends choose','Work backward from your interests to the subjects that protect those doors','Only choose subjects you find easy','It doesn’t matter, you can always change later']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('What Can I Actually Do After Matric?', 'A clear, honest map of every real path after Grade 12 — university, TVET college, learnerships, gap year work, and starting your own thing — so the choice feels like options, not pressure.', 'career', t1_id, 11, 12, 13, ARRAY['List at least four legitimate post-matric pathways beyond university','Understand what a TVET college and a learnership actually involve','Identify the first concrete action to take in their final matric year for their preferred path']::text[], '“Go to university” is not the only sentence that finishes “After matric, I’m going to...” — there are at least five.', 'Ask most Grade 12s what''s next and you''ll hear "varsity" — said with more hope than certainty. University is one path. It is not the only one, and for a lot of learners, it isn''t even the best one.

Here are the real options on the table. University (a 3–4 year degree, entry usually needs a Bachelor''s pass and specific subject marks) leads to professional and academic careers — but it''s expensive, competitive, and not the only route into a good career. TVET colleges (Technical and Vocational Education and Training) offer NCV or Report 191 qualifications in fields like electrical engineering, hospitality, IT and hairdressing — shorter, more affordable, and highly practical, with direct routes into trades and technical careers that are in real demand. Learnerships combine paid work with structured training — a company pays you a stipend while you earn a qualification, common in banking, retail, and engineering sectors through SETAs. Artisan/apprenticeship routes (through TVET or direct trade programmes) train electricians, plumbers, welders and mechanics — skilled trades that are consistently short-staffed in South Africa and pay well once qualified. And for some, a gap year of paid work or volunteering, followed by study once there''s clarity (and sometimes savings), is a legitimate and often smarter choice than enrolling in a degree you''re not sure about.

Sibusiso, from KwaMashu, didn''t get a Bachelor''s pass. He assumed that was the end of the story. His teacher pointed him to a TVET college''s Electrical Infrastructure Construction NCV — two years later he''s doing an apprenticeship with an electrical contractor, earning while he finishes his trade test. He didn''t take a "backup" path. He took a different, valid one.

The real skill isn''t picking the "best" option in general — it''s picking the option that matches your marks, your interests, and your family''s financial reality, and then taking one concrete step toward it before the school year ends.', ARRAY['University is one path after matric — not the only respected one','TVET colleges and learnerships offer shorter, practical, often-paid routes into real careers','Skilled trades (electrician, plumber, artisan routes) are in high demand in South Africa and pay well','The right path is the one that matches your marks, interests and finances — not the one that sounds most impressive']::text[], 'Research one TVET college or one learnership programme in a field you’re curious about. Write down: what qualification do they offer, how long does it take, and what’s the one thing you’d need to do this year to apply?', 'Has anyone ever made you feel like university was the only "real" option after school? How did that make you think about your own plans?', 'Post-Matric Pathways Checklist', 'PDF', 'POST-MATRIC PATHWAYS CHECKLIST

UNIVERSITY — Needs: Bachelor''s/Diploma pass + subject-specific marks. Apply via CAO (KZN) or direct to universities, usually April–June the year before. Cost: highest, but NSFAS may cover if household income qualifies.

TVET COLLEGE — Needs: Grade 9–12 depending on programme (NCV or Report 191). Apply directly to the college. Cost: lower than university, NSFAS also available for qualifying students. Timeframe: practical qualifications often 1–3 years.

LEARNERSHIP — Needs: Varies by programme, some accept Grade 12 with no further study. Apply directly to companies or via SETA websites. You are paid a stipend while training — no fees.

ARTISAN / APPRENTICESHIP — Needs: Often Grade 9–12 + a trade test process. Apply via TVET colleges or directly to employers (e.g. municipalities, mines, manufacturers).

GAP YEAR — No formal requirements. Plan: paid work or volunteering + a clear date to revisit study plans, so it stays intentional rather than open-ended.

THIS WEEK: pick one row above, find the actual application deadline, and write it in your phone calendar.', '[OPEN on a Grade 12 learner scrolling university ads on a phone, looking overwhelmed]
NARRATOR (V.O.): "Everyone asks: which university? Almost no one asks: is university even your best next step?"
[GRAPHIC: 5 icons — University, TVET College, Learnership, Artisan Trade, Gap Year]
NARRATOR: "There are at least five real paths after matric. All of them can lead somewhere good."
[CUT to Sibusiso, in work overalls, smiling next to an electrical panel]
SIBUSISO: "I didn''t get a Bachelor''s pass. I thought that was it for me. Then I found out about TVET — now I''m training as an electrician, and I''m getting paid while I learn."
NARRATOR (V.O.): "The right path isn''t the most impressive one. It''s the one that matches your marks, your interests, and your life."
[END CARD: "Take Action: find one real deadline this week."]', 'Open with the overwhelmed "university ads" scroll to mirror real learner anxiety. Use a simple 5-icon pathway graphic (university/TVET/learnership/artisan/gap year) as a recurring visual anchor. Feature Sibusiso in a real trade setting (electrical/technical) to visually dignify the non-university path — avoid stock "graduation gown" imagery which reinforces the university-only bias this lesson is correcting.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action pathway research exercise.', 'Thabo Nkosi', 'Career Counsellor', 'thabo', '#FF8A00', 'published', '/lessons/career-2.png', now()) returning id into l1_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l1_id, 'Which of these is a legitimate post-matric path besides university?', ARRAY['TVET college','Learnership','Artisan apprenticeship','All of the above']::text[], 3, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l1_id, 'What is a key feature of a learnership?', ARRAY['You pay full university fees','You are paid a stipend while training','It only lasts one weekend','It requires a Bachelor’s pass']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l1_id, 'According to this lesson, how should you choose your post-matric path?', ARRAY['Pick whatever sounds most impressive','Match it to your marks, interests and finances','Always choose university no matter what','Let someone else decide for you']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Your First Budget: Where Does Your Money Go?', 'A beginner’s guide to building your first simple budget — even if your only "income" is taxi fare change or birthday money.', 'finance', t2_id, 7, 9, 10, ARRAY['Explain the difference between needs and wants in personal spending','Build a simple three-category budget for any amount of money, big or small','Track where money actually goes for one week']::text[], 'If you can’t say where your last R100 went, you don’t have a spending problem — you have a tracking problem. That’s the easiest one to fix.', 'A budget sounds like something adults do with payslips and bank apps. But if you''ve ever had R50 for the week and it was gone by Wednesday with nothing to show for it — you already needed one.

A budget is just a plan for money before you spend it, instead of a mystery you solve afterward. The simplest version has three buckets: Needs (things you can''t avoid — transport to school, airtime for family contact, lunch), Wants (things that are nice but optional — snacks, data for social media, new sneakers), and Savings (money you decide not to touch, even a small amount).

Here''s why this matters more than it sounds: most people don''t overspend on one big thing. They leak money on small things they don''t track — a R15 airtime top-up here, a R20 snack there — until R100 has quietly become R0 with nothing memorable bought. Zanele, a Grade 8 learner in Mitchells Plain, started tracking her taxi-fare change for one week out of curiosity. She discovered she was spending almost R60 a month on chips and airtime she barely remembered buying — more than half of what she''d been trying to save for a school trip.

The fix isn''t complicated: before you spend, decide the three numbers. If you get R200 pocket money a month, you might set Needs at R120 (data, lunch top-ups), Wants at R50 (snacks, fun), Savings at R30 (untouched, even if it takes months to add up to something). The categories don''t need to be perfect on day one. What matters is that you decided the numbers before the money disappeared, not after.', ARRAY['A budget is simply deciding where money goes before you spend it','Split money into three buckets: Needs, Wants, and Savings','Small untracked spending ("leaks") often adds up to more than one big purchase','Tracking for even one week reveals patterns you didn’t know you had']::text[], 'For 7 days, write down every single rand you spend — taxi fare, airtime, snacks, everything — in your phone notes or on paper. At the end of the week, sort it into Needs / Wants / Savings and see what surprises you.', 'Think about the last R50 you spent on non-essentials. If you had to explain each purchase out loud to someone, would you feel proud of the choices — or surprised by them?', 'My First Budget Worksheet', 'PDF', 'MY FIRST BUDGET WORKSHEET

STEP 1: Write your total money for the month (pocket money, allowance, any income): R______

STEP 2: Split it into three buckets:
NEEDS (transport, airtime for contact, school lunch): R______
WANTS (snacks, social data, extras): R______
SAVINGS (untouched, even if small): R______
(Needs + Wants + Savings should add up to your total)

STEP 3: Track for 7 days. Write every rand spent:
Day 1: ___________________________
Day 2: ___________________________
Day 3: ___________________________
Day 4: ___________________________
Day 5: ___________________________
Day 6: ___________________________
Day 7: ___________________________

STEP 4: At the end of the week, ask: did I stick to my three numbers? What surprised me?

RULE OF THUMB FOR BEGINNERS: even R5 a week saved consistently is a habit worth more than R500 saved once and forgotten.', '[OPEN on a hand counting loose coins and small notes on a table]
NARRATOR (V.O.): "R50 for the week. By Wednesday, it''s gone. Where did it go?"
[CUT to a phone notes app, empty]
NARRATOR: "Most people don''t lose money on one big thing. They leak it — R15 here, R20 there."
[CUT to Zanele, smiling, holding up a small notebook]
ZANELE: "I tracked my taxi change for a week just to see. I was spending almost R60 a month on chips and airtime I don''t even remember buying."
NARRATOR (V.O.): "A budget isn''t about having a lot of money. It''s about deciding where it goes before it disappears."
[GRAPHIC: Three buckets — Needs, Wants, Savings]
[END CARD: "Take Action: track every rand for 7 days."]', 'Open tight on hands counting real coins/notes — grounds this in an amount every learner recognises, not an abstract "budget" graphic. Use a simple 3-bucket visual (Needs/Wants/Savings) as a recurring motif reusable across future Money lessons. Feature Zanele with a physical notebook, not a banking app, to keep it accessible for learners without smartphones.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and track spending for at least 3 days using the worksheet.', 'Lerato Dlamini', 'Financial Literacy Educator', 'lerato', '#F4B84C', 'published', '/lessons/finance-1.png', now()) returning id into l2_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l2_id, 'What are the three budget buckets taught in this lesson?', ARRAY['Cash, Card, Crypto','Needs, Wants, Savings','Rent, Food, Fun','Income, Tax, Debt']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l2_id, 'What is a "money leak"?', ARRAY['A bank error','Small untracked spending that adds up over time','A type of savings account','Money stolen from you']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l2_id, 'What did Zanele discover by tracking her spending for a week?', ARRAY['She had no money leaks','She was spending more than expected on chips and airtime','She saved too much','Budgeting was impossible for her']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Credit, Debt & Building Your Financial Future', 'How credit, interest and debt actually work in South Africa — and how to use them as tools for building wealth instead of traps that build stress.', 'finance', t3_id, 10, 12, 14, ARRAY['Explain how interest makes borrowed money cost more than its sticker price','Distinguish between "good debt" (can build wealth) and "bad debt" (erodes it)','Describe two starting habits for building long-term financial wealth']::text[], 'Debt isn’t automatically bad, and credit isn’t automatically dangerous — what matters is whether you understand the deal you’re making before you sign it.', 'Credit is simply someone else''s money, lent to you today, on the promise you''ll pay it back — plus extra, called interest. That extra is the cost of borrowing, and it''s where most financial trouble in South Africa actually starts: not from borrowing itself, but from not understanding how much the "extra" really is.

Here''s the part most people never get taught: a R2,000 store account debt at typical retail interest rates, paid off slowly at minimum monthly instalments, can end up costing R3,000–R4,000 in total once interest and fees are added — sometimes more. That''s not a rare trap; it''s how the maths of high-interest revolving credit works by design. This is why "good debt" and "bad debt" is a more useful split than "debt is good" or "debt is bad." Good debt is money borrowed for something that grows in value or grows your earning power — a student loan for a qualification that increases your income, or a home loan on a property that appreciates. Bad debt is money borrowed for things that lose value the moment you buy them — clothing accounts, high-interest "buy now pay later" apps for non-essentials, loans for things you could have saved for in a month or two.

Palesa, a Grade 11 learner from Soweto, watched her older cousin get trapped by three separate clothing accounts — each with a small, manageable-looking monthly instalment, but together eating almost 40% of her cousin''s salary in interest and fees. Palesa''s takeaway wasn''t "never use credit." It was: one account at a time, know the interest rate before you sign, and never borrow for something you could save for in under three months.

Building wealth starts small and boring, on purpose: an emergency fund (even R500 saved before anything else, so one bad month doesn''t force you into debt), consistent saving (a fixed amount every month, no matter how small, because consistency beats occasional large deposits), and understanding compound growth (money that earns interest on its own interest grows faster the earlier you start — which means the best time to start is now, at your current age, not "later" when you earn more).', ARRAY['Interest is the real cost of credit — always check the rate before borrowing','Good debt builds your income or assets; bad debt is for things that lose value immediately','Multiple small debt accounts can combine into a large, hard-to-escape monthly burden','Starting to save small amounts consistently, early, matters more than the amount itself']::text[], 'Find one real store account or credit product advertisement (in-store, online, or from a family member’s statement with permission). Work out: what’s the interest rate, and what would a R1,000 purchase actually cost by the time it’s paid off?', 'Has anyone in your family or community been affected by debt that grew bigger than expected? What do you think they wish they’d known beforehand?', 'Good Debt vs Bad Debt Guide', 'PDF', 'GOOD DEBT VS BAD DEBT GUIDE

GOOD DEBT (can build your future):
- Student loans/bursary-linked study loans for a qualification that increases your earning power
- A home loan on a property in a stable or growing area
- A business loan for equipment that generates income

BAD DEBT (usually costs more than it''s worth):
- Clothing accounts and store cards for non-essential items
- High-interest short-term loans for things you could save for in under 3 months
- "Buy now, pay later" apps used for wants, not needs
- Borrowing to pay off other debt

BEFORE YOU BORROW ANYTHING, ASK:
1. What is the interest rate? (If nobody can tell you clearly, that''s a red flag.)
2. What will this actually cost me in total by the time it''s paid off?
3. Could I save for this instead in under 3 months?
4. Will this debt help me earn more, or just spend more?

3 HABITS TO START THIS YEAR:
1. Save R50–R500 (whatever you can) before spending on anything else — an emergency fund.
2. Save a fixed small amount every single month, without fail.
3. Ask before signing anything: "What''s the interest rate, and what''s the total cost?"', '[OPEN on a store account application form, close-up on the interest rate line — deliberately blurred/small print]
NARRATOR (V.O.): "The most important number on this page is also the smallest."
[GRAPHIC: R2,000 purchase → R3,000+ paid back, ticking upward]
NARRATOR: "That''s what interest does. It''s not a trick — it''s the cost of borrowing. But most people never do this maths before they sign."
[CUT to Palesa, thoughtful, speaking directly to camera]
PALESA: "My cousin had three small accounts. Small on their own. Together, almost half her salary was gone to interest every month."
NARRATOR (V.O.): "Good debt builds your future. Bad debt just costs you today''s money tomorrow, with extra."
[END CARD: "Take Action: find one real interest rate and do the maths."]', 'Open on a real-looking store account form with the interest rate line emphasised — this is the visual "aha" of the whole lesson. Use a simple rising-number graphic (R2,000 → R3,000+) to make compounding interest visceral rather than abstract. Palesa should read as thoughtful/measured, not preachy — this is a peer sharing a lesson, not a lecture.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action interest-rate research exercise.', 'Lerato Dlamini', 'Financial Literacy Educator', 'lerato', '#F4B84C', 'published', '/lessons/finance-2.png', now()) returning id into l3_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l3_id, 'What is interest?', ARRAY['A type of savings account','The extra cost of borrowing money','A government tax','Money you get for free']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l3_id, 'Which of these is an example of "good debt"?', ARRAY['A clothing account for new sneakers','A student loan for a qualification that increases income','A short-term loan for a party','Borrowing to pay off another loan']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l3_id, 'What should you always check before taking on any credit?', ARRAY['The store’s opening hours','The interest rate and total cost','What your friends think','Nothing, just sign']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Your Digital Footprint Is Your Reputation', 'What a digital footprint actually is, why it doesn’t disappear, and how to build one you’d be proud to have a future employer or school see.', 'digital', t4_id, 7, 9, 11, ARRAY['Define "digital footprint" and explain why deleted posts aren’t really gone','Identify the difference between an active footprint (what you post) and passive footprint (data collected about you)','Apply a simple "billboard test" before posting anything online']::text[], 'Before a stranger ever meets you, they might already "know" you — from what you posted two years ago and forgot about.', 'Every like, comment, post, and search leaves a trace. Put together, those traces form your digital footprint — the version of you that exists online, whether you''re thinking about it or not.

There are two kinds. Your active footprint is everything you deliberately post — photos, comments, statuses, videos. Your passive footprint is data collected about you without you actively "posting" it — your location history, what you searched, which posts you lingered on. Most learners only think about the active kind, but both shape how apps and, eventually, people understand you.

Here''s the part that surprises people: deleting a post doesn''t erase it. Screenshots exist. Cached versions exist on search engines. Group chats forward things. A photo posted at 14 can resurface at 22, during a university interview or a job application, with zero context about who you were when you posted it. This isn''t a scare tactic — it''s just how the internet''s memory works, and understanding it early means you get to be intentional instead of caught off guard later.

Ayanda, a Grade 9 learner in Durban, posted a joke video mocking a teacher, deleted it an hour later after a friend warned her, and thought that was the end of it. Three months later, a classmate resurfaced a saved copy during an unrelated argument, and it reached her school''s discipline committee. Ayanda''s lesson wasn''t "never post anything" — it was learning the billboard test: would you be comfortable if this was printed on a billboard outside your school, with your name on it, for a month? If not, don''t post it, because functionally, that''s what the internet can do with it.

A strong digital footprint isn''t about posting nothing — it''s about posting things you''d stand behind. Universities and employers increasingly check social media before final decisions. The goal isn''t fear. It''s building a footprint today that your future self is proud to have left behind.', ARRAY['Your digital footprint = everything you post (active) + data collected about you (passive)','Deleted posts aren’t really gone — screenshots and caches keep them alive','Use the "billboard test": would you be okay with this on a billboard with your name on it?','Universities and employers increasingly check social media before making decisions']::text[], 'Search your own name (or your most-used username) online. What comes up? Pick one post from the last year and honestly run it through the billboard test — would you stand behind it?', 'Have you ever seen someone judged unfairly because of something old they posted? What do you think they’d want people to know instead?', 'The Billboard Test Checklist', 'PDF', 'THE BILLBOARD TEST CHECKLIST

Before you post anything, ask:

1. Would I be okay with this on a billboard outside my school, with my name on it, for a month?
2. Could this be misunderstood without the context I have in my head right now?
3. Am I posting this because I actually want to, or because of pressure in the moment?
4. If my future self read this in 5 years, would they be proud, embarrassed, or indifferent?
5. Does this reveal information (location, routine, family details) that could put me or someone else at risk?

IF YOU ANSWER "NO" TO QUESTION 1 OR "YES" TO QUESTION 5 — DON''T POST IT.

REMEMBER: "Delete" does not mean "gone." Screenshots, caches and forwards can outlive the original post by years.

A GOOD DIGITAL FOOTPRINT IS BUILT, NOT AVOIDED: share things you''re proud of — achievements, opinions you''ve thought through, things you''ve made. That''s what a strong footprint looks like.', '[OPEN on a phone screen, a post being typed, thumb hovering over "Post"]
NARRATOR (V.O.): "Before you tap post — who''s this for, and who might see it later?"
[CUT to a search bar typing a name, results loading]
NARRATOR: "Everything you post, like, and search builds something: your digital footprint."
[CUT to Ayanda, honest, a little rueful]
AYANDA: "I deleted it in an hour. Someone had already screenshotted it. Three months later it was back — with none of the context."
NARRATOR (V.O.): "Delete doesn''t mean gone. So before you post — try the billboard test."
[GRAPHIC: A literal billboard with a phone post blown up large, learner''s name on it]
NARRATOR: "Would you be okay with this, on a billboard, with your name on it, for a month?"
[END CARD: "Take Action: search your own name today."]', 'Open tight on the "Post" button moment — the exact decision point this lesson is about. Use the literal billboard graphic (post blown up large on a billboard) as the lesson’s signature visual — it should become instantly recognisable/reusable. Keep Ayanda’s story sympathetic, not shaming — she’s a relatable peer, not a cautionary villain.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action self-search exercise.', 'Sipho Mthembu', 'Digital Literacy Teacher', 'sipho', '#006E68', 'published', '/lessons/digital-1.png', now()) returning id into l4_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l4_id, 'What is a "passive" digital footprint?', ARRAY['Posts you delete','Data collected about you without actively posting (location, searches)','Your profile picture','Comments you leave on friends’ posts']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l4_id, 'Why doesn’t deleting a post make it truly gone?', ARRAY['It doesn’t — deleting removes it completely','Screenshots and cached copies can still exist','Only adults can see deleted posts','The app keeps a public archive']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l4_id, 'What is the "billboard test"?', ARRAY['Checking how many likes a post got','Asking if you’d be okay with a post on a billboard with your name on it','A way to make posts go viral','A school assignment about advertising']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('AI, Fake News & Thinking for Yourself', 'How AI-generated content and fake news actually spread, and a practical method for checking what’s real before you believe it or share it.', 'digital', t5_id, 10, 12, 13, ARRAY['Explain how AI-generated images, video and text can be used to mislead','Apply a simple source-checking method before sharing information','Identify at least two red flags that suggest content might be false or manipulated']::text[], 'The most convincing lie you’ll see this year probably won’t look like a lie — it’ll look exactly like a normal post from someone you trust.', 'A few years ago, spotting fake news meant looking for bad spelling and obviously fake-looking photos. That world is gone. AI tools can now generate a realistic video of someone saying something they never said, a photo of an event that never happened, or a news article that reads exactly like real journalism — all in seconds, for free.

This matters because misinformation doesn''t spread because people are careless. It spreads because it''s designed to trigger strong emotion — outrage, fear, excitement — faster than the brain''s "wait, is this true?" reflex can catch up. A fake video of a politician saying something shocking will always travel faster than the fact-check that debunks it three hours later, because outrage is instant and verification takes time.

The good news: you don''t need to be a tech expert to catch most of it. Use SIFT — a simple four-step check. Stop before reacting or sharing — the emotional pull is often the first clue something''s designed to manipulate you. Investigate the source — who posted this originally, and are they credible? A screenshot with no source is worth nothing. Find better coverage — search the claim; if it''s real news, credible outlets will be reporting it too, not just one anonymous account. Trace the original — for images and videos, a reverse image search often reveals whether a photo is old, from a different event, or AI-generated entirely.

Kagiso, a Grade 11 learner from Polokwane, almost shared a video showing a local politician making an inflammatory statement — it had thousands of shares already. Before sharing, he ran a 30-second SIFT check: no credible news outlet was reporting it, and a reverse image search showed the video was a manipulated splice of two unrelated clips. He didn''t share it. Thousands of others already had.

Thinking for yourself online doesn''t mean distrusting everything — it means pausing long enough to check before you become part of the problem.', ARRAY['AI can now generate convincing fake images, videos and articles in seconds','Misinformation spreads fast because it triggers emotion faster than verification','Use SIFT: Stop, Investigate the source, Find better coverage, Trace the original','A reverse image search can reveal if a photo/video is old, unrelated, or fabricated']::text[], 'Find one piece of content online today that made you feel a strong emotional reaction (outrage, shock, excitement). Run the SIFT check on it before deciding whether to trust or share it. Write down what you found.', 'Have you ever shared something online that turned out to be false or misleading? What made it convincing enough to share in the moment?', 'The SIFT Method Card', 'PDF', 'THE SIFT METHOD — CHECK BEFORE YOU BELIEVE OR SHARE

S — STOP: Notice your emotional reaction. Outrage, shock and excitement are exactly what manipulated content is designed to trigger. Pause before reacting.

I — INVESTIGATE THE SOURCE: Who posted this originally? Is it a known, credible account or an anonymous/new one? A claim with no named source is not evidence.

F — FIND BETTER COVERAGE: Search the claim in a few words. If it''s real and significant, multiple credible news outlets will be covering it — not just one post.

T — TRACE THE ORIGINAL: For photos and videos, use a reverse image search (e.g. Google Images, TinEye) to check if the image is old, from a different event, or doesn''t exist anywhere else — a sign of AI generation.

RED FLAGS TO WATCH FOR:
- No named, checkable source
- Extreme emotional language ("You won''t believe...", "SHARE before they delete this")
- Only one account posting it, no other coverage
- Slightly "off" details in AI images (hands, text, backgrounds that don''t quite make sense)

BEFORE SHARING ANYTHING: run SIFT. It takes 30 seconds and can stop you from spreading something false.', '[OPEN on a realistic-looking video clip of a "public figure" saying something shocking, mid-scroll]
NARRATOR (V.O.): "Is this real? A few years ago, you could probably tell. Today — maybe not."
[GRAPHIC: "AI-generated" stamp appears over the clip]
NARRATOR: "AI can now fake video, photos, even entire news articles, in seconds."
[CUT to Kagiso, phone in hand]
KAGISO: "It had thousands of shares already. I almost shared it too. Then I checked — no real news outlet was reporting it. A reverse image search showed it was two unrelated clips spliced together."
NARRATOR (V.O.): "You don''t need to be an expert. You need 30 seconds and one method: SIFT."
[GRAPHIC: S-I-F-T letters building one at a time]
[END CARD: "Take Action: SIFT-check one post today."]', 'Open with a convincing-looking fake clip, then visually "reveal" the AI-generated stamp — a strong hook that demonstrates the problem before explaining it. Build the SIFT acronym as an on-screen graphic, letter by letter, so it’s memorable and reusable in future lessons. Kagiso should demonstrate the actual 30-second check happening, not just describe it afterward.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action SIFT-check exercise.', 'Sipho Mthembu', 'Digital Literacy Teacher', 'sipho', '#006E68', 'published', '/lessons/digital-2.png', now()) returning id into l5_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l5_id, 'What does the "S" in SIFT stand for?', ARRAY['Share','Stop','Search','Screenshot']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l5_id, 'Why does misinformation spread so quickly?', ARRAY['It’s always well-written','It triggers strong emotion faster than people can verify it','Only bots share it','It’s usually true']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l5_id, 'What can a reverse image search help you discover?', ARRAY['Who took the best photo','If a photo/video is old, unrelated, or doesn’t exist elsewhere','How many likes a post has','The weather when a photo was taken']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Turn an Idea Into a Business', 'A simple, practical framework for spotting real problems around you and shaping them into the beginning of a business idea.', 'entrepreneurship', t6_id, 7, 9, 11, ARRAY['Explain the difference between an "idea" and a "business opportunity"','Identify a real problem in their own community worth solving','Describe their idea in one clear sentence using the problem-solution format']::text[], 'You don’t need a big invention to start a business — you need to notice a problem people already have and are already willing to pay to solve.', 'Most people think entrepreneurs start with a brilliant, original idea. Almost none of them do. They start by noticing an ordinary, annoying problem — one so common that everyone else had stopped seeing it — and asking, "why does this still exist?"

The difference between an idea and a business opportunity is one word: payment. An idea is "wouldn''t it be nice if..." A business opportunity is "people already spend time, money or effort dealing with this problem, and I can solve it better, cheaper, or more conveniently." That second part — that someone is already paying (in money or effort) to deal with the problem — is what makes it real.

Look at problems that already exist around you. Load-shedding means people need charged devices — that''s why phone-charging kiosks appeared at taxi ranks across the country, started by ordinary people who noticed a gap. Long queues at spaza shops during peak hours are a problem — someone who organises pre-orders solves it. Learners without data for schoolwork is a problem — a local library with free Wi-Fi, publicised well, becomes valuable. None of these require a patent or an app. They require noticing.

Sizwe, a Grade 8 learner from Khayelitsha, noticed his grandmother struggled to carry groceries home from the taxi rank, a 15-minute walk. He started offering to carry bags home for a small fee on weekends — not a complicated business, but a real one, because it solved a real, already-felt problem for people already willing to pay for the relief.

The starting skill isn''t "have a genius idea." It''s: walk through your own neighbourhood or school with fresh eyes, write down every small annoyance you or people around you deal with regularly, and ask which one you could realistically solve. That list is where real businesses start.', ARRAY['An idea becomes a business opportunity when someone is already paying (money or effort) to deal with the problem','The best business ideas usually solve ordinary, overlooked problems — not invent something new','Look for problems that repeat often and affect people around you','A clear problem-solution sentence is the real starting point, not a perfect plan']::text[], 'Spend one day noticing problems around you — at home, school, or your taxi rank/community. Write down 3 of them. Pick the one you find most interesting and write it as: "[Who] struggles with [problem]. I could solve it by [simple solution]."', 'What’s a problem in your own community that everyone complains about but nobody has tried to fix? Why do you think that is?', 'Problem-Spotting Worksheet', 'PDF', 'PROBLEM-SPOTTING WORKSHEET

STEP 1: List 5 things that annoy you or people around you regularly (at home, school, taxi rank, community):
1. ___________________________
2. ___________________________
3. ___________________________
4. ___________________________
5. ___________________________

STEP 2: For each one, ask: is anyone already spending money, time, or effort dealing with this problem? Circle the ones where the answer is YES — that''s a sign of a real opportunity.

STEP 3: Pick your strongest one and complete this sentence:
"[Who has this problem] struggles with [the problem]. I could solve it by [your simple idea]."

Example: "Commuters at the taxi rank struggle to charge their phones during load-shedding. I could solve it by offering a paid phone-charging station using a power bank."

STEP 4: Ask yourself — could I test a tiny version of this idea this month, even on a small scale? What would that look like?', '[OPEN on a busy taxi rank, someone plugging a phone into a small charging kiosk]
NARRATOR (V.O.): "This didn''t exist five years ago. Someone just noticed load-shedding made phones a problem — and solved it."
[CUT to Sizwe, carrying grocery bags, smiling]
SIZWE: "My grandmother struggled carrying groceries from the taxi rank. So I started offering to carry them for a small fee. That''s it. That''s the whole idea."
NARRATOR (V.O.): "You don''t need a genius invention. You need a problem people already feel — and a way to solve it."
[GRAPHIC: "[Problem] + [Simple Solution] = Business Opportunity"]
[END CARD: "Take Action: spot 3 problems today."]', 'Open on a real, recognisable South African scene (taxi rank phone-charging kiosk) to immediately ground the lesson in something learners have seen. Sizwe’s story should feel small and achievable, not a polished startup pitch — that’s the point. Use the simple equation graphic (Problem + Solution = Opportunity) as a reusable visual for the Business pillar.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action problem-spotting exercise.', 'Zanele Khumalo', 'Entrepreneurship Mentor', 'zanele', '#E8603C', 'published', '/lessons/entrepreneurship-1.png', now()) returning id into l6_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l6_id, 'What turns an idea into a real business opportunity?', ARRAY['Having a patent','People already paying (money or effort) to deal with the problem','Making an app','Having a famous investor']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l6_id, 'What did Sizwe’s business solve?', ARRAY['A data shortage','Carrying groceries home from the taxi rank','Phone charging','Long queues at a spaza shop']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l6_id, 'What is the first real step in finding a business idea, according to this lesson?', ARRAY['Write a business plan immediately','Notice ordinary, repeated problems around you','Ask investors for money','Copy a successful company exactly']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('How to Pitch an Idea That People Understand', 'A simple, repeatable structure for pitching any idea — to a teacher, a funder, or a customer — so people actually understand and remember it.', 'entrepreneurship', t7_id, 10, 12, 13, ARRAY['Explain why a clear pitch matters as much as a good idea','Structure a 60-second pitch using the Problem-Solution-Ask format','Practise removing jargon and complexity from an explanation']::text[], 'The best idea in the room loses to the best-explained idea in the room — every single time.', 'Here''s an uncomfortable truth: most good ideas die not because they were bad, but because the person explaining them lost their audience in the first thirty seconds. A funder, teacher or customer who doesn''t understand your idea within a minute will mentally check out — no matter how good the idea actually is.

A pitch is not a business plan read out loud. It''s a compressed, clear answer to three questions, in order: What''s the problem? (state it in one sentence, using words a stranger would understand — not jargon). What''s your solution? (one sentence, concrete, not vague — "an app that helps people" is vague; "a WhatsApp bot that reminds spaza shop owners when stock is running low" is concrete). What do you need? (be specific — money, a partnership, feedback, permission — vague asks get vague responses).

This is called the Problem-Solution-Ask structure, and it works in 60 seconds because it respects the listener''s attention instead of testing it.

Look at the difference: "So basically I had this idea where, um, there''s this app, and it''s kind of like Uber but for, well, it does a few different things..." versus "Small taxi commuters lose time waiting without knowing which taxi is coming next. I want to build a simple SMS system — no smartphone needed — that tells you when the next taxi is arriving. I''m looking for five taxi drivers willing to test it for two weeks." The second version is shorter, clearer, and makes the listener want to ask a follow-up question instead of politely nodding through confusion.

Bongani, a Grade 11 learner from Mahikeng, pitched a school recycling initiative to his principal three times. The first two times, he explained everything — the environmental research, the long-term vision, the full plan — and got a polite "let me think about it." The third time, he used Problem-Solution-Ask: "Our school throws away recyclable plastic worth roughly R800 a month in potential income. I want to set up three collection bins and a Grade 11 volunteer roster. I need your permission to place the bins by Friday." He got a yes in that same meeting.

Clarity isn''t dumbing an idea down. It''s respecting the listener enough to make it easy for them to say yes.', ARRAY['A clear, simple pitch often beats a better but confusingly explained idea','Use Problem → Solution → Ask: state each in one clear sentence','Concrete beats vague — name specifics, not general categories','A specific "ask" gets a specific answer; a vague ask gets a vague response']::text[], 'Take an idea you have (business, school project, or community initiative) and write it as a 60-second Problem-Solution-Ask pitch. Say it out loud to a friend or family member — can they repeat your idea back to you afterward?', 'Think of a time someone explained something to you so clearly you immediately understood it, versus a time you were completely lost. What was the difference in how they explained it?', '60-Second Pitch Template', 'PDF', '60-SECOND PITCH TEMPLATE

PROBLEM (1 sentence, plain language, no jargon):
"[Who] struggles with [specific problem], which causes [specific consequence]."

SOLUTION (1 sentence, concrete, not vague):
"I want to [specific action], which will [specific result]."

ASK (be exact — money, time, permission, feedback, a connection):
"I need [exact thing], by [specific date/amount], to [specific next step]."

EXAMPLE:
Problem: "Small taxi commuters waste up to 20 minutes waiting without knowing when the next taxi is coming."
Solution: "I want to build a simple SMS alert system — no smartphone required — that tells commuters when the next taxi is arriving."
Ask: "I need 5 taxi drivers willing to test it for 2 weeks, starting this month."

CHECK YOUR OWN PITCH:
- Could a stranger repeat your Problem sentence back to you after hearing it once?
- Does your Solution sentence include a specific detail (not just "an app" or "a programme")?
- Is your Ask something the listener can say a clear yes or no to?

If you answered "no" to any of these, simplify further — remove a word, cut the jargon, get more specific.', '[OPEN on a learner mumbling through a confusing pitch, the listener’s eyes glazing over]
NARRATOR (V.O.): "Good ideas die here — not because they''re bad, but because nobody could follow them."
[CUT to Bongani, calm, direct, speaking to his principal]
BONGANI: "Our school throws away recyclable plastic worth about R800 a month. I want three collection bins and a volunteer roster. I need your permission by Friday."
[GRAPHIC: PROBLEM → SOLUTION → ASK, each appearing as he says it]
NARRATOR (V.O.): "One sentence each. Specific, not vague. That''s the whole structure."
[CUT back to Bongani''s principal, nodding, saying "yes"]
NARRATOR: "Clarity isn''t dumbing an idea down — it''s making it easy for someone to say yes."
[END CARD: "Take Action: pitch your idea in 60 seconds, out loud, today."]', 'Open with a deliberately rambling, confusing pitch to make the audience feel the discomfort of losing a listener — then contrast sharply with Bongani’s clean version. Build the Problem → Solution → Ask graphic progressively as Bongani speaks each part, so structure and speech reinforce each other. End on the specific, satisfying "yes" moment.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action pitch exercise out loud.', 'Zanele Khumalo', 'Entrepreneurship Mentor', 'zanele', '#E8603C', 'published', '/lessons/entrepreneurship-2.png', now()) returning id into l7_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l7_id, 'What is the Problem-Solution-Ask structure used for?', ARRAY['Writing a full business plan','Delivering a clear 60-second pitch','Doing market research','Filing a patent']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l7_id, 'Why did Bongani’s third pitch succeed where the first two didn’t?', ARRAY['He had a better idea','He used a clearer, more specific structure','He pitched to a different person','He used more technical language']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l7_id, 'What makes an "ask" effective in a pitch?', ARRAY['Being vague so people don’t say no','Being specific about what you need','Asking for as much as possible','Not including an ask at all']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Find Your Voice: Confidence, Communication & Influence', 'A practical starting point for building real confidence and communication skills — not by waiting to feel brave, but by practising small, deliberate acts of speaking up.', 'leadership', t8_id, 7, 9, 11, ARRAY['Explain why confidence is built through action, not felt before it','Practise a simple technique for speaking up in a group setting','Identify one low-stakes opportunity this week to use their voice']::text[], 'Confidence isn’t a feeling you wait to arrive — it’s a muscle you build by speaking before you feel ready.', 'Most people believe confidence works like this: you feel confident, and then you speak up. It''s actually the other way around. Confidence is built by speaking up before you feel ready — the feeling follows the action, not the other way around.

This matters because waiting to "feel ready" often means waiting forever. The learner who never raises their hand in class isn''t waiting for the right moment — they''re waiting for a feeling that only shows up after they''ve done it a few times. Every voice that now sounds confident once sounded shaky the first time it spoke up.

A simple technique that works: the 3-Second Rule. In a group setting — class discussion, family conversation, a group project — give yourself exactly 3 seconds after you have a thought worth sharing, and speak before your brain can talk you out of it. Waiting longer gives self-doubt time to build a case against you.

It also helps to separate two things people often confuse: being loud, and being clear. Confidence isn''t about volume or dominating a room. Thandeka, a quiet Grade 8 learner from Cape Town, used to sit silently through group projects, letting louder classmates make every decision. Her teacher encouraged her to try one small thing: in her next group discussion, share just one clear opinion, even briefly. She said, quietly but clearly, "I think we should split the research differently — I can take the history part." It was eight words. Her group listened, and used her suggestion. That one small, clear moment did more for her confidence than any pep talk could have.

Influence doesn''t require being the loudest person in the room. It requires being willing to say the true, useful thing you''re already thinking — even quietly, even briefly — instead of letting it stay unsaid.', ARRAY['Confidence is built by acting before you feel ready — not the other way around','The 3-Second Rule: speak within 3 seconds of having a worthwhile thought, before doubt builds','Confidence is about clarity, not volume — quiet and clear can be just as influential as loud','Small, low-stakes moments of speaking up build the habit that larger moments later depend on']::text[], 'This week, find one low-stakes moment — in class, with friends, or at home — to share an opinion you’d normally keep to yourself. Use the 3-Second Rule. Notice how it feels before, during and after.', 'Think of a time you stayed quiet when you actually had something worth saying. What stopped you — and what might have happened if you’d spoken up?', 'The 3-Second Rule Practice Card', 'PDF', 'THE 3-SECOND RULE PRACTICE CARD

THE RULE: When you have a thought worth sharing in a group, count to 3 in your head and speak before doubt has time to build a case against you.

WHY IT WORKS: Confidence is built through action, not felt before it. Waiting for "the right moment" or "feeling ready" often means never speaking at all — the feeling of confidence comes AFTER you act, not before.

THIS WEEK, TRY IT 3 TIMES:
Moment 1 (low stakes — e.g. with friends or family): ___________________________
What I said: ___________________________
How it felt afterward: ___________________________

Moment 2 (slightly bigger — e.g. in class): ___________________________
What I said: ___________________________
How it felt afterward: ___________________________

Moment 3 (your choice): ___________________________
What I said: ___________________________
How it felt afterward: ___________________________

REMEMBER: You don''t need to be loud to be influential. Clear and brief beats loud and vague, every time.', '[OPEN on a classroom, a hand slowly raising, then hesitating, then lowering]
NARRATOR (V.O.): "That hesitation? That''s not a lack of confidence. That''s confidence waiting to be built."
[CUT to Thandeka, quiet, thoughtful, in a group project setting]
THANDEKA: "I used to just let everyone else decide. One day I just said — quietly — ''I think we should split the research differently. I can take the history part.'' Eight words. That was it."
[GRAPHIC: "3-2-1... SPEAK" countdown graphic]
NARRATOR (V.O.): "The 3-Second Rule: speak before doubt gets a chance to build its case."
NARRATOR: "Confidence isn''t about being loud. It''s about being clear — and willing."
[END CARD: "Take Action: use the 3-Second Rule this week."]', 'Open on the universal, relatable moment of a hesitating raised hand — immediately recognisable to every learner. Use a simple 3-2-1-Speak countdown graphic as a memorable, reusable device. Keep Thandeka’s moment small and quiet, not a dramatic speech — the lesson’s whole point is that small, clear moments count.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action 3-Second Rule exercise.', 'Amahle Ndlovu', 'Youth Leadership Coach', 'amahle', '#0D665F', 'published', '/lessons/leadership-1.png', now()) returning id into l8_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l8_id, 'According to this lesson, which comes first?', ARRAY['Feeling confident, then speaking up','Speaking up, then feeling confident','Neither, confidence is random','You need to be loud first']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l8_id, 'What is the 3-Second Rule?', ARRAY['Wait 3 seconds before leaving a room','Speak within 3 seconds of having a worthwhile thought','Practise speaking for 3 seconds a day','Count to 3 before an argument']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l8_id, 'What did Thandeka’s story demonstrate?', ARRAY['You must be loud to be influential','A brief, clear statement can be just as influential as a long one','Quiet people should stay quiet','Confidence has nothing to do with speaking up']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Leadership Isn’t a Title', 'Why real leadership is a set of daily habits and choices — not a position you’re appointed to — and how to practise it starting today, wherever you are.', 'leadership', t9_id, 10, 12, 12, ARRAY['Distinguish between positional leadership (a title) and behavioural leadership (actions)','Identify examples of leadership happening without formal authority','Practise one leadership behaviour this week without waiting for a title']::text[], 'You don’t need to be head prefect to lead. You just need to be the person who does the useful thing before someone tells you to.', 'Ask a room of teenagers to name a leader, and most will describe a title: head girl, class captain, team captain, prefect. This is positional leadership — leadership granted by a role. It''s real, but it''s also the smallest, least useful definition of leadership, because it means 95% of learners believe leadership isn''t available to them until someone appoints them.

Behavioural leadership is different: it''s what you do, not what you''re called. It''s the learner who notices a younger student being excluded at break and includes them, without being asked. It''s the group member who says "I think we''re avoiding the hard part of this project, let''s tackle it first" when everyone else is quietly procrastinating. It''s the person who apologises first after a group disagreement, breaking the tension nobody else was willing to break. None of these require a title. All of them are leadership.

Research on leadership consistently finds the same thing: the habits that make someone a good leader later in life — taking initiative, staying calm under pressure, communicating honestly, taking responsibility without blaming others — are built through small, repeated, unglamorous practice, not granted the day someone gets a badge.

Lindiwe, a Grade 12 learner from Polokwane, was never elected to any position at her school. But during a group assignment where three group members stopped contributing, she was the one who calmly said, "Let''s figure out how to finish this fairly, not who''s to blame," and reorganised the work so it actually got done. Her teacher later nominated her for a leadership award — not because of a title she held, but because of a pattern of behaviour people had noticed over two years.

The habit to build starting now: in any group you''re part of — class project, sports team, family, friend group — look for the thing that needs doing that nobody''s doing, and do it, without waiting for permission or a title. That''s the actual practice of leadership. The title, if it ever comes, is just other people noticing what you were already doing.', ARRAY['Positional leadership (a title) and behavioural leadership (actions) are different things','Behavioural leadership — initiative, honesty, calm under pressure — is available to everyone, right now','Leadership habits are built through small, repeated practice, not granted with a title','Look for what needs doing that nobody’s doing — and do it, without waiting for permission']::text[], 'This week, in any group you’re part of, notice one thing that needs doing that nobody has taken responsibility for — and do it, without being asked or announcing it. Reflect afterward on how it felt.', 'Think of someone you consider a real leader who has never held an official leadership title. What specific behaviours make you see them that way?', 'Behavioural Leadership Tracker', 'PDF', 'BEHAVIOURAL LEADERSHIP TRACKER

POSITIONAL LEADERSHIP = a title (head prefect, captain, class rep)
BEHAVIOURAL LEADERSHIP = actions anyone can take, right now, without a title:
- Taking initiative on something nobody else is doing
- Staying calm and constructive when a group is stressed or in conflict
- Communicating honestly, even when it''s uncomfortable
- Taking responsibility without blaming others
- Including someone who''s being left out

THIS WEEK, TRACK 3 MOMENTS where you practised behavioural leadership, even in a small way:

Moment 1: What needed doing? ___________________________
What did you do? ___________________________

Moment 2: What needed doing? ___________________________
What did you do? ___________________________

Moment 3: What needed doing? ___________________________
What did you do? ___________________________

REMEMBER: A leadership title, if it ever comes, is just other people noticing a pattern you already built. Start the pattern now.', '[OPEN on a classroom scene: a group project, three learners disengaged, one learner watching quietly]
NARRATOR (V.O.): "No one here has a title. Watch what happens next."
[CUT to that learner — Lindiwe — speaking calmly to the group]
LINDIWE: "Let''s figure out how to finish this fairly, not who''s to blame."
[The group reorganises, gets back to work]
NARRATOR (V.O.): "That''s leadership. Not a badge. A choice, made in a small moment."
[GRAPHIC: "Positional Leadership (a title) vs Behavioural Leadership (an action)"]
NARRATOR: "You don''t need permission to lead. You need to notice what needs doing — and do it."
[END CARD: "Take Action: find the thing nobody’s doing. Do it, this week."]', 'Open on an ordinary group-project scene with visible disengagement — a situation every learner recognises. Let Lindiwe’s intervention feel calm and understated, not a dramatic speech — the whole point is that leadership doesn’t need to be loud or announced. Use a clean side-by-side graphic contrasting Positional vs Behavioural leadership as a reusable visual.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action behavioural leadership exercise.', 'Amahle Ndlovu', 'Youth Leadership Coach', 'amahle', '#0D665F', 'published', '/lessons/leadership-2.png', now()) returning id into l9_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l9_id, 'What is "positional leadership"?', ARRAY['Leadership based on actions','Leadership granted by a title or role','A leadership app','Leadership only adults can have']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l9_id, 'What made Lindiwe a leader in her story, according to the lesson?', ARRAY['She was elected head girl','She took calm, constructive action during a group conflict, without a title','She was the loudest in her class','Her teacher gave her a badge first']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l9_id, 'According to this lesson, how are leadership habits built?', ARRAY['By waiting to be appointed to a role','Through small, repeated practice over time','Only through formal leadership training','They can’t be built, you either have them or you don’t']::text[], 1, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('Know Your Rights: Being a Young South African', 'A clear, practical introduction to the rights every young South African actually has under the Constitution — and what to do if one is ignored.', 'civic', t10_id, 7, 9, 12, ARRAY['Name at least three rights guaranteed to children and youth under the SA Constitution','Explain the difference between a right and a privilege','Identify one real-world situation where a youth right applies']::text[], 'The South African Constitution gives you real, enforceable rights right now, at your age — most young people just haven’t been shown where to look.', 'South Africa''s Constitution, adopted in 1996, contains one of the most progressive Bills of Rights in the world — and it applies to you now, not only once you turn 18. Many young people assume rights are something adults have and children eventually earn. That''s not how it works.

Section 28 of the Constitution specifically protects children (defined as anyone under 18), guaranteeing the right to a name and nationality from birth, family or parental care, basic nutrition, shelter, healthcare and social services, protection from abuse, neglect or degradation, and protection from exploitative labour. Beyond Section 28, the Bill of Rights guarantees everyone — including you — the right to basic education (Section 29), freedom of expression (Section 16), equality regardless of race, gender or background (Section 9), and freedom from unfair discrimination.

The difference between a right and a privilege matters here. A privilege can be given or taken away at someone''s discretion — permission to use a phone, an allowance, an extended curfew. A right cannot be legally removed just because someone in authority is annoyed or doesn''t feel like honouring it. A school cannot legally expel a learner without due process. A learner cannot legally be denied basic education because of pregnancy, disability, or inability to pay certain fees at a no-fee school. These are enforceable rights, not favours.

Amara, a Grade 9 learner in Gqeberha, was initially told by an administrator that she couldn''t return to school after having a baby. Her mother, knowing this contradicted Amara''s constitutional right to basic education, contacted the school governing body and referenced Section 29 directly. Amara was readmitted within two weeks. She didn''t need a lawyer — she needed to know the right existed and be willing to name it.

Knowing your rights isn''t about being confrontational. It''s about recognising when something being denied to you is actually not a matter of someone''s opinion — it''s a matter of law.', ARRAY['The Constitution’s Bill of Rights applies to you now, not only once you turn 18','Section 28 specifically protects children’s rights to care, safety, nutrition and protection from exploitation','A right cannot legally be removed at someone’s discretion — unlike a privilege','Knowing the specific right and section can be enough to resolve a violation without legal action']::text[], 'Research one right from the Bill of Rights that applies directly to your life as a learner (education, expression, equality, or another). Write down the section number and explain in your own words what it actually guarantees you.', 'Have you or someone you know ever been denied something that, after learning about your rights today, you now think may have actually been a rights violation?', 'Youth Rights Quick Reference', 'PDF', 'YOUTH RIGHTS QUICK REFERENCE — SOUTH AFRICAN CONSTITUTION

SECTION 28 (Children’s Rights) guarantees every person under 18:
- A name and nationality from birth
- Family or parental care, or appropriate alternative care
- Basic nutrition, shelter, healthcare and social services
- Protection from maltreatment, neglect, abuse or degradation
- Protection from exploitative labour practices

OTHER KEY RIGHTS THAT APPLY TO YOU NOW:
- Section 9: Equality — protection from unfair discrimination based on race, gender, disability, religion, and more
- Section 16: Freedom of expression
- Section 29: The right to basic education — this cannot be denied due to pregnancy, disability, or inability to pay at a no-fee school
- Section 12: Freedom and security of the person, including protection from violence

RIGHT vs PRIVILEGE:
A right = protected by law, cannot be removed at someone''s discretion.
A privilege = granted and can be withdrawn (e.g. phone use, curfew extensions).

IF YOU BELIEVE A RIGHT IS BEING VIOLATED:
1. Name the specific right and section, calmly, to the person or authority involved.
2. Involve a parent/guardian or trusted adult.
3. Contact your School Governing Body, or the South African Human Rights Commission (www.sahrc.org.za) for serious or unresolved cases.', '[OPEN on a copy of the South African Constitution, camera pushing in on "Bill of Rights"]
NARRATOR (V.O.): "This applies to you. Right now. Not when you turn 18."
[GRAPHIC: Section 28 highlighted — key children''s rights listed]
NARRATOR: "Section 28 protects every person under 18 — care, safety, nutrition, protection from exploitation."
[CUT to Amara, calm, resolute]
AMARA: "They told me I couldn''t come back to school after having my baby. My mom knew that wasn''t legal — Section 29 protects the right to basic education. I was back within two weeks."
NARRATOR (V.O.): "A right isn''t a favour someone can take away because they feel like it. It''s the law."
[END CARD: "Take Action: learn the one right that matters most to your life."]', 'Open on the physical Constitution document to ground the lesson in something real and official, not abstract. Use a clean highlighted-text graphic for Section 28 rather than a dense legal quote — readability matters more than completeness. Amara’s story should be delivered with quiet confidence, not distress — she is a peer who successfully used her knowledge, not a victim narrative.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action rights-research exercise.', 'Nomusa Radebe', 'Civic Education Facilitator', 'nomusa', '#5F9770', 'published', '/lessons/civic-1.png', now()) returning id into l10_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l10_id, 'What does Section 28 of the South African Constitution protect?', ARRAY['Only adults’ rights','Children’s rights, including care, safety and protection from exploitation','Only the right to vote','Property rights']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l10_id, 'What is the difference between a right and a privilege?', ARRAY['They mean the same thing','A right is legally protected; a privilege can be withdrawn at someone’s discretion','A privilege is stronger than a right','Only adults have rights, children have privileges']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l10_id, 'According to this lesson, what can a learner be denied under the right to basic education (Section 29)?', ARRAY['Nothing — it cannot be denied due to pregnancy, disability, or inability to pay at a no-fee school','Education can be denied for any reason a school chooses','Only wealthy learners have this right','This right only applies after Grade 12']::text[], 0, 2);

  insert into public.lessons (title, description, pillar, topic_id, grade_min, grade_max, duration_minutes, objectives, hook, content_body, key_takeaways, activity, discussion_question, resource_name, resource_type, resource_content, video_script, visual_notes, completion_criteria, contributor_name, contributor_role, avatar_id, color, status, cover_image_url, published_at) values ('From Problem to Action: Change Your Community', 'A practical framework for turning a community problem you care about into a real, achievable action — not just a complaint.', 'civic', t11_id, 10, 12, 13, ARRAY['Distinguish between complaining about a problem and taking structured action on it','Apply a simple four-step framework to move from problem to action','Identify the correct person or structure to approach for a specific community issue']::text[], 'You don’t need to wait until you’re an adult, a politician, or "important" to change something in your community — you need one specific action and one specific person to take it to.', 'Almost everyone complains about problems in their community — broken streetlights, unsafe crossings, litter, lack of youth spaces. Almost nobody turns the complaint into action. The gap between the two isn''t courage or intelligence — it''s usually just not knowing the next concrete step.

Here''s a four-step framework that works for almost any local issue. First, name the problem specifically — not "our area is neglected" but "the streetlight outside the community hall on Vilakazi Street has been broken for four months, and it''s unsafe after dark." Specific problems get taken seriously; vague complaints get ignored. Second, find out who''s actually responsible — a broken streetlight is usually a municipal infrastructure issue, handled by your local ward councillor or municipality''s service request line, not a police matter or a mystery. Third, document it — a photo, a date, and (if possible) how many people it affects turns a complaint into evidence. Fourth, take it to the right structure — your ward councillor, a School Governing Body, a community policing forum, or a municipal service request line/app, depending on the issue — and follow up if you don''t hear back within a reasonable time.

Katlego, a Grade 11 learner from Tembisa, was frustrated that a pedestrian crossing near her school had no visible markings, and two learners had nearly been hit by cars that year. Instead of just complaining to friends, she photographed the crossing, wrote a one-page description of the problem and its safety risk, found her ward councillor''s contact details online, and submitted it formally — copying her school principal. Three months later, new road markings and a speed hump were installed. She was seventeen. She didn''t need a title, a party membership, or permission — she needed a specific problem, a paper trail, and the right person to send it to.

This is what active citizenship actually looks like in practice — not always marches and big movements (though those matter too), but often a specific, documented, correctly-addressed request that turns a shared frustration into a solved problem.', ARRAY['Vague complaints get ignored; specific, documented problems get taken seriously','Use the 4-step framework: Name it specifically → Find who’s responsible → Document it → Take it to the right structure','Most local issues have a specific responsible structure — ward councillor, SGB, municipal service line — not "the government" vaguely','You don’t need a title or adult status to submit a legitimate community request']::text[], 'Identify one specific problem in your community. Use the 4-step framework to research who’s actually responsible for it, and draft the message or report you’d send to them.', 'What’s a problem in your community that you’ve heard people complain about often, but that you’ve never seen anyone formally report or act on? What’s stopped that from happening?', 'Problem-to-Action Framework', 'PDF', 'PROBLEM-TO-ACTION FRAMEWORK

STEP 1: NAME THE PROBLEM SPECIFICALLY
Bad: "Our area is neglected."
Good: "The streetlight outside [specific location] has been broken since [date], creating a safety risk after dark for [who it affects]."

STEP 2: FIND OUT WHO''S RESPONSIBLE
- Infrastructure (roads, lights, water) → Local municipality / ward councillor
- School issues → School Governing Body (SGB) or principal
- Safety/crime concerns → Community Policing Forum (CPF) or SAPS
- Broader policy issues → Local municipal council meetings (open to the public)

STEP 3: DOCUMENT IT
- Take a clear photo with a date
- Note how many people are affected, and how
- Keep it factual, not emotional — facts are harder to dismiss

STEP 4: TAKE IT TO THE RIGHT STRUCTURE
- Find your ward councillor''s contact details (search "[your municipality] ward councillor contact")
- Submit via the correct channel: email, municipal app, or in-person at a ward meeting
- Copy a trusted adult or relevant structure (e.g. your school) if appropriate
- Follow up in 2–3 weeks if you haven''t heard back — politely, referencing your original submission

MY PROBLEM: ___________________________
WHO''S RESPONSIBLE: ___________________________
MY DOCUMENTATION: ___________________________
MY NEXT STEP: ___________________________', '[OPEN on a pedestrian crossing with faded, barely visible road markings, cars passing]
NARRATOR (V.O.): "Everyone here knows this crossing is dangerous. For months, nobody did anything about it."
[CUT to Katlego, phone out, photographing the crossing]
KATLEGO: "I took a photo, wrote one page explaining the risk, found my ward councillor online, and sent it — copying my principal."
[GRAPHIC: 4-step framework appearing — Name it, Find who''s responsible, Document it, Take action]
NARRATOR (V.O.): "Three months later: new markings, a speed hump. She was seventeen."
KATLEGO: "I didn''t need permission. I needed the right person''s email address."
[END CARD: "Take Action: pick one problem. Find out who''s responsible. Today."]', 'Open on a real, specific, recognisable local problem (faded crossing) rather than an abstract "community issues" montage. Show Katlego actively documenting (photo, notes) to make the process feel procedural and achievable, not heroic. Build the 4-step framework graphic in sync with her narration so structure and story reinforce each other.', 'Watch or read the full lesson, attempt all 3 checkpoint questions, and complete the Take Action problem-to-action exercise.', 'Nomusa Radebe', 'Civic Education Facilitator', 'nomusa', '#5F9770', 'published', '/lessons/civic-2.png', now()) returning id into l11_id;
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l11_id, 'What is the first step in the Problem-to-Action framework?', ARRAY['Post about it on social media','Name the problem specifically','Wait for an adult to handle it','Start a protest immediately']::text[], 1, 0);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l11_id, 'Who is typically responsible for a broken streetlight or local infrastructure issue?', ARRAY['The national government only','Local municipality / ward councillor','The school principal','No one, it can’t be fixed']::text[], 1, 1);
  insert into public.lesson_quiz_questions (lesson_id, question, options, correct_index, sort_order) values (l11_id, 'What made Katlego’s approach effective?', ARRAY['She complained loudly to friends','She documented the problem and sent it to the correctly responsible person','She waited until she was an adult','She ignored the problem']::text[], 1, 2);

end $$;
