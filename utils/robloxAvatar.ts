
/**
 * Shared utility for Roblox avatar logic
 */

const AVATAR_CACHE: Record<string, string | null> = {};

export const getRobloxAvatarUrl = async (username: string): Promise<string | null> => {
  const normalized = username.trim();
  if (!normalized) return null;

  if (AVATAR_CACHE[normalized] !== undefined) {
    return AVATAR_CACHE[normalized];
  }

  try {
    const response = await fetch(`/.netlify/functions/robloxAvatar?username=${encodeURIComponent(normalized)}`);
    if (!response.ok) throw new Error('Failed to fetch avatar');
    
    const data = await response.json();
    const url = data.imageUrl || null;
    AVATAR_CACHE[normalized] = url;
    return url;
  } catch (error) {
    console.error('Error fetching Roblox avatar:', error);
    AVATAR_CACHE[normalized] = null;
    return null;
  }
};
