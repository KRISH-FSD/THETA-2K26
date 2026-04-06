function mdToHtml(text) {
  if (!text) return "";
  
  // Custom regex to handle bullet points and wrap them in <ul>
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/^• (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/g, '<ul class="list-disc pl-5 mb-2">$1</ul>')
    .replace(/\n/g, "<br/>");
}

const test1 = "**Day 1 Events**\n• FunKart\n• Maze Bot";
console.log("Test 1 Result:");
console.log(mdToHtml(test1));

const test2 = "Regular text with _italics_";
console.log("\nTest 2 Result:");
console.log(mdToHtml(test2));

const test3 = "Emoji Test 👋";
console.log("\nTest 3 Result:");
console.log(mdToHtml(test3));
