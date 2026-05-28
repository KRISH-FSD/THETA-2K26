import { component$, useSignal, useVisibleTask$, $, useOnWindow } from "@builder.io/qwik";
import Fuse from "fuse.js";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  quickReplies?: string[];
  timestamp: Date;
}

const DEFAULT_QUICK_REPLIES = [
  "Event Schedule",
  "All Events",
  "Robotics Events",
  "Contact Us",
];

function fixMojibake(text: string) {
  if (!text) return "";
  try {
    const bytes = Uint8Array.from(text.split("").map((char) => char.charCodeAt(0)));
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return decoded.includes("") ? text : decoded;
  } catch {
    return text;
  }
}

// Improved markdown parser
function mdToHtml(text: string) {
  if (!text) return "";
  
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");
  
  // Handle lists gracefully
  const lines = formatted.split('\n');
  let inList = false;
  let htmlResult = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isBullet = line.startsWith('•') || line.startsWith('-');
    
    if (isBullet) {
      if (!inList) {
        htmlResult += '<ul class="list-disc pl-5 mb-2 mt-1">';
        inList = true;
      }
      const itemText = line.substring(1).trim();
      htmlResult += `<li>${itemText}</li>`;
    } else {
      if (inList) {
        htmlResult += '</ul>';
        inList = false;
      }
      if (line !== '') {
        htmlResult += `${line}<br/>`;
      }
    }
  }

  if (inList) {
    htmlResult += '</ul>';
  }

  // Remove trailing <br/> if any
  return htmlResult.replace(/(<br\/>)+$/, "");
}

export const Chatbot = component$(() => {
  const isOpen = useSignal(false);
  const hasOpened = useSignal(false);
  const messages = useSignal<Message[]>([{
    id: 1,
    role: "bot",
    text: "Hey! Welcome to Theta 2026, SASTRA's National Techno-Management Fest. How can I help you?",
    quickReplies: DEFAULT_QUICK_REPLIES,
    timestamp: new Date()
  }]);
  const inputValue = useSignal("");
  const isTyping = useSignal(false);
  const dataset = useSignal<any>(null);
  const teamData = useSignal<any>(null);
  const messagesEndRef = useSignal<Element>();
  const activeTheme = useSignal<"green" | "gold" | "red">("green");

  const themeColors =
    activeTheme.value === "red"
      ? {
          main: "#ff4d4f",
          soft: "#ff7875",
          border: "rgba(255, 77, 79, 0.2)",
          borderStrong: "rgba(255, 77, 79, 0.3)",
          bubble: "linear-gradient(135deg, #cc0000 0%, #ff4d4f 100%)",
          bubbleSolid: "linear-gradient(135deg, #ff4d4f, #cc0000)",
          bubbleStrong: "linear-gradient(135deg, #ff4d4f, #990000)",
          tint: "rgba(255, 77, 79, 0.15)",
          shadow: "0 4px 20px rgba(255, 77, 79, 0.05)",
          focusClass: "border-white/10 focus-within:border-[#ff4d4f] focus-within:bg-[#ff4d4f]/5 focus-within:shadow-[0_0_20px_rgba(255,77,79,0.2)]",
        }
      : activeTheme.value === "gold"
        ? {
            main: "#f5c842",
            soft: "#ffd76a",
            border: "rgba(245, 200, 66, 0.2)",
            borderStrong: "rgba(245, 200, 66, 0.32)",
            bubble: "linear-gradient(135deg, #b77900 0%, #f5c842 100%)",
            bubbleSolid: "linear-gradient(135deg, #f5c842, #b77900)",
            bubbleStrong: "linear-gradient(135deg, #f5c842, #8a5a00)",
            tint: "rgba(245, 200, 66, 0.15)",
            shadow: "0 4px 20px rgba(245, 200, 66, 0.06)",
            focusClass: "border-white/10 focus-within:border-[#f5c842] focus-within:bg-[#f5c842]/5 focus-within:shadow-[0_0_20px_rgba(245,200,66,0.2)]",
          }
        : {
            main: "#0ea935",
            soft: "#4ade80",
            border: "rgba(14, 169, 53, 0.2)",
            borderStrong: "rgba(14, 169, 53, 0.3)",
            bubble: "linear-gradient(135deg, #008000 0%, #0ea935 100%)",
            bubbleSolid: "linear-gradient(135deg, #0ea935, #008000)",
            bubbleStrong: "linear-gradient(135deg, #0ea935, #005500)",
            tint: "rgba(14, 169, 53, 0.15)",
            shadow: "0 4px 20px rgba(14, 169, 53, 0.05)",
            focusClass: "border-white/10 focus-within:border-[#0ea935] focus-within:bg-[#0ea935]/5 focus-within:shadow-[0_0_20px_rgba(14,169,53,0.2)]",
          };

  useOnWindow(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Escape" && isOpen.value) {
        isOpen.value = false;
      }
    })
  );

  useVisibleTask$(async () => {
    // Determine theme instantly
    const updateTheme = () => {
      const t = document.body.getAttribute("data-theme");
      activeTheme.value = t === "red-ben10" || t === "spider"
        ? "red"
        : t === "onepiece"
          ? "gold"
          : "green";
    };
    updateTheme();
    const onUiThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: "default" | "spider" | "onepiece" | "red-ben10" | null }>).detail;
      const t = detail?.theme;
      if (!t || t === "default") {
        updateTheme();
        return;
      }
      activeTheme.value = t === "onepiece" ? "gold" : "red";
    };
    const obs = new MutationObserver(updateTheme);
    window.addEventListener("theta-ui-theme-change", onUiThemeChange as EventListener);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("theta-ui-theme-change", onUiThemeChange as EventListener);
      obs.disconnect();
    };
  });

  useVisibleTask$(({ track, cleanup }) => {
    track(() => messages.value.length);
    track(() => isTyping.value);
    track(() => isOpen.value);

    if (!isOpen.value) return;

    const scrollToBottom = () => {
      messagesEndRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    const raf = window.requestAnimationFrame(scrollToBottom);
    const timeout = window.setTimeout(scrollToBottom, 120);

    cleanup(() => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    });
  });

  const preprocess = $((input: string) => {
    const stopWords = ["give", "me", "i", "need", "want", "can", "you",
      "please", "tell", "show", "what", "is", "the", "a", "an", "of",
      "for", "to", "how", "do", "get", "in", "at", "on", "with"];

    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(" ")
      .filter(word => !stopWords.includes(word))
      .join(" ")
      .trim();
  });

  const buildLocalReply = $((rawInput: string) => {
    const input = rawInput.toLowerCase();

    if (/(hi|hello|hey|hola|yo)\b/.test(input)) {
      return {
        text: "Hey! Welcome to Theta 2026. Ask me about events, schedules, venues, registration, robotics, coding events, or contact details.",
        quickReplies: DEFAULT_QUICK_REPLIES,
      };
    }

    if (/(date|when|schedule|day 1|day 2|day 3)/.test(input)) {
      return {
        text: "**Theta 2026 Schedule**\n• Day 1 — March 15, 2026\n• Day 2 — March 16, 2026\n• Day 3 — March 17, 2026\n\nVenue: SASTRA Deemed University.",
        quickReplies: ["Day 1 Events", "Day 2 Events", "Day 3 Events", "All Events"],
      };
    }

    if (/(register|registration|sign up|apply|join)/.test(input)) {
      return {
        text: "**How to register**\nVisit the Events page, open the event you want, and use the registration link in its details.",
        quickReplies: ["All Events", "Contact Us"],
      };
    }

    if (/(robotics|maze bot|sumo bot|hackathon)/.test(input)) {
      return {
        text: "**Robotics Events**\n• Maze Bot — Day 1 | ECE Lab\n• Sumo Bot — Day 1 | ECE Lab\n• Hackathon — Day 3 | Room 106",
        quickReplies: ["Day 1 Events", "Day 3 Events", "Contact Us"],
      };
    }

    if (/(contact|email|phone|support|help|coordinator)/.test(input)) {
      const president = teamData.value?.president?.[0];
      return {
        text: president
          ? `**Contact Theta 2026**\nEmail: theta@sastra.edu\nWebsite: theta.sastra.edu\nPresident: ${president.name} — ${president.phone}`
          : "**Contact Theta 2026**\nEmail: theta@sastra.edu",
        quickReplies: ["Contact Us", "Event Schedule"],
      };
    }

    if (/(venue|where|location|sastra|thanjavur)/.test(input)) {
      return {
        text: "Theta 2026 is hosted at **SASTRA Deemed University, Thanjavur, Tamil Nadu**. Specific event venues are listed on each event page.",
        quickReplies: ["All Events", "Day 1 Events"],
      };
    }

    return {
      text: "I can help with Theta 2026 events, schedules, venues, registration, robotics, coding events, and contacts. Try asking something like \"What events are on Day 1?\"",
      quickReplies: DEFAULT_QUICK_REPLIES,
    };
  });

  const sendMessage = $(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
      timestamp: new Date()
    };
    messages.value = [...messages.value, userMsg];
    inputValue.value = "";
    isTyping.value = true;

    // Simulate natural typing delay based on message length but keep it brief (max 400ms)
    await new Promise(r => setTimeout(r, Math.min(250 + text.length * 10, 400)));

    if (!dataset.value) {
      const localReply = await buildLocalReply(text);
      const fallbackMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: localReply.text,
        quickReplies: localReply.quickReplies,
        timestamp: new Date()
      };
      isTyping.value = false;
      messages.value = [...messages.value, fallbackMsg];
      return;
    }

    const cleaned = await preprocess(text);
    
    const fuseList: { intentId: string; pattern: string }[] = [];
    if (dataset.value.intents) {
      dataset.value.intents.forEach((intent: any) => {
        intent.patterns.forEach((pattern: string) => {
          fuseList.push({ intentId: intent.id, pattern });
        });
      });
    }

    const FuseConstructor = typeof Fuse === "function" ? Fuse : (Fuse as any).default || Fuse;
    let results: any[] = [];
    try {
      const fuse = new FuseConstructor(fuseList, {
        keys: ["pattern"],
        threshold: 0.35,
        includeScore: true,
        minMatchCharLength: 2,
      });
      results = fuse.search(cleaned);
    } catch (e) {
      console.error("Fuse search error:", e);
    }
    let matchedIntentId = "fallback";

    if (results.length > 0 && results[0].score! <= 0.35) {
      matchedIntentId = results[0].item.intentId;
    }

    const intent = dataset.value.intents.find((i: any) => i.id === matchedIntentId) || 
                   dataset.value.intents.find((i: any) => i.id === "fallback");
    
    let responseText = intent?.response || "I'm not sure how to respond to that.";
    
    if (matchedIntentId === "event_fee") {
        responseText = dataset.value.fest_info?.note_on_fees || 
                      dataset.value._meta?.note_on_fees || 
                      "Event entry fees are not published on the website. Please check the event details page for accurate fee information.";
    }

    if (matchedIntentId === "webtek_contact" && dataset.value.team?.webtek?.members) {
       responseText = "**WebTek Team:**\n" + dataset.value.team.webtek.members.map((m: any) => `• ${m.name} (${m.role})`).join("\n");
       if (dataset.value.team.webtek.email) {
         responseText += `\n\n📧 Contact: ${dataset.value.team.webtek.email}`;
       }
    }

    if (matchedIntentId === "president_contact" && teamData.value?.president?.length) {
      const president = teamData.value.president[0];
      responseText = `**President Contact**\n• ${president.name}\n• ${president.phone}\n• ${president.email}`;
    }

    if (matchedIntentId === "vice_president_contact" && teamData.value?.vicePresidents?.length) {
      responseText = "**Vice President Contacts**\n" + teamData.value.vicePresidents
        .map((member: any) => `• ${member.name} — ${member.phone}`)
        .join("\n");
    }

    let replyOptions: string[] = [];
    if (dataset.value.quick_replies && dataset.value.quick_replies[matchedIntentId]) {
       replyOptions = dataset.value.quick_replies[matchedIntentId];
    } else if (intent?.quick_replies) {
       replyOptions = intent.quick_replies;
    } else if (dataset.value.quick_replies && dataset.value.quick_replies["default"]) {
       replyOptions = dataset.value.quick_replies["default"];
    }

    const botMsg: Message = {
      id: Date.now() + 1,
      role: "bot",
      text: responseText,
      quickReplies: replyOptions.length > 0 ? replyOptions : undefined,
      timestamp: new Date()
    };

    isTyping.value = false;
    messages.value = [...messages.value, botMsg];
  });

  const loadChatData = $(async () => {
    if (dataset.value && teamData.value) return;

    const [chatbotModule, teamModule] = await Promise.all([
      import("../../../public/data/chatbot.json"),
      import("../../../public/data/team.json"),
    ]);

    dataset.value = chatbotModule.default;
    teamData.value = teamModule.default;
  });

  const openChat = $(() => {
    hasOpened.value = true;
    isOpen.value = true;
    void loadChatData();
  });

  return (
    <div class="relative z-[9999]">
      {/* Chat Window */}
      {hasOpened.value && (
      <div
        class={`fixed right-3 bottom-20 z-[10000] flex h-[70dvh] max-h-[560px] w-[calc(100vw-1.5rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-2xl transition-all duration-300 ease-out sm:right-6 sm:bottom-6 sm:h-[650px] sm:max-h-[85vh] sm:w-[420px] sm:rounded-[32px] sm:bg-black/50 sm:shadow-[0_8px_32px_rgba(0,0,0,0.5)] sm:backdrop-blur-2xl ${isOpen.value ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-95 opacity-0'}`}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Modern Header */}
        <div class="relative flex shrink-0 items-center justify-between border-b border-white/10 bg-[#151515] px-4 py-3 sm:bg-white/5 sm:px-6 sm:py-4 sm:backdrop-blur-md">
          <div class="pointer-events-none absolute top-0 left-0 hidden h-full w-full overflow-hidden sm:block">
             <div class="absolute -top-[50%] -left-[20%] w-64 h-64 rounded-full opacity-30 blur-[60px]" style={{ backgroundColor: themeColors.main }} />
          </div>
          
          <div class="relative z-10 flex items-center gap-3 sm:gap-4">
            <div class="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-black sm:h-11 sm:w-11 sm:rounded-xl sm:bg-black/40 sm:shadow-lg">
               <img src="/theta-logo.webp" alt="Theta Logo" loading="lazy" decoding="async" class="h-6 w-6 object-contain sm:h-8 sm:w-8" />
               <span 
                  class="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-black transition-colors duration-500 sm:-right-1 sm:-bottom-1 sm:h-3.5 sm:w-3.5 sm:shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: themeColors.main, color: themeColors.main }}
               ></span>
            </div>
            <div class="flex flex-col">
               <span class="text-[14px] font-bold tracking-wide text-white sm:bg-gradient-to-r sm:from-white sm:to-white/70 sm:bg-clip-text sm:text-[16px] sm:font-extrabold sm:text-transparent sm:drop-shadow-md">Theta AI</span>
               <span class="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase opacity-90 transition-colors duration-500 sm:text-[11px]" style={{ color: themeColors.soft }}>
                  <span class="relative flex h-1.5 w-1.5">
                     <span class="absolute hidden h-full w-full animate-ping rounded-full opacity-75 sm:inline-flex" style={{ backgroundColor: themeColors.soft }}></span>
                     <span class="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: themeColors.soft }}></span>
                  </span>
                  Online
               </span>
            </div>
          </div>
          
          <button type="button" class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70 transition-all hover:bg-white/15 hover:text-white active:scale-95 sm:h-9 sm:w-9 sm:bg-white/5 sm:hover:rotate-90 sm:hover:scale-110" onClick$={() => { isOpen.value = false; }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        {/* Message Area */}
        <div class="font-body scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-6 sm:p-5">
          <div class="h-0 sm:h-1"></div>
          
          {messages.value.map((msg) => (
             <div key={msg.id} class={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full duration-300 transform scale-100 origin-bottom`}>
                {msg.role === 'user' ? (
                  <div 
                     class="max-w-[86%] rounded-2xl rounded-br-[4px] px-3.5 py-2.5 text-[13px] leading-relaxed font-medium break-words whitespace-pre-line text-white shadow-sm sm:max-w-[85%] sm:rounded-[24px] sm:rounded-br-[4px] sm:px-5 sm:py-3.5 sm:text-[14.5px] sm:shadow-lg"
                     style={{ background: themeColors.bubble }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div 
                     class="max-w-[90%] rounded-2xl rounded-tl-[4px] border border-white/10 bg-[#1a1a1a] px-3.5 py-2.5 text-[13px] leading-relaxed break-words whitespace-pre-line text-white/95 shadow-sm sm:rounded-[24px] sm:rounded-tl-[4px] sm:bg-white/5 sm:px-5 sm:py-4 sm:text-[14.5px] sm:shadow-md sm:backdrop-blur-md"
                     style={{ 
                       borderColor: themeColors.border,
                       boxShadow: themeColors.shadow
                     }}
                  >
                     <div dangerouslySetInnerHTML={mdToHtml(msg.text)} class="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-blue-400 marker:text-white/50" />
                  </div>
                )}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                   <div class="mt-2.5 flex max-w-[95%] flex-wrap gap-1.5 sm:mt-3.5 sm:gap-2">
                      {msg.quickReplies.map((chip: string) => (
                         <button
                           type="button"
                           key={chip}
                           onClick$={() => sendMessage(chip)}
                           class="rounded-full border px-3 py-1.5 text-[12px] font-semibold tracking-wide whitespace-nowrap shadow-sm transition-all duration-300 active:scale-95 sm:px-4 sm:text-[13px] sm:hover:-translate-y-0.5 sm:hover:shadow-md"
                           style={{ 
                             borderColor: themeColors.borderStrong,
                             color: "white",
                             backgroundColor: themeColors.tint
                           }}
                         >
                           {chip}
                         </button>
                      ))}
                   </div>
                )}
             </div>
          ))}

          {isTyping.value && (
            <div class="flex max-w-[85%] origin-bottom flex-col items-start transition-all duration-300">
              <div 
                class="flex w-fit gap-2 rounded-2xl rounded-tl-[4px] border bg-[#1a1a1a] px-4 py-3 shadow-sm sm:rounded-[24px] sm:rounded-tl-[4px] sm:bg-white/5 sm:px-5 sm:py-4 sm:shadow-md sm:backdrop-blur-md"
                style={{ borderColor: themeColors.border }}
              >
                <span class="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: themeColors.soft, animation: "pulse 1.4s infinite ease-in-out both", animationDelay: "-0.32s" }} />
                <span class="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: themeColors.soft, animation: "pulse 1.4s infinite ease-in-out both", animationDelay: "-0.16s" }} />
                <span class="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: themeColors.soft, animation: "pulse 1.4s infinite ease-in-out both" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} class="h-2 sm:h-4" />
        </div>

        {/* Input Area */}
        <div class="relative shrink-0 border-t border-white/10 bg-[#101010] p-3 sm:border-t-0 sm:bg-gradient-to-t sm:from-black sm:via-black/80 sm:to-transparent sm:p-5">
           <form
              class={`relative flex items-center rounded-2xl border bg-[#181818] p-1 transition-all duration-300 sm:rounded-[32px] sm:bg-white/5 sm:p-1.5 sm:shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:backdrop-blur-xl ${themeColors.focusClass}`}
              preventdefault:submit
              onSubmit$={$(() => {
                void sendMessage(inputValue.value);
              })}
           >
              <input 
                 type="text"
                 placeholder="Message Theta AI..."
                 class="font-body w-full bg-transparent py-2.5 pr-11 pl-3.5 text-[13px] font-medium text-white placeholder-white/40 focus:outline-none sm:py-3 sm:pr-14 sm:pl-5 sm:text-[14.5px]"
                 bind:value={inputValue}
                 onKeyDown$={$((e) => {
                   if (e.key === "Enter") {
                     e.preventDefault();
                     void sendMessage(inputValue.value);
                   }
                 })}
              />
              <button 
                 type="button"
                 onClick$={() => sendMessage(inputValue.value)}
                 class="group absolute top-1.5 right-1.5 bottom-1.5 flex aspect-square items-center justify-center overflow-hidden rounded-xl text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-90 disabled:cursor-not-allowed disabled:opacity-40 sm:top-2 sm:right-2 sm:bottom-2 sm:rounded-[24px] sm:shadow-md"
                 style={{ background: themeColors.bubbleSolid }}
                 disabled={!inputValue.value.trim() || isTyping.value}
              >
                 <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 translate-y-[-1px] translate-x-[1px]"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
           </form>
           <div class="font-body mt-2 mb-0.5 flex items-center justify-center gap-1.5 text-center text-[9px] font-semibold tracking-wide text-white/25 uppercase sm:mt-3.5 sm:mb-1 sm:text-[10px] sm:text-white/30">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             Powered by WebTek Technical Team
           </div>
        </div>
      </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        class={`group fixed right-4 bottom-4 z-[9900] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white shadow-lg transition-all duration-300 ease-out sm:right-8 sm:bottom-8 sm:h-16 sm:w-16 sm:border-2 sm:duration-500 sm:ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isOpen.value ? 'pointer-events-none translate-y-8 scale-75 opacity-0 sm:translate-y-12 sm:scale-50' : 'translate-y-0 scale-100 opacity-100 hover:-translate-y-1 sm:hover:-translate-y-2 sm:hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]'}`}
        style={{ 
          background: themeColors.bubbleStrong,
          willChange: 'transform, opacity'
        }}
        onClick$={openChat}
      >
        <div class="absolute inset-0 hidden h-full w-full scale-[1.05] rounded-full border-[2px] border-white/40 opacity-0 transition-all duration-300 group-hover:scale-[1.15] group-hover:opacity-100 sm:block"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-7 sm:w-7 sm:drop-shadow-md sm:group-hover:scale-110"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>

        <span class="absolute top-0 right-0 flex h-3 w-3 sm:h-4 sm:w-4">
          <span class="absolute hidden h-full w-full animate-ping rounded-full bg-white opacity-75 sm:inline-flex"></span>
          <span class="relative inline-flex h-3 w-3 rounded-full border-2 bg-white sm:h-4 sm:w-4" style={{ borderColor: themeColors.main }}></span>
        </span>
      </button>
      
      {/* Mobile Backdrop Overlay */}
      {isOpen.value && (
        <div 
          class="fixed inset-0 z-[9990] bg-black/35 transition-opacity sm:hidden"
          onClick$={() => { isOpen.value = false; }}
        ></div>
      )}
    </div>
  );
});
