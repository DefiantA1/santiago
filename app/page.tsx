"use client";

import { collection, getDocs, limit, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    getConversations();
  }, []);

  async function getConversations() {
    const response = await fetch("/api/meta/converstations");
    const data = await response.json();

    const rawConversations = data.data;

    // format the data to the Conversation type
    const formattedData : Conversation[] = rawConversations.map((c: any) => ({
      id: c.id,
      participants: c.participants.data,
      messages: c.messages.data,
    }));

    setConversations(formattedData);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: "#f0f0f0" }}>
      <div className="flex flex-col items-start justify-center text-black">
        <h1 className="text-2xl font-bold">Santiago Sentry Project</h1>
        <p className="text-sm text-gray-500 mb-4">Customers: {conversations.length}</p>
        {conversations.map((c: Conversation, i) => (
          <div key={i} className="mb-4 p-4 rounded-md" style={{ backgroundColor: "#fff" }}>
            <p className="text-lg font-bold">{c.participants[0].name}</p>
            <p className="text-sm text-gray-500">{c.messages[0].message == "" ? "Sent a message" : c.messages[0].message}</p>
            <p className="text-sm text-gray-500">{formatDate(c.messages[0].created_time)}</p>
          </div>
        ))}
      </div>
    </div>
  );

  function formatDate(date: string) {
    // Timelapse 

    const now = new Date();
    const then = new Date(date);

    const diff = now.getTime() - then.getTime();
    const diffSeconds = Math.ceil(diff / 1000);
    const diffHours = Math.ceil(diff / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diff / (1000 * 60));

    if (diffSeconds < 5) {
      return "Just now";
    }


    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    }

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }

    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    const diffWeeks = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    
    if (diffWeeks < 4) {
      return `${diffWeeks} weeks ago`;
    }
    
    const diffMonths = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths < 12) {
      return `${diffMonths} months ago`;
    }

    const diffYears = Math.ceil(diff / (1000 * 60 * 60 * 24 * 365));
      
    return `${diffYears} years ago`;
  }
}