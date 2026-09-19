type MetaEvent = {
  createdAt: string;
  object: string;
  entry: EntryData[];
}

type EntryData = {
  id: string;
  time: number;
  messaging: MessagingEvent[];
}

type MessagingEvent = {
    message?: MessageData;
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
    text?: string;
    is_echo?: boolean;
}