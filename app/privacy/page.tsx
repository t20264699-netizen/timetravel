import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - TimeTravel',
  description: 'Privacy policy for TimeTravel - Online clock and timer tools',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              TimeTravel (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our online clock and timer tools.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">
              TimeTravel is designed to work entirely client-side. We collect minimal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Settings stored locally in your browser (alarm times, timer presets, theme preferences)</li>
              <li>Analytics data (if you accept cookies) through Google Analytics</li>
              <li>No personal information is collected or stored on our servers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and improve our services</li>
              <li>To analyze usage patterns (via Google Analytics, if consented)</li>
              <li>To display relevant advertisements (via Google AdSense, if consented)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remember your preferences (theme, time format)</li>
              <li>Track analytics (with your consent)</li>
              <li>Serve advertisements (with your consent)</li>
            </ul>
            <p className="mb-4">
              You can control cookie preferences through the cookie consent banner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Analytics:</strong> To understand how users interact with our site</li>
              <li><strong>Google AdSense:</strong> To display relevant advertisements</li>
              <li><strong>WorldTimeAPI:</strong> To fetch accurate timezone data (cached locally)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p className="mb-4">
              All user settings and preferences are stored locally in your browser using localStorage. 
              We do not store any data on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your locally stored data (via browser settings)</li>
              <li>Delete your locally stored data (clear browser storage)</li>
              <li>Opt-out of analytics and advertising cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="/contact" className="text-blue-600 dark:text-blue-400 underline">
                our contact page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
