/**
 * Returns the best available strong feminine voice for speech synthesis.
 * Priority: quality British/Commonwealth female voices → any labelled female → en-GB → any English.
 */
export function pickFeminineVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.name === "Google UK English Female") ||
    voices.find(v => v.name === "Karen")   ||   // macOS — Australian, strong
    voices.find(v => v.name === "Moira")   ||   // macOS — Irish, confident
    voices.find(v => v.name === "Samantha")||   // macOS/iOS — US, clear
    voices.find(v => v.name === "Tessa")   ||   // macOS — South African, strong
    voices.find(v => v.name === "Victoria")||   // macOS — US feminine
    voices.find(v => v.name.includes("Zira"))|| // Windows — feminine
    voices.find(v => v.name.toLowerCase().includes("female") && v.lang.startsWith("en")) ||
    voices.find(v => v.lang === "en-GB")   ||
    voices.find(v => v.lang.startsWith("en")) ||
    null
  );
}

export const VOICE_RATE  = 0.9;
export const VOICE_PITCH = 1.2;
export const VOICE_LANG  = "en-GB";
