const BASE_URL = process.env.BASE_URL;

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID;
const BUSINESS_ID = process.env.BUSINESS_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const conversations = await getConversations();

  return Response.json(conversations);
}

async function getConversations() {
  const response = await fetch(`${BASE_URL}/${PAGE_ID}/conversations?fields=participants,messages{message,from,created_time,attachments}&access_token=${FACEBOOK_ACCESS_TOKEN}`);

  const data = await response.json();

  return data;
}