import {
  DEFAULT_ABOUT_LEADERSHIP_TEAM,
  leadershipTeamWithIds,
  parseLeadershipTeamFromSettings,
} from '../data/aboutLeadershipTeam';

export const ABOUT_FORM_DEFAULTS = {
  about_hero_title: 'Dedicated To Restoring Dignity & Hope',
  about_hero_description:
    'Established in 2018, Hope Somalia Foundation is a community-anchored humanitarian organization working to solve key challenges in education, health, clean water, and climate resilience.',
  about_story_title: 'Rooted In Local Communities, Serving With Integrity',
  about_story:
    'Hope Somalia Foundation was founded by a coalition of local humanitarian professionals, physicians, and community leaders determined to create a transparent, efficient non-governmental organization capable of acting swiftly during crises while building long-term local resilience.',
  about_story_p2:
    'Registered under the Federal Ministry of Planning, Investment and Economic Development (Reg: SOM-2018-042), we collaborate with international agencies, UN bodies, and local councils to ensure every dollar directly impacts families on the ground.',
  about_image:
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
  about_mission:
    'To empower vulnerable communities across Somalia by facilitating sustainable access to clean water, quality education, lifesaving maternal healthcare, climate-adapted farming, and rapid emergency aid.',
  about_vision:
    'A peaceful, resilient Horn of Africa where every child has access to quality learning, mothers give birth safely, and communities thrive through self-sustaining livelihoods.',
  about_values:
    'Trust & Transparency: Rigorous financial auditing., Human Dignity: Respect for local culture and community leadership., Sustainability: Building self-reliant systems over aid dependency.',
  about_efficiency_stat: '88.4% Field Efficiency',
  about_efficiency_label: 'Direct allocation to ground operations',
};

export function buildAboutFormFromSettings(settings = {}) {
  const form = { ...ABOUT_FORM_DEFAULTS };
  Object.keys(ABOUT_FORM_DEFAULTS).forEach((key) => {
    if (settings[key] != null && settings[key] !== '') {
      form[key] = settings[key];
    }
  });
  return form;
}

export function loadAboutEditorState(settings = {}) {
  if (settings.about_page_draft) {
    try {
      const draft = JSON.parse(settings.about_page_draft);
      if (draft?.formData && typeof draft.formData === 'object') {
        return {
          formData: { ...ABOUT_FORM_DEFAULTS, ...draft.formData },
          leadershipTeam: leadershipTeamWithIds(
            draft.leadershipTeam?.length ? draft.leadershipTeam : parseLeadershipTeamFromSettings(settings.about_leadership_team)
          ),
          source: 'draft',
        };
      }
    } catch {
      /* use published */
    }
  }

  return {
    formData: buildAboutFormFromSettings(settings),
    leadershipTeam: leadershipTeamWithIds(parseLeadershipTeamFromSettings(settings.about_leadership_team)),
    source: 'published',
  };
}

export function serializeLeadershipForPublish(members) {
  return JSON.stringify(
    (members || []).map(({ id, name, title, bio, image }) => ({
      id,
      name: (name || '').trim(),
      title: (title || '').trim(),
      bio: (bio || '').trim(),
      image: (image || '').trim(),
    }))
  );
}

export function buildDraftPayload(formData, leadershipTeam) {
  return {
    about_page_draft: JSON.stringify({
      formData,
      leadershipTeam,
      updatedAt: new Date().toISOString(),
    }),
  };
}

export function buildPublishPayload(formData, leadershipTeam) {
  const draft = buildDraftPayload(formData, leadershipTeam).about_page_draft;
  return {
    ...formData,
    about_leadership_team: serializeLeadershipForPublish(leadershipTeam),
    about_page_draft: draft,
    about_page_published_at: new Date().toISOString(),
  };
}

export function canEditAboutContent(role) {
  return role === 'SUPER_ADMIN' || role === 'CONTENT_MANAGER';
}
