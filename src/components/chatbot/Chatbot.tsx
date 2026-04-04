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
    return decoded.includes("�") ? text : decoded;
  } catch {
    return text;
  }
}

// Safer markdown parser
function mdToHtml(text: string) {
  if (!text) return "";
  return fixMojibake(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>")
    .replace(/^• (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/g, "<ul class=\"list-disc pl-4 mb-2\">$1</ul>");
}

export const Chatbot = component$(() => {
  const isOpen = useSignal(false);
  const messages = useSignal<Message[]>([]);
  const inputValue = useSignal("");
  const isTyping = useSignal(false);
  const dataset = useSignal<any>(null);
  const teamData = useSignal<any>(null);
  const messagesEndRef = useSignal<Element>();

  useOnWindow(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Escape" && isOpen.value) {
        isOpen.value = false;
      }
    })
  );

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/data/chatbot.json");
      if (res.ok) {
        const data = await res.json();
        dataset.value = data;
      }

      const teamRes = await fetch("/data/team.json");
      if (teamRes.ok) {
        teamData.value = await teamRes.json();
      }
    } catch (e) {
      console.error("Failed to load chatbot dataset", e);
    }

    messages.value = [{
      id: 1,
      role: "bot",
      text: "Hey! Welcome to Theta 2026, SASTRA's National Techno-Management Fest. How can I help you?",
      quickReplies: DEFAULT_QUICK_REPLIES,
      timestamp: new Date()
    }];
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
        text: "**Theta 2026 Schedule**\n• Day 1 — March 15, 2026\n• Day 2 — March 16, 2026\n• Day 3 — March 17, 2026\n\nVenue: SASTRA Deemed University, Thanjavur.",
        quickReplies: ["Day 1 Events", "Day 2 Events", "Day 3 Events", "All Events"],
      };
    }

    if (/(register|registration|sign up|apply|join)/.test(input)) {
      return {
        text: "**How to register**\nVisit the Events page, open the event you want, and use the registration link in its details. If you need help, email theta@sastra.edu.",
        quickReplies: ["All Events", "Contact Us"],
      };
    }

    if (/(robotics|maze bot|sumo bot|hackathon)/.test(input)) {
      return {
        text: "**Robotics Events**\n• Maze Bot — Day 1 | ECE Lab | 11 AM–1 PM\n• Sumo Bot — Day 1 | ECE Lab | 2 PM–4 PM\n• Hackathon — Day 3 | Room 106 | 11 AM–1 PM",
        quickReplies: ["Day 1 Events", "Day 3 Events", "Contact Us"],
      };
    }

    if (/(contact|email|phone|support|help|coordinator)/.test(input)) {
      const president = teamData.value?.president?.[0];
      return {
        text: president
          ? `**Contact Theta 2026**\nEmail: theta@sastra.edu\nWebsite: theta.sastra.edu\nPresident: ${president.name} — ${president.phone}`
          : "**Contact Theta 2026**\nEmail: theta@sastra.edu\nWebsite: theta.sastra.edu",
        quickReplies: ["Contact Us", "Event Schedule"],
      };
    }

    if (/(venue|where|location|sastra|thanjavur)/.test(input)) {
      return {
        text: "Theta 2026 is hosted at **SASTRA Deemed University, Thanjavur, Tamil Nadu**. Specific event venues are listed on each event page.",
        quickReplies: ["All Events", "Day 1 Events", "Contact Us"],
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

    await new Promise(r => setTimeout(r, 700));

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

    const fuse = new Fuse(fuseList, {
      keys: ["pattern"],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });

    const results = fuse.search(cleaned);
    let matchedIntentId = "fallback";

    if (results.length > 0 && results[0].score! <= 0.35) {
      matchedIntentId = results[0].item.intentId;
    }

    const intent = dataset.value.intents.find((i: any) => i.id === matchedIntentId) || 
                   dataset.value.intents.find((i: any) => i.id === "fallback");
    
    let responseText = fixMojibake(intent?.response || "I'm not sure how to respond to that.");
    
    if (matchedIntentId === "event_fee" && dataset.value.fee_info) {
        responseText = fixMojibake(dataset.value.fee_info);
    } else if (matchedIntentId === "event_fee") {
        responseText = "Please check the event details page for accurate fee information.";
    }

    if (matchedIntentId === "webtek_contact" && dataset.value.team?.webtek?.members) {
       responseText = "**WebTek Team:**\n" + dataset.value.team.webtek.members.map((m: any) => `• ${m.name} (${m.role}): ${m.phone}`).join("\n");
    }

    if (matchedIntentId === "webtek_contact" && dataset.value.team?.webtek?.members) {
      responseText = "**WebTek Team:**\n" + dataset.value.team.webtek.members.map((m: any) => `• ${m.name} (${m.role})`).join("\n");
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
      <div 
        class={`fixed bottom-0 sm:bottom-24 right-0 sm:right-8 w-full sm:w-[380px] h-[70vh] sm:h-[520px] max-h-[100dvh] bg-[#06090a]/90 backdrop-blur-2xl border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ease-out origin-bottom-right z-[9999] ${isOpen.value ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}`}
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5 rounded-t-3xl">
           <div class="flex items-center gap-3">
              <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0ea935]/20 text-[#0ea935]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                 <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-[#0ea935] rounded-full border-2 border-[#06090a]"></span>
              </div>
              <div class="flex flex-col">
                 <span class="text-sm font-semibold text-white/90">Theta 2026 Assistant</span>
                 <span class="text-[10px] text-[#0ea935] font-medium tracking-wide uppercase flex items-center gap-1.5"><span class="w-1.5 h-1.5 bg-[#0ea935] rounded-full animate-pulse"></span>Online</span>
              </div>
           </div>
           <button type="button" class="text-white/50 hover:text-white transition-colors p-1" onClick$={() => { isOpen.value = false; }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
           </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 pb-0 space-y-4 font-body scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.value.map((msg) => (
             <div key={msg.id} class={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full duration-200 chat-bubble-animate`}>
                <div class={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line break-words max-w-[85%] ${msg.role === 'user' ? 'bg-white/5 border border-white/10 text-white/85 rounded-2xl rounded-tr-sm' : 'bg-[#0ea935]/10 border border-[#0ea935]/20 text-white/90 rounded-2xl rounded-tl-sm'}`}>
                   {msg.role === 'user' ? msg.text : <div dangerouslySetInnerHTML={mdToHtml(msg.text)} />}
                </div>
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                   <div class="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                      {msg.quickReplies.map((chip: string) => (
                        <button
                          type="button"
                          key={chip}
                          onClick$={() => sendMessage(chip)}
                          class="px-3 py-1.5 rounded-full text-xs font-bold border border-[#0ea935]/30 text-[#0ea935] bg-[#0ea935]/5 hover:bg-[#0ea935]/15 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                   </div>
                )}
             </div>
          ))}

          {isTyping.value && (
            <div class="flex flex-col items-start max-w-[85%] chat-bubble-animate">
              <div class="flex gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-[#0ea935]/10 border border-[#0ea935]/20 w-fit">
                <span class="w-2 h-2 rounded-full bg-[#0ea935] animate-bounce" style="animation-delay: 0ms" />
                <span class="w-2 h-2 rounded-full bg-[#0ea935] animate-bounce" style="animation-delay: 150ms" />
                <span class="w-2 h-2 rounded-full bg-[#0ea935] animate-bounce" style="animation-delay: 300ms" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} class="h-2" />
        </div>

        <div class="p-4 pt-3 flex-shrink-0 bg-[#06090a]">
           <form
              class="relative flex items-center"
              preventdefault:submit
              onSubmit$={$(() => {
                void sendMessage(inputValue.value);
              })}
           >
              <input 
                 type="text"
                 placeholder="Type your message..."
                 class="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-[#0ea935]/50 focus:ring-1 focus:ring-[#0ea935]/50 transition-all font-body"
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
                 class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#0ea935] text-white rounded-full hover:bg-[#0ca030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 disabled={!inputValue.value.trim() || isTyping.value}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
           </form>
           <div class="text-[10px] text-center text-white/30 mt-2 font-medium">Powered by WebTek Technical Team</div>
        </div>
      </div>

      <button 
        class={`fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-14 h-14 bg-[#0ea935] rounded-full flex items-center justify-center text-white shadow-[0_0_0_8px_rgba(14,169,53,0.15)] hover:bg-[#0ca030] hover:scale-105 active:scale-95 transition-all z-[9999] group overflow-hidden ${isOpen.value ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
        onClick$={() => { isOpen.value = true; }}
      >
        <div class="absolute inset-0 rounded-full w-full h-full bg-[#0ea935] animate-[ping_3s_ease-in-out_infinite] opacity-50 block pointer-events-none -z-10 group-hover:hidden"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 drop-shadow-sm"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      </button>
    </div>
  );
});
