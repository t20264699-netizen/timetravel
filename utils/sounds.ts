// Alarm sound file mappings
// Files are in /public/alarm sounds/ folder
// Using encodeURI to properly handle spaces in folder name
const SOUNDS_BASE_PATH = '/alarm sounds/'

export const ALARM_SOUNDS: Record<string, string> = {
  'Clock Chimes': `${SOUNDS_BASE_PATH}Clock-chimes-sounds.mp3`,
  'Cool Alarm': `${SOUNDS_BASE_PATH}Cool-alarm-tone-notification-sound.mp3`,
  'Warning Buzzer': `${SOUNDS_BASE_PATH}mixkit-warning-alarm-buzzer-991.wav`,
  'Ringing Clock': `${SOUNDS_BASE_PATH}Ringing-clock.mp3`,
  'Clock Ringing': `${SOUNDS_BASE_PATH}Clock-ringing.mp3`,
  'Gentle Wake': `${SOUNDS_BASE_PATH}Gentle-wake-alarm-clock.mp3`,
  'Wecker': `${SOUNDS_BASE_PATH}Wecker-sound.mp3`,
  'Alarm Ringtone': `${SOUNDS_BASE_PATH}Alarm-ringtone.mp3`,
  'Tick Tock': `${SOUNDS_BASE_PATH}Clock-sound-tick-tock.mp3`,
  'Alarm Short': `${SOUNDS_BASE_PATH}Alarm-Clock-Short-chosic.com_.mp3`,
  'Mechanical Clock': `${SOUNDS_BASE_PATH}Tic-Tac-Mechanical-Alarm-Clock-chosic.com_.mp3`,
  'Cuckoo Clock': `${SOUNDS_BASE_PATH}Cuckoo-clock-sound-effect.mp3`,
  'Rooster': `${SOUNDS_BASE_PATH}mixkit-short-rooster-crowing-2470.wav`,
  'Morning Alarm': `${SOUNDS_BASE_PATH}mixkit-morning-clock-alarm-1003.wav`,
  'Loud Alarm': `${SOUNDS_BASE_PATH}Loud-alarm-clock-sound.wav`,
}

// Timer sounds
export const TIMER_SOUNDS: Record<string, string> = {
  'Timer Clicking': `${SOUNDS_BASE_PATH}Timer-clicking-sound.mp3`,
  'Warning Buzzer': `${SOUNDS_BASE_PATH}mixkit-warning-alarm-buzzer-991.wav`,
  'Clock Chimes': `${SOUNDS_BASE_PATH}Clock-chimes-sounds.mp3`,
}

// Stopwatch sounds
export const STOPWATCH_SOUNDS: Record<string, string> = {
  'Click': `${SOUNDS_BASE_PATH}Stopwatch-sound-effect.mp3`,
  'Tick': `${SOUNDS_BASE_PATH}Clock-sound-tick-tock.mp3`,
}

// Get sound URL by name, with fallback
export function getSoundUrl(soundName: string, type: 'alarm' | 'timer' | 'stopwatch' = 'alarm'): string {
  let soundMap: Record<string, string>
  
  switch (type) {
    case 'timer':
      soundMap = TIMER_SOUNDS
      break
    case 'stopwatch':
      soundMap = STOPWATCH_SOUNDS
      break
    default:
      soundMap = ALARM_SOUNDS
  }
  
  return soundMap[soundName] || soundMap['Clock Chimes'] || `${SOUNDS_BASE_PATH}Clock-chimes-sounds.mp3`
}

// Get all available sound names for a type
export function getAvailableSounds(type: 'alarm' | 'timer' | 'stopwatch' = 'alarm'): string[] {
  let sounds: string[]
  switch (type) {
    case 'timer':
      sounds = Object.keys(TIMER_SOUNDS)
      break
    case 'stopwatch':
      sounds = Object.keys(STOPWATCH_SOUNDS)
      break
    default:
      sounds = Object.keys(ALARM_SOUNDS)
  }
  // Sort alphabetically for better UX
  return sounds.sort()
}
