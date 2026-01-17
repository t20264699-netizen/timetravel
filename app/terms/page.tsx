import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - TimeTravel',
  description: 'Terms of service for TimeTravel - Online clock and timer tools',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using TimeTravel, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use TimeTravel for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on TimeTravel</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="mb-4">
              The materials on TimeTravel are provided on an &apos;as is&apos; basis. TimeTravel makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, 
              without limitation, implied warranties or conditions of merchantability, fitness for a 
              particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p className="mb-4">
              In no event shall TimeTravel or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising 
              out of the use or inability to use the materials on TimeTravel, even if TimeTravel or a TimeTravel 
              authorized representative has been notified orally or in writing of the possibility of 
              such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Accuracy of Materials</h2>
            <p className="mb-4">
              The materials appearing on TimeTravel could include technical, typographical, or photographic 
              errors. TimeTravel does not warrant that any of the materials on its website are accurate, 
              complete, or current. TimeTravel may make changes to the materials contained on its website 
              at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            <p className="mb-4">
              TimeTravel has not reviewed all of the sites linked to its website and is not responsible 
              for the contents of any such linked site. The inclusion of any link does not imply 
              endorsement by TimeTravel of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
            <p className="mb-4">
              TimeTravel may revise these terms of service for its website at any time without notice. 
              By using this website you are agreeing to be bound by the then current version of 
              these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at{' '}
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
