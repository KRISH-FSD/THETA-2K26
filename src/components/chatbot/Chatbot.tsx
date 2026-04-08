import { component$, useSignal, useVisibleTask$, $, useOnWindow } from "@builder.io/qwik";
import Fuse from "fuse.js";
import chatbotData from "../../../public/data/chatbot.json";
import teamDataJson from "../../../public/data/team.json";

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
  const messages = useSignal<Message[]>([{
    id: 1,
    role: "bot",
    text: "Hey! Welcome to Theta 2026, SASTRA's National Techno-Management Fest. How can I help you?",
    quickReplies: DEFAULT_QUICK_REPLIES,
    timestamp: new Date()
  }]);
  const inputValue = useSignal("");
  const isTyping = useSignal(false);
  const dataset = useSignal<any>(chatbotData);
  const teamData = useSignal<any>(teamDataJson);
  const messagesEndRef = useSignal<Element>();
  const activeTheme = useSignal<"green" | "red">("green");

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
      activeTheme.value = t === "red-ben10" ? "red" : "green";
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  });

  useVisibleTask$(({ track }) => {
    track(() => messages.value.length);
    track(() => isTyping.value);
    messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div class="relative z-[9999]">
      {/* Chat Window */}
      <div 
        class={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[100dvh] sm:h-[650px] sm:max-h-[85vh] bg-black/50 backdrop-blur-2xl border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right z-[10000] ${isOpen.value ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'}`}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {/* Modern Header */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md relative shrink-0">
          <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div class="absolute -top-[50%] -left-[20%] w-64 h-64 rounded-full opacity-30 blur-[60px]" style={{ backgroundColor: activeTheme.value === "red" ? "#ff4d4f" : "#0ea935" }} />
          </div>
          
          <div class="flex items-center gap-4 relative z-10">
            <div class="relative flex items-center justify-center w-11 h-11 rounded-xl shadow-lg border border-white/20 bg-black/40 overflow-hidden shrink-0">
               <img src="/theta-logo.webp" alt="Theta Logo" class="w-8 h-8 object-contain" />
               <span 
                  class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black transition-colors duration-500 shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: activeTheme.value === "red" ? "#ff4d4f" : "#0ea935", color: activeTheme.value === "red" ? "#ff4d4f" : "#0ea935" }}
               ></span>
            </div>
            <div class="flex flex-col">
               <span class="text-[16px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-wide drop-shadow-md">Theta AI</span>
               <span class="text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors duration-500 opacity-90" style={{ color: activeTheme.value === "red" ? "#ff7875" : "#4ade80" }}>
                  <span class="relative flex h-1.5 w-1.5">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeTheme.value === "red" ? "#ff7875" : "#4ade80" }}></span>
                     <span class="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: activeTheme.value === "red" ? "#ff7875" : "#4ade80" }}></span>
                  </span>
                  Online
               </span>
            </div>
          </div>
          
          <button type="button" class="relative z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-all hover:rotate-90 hover:scale-110 active:scale-95" onClick$={() => { isOpen.value = false; }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        {/* Message Area */}
        <div class="flex-1 overflow-y-auto p-5 space-y-6 font-body scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div class="h-1"></div>
          
          {messages.value.map((msg) => (
             <div key={msg.id} class={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full duration-300 transform scale-100 origin-bottom`}>
                {msg.role === 'user' ? (
                  <div 
                     class="px-5 py-3.5 text-[14.5px] leading-relaxed whitespace-pre-line break-words max-w-[85%] rounded-[24px] rounded-br-[4px] shadow-lg text-white font-medium"
                     style={{ background: activeTheme.value === "red" ? "linear-gradient(135deg, #cc0000 0%, #ff4d4f 100%)" : "linear-gradient(135deg, #008000 0%, #0ea935 100%)" }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div 
                     class="px-5 py-4 text-[14.5px] leading-relaxed whitespace-pre-line break-words max-w-[90%] rounded-[24px] rounded-tl-[4px] shadow-md border bg-white/5 backdrop-blur-md text-white/95"
                     style={{ 
                       borderColor: activeTheme.value === "red" ? "rgba(255, 77, 79, 0.2)" : "rgba(14, 169, 53, 0.2)",
                       boxShadow: activeTheme.value === "red" ? "0 4px 20px rgba(255, 77, 79, 0.05)" : "0 4px 20px rgba(14, 169, 53, 0.05)"
                     }}
                  >
                     <div dangerouslySetInnerHTML={mdToHtml(msg.text)} class="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-blue-400 marker:text-white/50" />
                  </div>
                )}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                   <div class="flex flex-wrap gap-2 mt-3.5 max-w-[95%]">
                      {msg.quickReplies.map((chip: string) => (
                         <button
                           type="button"
                           key={chip}
                           onClick$={() => sendMessage(chip)}
                           class="px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide border transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md whitespace-nowrap"
                           style={{ 
                             borderColor: activeTheme.value === "red" ? "rgba(255, 77, 79, 0.3)" : "rgba(14, 169, 53, 0.3)",
                             color: "white",
                             backgroundColor: activeTheme.value === "red" ? "rgba(255, 77, 79, 0.15)" : "rgba(14, 169, 53, 0.15)"
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
            <div class="flex flex-col items-start max-w-[85%] origin-bottom transition-all duration-300">
              <div 
                class="flex gap-2 px-5 py-4 rounded-[24px] rounded-tl-[4px] w-fit border bg-white/5 backdrop-blur-md shadow-md"
                style={{ borderColor: activeTheme.value === "red" ? "rgba(255, 77, 79, 0.2)" : "rgba(14, 169, 53, 0.2)" }}
              >
                <span class="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: activeTheme.value === "red" ? "#ff7875" : "#4ade80", animation: "pulse 1.4s infinite ease-in-out both", animationDelay: "-0.32s" }} />
                <span class="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: activeTheme.value === "red" ? "#ff7875" : "#4ade80", animation: "pulse 1.4s infinite ease-in-out both", animationDelay: "-0.16s" }} />
                <span class="w-2 h-2 rounded-full opacity-80" style={{ backgroundColor: activeTheme.value === "red" ? "#ff7875" : "#4ade80", animation: "pulse 1.4s infinite ease-in-out both" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} class="h-4" />
        </div>

        {/* Input Area */}
        <div class="relative p-4 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent shrink-0">
           <form
              class={`relative flex items-center bg-white/5 backdrop-blur-xl p-1.5 rounded-[32px] border transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${activeTheme.value === 'red' ? 'border-white/10 focus-within:border-[#ff4d4f] focus-within:bg-[#ff4d4f]/5 focus-within:shadow-[0_0_20px_rgba(255,77,79,0.2)]' : 'border-white/10 focus-within:border-[#0ea935] focus-within:bg-[#0ea935]/5 focus-within:shadow-[0_0_20px_rgba(14,169,53,0.2)]'}`}
              preventdefault:submit
              onSubmit$={$(() => {
                void sendMessage(inputValue.value);
              })}
           >
              <input 
                 type="text"
                 placeholder="Message Theta AI..."
                 class="w-full bg-transparent text-white placeholder-white/40 text-[14.5px] py-3 pl-5 pr-14 focus:outline-none font-body font-medium"
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
                 class="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center text-white rounded-[24px] transition-all duration-300 disabled:opacity-40 disabled:scale-90 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md group overflow-hidden"
                 style={{ background: activeTheme.value === "red" ? "linear-gradient(135deg, #ff4d4f, #cc0000)" : "linear-gradient(135deg, #0ea935, #008000)" }}
                 disabled={!inputValue.value.trim() || isTyping.value}
              >
                 <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 translate-y-[-1px] translate-x-[1px]"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
           </form>
           <div class="text-[10px] text-center text-white/30 mt-3.5 mb-1 font-semibold tracking-wide font-body flex items-center justify-center gap-1.5 uppercase">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             Powered by WebTek Technical Team
           </div>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button 
        class={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-[64px] h-[64px] rounded-full flex items-center justify-center text-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-[9900] group shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-white/10 ${isOpen.value ? 'opacity-0 scale-50 pointer-events-none translate-y-12' : 'opacity-100 scale-100 translate-y-0 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]'}`}
        style={{ 
          background: activeTheme.value === "red" ? "linear-gradient(135deg, #ff4d4f, #990000)" : "linear-gradient(135deg, #0ea935, #005500)",
          willChange: 'transform, opacity'
        }}
        onClick$={() => { isOpen.value = true; }}
      >
        <div class="absolute inset-0 rounded-full w-full h-full border-[2px] border-white/40 scale-[1.05] opacity-0 group-hover:opacity-100 group-hover:scale-[1.15] transition-all duration-300"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-md"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>

        <span class="absolute 0 top-0 right-0 flex h-4 w-4">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-white border-2" style={{ borderColor: activeTheme.value === "red" ? "#ff4d4f" : "#0ea935" }}></span>
        </span>
      </button>
      
      {/* Mobile Backdrop Overlay */}
      {isOpen.value && (
        <div 
          class="fixed inset-0 bg-black/60 sm:hidden z-[9990] backdrop-blur-md transition-opacity"
          onClick$={() => { isOpen.value = false; }}
        ></div>
      )}
    </div>
  );
});
