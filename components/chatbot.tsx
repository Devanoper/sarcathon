"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios"; // Import Axios

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

export const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: message.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to the Django backend
      const response = await axios.post("http://localhost:8000/faq/chat/", { prompt: message });
      const botMessage: Message = {
        id: generateId(),
        content: response.data.response,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: generateId(),
        content: "Sorry, there was an error processing your request.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-colors duration-300"
        variant="solid"
      >
        {isOpen ? "Close Chat" : "Chat"}
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-black text-white border border-gray-600 rounded-2xl shadow-xl flex flex-col z-50">
          <div className="p-3 border-b border-gray-600 bg-gray-900 text-white rounded-t-2xl">
            <h2 className="text-lg font-semibold">Chat with us!</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-black">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`max-w-[85%] rounded-2xl shadow-none ${
                  msg.sender === "user"
                    ? "ml-auto bg-gray-700 text-white"
                    : "mr-auto bg-gray-800 text-white"
                }`}
              >
                <CardHeader className="p-2">
                  <span className="text-sm font-semibold">
                    {msg.sender === "user" ? "You" : "Bot"}
                  </span>
                </CardHeader>
                <CardBody className="p-2 pt-0">
                  <p className="text-sm">{msg.content}</p>
                </CardBody>
              </Card>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Spinner color="white" size="md" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-600 bg-gray-900 rounded-b-2xl">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none text-white bg-gray-800 border-transparent focus:ring-gray-500 rounded-lg transition-all duration-300"
            />
          </div>
        </div>
      )}
    </>
  );
};
