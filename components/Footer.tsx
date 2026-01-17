import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="ml-0 md:ml-[100px] px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">TimeTravel</h3>
            <p className="text-sm text-gray-400">
              Free online clock and timer tools. Works offline as PWA.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/alarm" className="text-gray-400 hover:text-blue-400">
                  Alarm Clock
                </Link>
              </li>
              <li>
                <Link href="/timer" className="text-gray-400 hover:text-blue-400">
                  Timer
                </Link>
              </li>
              <li>
                <Link href="/stopwatch" className="text-gray-400 hover:text-blue-400">
                  Stopwatch
                </Link>
              </li>
              <li>
                <Link href="/world-clock" className="text-gray-400 hover:text-blue-400">
                  World Clock
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} TimeTravel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
