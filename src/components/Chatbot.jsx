import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "cv_chat_state_v2";

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
  const [showResumeBanner, setShowResumeBanner] = useState(false);

  const messagesEndRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const hydratedRef = useRef(false);

  /* =========================
     Scroll
  ========================= */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  /* =========================
     Lead Scoring
  ========================= */

  const computeLeadScore = (data) => {
    let score = 0;
    if (data.email) score += 2;
    if (["launched", "series-a"].includes(data.stage)) score += 2;
    if (!["under-5k"].includes(data.budget)) score += 2;
    if (["asap", "2weeks"].includes(data.timeline)) score += 2;

    if (score >= 7) return "hot";
    if (score >= 4) return "warm";
    return "cold";
  };

  /* =========================
     Local Resume Hydration
  ========================= */

  useEffect(() => {
    if (hydratedRef.current) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      setMessages(parsed.messages || []);
      setCurrentStep(parsed.currentStep || "greeting");
      setUserData(parsed.userData || {});
      hasGreetedRef.current = parsed.hasGreeted || false;

      if ((parsed.messages || []).length > 0) {
        setShowResumeBanner(true);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages,
        currentStep,
        userData,
        hasGreeted: hasGreetedRef.current,
      })
    );
  }, [messages, currentStep, userData]);

  /* =========================
     Initial Greeting
  ========================= */

  useEffect(() => {
    if (isOpen && !hasGreetedRef.current && messages.length === 0) {
      hasGreetedRef.current = true;
      addBotMessage(
        "👋 Hello! I'm your virtual assistant. I can help you choose the right technology solution. What’s your name?"
      );
    }
  }, [isOpen]);

  /* =========================
     Message Helpers
  ========================= */

  const addBotMessage = (text, delay = 600) => {
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

  /* =========================
     Core Flow
  ========================= */

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

        fetchServerResume(response);

        addBotMessage("What stage is your startup at?");
        pushOptions([
          { value: "idea", label: "Idea / Pre-Seed" },
          { value: "mvp", label: "MVP / Seed" },
          { value: "launched", label: "Launched / Growing" },
          { value: "series-a", label: "Series A+" },
        ]);
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
        pushOptions([
          { value: "asap", label: "ASAP" },
          { value: "2weeks", label: "Within 2 weeks" },
          { value: "month", label: "Within a month" },
          { value: "exploring", label: "Just exploring" },
        ]);
        setCurrentStep("timeline");
        break;

      case "timeline":
        newUserData.timeline = response;
        setUserData(newUserData);
        addBotMessage("What’s your approximate monthly budget?");
        pushOptions([
          { value: "under-5k", label: "Under $5k" },
          { value: "5k-15k", label: "$5k–$15k" },
          { value: "15k-30k", label: "$15k–$30k" },
          { value: "over-30k", label: "Over $30k" },
          { value: "flexible", label: "Flexible" },
        ]);
        setCurrentStep("budget");
        break;

      case "budget":
        newUserData.budget = response;
        setUserData(newUserData);

        const score = computeLeadScore(newUserData);

        addBotMessage(
          `Excellent, ${newUserData.name}! Our team will contact you at ${newUserData.email}.\n\n🔥 Lead Score: ${score.toUpperCase()}`
        );

        setTimeout(() => {
          saveToSupabase(newUserData, score);
          localStorage.removeItem(STORAGE_KEY);
          setShowResumeBanner(false);
          setCurrentStep("complete");
        }, 1200);

        break;

      default:
        break;
    }
  };

  const pushOptions = (options) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "options", options }]);
    }, 500);
  };

  /* =========================
     SERVER RESUME
  ========================= */

    const fetchServerResume = async (email) => {
    try {
        const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_email", email)
        .order("created_at", { ascending: false })
        .limit(1);

        if (error) throw error;

        if (data?.length) {
        const lead = data[0];

        setMessages(lead.messages || []);
        setUserData({
            name: lead.user_name || "",
            email: lead.user_email || "",
            company: lead.company || "",
            stage: lead.stage || "",
            challenge: lead.challenge || "",
            budget: lead.budget || "",
            timeline: lead.timeline || "",
        });

        setShowResumeBanner(true);
        }
    } catch (err) {
        console.warn("Resume lookup failed:", err);
    }
    };

  /* =========================
     Supabase Save
  ========================= */

    const saveToSupabase = async (data, score) => {
    try {
        const payload = {
        user_name: data.name,
        user_email: data.email,
        company: data.company || "",
        stage: data.stage || "",
        challenge: data.challenge || "",
        budget: data.budget || "",
        timeline: data.timeline || "",
        messages: messages,
        status: 'completed'
        };

        const { data: result, error } = await supabase
        .from("chat_conversations")
        .insert([payload])
        .select();

        if (error) {
        console.error("❌ Supabase error object:", error);
        throw error;
        }

        console.log("✅ Lead saved successfully:", result);
    } catch (err) {
        console.error("❌ Lead save failed FULL ERROR:", err);
    }
    };

  /* =========================
     Reset / Resume
  ========================= */

  const handleFullReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    hasGreetedRef.current = false;
    setMessages([]);
    setCurrentStep("greeting");
    setUserData({
      name: "",
      email: "",
      company: "",
      stage: "",
      challenge: "",
      budget: "",
      timeline: "",
    });
    setShowResumeBanner(false);
    setIsOpen(false);
  };

  const handleResume = () => {
    setShowResumeBanner(false);
    setIsOpen(true);
  };

  /* =========================
     Submit
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addUserMessage(inputValue);
    processResponse(inputValue);
    setInputValue("");
  };

  /* =========================
     JSX
  ========================= */

  return (
    <>
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {showResumeBanner && !isOpen && (
        <div className="chat-resume-banner">
          <span>Continue where you left off?</span>
          <button onClick={handleResume}>Resume</button>
          <button onClick={handleFullReset} className="ghost">
            Start Over
          </button>
        </div>
      )}

      <div className={`chat-panel ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <strong>CogniVectra AI</strong>
          <button className="chat-close" onClick={handleFullReset}>
            ✕
          </button>
        </div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type}`}>
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

          {isTyping && <div className="chat-typing">Typing…</div>}
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
