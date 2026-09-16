const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json() as { email?: string };
    if (!email || !emailPattern.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) return Response.json({ error: 'Email signup is not configured.' }, { status: 503 });

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, status: 'active' }),
    });

    if (!response.ok) return Response.json({ error: 'MailerLite could not add this subscriber.' }, { status: response.status });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Unable to process this signup.' }, { status: 500 });
  }
}
