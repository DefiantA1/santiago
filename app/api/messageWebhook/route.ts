import { db } from "@/app/firebase/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body : Record<string, any> = await request.json();
    console.log("POST - Webhook received:", body);

    const metaEvent : MetaEvent = body as MetaEvent;
    
    // const ref = doc(db, "events");
    const col = collection(db, "events");


    await addDoc(col, 
      {
        ...(metaEvent),
        createdAt: new Date()
      }
    )

    const psid = metaEvent.entry[0].messaging[0].sender.id;
    console.log("PSID:", psid);

    await sendMessageToUser(psid, "Hello, how are you?");

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}


export async function GET(req: NextRequest) {  
  // Extract query parameters using nextUrl.searchParams
  const { searchParams } = req.nextUrl;

  // Option 1: log as a plain object
  const paramsObj = Object.fromEntries(searchParams.entries());
  console.log('All search params:', paramsObj);

  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Replace this with the custom secret string you type into the Meta Dashboard
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN; 

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      
      // Meta expects the raw challenge string returned with a 200 OK status
      return new NextResponse(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  // Return a 403 Forbidden if the token verification fails
  return new NextResponse('Forbidden', { status: 403 });
}


// send message to user
async function sendMessageToUser(psid: string, message: string) {
  
    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;  
    console.log("Facebook Access Token:", facebookAccessToken);
  
    try {
    const response = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${facebookAccessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        recipient: {
          id: psid
        },
        messaging_type: "RESPONSE",
        message: {
          text: message
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        console.error("Graph API error:", JSON.stringify(data.error, null, 2));
        throw new Error(`Failed to send message to user: ${data.error?.message ?? response.statusText}`);
    }
    
    console.log("Message sent to user:", data);
  }
  catch (error) {
    console.error("Error sending message to user:", error);
  }
}