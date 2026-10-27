global._adminProfileOverrides = global._adminProfileOverrides || {};

function publicUserFields(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    avatar: user.avatar || null,
  };
}

function mergeUserProfile(user) {
  if (!user?.id) return user;
  const overrides = global._adminProfileOverrides[user.id];
  if (!overrides) return user;
  // Database values win for persisted fields; overrides only fill gaps (fallback admins).
  return {
    ...overrides,
    ...user,
    fullName: user.fullName || overrides.fullName,
    email: user.email || overrides.email,
    avatar: user.avatar != null && user.avatar !== '' ? user.avatar : overrides.avatar ?? user.avatar ?? null,
  };
}

function setProfileOverrides(userId, partial) {
  global._adminProfileOverrides[userId] = {
    ...(global._adminProfileOverrides[userId] || {}),
    ...partial,
  };
  return global._adminProfileOverrides[userId];
}

module.exports = {
  mergeUserProfile,
  setProfileOverrides,
  publicUserFields,
};
