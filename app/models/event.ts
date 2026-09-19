type MetaEvent = {
  createdAt: string;
  object: string;
  event: EventData[];
}

type EventData = {
  id: string;
  time: number;
  messaging: MessagingEvent[];
}

type MessagingEvent = {
    message: MessageData;
    recipient: Recipient;
    sender: Sender;
    timestamp: number;
}


type Recipient = {
    id: string; // psid
}

type Sender = {
    id: string; // psid
}

type MessageData = {
    mid: string;
    text:string
}