type Participant = {
  name: string;
  email?: string;
  id: string;
}

type Message = {
  message: string;
  from: Participant;
  created_time: string;
  attachments?: any[];
  id: string;
}

type Conversation = {
  participants: Participant[];
  messages: Message[];
}