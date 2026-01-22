import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function Chatbot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState("greeting");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    company: "",
    stage: "",
    challenge: "",
    budget: "",
    timeline: "",
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Hello! I'm your virtual assistant. I can help you choose the right technology solution. What’s your name?"
      );
    }
  }, [isOpen]);

  const addBotMessage = (text, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };

  const handleQuickReply = (value, label) => {
    addUserMessage(label || value);
    processResponse(value);
  };

  const processResponse = (response) => {
    const newUserData = { ...userData };

    switch (currentStep) {
      case "greeting":
        newUserData.name = response;
        setUserData(newUserData);
        addBotMessage(`Nice to meet you, ${response}! What’s your email?`);
        setCurrentStep("email");
        break;

      case "email":
        newUserData.email = response;
        setUserData(newUserData);
        addBotMessage("What stage is your startup at?");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "options",
              options: [
                { value: "idea", label: "Idea / Pre-Seed" },
                { value: "mvp", label: "MVP / Seed" },
                { value: "launched", label: "Launched / Growing" },
                { value: "series-a", label: "Series A+" },
              ],
            },
          ]);
        }, 700);
        setCurrentStep("stage");
        break;

      case "stage":
        newUserData.stage = response;
        setUserData(newUserData);
        addBotMessage("What’s your biggest technical challenge right now?");
        setCurrentStep("challenge");
        break;

      case "challenge":
        newUserData.challenge = response;
        setUserData(newUserData);
        addBotMessage("When are you looking to get started?");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "options",
              options: [
                { value: "asap", label: "ASAP" },
                { value: "2weeks", label: "Within 2 weeks" },
                { value: "month", label: "Within a month" },
                { value: "exploring", label: "Just exploring" },
              ],
            },
          ]);
        }, 700);
        setCurrentStep("timeline");
        break;

      case "timeline":
        newUserData.timeline = response;
        setUserData(newUserData);
        addBotMessage("What’s your approximate monthly budget?");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "options",
              options: [
                { value: "under-5k", label: "Under $5k" },
                { value: "5k-15k", label: "$5k–$15k" },
                { value: "15k-30k", label: "$15k–$30k" },
                { value: "over-30k", label: "Over $30k" },
                { value: "flexible", label: "Flexible" },
              ],
            },
          ]);
        }, 700);
        setCurrentStep("budget");
        break;

      case "budget":
        newUserData.budget = response;
        setUserData(newUserData);

        addBotMessage(
          `Excellent, ${newUserData.name}! Based on your inputs, our team will reach out to ${newUserData.email} within 24 hours.`
        );

        setTimeout(() => {
          setMessages((prev) => [...prev, { type: "final" }]);
          saveToSupabase(newUserData);
        }, 1200);

        setCurrentStep("complete");
        break;

      default:
        break;
    }
  };

  const saveToSupabase = async (data) => {
    try {
      await supabase.from("leads").insert([
        {
          name: data.name,
          email: data.email,
          stage: data.stage,
          challenge: data.challenge,
          budget: data.budget,
          timeline: data.timeline,
          source: "chatbot",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Lead save failed:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addUserMessage(inputValue);
    processResponse(inputValue);
    setInputValue("");
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* Chat Panel */}
      <div className={`chat-panel ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <strong>CogniVectra AI</strong>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-msg ${
                msg.type === "user" ? "user" : "bot"
              }`}
            >
              {msg.text}
              {msg.type === "options" && (
                <div className="chat-options">
                  {msg.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() =>
                        handleQuickReply(opt.value, opt.label)
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-typing">Typing…</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {currentStep !== "complete" && (
          <form className="chat-footer" onSubmit={handleSubmit}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message…"
            />
            <button type="submit">➤</button>
          </form>
        )}
      </div>
    </>
  );
}
