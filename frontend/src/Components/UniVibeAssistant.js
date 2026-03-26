import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UniVibeAssistant.css";

function Icon({ name, alt }) {
  return <img src={`/icons/${name}`} alt={alt || name} className="uv-inline-icon" />;
}

export default function UniVibeAssistant() {
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const [loginStep, setLoginStep] = useState(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);
    const [newsletterShown, setNewsletterShown] = useState(false);
    const [aiMessageCount, setAiMessageCount] = useState(0);
    const [aiEnabled, setAiEnabled] = useState(false);

    const initialMessage = useMemo(() => ({
        from: "bot",
        text: (
            <>
                Здраво! Добредојде на UniVibe! 👋
                <br/> <br/>
                Јас сум твој AI асистент и тука сум да ти помогнам со настани, пребарување и пријавување.
                <br/> <br/>
                Можеш да прашаш за настани, регистрација или најава. Што те интересира? 
            </>
        ),
        time: new Date(),
    }), []);

    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [email, setEmail] = useState("");
    const [registerStep, setRegisterStep] = useState(null);
    const [registerData, setRegisterData] = useState({});

    useEffect(() => {
    if (open) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
}, [messages, open]);

useEffect(() => {
    if (!open) {
        setAiEnabled(false);
    }
}, [open]);

    const fetchAIResponse = async (question) => {
    try {
        const res = await fetch("http://localhost:9091/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
            question,
            aiEnabled
}),
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("AI error:", err);
        return {
    answer: "Се извинувам, имав проблем. Пробај повторно.",
    action: "NONE"
};
    }
};

    const sendMessage = async (e) => {
    if (e) e.preventDefault();

    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

if (
  lower === "здраво" ||
  lower === "hello" ||
  lower === "hi" ||
  lower === "hej"
) {
  setMessages(prev => [
    ...prev,
    { from: "user", text: trimmed, time: new Date() },
    {
      from: "bot",
      text: "Здраво! 😊\n\nМожам да ти помогнам со:\n• настани\n• регистрација\n• најава\n\nШто те интересира?",
      time: new Date()
    }
  ]);
  setInput("");
  return;
}

if (lower.includes("help") || lower.includes("помош") || lower.includes("што можам")) {
  setMessages(prev => [
    ...prev,
    { from: "user", text: trimmed, time: new Date() },
    {
      from: "bot",
      text: "Можам да ти помогнам со:\n\n• Пребарување настани\n• Регистрација\n• Најава\n• Newsletter за нови настани\n\nПробај да напишеш:\n\"настани\" или \"регистрација\" 😊",
      time: new Date()
    }
  ]);
  setInput("");
  return;
}

if (!aiEnabled) {

  if (lower.includes("najava") || lower.includes("најава") || lower.includes("login")) {
    setLoginStep("EMAIL");
    setMessages(prev => [
      ...prev,
      { from: "user", text: trimmed, time: new Date() },
      { from: "bot", text: "Внеси email 📧", time: new Date() }
    ]);
    setInput("");
    return;
  }

 if (lower.includes("registracija") || lower.includes("регистрација") || lower.includes("register")) {

  setMessages(prev => [
    ...prev,
    { from: "user", text: trimmed, time: new Date() },

    {
      from: "bot",
      text: "✨ Можеш да се регистрираш на два начина:\n\n1️⃣ Преку формата на страницата",
      action: "REGISTER_FORM_OPTION",
      time: new Date()
    },

    {
      from: "bot",
      text: "2️⃣ Тука во чатот\nЗа да започнеме со регистрација, напиши го твоето име 👇",
      time: new Date()
    }
  ]);

  setRegisterStep("FIRST_NAME");
  setInput("");
  return;
}

}
    if (!trimmed) return;

if (loginStep === "EMAIL") {

    setMessages(prev => [
        ...prev,
        { from: "user", text: trimmed, time: new Date() },
        { from: "bot", text: "Внеси лозинка 🔒", time: new Date() }
    ]);

    setLoginEmail(trimmed);
    setLoginStep("PASSWORD");
    setInput("");
    return;
}

if (loginStep === "PASSWORD") {

    setMessages(prev => [
        ...prev,
        { from: "user", text: "••••••••", time: new Date() }
    ]);

    handleLogin(loginEmail, trimmed);
    setLoginStep(null);
    setInput("");
    return;
}

if (registerStep) {

    const updatedData = { ...registerData };

    switch (registerStep) {
        case "FIRST_NAME":
            updatedData.firstName = trimmed;
            setRegisterStep("LAST_NAME");
            setMessages(prev => [
                ...prev,
                { from: "user", text: trimmed, time: new Date() },
                { from: "bot", text: "Внеси презиме", time: new Date() }
            ]);
            break;

        case "LAST_NAME":
            updatedData.lastName = trimmed;
            setRegisterStep("EMAIL");
            setMessages(prev => [
                ...prev,
                { from: "user", text: trimmed, time: new Date() },
                { from: "bot", text: "📧 Внеси email", time: new Date() }
            ]);
            break;

        case "EMAIL":
            updatedData.email = trimmed;
            setRegisterStep("TELEPHONE");
            setMessages(prev => [
                ...prev,
                { from: "user", text: trimmed, time: new Date() },
                { from: "bot", text: "Внеси телефон", time: new Date() }
            ]);
            break;

        case "TELEPHONE":
            updatedData.telephone = trimmed;
            setRegisterStep("CITY");
            setMessages(prev => [
                ...prev,
                { from: "user", text: trimmed, time: new Date() },
                { from: "bot", text: "Внеси град", time: new Date() }
            ]);
            break;

        case "CITY":
            updatedData.city = trimmed;
            setRegisterStep("PASSWORD");
            setMessages(prev => [
                ...prev,
                { from: "user", text: trimmed, time: new Date() },
                { from: "bot", text: "Внеси лозинка", time: new Date() }
            ]);
            break;

        case "PASSWORD":
            updatedData.password = trimmed;
            await handleRegister(updatedData);
            setRegisterStep(null);
            break;
    }

    setRegisterData(updatedData);
    setInput("");
    return;
} 

const userMsg = { from: "user", text: trimmed, time: new Date() };
const thinkingMsg = { from: "bot", text: "Размислувам... 🤔", time: new Date() };

setMessages((prev) => [...prev, userMsg, thinkingMsg]);
setInput("");

const aiResponse = await fetchAIResponse(trimmed);
setAiMessageCount(prev => prev + 1);

    setMessages((prev) => {
    const withoutThinking = prev.slice(0, -1);

    const newMessages = [
        ...withoutThinking,
        {
            from: "bot",
            text: aiResponse.answer,
            action: aiResponse.action,
            time: new Date()
        }
    ];

  if (aiResponse.action === "LOGIN_EMAIL") {
    setLoginStep("EMAIL");
}

if (aiResponse.action === "REGISTER") {
    setRegisterStep("FIRST_NAME");
    }

    if (
    aiResponse.action === "NONE" &&
    !newsletterShown &&
    !registerStep &&
    !loginStep &&
    aiMessageCount >= 3 &&
    !trimmed.toLowerCase().includes("здраво") &&
    !trimmed.toLowerCase().includes("добар")
)
 {
    newMessages.push({
        from: "bot",
        text: "Дали сакаш да добиваш новости за нови настани и работилници? ✨",
        action: "NEWSLETTER",
        time: new Date()
    });

    setNewsletterShown(true);
}
    return newMessages;
});
};

const sendEmail = async () => {
    if (!email || newsletterSuccess) return;

    try {
        const res = await fetch("http://localhost:9091/api/newsletter/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        if (!res.ok) {
            setMessages(prev => [
                ...prev,
                {
                    from: "bot",
                    text: "Настана грешка. Обиди се повторно.",
                    time: new Date()
                }
            ]);
            return;
        }

        const data = await res.json();

        const isAlreadySubscribed = data?.message?.includes("Веќе");

        setMessages(prev => [
            ...prev,
            {
                from: "bot",
                text: data.message,
                success: !isAlreadySubscribed,
                time: new Date()
            }
        ]);

        setNewsletterSuccess(!isAlreadySubscribed);
        setEmail("");

    } catch (err) {
        console.error(err);

        setMessages(prev => [
            ...prev,
            {
                from: "bot",
                text: "Настана грешка. Обиди се повторно.",
                time: new Date()
            }
        ]);
    }
};

const handleLogin = async (email, password) => {
    try {
       let identifier = email;

let response = await fetch("http://localhost:9091/api/auth/form-login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ identifier, password })
});


// ако login со email не успее, пробај со username
if (!response.ok && email.includes("@")) {

    const username = email.split("@")[0];

    response = await fetch("http://localhost:9091/api/auth/form-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ identifier: username, password })
    });

}
        if (!response.ok) {
            setMessages(prev => [
                ...prev,
                {
                    from: "bot",
                    text: "Погрешен email или лозинка ❌",
                    action: "LOGIN_FAILED",
                    time: new Date()
                }
            ]);
            setLoginStep(null);
            return;
        }

        const token = await response.text();

        if (!token) {
            setMessages(prev => [
                ...prev,
                {
                    from: "bot",
                    text: "Настана проблем со токенот.",
                    time: new Date()
                }
            ]);
            return;
        }

        localStorage.setItem("token", token);

        setMessages(prev => [
            ...prev,
            {
                from: "bot",
                text: "Успешно се најави 🎉",
                time: new Date()
            }
        ]);

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

    } catch (error) {
        setMessages(prev => [
            ...prev,
            {
                from: "bot",
                text: "Настана грешка при најавување.",
                time: new Date()
            }
        ]);
    }
};

const handleRegister = async (data) => {
    try {
        const response = await fetch("http://localhost:9091/api/user/public/create-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: data.email.split("@")[0],
                password: data.password,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                telephone: data.telephone,
                city: data.city
            })
        });

        if (!response.ok) {
            setMessages(prev => [
                ...prev,
                { from: "bot", text: "Регистрацијата не успеа ❌", time: new Date() }
            ]);
            return;
        }

        setMessages(prev => [
            ...prev,
            { 
                from: "bot", 
                text: "Успешно се регистрира 🎉\n\nЗа да се најавиш, напиши „најава“.", 
                time: new Date() 
            }
        ]);

    } catch (error) {
        setMessages(prev => [
            ...prev,
            { from: "bot", text: "Настана грешка при регистрација ❌", time: new Date() }
        ]);
    }
};

    const closeChat = () => setOpen(false);

    return (
        <>
            {!open && (
                <button className="uv-chat-fab" onClick={() => setOpen(true)}>
                    <div className="uv-chat-fab-inner">
                        <img src="/chat_assistant.png" alt="UniVibe" className="uv-chat-fab-logo" />
                        <span className="uv-chat-fab-dot"></span>
                        <div className="uv-chat-fab-bubble">Твој UniVibe асистент</div>
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
                        <div className="uv-ai-toggle">
                            <span className="uv-ai-label">AI</span>
                            <label className="uv-switch">
                                <input 
                                    type="checkbox" 
                                    checked={aiEnabled}
                                    onChange={() => setAiEnabled(!aiEnabled)}
                                />
                                <span className="uv-slider"></span>
                            </label>
                        </div>

                        <button 
                            className="uv-chat-close" 
                            onClick={closeChat} 
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                     </div>


                    <div className="uv-chat-body">
                        <div className="uv-messages">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`uv-msg-row ${m.from === "user" ? "uv-right" : "uv-left"}`}>
                                    <div className={`uv-msg 
                        ${m.from === "user" ? "uv-user" : "uv-bot"} 
                        ${m.success ? "uv-success-bubble" : ""}`}>
                                        <>
                                {m.text}
                                {idx === 0 && (
  <div className="uv-quick-actions">
    <button
      className="uv-action-btn"
      onClick={() => {
        setInput("настани");
        sendMessage();
      }}
    >
      📅 Настани
    </button>

    <button
      className="uv-action-btn"
      onClick={() => {
        setInput("најава");
        sendMessage();
      }}
    >
      🔐 Најава
    </button>

    <button
      className="uv-action-btn"
      onClick={() => {
        setInput("регистрација");
        sendMessage();
      }}
    >
      ✨ Регистрација
    </button>
  </div>
)}

                               {m.action === "REGISTER" && (
                        <div className="uv-action-wrapper">
                        <button
                        className="uv-action-btn"
                        onClick={() => {
                        setRegisterStep("FIRST_NAME");
                        setMessages(prev => [
                        ...prev,
                        {
                        from: "bot",
                        text: "Ајде да те регистрираме 😊\n\nВнеси име:",
                        time: new Date()
                        }
                        ]);
                        }}
                        >
                        ✨ Регистрирај се
                        </button>
                        </div>
                        )}

                        {m.action === "REGISTER_FORM_OPTION" && (
                        <div className="uv-action-wrapper">
                            <button
                            className="uv-action-btn"
                            onClick={() => window.location.href = "/register"}
                            >
                            📄 Регистрација преку форма
                            </button>
                        </div>
                        )}

                             {m.action === "FORGOT_PASSWORD" && (
                                    <div>
                                        <button className="uv-action-btn" onClick={() => window.location.href = "/login"} >
                                        Обиди се повторно
                                    </button>
                                    </div>
                                )}

                                {m.action === "LOGIN_FAILED" && (
                                        <div>
                                            <button
                                                className="uv-action-btn"
                                                onClick={() => {
                                                    setLoginStep("EMAIL");
                                                    setMessages(prev => [
                                                        ...prev,
                                                        { from: "bot", text: "Внеси email 📧", time: new Date() }
                                                    ]);
                                                }}
                                            >
                                                Обиди се повторно
                                            </button>

                                            <button
                                                className="uv-action-btn"
                                                onClick={() => window.location.href = "/login"}
                                            >
                                                Отвори страница за најава
                                            </button>
                                        </div>
                                    )}

                            {m.action === "NEWSLETTER" && (
                                    <div className="uv-newsletter-box">
                                        <input
                                        className="uv-newsletter-input"
                                        placeholder="Внеси email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={newsletterSuccess}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                sendEmail();
                                            }
                                        }}
                                    />

                                        <button
                                        type="button"
                                        className={`uv-newsletter-btn ${newsletterSuccess ? "success" : ""}`}
                                        onClick={sendEmail}
                                        disabled={newsletterSuccess}
                                    >
                                            {newsletterSuccess ? "✓ Пријавен" : "Сакам новости 💌"}
                                        </button>
                                    </div>
                                )}


                            </>
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
