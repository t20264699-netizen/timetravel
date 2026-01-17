import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const AlarmEmbed = dynamic(() => import('@/components/embeds/AlarmEmbed'), { ssr: false })
const TimerEmbed = dynamic(() => import('@/components/embeds/TimerEmbed'), { ssr: false })
const StopwatchEmbed = dynamic(() => import('@/components/embeds/StopwatchEmbed'), { ssr: false })
const WorldClockEmbed = dynamic(() => import('@/components/embeds/WorldClockEmbed'), { ssr: false })

interface PageProps {
  params: {
    tool: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const toolNames: Record<string, string> = {
    alarm: 'Alarm Clock',
    timer: 'Timer',
    stopwatch: 'Stopwatch',
    'world-clock': 'World Clock',
  }

  const toolName = toolNames[params.tool] || 'Tool'

  return {
    title: `${toolName} Embed - TimeTravel`,
    description: `Embeddable ${toolName.toLowerCase()} widget from TimeTravel`,
    robots: 'noindex, nofollow',
  }
}

export default function EmbedPage({ params }: PageProps) {
  const tool = params.tool

  switch (tool) {
    case 'alarm':
      return <AlarmEmbed />
    case 'timer':
      return <TimerEmbed />
    case 'stopwatch':
      return <StopwatchEmbed />
    case 'world-clock':
      return <WorldClockEmbed />
    default:
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 dark:text-gray-400">Tool not found</p>
        </div>
      )
  }
}
