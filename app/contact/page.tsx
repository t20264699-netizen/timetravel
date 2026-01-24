import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://timetravel-is48.vercel.app'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact TimeTravel for support, feedback, or inquiries about our online clock and timer tools.',
  keywords: ['contact', 'support', 'feedback', 'help', 'TimeTravel contact'],
  openGraph: {
    title: 'Contact Us - TimeTravel',
    description: 'Contact TimeTravel for support, feedback, or inquiries about our online clock and timer tools.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="dark:bg-gray-800 rounded-lg shadow-lg p-8" style={{ backgroundColor: '#000' }}>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            We&apos;d love to hear from you! Whether you have a question, feedback, or need support, 
            please reach out to us.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">General Inquiries</h2>
              <p className="text-gray-600 dark:text-gray-400">
                For general questions or feedback about TimeTravel, please email us at:{' '}
                <a 
                  href="mailto:t20264699@gmail.com" 
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  t20264699@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Support</h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you&apos;re experiencing technical issues or need help using our tools, 
                please include as much detail as possible about the problem you&apos;re encountering.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Feature Requests</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Have an idea for a new feature or improvement? We&apos;re always looking to enhance 
                TimeTravel based on user feedback.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Privacy & Legal</h2>
              <p className="text-gray-600 dark:text-gray-400">
                For privacy-related inquiries, please review our{' '}
                <a href="/privacy" className="text-blue-600 dark:text-blue-400 underline">
                  Privacy Policy
                </a>
                {' '}and{' '}
                <a href="/terms" className="text-blue-600 dark:text-blue-400 underline">
                  Terms of Service
                </a>.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Note:</strong> We aim to respond to all inquiries within 48 hours. 
              Thank you for using TimeTravel!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
