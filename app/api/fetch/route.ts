export async function POST(request: Request) {
  const body = await request.json();

  const {url, message} = body;

  const response = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'message': message
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }

  return Response.json({
    success: true,
  });
}