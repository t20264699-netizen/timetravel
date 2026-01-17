export function playAlarmSound(soundUrl?: string) {
  try {
    const audio = new Audio(soundUrl || '/sounds/alarm.mp3')
    audio.volume = 0.7
    audio.play().catch((error) => {
      console.warn('Failed to play alarm sound:', error)
      // Fallback to beep
      playBeep()
    })
  } catch (error) {
    console.warn('Failed to create audio:', error)
    playBeep()
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
    console.warn('Failed to play beep:', error)
  }
}
