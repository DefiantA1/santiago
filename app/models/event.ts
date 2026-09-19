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
    id: string;
}

type Sender = {
    id: string;
}

type MessageData = {
    mid: string;
    text:string
}