'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Brain, RefreshCw } from "lucide-react";
import { IUser } from "../auth/page";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: String;
  timestamp: Date;
  id: Number
}

export default function ModernChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date(),
      id: 0
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const router = useRouter()

  const verifyToken = async () => {
    const res = await fetch('http://localhost:4000/verify-token', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  
    const response: IUser = await res.json();
    setCurrentUser(response);

    if(response === null){
      router.push('/auth')
    }
  
    const historyMessages: Message[] = response.chatHistory?.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
      timestamp: new Date(msg.time),
      id: Number(msg.id)
    })) || [];
  
    setMessages([
      messages[0],
      ...historyMessages
    ]);
  
    console.log(response);
  };

  useEffect(() => {
      const tokenVerification = async function(){
        await verifyToken()
      }
      tokenVerification()
    }, [])
    

  async function sendMessage() {
    if (!input.trim()) return;
    let id = currentUser?.id
    try {
      if(!isLoading){
        setIsLoading(true)
        setMessages((prev) => [...prev, { role: 'user', content: input.trim(), timestamp: new Date(), id: messages.length }]);
        const response = await fetch('http://localhost:4000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: input.trim(),
            id
          })
        });
        const data = await response.json();
        if(data.message){
          const AIMessage: Message = {
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
            id: messages.length
          }
          setMessages((prev) => [...prev, AIMessage]);
        }
        setIsLoading(true);
        setInput('');
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleRegenerate = async (id: number, userId: string) => {
    const response = await fetch(`http://localhost:4000/rewind/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, userId})
    })
    const res = await response.json()
    setMessages([messages[0], ...res])
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-20">
        {messages.length !== 0 && messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-2">
                {msg.role !== "user" ? (
                  <div className="rounded-full flex items-center justify-center bg-white h-10 w-10">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                ) : (
                  <Avatar className="h-11 w-11 border-2 border-muted">
                    <>
                      <AvatarImage className="rounded-full object-cover" src={currentUser?.profileImage} />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                        <User />
                      </AvatarFallback>
                    </>
                  </Avatar>
                )}
                <div className="flex flex-col items-start">
                  <div
                    className={`rounded-full pl-4 pr-4 p-2 shadow-sm ${
                      msg.role === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'assistant' && currentUser && <RefreshCw  onClick={() => handleRegenerate(Number(msg.id), currentUser?.id)} className="h-4 w-4 cursor-pointer" />}
                  </div>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100">
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className={`p-2 rounded-full transition-colors ${
              input.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}