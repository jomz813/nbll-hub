export const handler = async (event) => {
  try {
    const username = event.queryStringParameters?.username;

    if (!username) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing username' }),
      };
    }

    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
    });

    const userJson = await userRes.json();
    const user = userJson?.data?.[0];

    if (!user?.id) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=420x420&format=Png&isCircular=false`
    );

    const thumbJson = await thumbRes.json();
    const t = thumbJson?.data?.[0];

    if (event.queryStringParameters?.format === 'image' && t?.imageUrl) {
      const imgRes = await fetch(t.imageUrl);
      const buffer = await imgRes.arrayBuffer();
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400'
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true,
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.name,
        userId: user.id,
        displayName: user.displayName,
        state: t?.state,
        imageUrl: t?.imageUrl || null,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};