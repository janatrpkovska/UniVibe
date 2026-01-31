import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UniVibeAssistant.css";

function Icon({ name, alt }) {
  return <img src={`/icons/${name}`} alt={alt || name} className="uv-inline-icon" />;
}

const fetchAIResponse = async (question) => {
    try {
        const res = await fetch("http://localhost:9091/api/chatbot/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });
        const data = await res.json();
        return data.answer;
    } catch (err) {
        console.error("AI error:", err);
        return "Се извинувам, имав проблем да добијам одговор. Пробај повторно.";
    }
};

export default function UniVibeAssistant() {
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const initialMessage = useMemo(() => ({
        from: "bot",
        text: (
            <>
                Здраво! Добредојде на UniVibe! 👋
                <br/> <br/>
                Јас сум твој AI асистент и тука сум да ти помогнам со настани, пребарување и пријавување.
                <br/> <br/>
                Што те интересира? 😊
            </>
        ),
        time: new Date(),
    }), []);

    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = async (e) => {
        if (e) e.preventDefault();

        const trimmed = input.trim();
        if (!trimmed) return;

        const userMsg = { from: "user", text: trimmed, time: new Date() };
        const thinkingMsg = { from: "bot", text: "Се размислува... 🤔", time: new Date() };

        setMessages((prev) => [...prev, userMsg, thinkingMsg]);
        setInput("");

        const aiResponse = await fetchAIResponse(trimmed);

        setMessages((prev) => {
            const withoutThinking = prev.filter((m) => m !== thinkingMsg);
            return [...withoutThinking, { from: "bot", text: aiResponse, time: new Date() }];
        });
    };

    const closeChat = () => setOpen(false);

    return (
        <>
            {!open && (
                <button className="uv-chat-fab" onClick={() => setOpen(true)}>
                    <div className="uv-chat-fab-inner">
                        <img src="/chat_assistant.png" alt="UniVibe AI" className="uv-chat-fab-logo" />
                        <span className="uv-chat-fab-dot"></span>
                        <div className="uv-chat-fab-bubble">Твој AI асистент</div>
                    </div>
                </button>
            )}

            {open && (
                <div className="uv-chat-window">
                    <div className="uv-chat-header">
                        <div className="uv-chat-header-left">
                            <img src="/chat_assistant.png" alt="UniVibe" className="uv-chat-header-logo" />
                            <div className="uv-chat-header-text">
                                <div className="uv-chat-title">UniVibe Асистент</div>
                                <div className="uv-chat-subtitle">
                                    Тука сум ако ти треба помош <Icon name="smiley.png" />
                                </div>
                            </div>
                        </div>
                        <button className="uv-chat-close" onClick={closeChat} aria-label="Close chat">✕</button>
                    </div>

                    <div className="uv-chat-body">
                        <div className="uv-messages">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`uv-msg-row ${m.from === "user" ? "uv-right" : "uv-left"}`}>
                                    <div className={`uv-msg ${m.from === "user" ? "uv-user" : "uv-bot"}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <form className="uv-chat-input" onSubmit={sendMessage}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Напиши прашање..."
                            className="uv-input"
                            autoFocus
                        />
                        <button type="submit" className="uv-send" aria-label="Send">➤</button>
                    </form>
                </div>
            )}
        </>
    );
}