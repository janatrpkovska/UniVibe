import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UniVibeAssistant.css";

function Icon({ name, alt }) {
  return <img src={`/icons/${name}`} alt={alt || name} className="uv-inline-icon" />;
}

const FAQ = [
  // --- Категории ---
  {
    id: "cat_find",
    title: "Како да најдам настани по категорија?",
    answer: (
      <>
        Оди во „Настани“ → избери категорија (Технологија, Кариера, Наука/Истражување итн.) и ќе ти се прикажат
        сите настани во таа категорија <Icon name="category.png" />
      </>
    ),
    keywords: ["категорија", "категории", "настани по категорија", "technology", "tech", "кариера", "култура", "спорт", "здравје", "едукација", "работилници"],
  },
  {
    id: "cat_no_events",
    title: "Зошто нема настани во некоја категорија?",
    answer: (
      <>
        Можно е моментално да нема објавени настани во таа категорија. Пробај:
        <br />• Друга категорија
        <br />• Пребарување со поширок keyword
        <br />• Филтер по друг датум
        <br />
        <br />
        Исто така, нови настани се додаваат често, па провери повторно подоцна <Icon name="checklater.png" />
      </>
    ),
    keywords: ["нема настани", "празна категорија", "зошто нема", "no events in category"],
  },
  {
    id: "cat_types",
    title: "Кои категории постојат на UniVibe?",
    answer: (
      <>
        На UniVibe ги има овие категории:
        <br />• Технологија
        <br />• Кариера
        <br />• Наука/Истражување
        <br />• Култура
        <br />• Здравје
        <br />• Спорт
        <br />• Едукација
        <br />• Работилници
        <br />
        <br />
        <Icon name="category.png" />
      </>
    ),
    keywords: ["кои категории", "листa категории", "категории постојат"],
  },
  {
    id: "cat_best",
    title: "Како да изберам најдобра категорија за мене?",
    answer: (
      <>
        Ако ми кажеш што те интересира најмногу (на пример „AI“, „Дизајн“, „Маркетинг“), ќе ти кажам точна
        категорија <Icon name="tick.png" />
      </>
    ),
    keywords: ["најдобра категорија", "која категорија", "што да изберам"],
  },

  // --- Филтри / пребарување ---
  {
    id: "filters_where",
    title: "Каде се филтрите за пребарување?",
    answer: (
      <>
        Филтрите се на страната „Пребарај настани“.
        <br />
        Можеш да ја најдеш преку копчето „Пребарај настани“ (во категорија) или преку HomePage.{" "}
        <Icon name="search.png" />
      </>
    ),
    keywords: ["каде филтри", "каде се филтрите", "filters", "пребарај настани"],
  },
  {
    id: "filters_what",
    title: "Кои филтрирања можам да ги користам?",
    answer: (
      <>
        На UniVibe можеш да филтрираш според:
        <br />• Категорија
        <br />• Тип на настан (хакатон, работилница итн.)
        <br />• Универзитет/Факултет
        <br />• Датум (од/до)
        <br />• Keyword (збор)
        <br />
        <br />
        Внеси и кликни „Search“ <Icon name="search.png" />
      </>
    ),
    keywords: ["кои филтри", "што филтри", "filter options", "филтрирање"],
  },
  {
    id: "filters_keyword",
    title: "Како работи пребарување со keyword?",
    answer: (
      <>
        Keyword е збор што го внесуваш (пример: „AI“, „hackathon“, „internship“).
        <br />
        UniVibe ќе ти ги прикаже настаните каде што тој збор се појавува во наслов/опис <Icon name="find.png" />
      </>
    ),
    keywords: ["keyword", "клучен збор", "збор", "search keyword"],
  },
  {
    id: "filters_date",
    title: "Како да пребарувам по датум?",
    answer: (
      <>
        Во „Пребарај настани“ избери датум (од/до) и кликни „Search“ <Icon name="search.png" />
        <br />
        Ако не си сигурен/а — остави поширок период (пример цел месец).
      </>
    ),
    keywords: ["датум", "по датум", "date filter", "од до"],
  },
  {
    id: "filters_faculty",
    title: "Како работи пребарување по универзитет/факултет?",
    answer: (
      <>
        Во филтрите избери универзитет/факултет (пример: ФИНКИ, ФЕИТ итн.) и UniVibe ќе ти прикаже само настани
        што се поврзани со тој избор <Icon name="university.png" />
      </>
    ),
    keywords: ["универзитет", "факултет", "finki", "feit", "ukim", "university", "faculty"],
  },

  // --- Детали ---
  {
    id: "details_open",
    title: "Како да видам детали за настан?",
    answer: (
      <>
        Кога ќе видиш картичка за настан, кликни „Детали“.
        <br />
        Таму ќе ти се отвори целата страна со опис, датум/час, локација, тип и слика (ако има).{" "}
        <Icon name="tick.png" />
      </>
    ),
    keywords: ["детали", "details", "опис", "информации"],
  },
  {
    id: "details_location",
    title: "Што значи локација на настан?",
    answer: (
      <>
        „Локација“ кажува каде се одржува настанот (пример: ФИНКИ / кампус / сала).
        <br />
        Ако е online — локацијата може да биде празна или да пишува online. <Icon name="location.png" />
      </>
    ),
    keywords: ["локација", "location", "каде", "место"],
  },
  {
    id: "details_mode",
    title: "Што значи ONLINE / OFFLINE / HYBRID?",
    answer: (
      <>
        • ONLINE → настанот е преку интернет
        <br />• OFFLINE → физички настан
        <br />• HYBRID → може и online и физички. <Icon name="details_mode.png" />
      </>
    ),
    keywords: ["online", "offline", "hybrid", "мод", "mode"],
  },
  {
    id: "details_type",
    title: "Што значи тип на настан?",
    answer: (
      <>
        Тип на настан е форматот: Хакатон, Работилница, Предавање, Забава итн.
        <br />
        Ова ти помага да знаеш што да очекуваш пред да одиш. <Icon name="tick.png" />
      </>
    ),
    keywords: ["тип", "type", "event type", "работилница", "хакатон"],
  },

  // --- Пријава / регистрација ---
  {
    id: "register_how",
    title: "Како да се пријавам/регистрирам на настан?",
    answer: (
      <>
        Отвори „Детали“ за настанот и кликни „Register / Пријави се“ (ако постои) <Icon name="register.png" />
        <br />
        Ако е надворешна регистрација ќе те однесе на форма/линк.
      </>
    ),
    keywords: ["пријава", "регистрација", "register", "аплицирам", "signup"],
  },
  {
    id: "register_login",
    title: "Дали мора да сум најавен за да се пријавам?",
    answer: (
      <>
        Зависи од настанот. Некои бараат да си најавен, некои имаат надворешен линк.
        <br />
        Ако не ти дава — прво кликни „Најави се“ (Погледни горе десно). <Icon name="tick.png" />
      </>
    ),
    keywords: ["мора најавен", "login", "најава", "дали мора да се најавам"],
  },
  {
    id: "register_no_button",
    title: "Што ако нема копче за пријава?",
    answer: (
      <>
        Тогаш најверојатно:
        <br />• Настанот е информативен
        <br />
        или
        <br />• Регистрацијата е преку организатор
        <br />
        <br />
        Провери во описот дали има линк/контакт. <Icon name="tick.png" />
      </>
    ),
    keywords: ["нема register", "нема пријава", "нема копче", "no button"],
  },
  {
    id: "register_cost",
    title: "Дали настаните се бесплатни?",
    answer: (
      <>
        Повеќето студентски настани се бесплатни <Icon name="free.png" />
        <br />
        Ако има цена, ќе биде наведена во описот или при регистрација. <Icon name="pay.png" />
      </>
    ),
    keywords: ["цена", "дали е бесплатно", "free", "колку чини"],
  },
  {
    id: "register_cancel",
    title: "Може ли да откажам пријава?",
    answer: (
      <>
        Ако регистрацијата е преку надворешна форма/организатор — откажувањето се прави таму.
        <br />
        Ако UniVibe има директна регистрација — ќе имаш опција да се откажеш (ако е имплементирано).{" "}
        <Icon name="tick.png" />
      </>
    ),
    keywords: ["откажам", "cancel", "одјавам", "unsubscribe"],
  },

  // --- Проблеми / Нема резултати ---
  {
    id: "no_results",
    title: "Не можам да најдам настан / нема резултати",
    answer: (
      <>
        Ајде да го најдеме <Icon name="smiley_star.png" /> Еве 5 брзи решенија:
        <br />
        1) Отстрани ги сите филтри (Reset)
        <br />
        2) Пробај поширок keyword (пример „AI“ наместо „AI workshop“)
        <br />
        3) Прошири датум (цел месец наместо 1 ден)
        <br />
        4) Смени универзитет/факултет (или тргни го филтерот)
        <br />
        5) Пробај друга категорија
        <br />
        <br />
        Ако ми кажеш што бараш (пример: „хакатон ФИНКИ“), ќе ти кажам како точно да го внесеш во филтри{" "}
        <Icon name="tick.png" />
      </>
    ),
    keywords: ["нема резултати", "не можам да најдам", "не излегува", "nothing", "no results", "не наоѓа"],
  },
  {
    id: "events_missing",
    title: "Зошто некој настан го нема во листата?",
    answer: (
      <>
        Можни причини:
        <br />• Настанот е во друга категорија
        <br />• Има филтер што го крие
        <br />• Датумот не ти се поклопува
        <br />
        <br />
        Решение: тргни филтри и пребарај со keyword. <Icon name="tick.png" />
      </>
    ),
    keywords: ["го нема", "missing event", "каде е настанот", "не го гледам"],
  },
  {
    id: "contact_help",
    title: "Како да добијам дополнителна помош?",
    answer: (
      <>
        Можеш да ми пишеш тука што точно бараш.
        <br />
        Ќе ти кажам точно кои филтри да ги ставиш и каде. <Icon name="smiley_star.png" />
      </>
    ),
    keywords: ["помош", "help", "асистент", "како да добијам помош"],
  },
  {
    id: "profile_need",
    title: "Морам ли да имам профил за да користам UniVibe?",
    answer: (
      <>
        Не мора секогаш <Icon name="smiley_star.png" />
        <br />
        Можеш да разгледуваш настани, категории и детали и без профил <Icon name="tick.png" />
        <br />
        <br />
        Но ако сакаш да се пријавиш/регистрираш на настан, тогаш ќе треба да се најавиш преку „Најави се“
        (Погледни горе десно).
      </>
    ),
    keywords: ["профил", "account", "најава", "login", "дали мора профил", "морам ли профил", "регистрација профил"],
  },
  {
    id: "profile_create",
    title: "Како да направам профил / да се најавам?",
    answer: (
      <>
        Кликни на „Најави се“ горе десно <Icon name="tick.png" />
        <br />
        Потоа следи ги чекорите за најава/регистрација.
        <br />
        <br />
        Откако ќе се најавиш, ќе можеш полесно да се пријавуваш на настани. <Icon name="smiley_star.png" />
      </>
    ),
    keywords: ["како да направам профил", "како да се најавам", "sign up", "register account", "login"],
  },
];

// "најчести прашања"
const TOP_5_IDS = ["cat_find", "filters_what", "details_open", "register_how", "no_results"];

const FAQ_GROUPS = [
    { title: "Категории", ids: ["cat_find", "cat_no_events", "cat_types", "cat_best"] },
    { title: "Филтри / Пребарување", ids: ["filters_where", "filters_what", "filters_keyword", "filters_date", "filters_faculty"] },
    { title: "Детали", ids: ["details_open", "details_location", "details_mode", "details_type"] },
    { title: "Пријава / регистрација", ids: ["register_how", "register_login", "register_no_button", "register_cost", "register_cancel"] },
    { title: "Проблеми / Нема резултати", ids: ["no_results", "events_missing", "contact_help"] },
    { title: "Профил", ids: ["profile_need", "profile_create"] },
];

const normalizeText = (text) =>
    (text || "")
        .toLowerCase()
        .replace(/[.,!?;:()]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const isNoneMessage = (msg) => {
    const nonePhrases = [
        "ниедно",
        "ни едно",
        "ниту едно",
        "ништо",
        "не ме интересира",
        "не сакам",
        "не треба",
        "none",
        "no",
        "nema",
        "nisto",
        "nishto",
        "nitu edno",
    ];
    return nonePhrases.includes(normalizeText(msg));
};

const matchFAQ = (msg) => {
    const text = normalizeText(msg);

    // Check keywords first
    for (const item of FAQ) {
        for (const k of item.keywords) {
            if (text.includes(normalizeText(k))) return item.id;
        }
    }

    // Hardcoded fallback
    if (text.match(/категор/i)) return "cat_find";
    if (text.match(/филтр|пребар/i)) return "filters_what";
    if (text.match(/детал/i)) return "details_open";
    if (text.match(/пријав|регист|register/i)) return "register_how";
    if (text.match(/универз|факултет/i)) return "filters_faculty";
    if (text.match(/нема резултат|не можам да најдам|не наоѓа/i)) return "no_results";

    return null;
};

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
    const [showFaqPanel, setShowFaqPanel] = useState(true);
    const [showAllFaqInChat, setShowAllFaqInChat] = useState(false);
    const messagesEndRef = useRef(null);

    const initialMessage = useMemo(() => ({
        from: "bot",
        text: (
            <>
                Здраво! Јас сум твој UniVibe Асистент.
                <br />
                Тука сум да ти помогнам со настани, пребарување и пријавување <Icon name="smiley_star.png" />
            </>
        ),
        time: new Date(),
    }), []);

    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState("");

    const top5 = useMemo(() => TOP_5_IDS.map((id) => FAQ.find((x) => x.id === id)).filter(Boolean), []);
    const allFaq = useMemo(() => FAQ, []);

    useEffect(() => {
        if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open, showAllFaqInChat]);

    const botReply = (userText) => {
        if (isNoneMessage(userText)) {
            return (
                <>
                    Нема проблем! <Icon name="smiley.png" />
                    <br />
                    Ако сакаш, кажи ми што ти треба и ќе ти помогнам.
                    <br />
                    <br />
                    Можеш да кликнеш и на „Други прашања“ за да ги видиш сите опции.
                </>
            );
        }
        const faqId = matchFAQ(userText);
        if (faqId) {
            return FAQ.find((x) => x.id === faqId)?.answer;
        }
        return (
            <>
                Разбрав. <Icon name="smiley.png" />
                <br />
                За да ти помогнам најбрзо, пробај да напишеш:
                <br />• Категорија (пример: „Технологија“)
                <br />• Филтри (пример: „филтри по датум“)
                <br />• Детали (пример: „детали за настан“)
                <br />• Пријава (пример: „како да се пријавам“)
                <br />
                <br />
                А можеш и да кликнеш „Други прашања“ <Icon name="star.png" />
            </>
        );
    };

    const sendMessage = async (textToSend = input, { hideFaq = false } = {}) => {
        const trimmed = textToSend.trim();
        if (!trimmed) return;

        if (hideFaq) setShowFaqPanel(false);

        const userMsg = { from: "user", text: trimmed, time: new Date() };
        const thinkingMsg = { from: "bot", text: "Се размислува...", time: new Date() };

        setMessages((prev) => [...prev, userMsg, thinkingMsg]);
        setInput("");

        let replyContent;
        const faqId = matchFAQ(trimmed);
        if (faqId) {
            replyContent = FAQ.find((x) => x.id === faqId)?.answer;
        } else {
            replyContent = await fetchAIResponse(trimmed);
        }

        setMessages((prev) => {
            const withoutThinking = prev.filter((m) => m !== thinkingMsg);
            return [...withoutThinking, { from: "bot", text: replyContent, time: new Date() }];
        });

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: (
                        <>
                            Ако сакаш, можеш да видиш и други прашања <Icon name="search.png" />
                        </>
                    ),
                    time: new Date(),
                    meta: { showFaqButton: true },
                },
            ]);
        }, 250);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        sendMessage(undefined, { hideFaq: true });
    };

    const handleTopQuestion = (faqItem) => sendMessage(faqItem.title, { hideFaq: true });
    const handleShowAllFaq = () => {
        setShowAllFaqInChat(true);
        setShowFaqPanel(false);
    };

    const handlePickFromAll = (faqItem) => sendMessage(faqItem.title, { hideFaq: true });
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
                        <button className="uv-chat-close" onClick={closeChat} aria-label="Close chat">✕</button>
                    </div>

                    <div className="uv-chat-body">
                        {showFaqPanel && (
                            <div className="uv-quick">
                                <div className="uv-quick-title">Најчести прашања:</div>
                                <div className="uv-quick-list">
                                    {top5.map((q) => (
                                        <button key={q.id} type="button" className="uv-quick-btn" onClick={() => handleTopQuestion(q)}>
                                            {q.title}
                                        </button>
                                    ))}
                                </div>
                                <button type="button" className="uv-other-btn" onClick={handleShowAllFaq}>
                                    Други прашања
                                </button>
                            </div>
                        )}

                        <div className="uv-messages">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`uv-msg-row ${m.from === "user" ? "uv-right" : "uv-left"}`}>
                                    <div className={`uv-msg ${m.from === "user" ? "uv-user" : "uv-bot"}`}>
                                        {m.text}
                                        {m.meta?.showFaqButton && (
                                            <button type="button" className="uv-inline-btn" onClick={handleShowAllFaq}>
                                                <Icon name="star.png" /> Други прашања
                                            </button>
                                        )}
                                        {m.meta?.showAllFaq && (
                                            <div className="uv-allfaq">
                                                {allFaq.map((q) => (
                                                    <button key={q.id} type="button" className="uv-allfaq-btn" onClick={() => handlePickFromAll(q)}>
                                                        {q.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {showAllFaqInChat && (
                            <div className="uv-allfaq-groups">
                                {FAQ_GROUPS.map((group) => (
                                    <div key={group.title} className="uv-faq-group">
                                        <b>{group.title}</b>
                                        <div className="uv-faq-group-list">
                                            {group.ids.map((id) => {
                                                const q = FAQ.find((x) => x.id === id);
                                                return (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        className="uv-allfaq-btn"
                                                        onClick={() => handlePickFromAll(q)}
                                                    >
                                                        {q.title}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <form className="uv-chat-input" onSubmit={onSubmit}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Напиши прашање..."
                            className="uv-input"
                        />
                        <button type="submit" className="uv-send" aria-label="Send">➤</button>
                    </form>
                </div>
            )}
        </>
    );
}