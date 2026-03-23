import { useState, useRef, useEffect, useCallback } from "react"

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentId, setCurrentId] = useState(null)
  const utteranceRef = useRef(null)
  const intervalRef = useRef(null)
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null

  useEffect(() => {
    return () => { if (synth) synth.cancel(); clearInterval(intervalRef.current) }
  }, [])

  const speak = useCallback((text, id) => {
    if (!synth) return
    if (synth.speaking) synth.cancel()
    clearInterval(intervalRef.current)
    setProgress(0)
    setCurrentId(id)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.88; utterance.pitch = 1.05
    const voices = synth.getVoices()
    const preferred = voices.find(v =>
      v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google UK English Female")
    )
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => {
      setIsPlaying(true)
      const duration = (text.length / 15) * 1000
      const start = Date.now()
      intervalRef.current = setInterval(() => {
        const pct = Math.min(((Date.now() - start) / duration) * 100, 100)
        setProgress(pct)
        if (pct >= 100) clearInterval(intervalRef.current)
      }, 100)
    }
    utterance.onend = () => { setIsPlaying(false); clearInterval(intervalRef.current); setProgress(100) }
    utterance.onerror = () => { setIsPlaying(false); clearInterval(intervalRef.current) }

    utteranceRef.current = utterance
    synth.speak(utterance)
  }, [synth])

  const toggle = useCallback(() => {
    if (!synth) return
    if (synth.speaking && !synth.paused) { synth.pause(); setIsPlaying(false); clearInterval(intervalRef.current) }
    else if (synth.paused) { synth.resume(); setIsPlaying(true) }
  }, [synth])

  const stop = useCallback(() => {
    if (synth) synth.cancel()
    setIsPlaying(false); setProgress(0); setCurrentId(null)
    clearInterval(intervalRef.current)
  }, [synth])

  return { speak, toggle, stop, isPlaying, progress, currentId, setCurrentId }
}
