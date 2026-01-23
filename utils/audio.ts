import { getSoundUrl } from './sounds'

export function playAlarmSound(soundNameOrUrl?: string, type: 'alarm' | 'timer' | 'stopwatch' = 'alarm', loop: boolean = false) {
  try {
    // If it's a URL (starts with /), use it directly
    // Otherwise, treat it as a sound name and get the URL
    let soundUrl = soundNameOrUrl?.startsWith('/') 
      ? soundNameOrUrl 
      : getSoundUrl(soundNameOrUrl || 'Bells', type)
    
    // Encode the URL to handle spaces in folder/file names
    // Replace spaces with %20 for proper URL encoding
    soundUrl = soundUrl.replace(/ /g, '%20')
    
    const audio = new Audio(soundUrl)
    audio.volume = 0.7
    audio.loop = loop
    
    audio.play().catch((error) => {
      // Failed to play alarm sound - silently fail in production
      // Fallback to beep
      playBeep()
    })
    
    return audio
  } catch (error) {
    // Failed to create audio - silently fail in production
    playBeep()
    return null
  }
}

function playBeep() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    // Failed to play beep - silently fail in production
  }
}
