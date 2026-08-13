-- Seed two topics per pillar and assign each existing lesson to one,
-- mirroring the junior (7-9) / senior (10-12) split already present in
-- the seed lessons. Once assigned, topic_id becomes required — every
-- future lesson must live inside a topic.
do $$
declare
  t_id uuid;
begin
  -- Career
  insert into public.topics (pillar, name, description, sort_order)
    values ('career', 'Know Yourself', 'Understand your strengths before you choose a path.', 1)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Discover Your Strengths & Talents';

  insert into public.topics (pillar, name, description, sort_order)
    values ('career', 'Subject Choices → Career Pathways', 'Connect what you study now to where it can take you.', 2)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Subject Choices → Career Pathways';

  -- Money
  insert into public.topics (pillar, name, description, sort_order)
    values ('finance', 'Money Foundations', 'The basics of earning, saving and spending with intention.', 1)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Money Basics: Save, Spend, Grow';

  insert into public.topics (pillar, name, description, sort_order)
    values ('finance', 'Credit & Wealth', 'How borrowing works, and how to build wealth over time.', 2)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Credit, Debt & Building Wealth';

  -- Digital
  insert into public.topics (pillar, name, description, sort_order)
    values ('digital', 'Digital Safety', 'Staying safe, private and in control online.', 1)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Stay Safe Online';

  insert into public.topics (pillar, name, description, sort_order)
    values ('digital', 'Your Digital Identity', 'Managing your online presence and using AI tools wisely.', 2)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Your Digital Brand & AI Awareness';

  -- Business
  insert into public.topics (pillar, name, description, sort_order)
    values ('entrepreneurship', 'Spotting Opportunity', 'Training your eye to notice problems worth solving.', 1)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'What Problem Can You Solve?';

  insert into public.topics (pillar, name, description, sort_order)
    values ('entrepreneurship', 'Building a Business', 'Turning an idea into a simple, workable business model.', 2)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Build a Simple Business Model';

  -- Leadership
  insert into public.topics (pillar, name, description, sort_order)
    values ('leadership', 'Finding Your Voice', 'Building the confidence to speak up and be heard.', 1)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Confidence & Public Speaking Basics';

  insert into public.topics (pillar, name, description, sort_order)
    values ('leadership', 'Leading Others', 'What it takes to lead a team, club or project well.', 2)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Leadership in Action';

  -- Community
  insert into public.topics (pillar, name, description, sort_order)
    values ('civic', 'Know Your Community', 'Understanding the place and people around you.', 1)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Understanding Your Community';

  insert into public.topics (pillar, name, description, sort_order)
    values ('civic', 'Active Citizenship', 'Using your voice to make change where you live.', 2)
    returning id into t_id;
  update public.lessons set topic_id = t_id where title = 'Active Citizenship & Youth Voice';
end $$;

alter table public.lessons alter column topic_id set not null;
