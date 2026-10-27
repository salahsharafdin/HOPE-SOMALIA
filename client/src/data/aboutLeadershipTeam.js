function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'member';
}

export function createLeadershipMember(overrides = {}) {
  return {
    id: overrides.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: overrides.name || '',
    title: overrides.title || '',
    bio: overrides.bio || '',
    image: overrides.image || '',
  };
}

export function leadershipTeamWithIds(members) {
  return (members || []).map((person, index) =>
    createLeadershipMember({
      id: person.id,
      name: person.name,
      title: person.title,
      bio: person.bio,
      image: person.image,
    })
  );
}

export const DEFAULT_ABOUT_LEADERSHIP_TEAM = [
  {
    id: 'lead-abdirahman-hassan',
    name: 'Dr. Abdirahman Hassan',
    title: 'Executive Director & Founder',
    bio: 'Over 18 years leading international development and public health initiatives across the Horn of Africa.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'lead-fatima-omar',
    name: 'Fatima Omar',
    title: 'Director of Programs & Field Operations',
    bio: 'Specialist in emergency rapid deployment, community empowerment, and maternal health access.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'lead-mohamed-jama',
    name: 'Mohamed Jama',
    title: 'Head of Financial Auditing & Accountability',
    bio: 'Certified accountant overseeing institutional donor compliance, transparency audits, and budget allocations.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
];

export function parseLeadershipTeamFromSettings(raw) {
  if (!raw || typeof raw !== 'string') {
    return DEFAULT_ABOUT_LEADERSHIP_TEAM;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ABOUT_LEADERSHIP_TEAM;
    }
    return parsed.map((person, index) => {
      const fallback = DEFAULT_ABOUT_LEADERSHIP_TEAM[index] || DEFAULT_ABOUT_LEADERSHIP_TEAM[0];
      return {
        id: person.id || `lead-${index}-${slugify(person.name || fallback.name)}`,
        name: person.name || fallback.name,
        title: person.title || fallback.title,
        bio: person.bio || fallback.bio,
        image: person.image || fallback.image,
      };
    });
  } catch {
    return DEFAULT_ABOUT_LEADERSHIP_TEAM;
  }
}
