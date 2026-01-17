'use client'

import { useState, useEffect } from 'react'

interface ShareSectionProps {
  pageTitle?: string
}

export function ShareSection({ pageTitle }: ShareSectionProps) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [dynamicTitle, setDynamicTitle] = useState('TimeTravel')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
      // Get page title from document.title, removing " - TimeTravel" suffix if present
      const title = pageTitle || document.title.replace(' - TimeTravel', '').replace(' - Online Timer - Countdown', '').replace(' - Online Alarm Clock - TimeTravel', '').replace(' - Online Stopwatch - TimeTravel', '').replace(' - Online World Clock - TimeTravel', '') || 'TimeTravel'
      setDynamicTitle(title)
    }
  }, [pageTitle])

  const copyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(currentUrl)
      const button = document.getElementById('copy-url-btn')
      if (button) {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        button.style.color = '#0090dd'
        setTimeout(() => {
          button.textContent = originalText
          button.style.color = ''
        }, 2000)
      }
    }
  }

  const sharePopup = (platform: string) => {
    const url = encodeURIComponent(currentUrl)
    const title = encodeURIComponent(dynamicTitle)

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      blogger: `https://www.blogger.com/blog-this.g?u=${url}&n=${title}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
      tumblr: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      livejournal: `https://www.livejournal.com/update.bml?subject=${title}&event=${url}`,
    }

    const shareUrl = shareUrls[platform]
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="panel panel-default mb-4" style={{ backgroundColor: '#111', border: 'none', padding: '20px' }}>
          <div className="mb-4">
            <input
              type="text"
              readOnly
              value={currentUrl}
              onClick={copyUrl}
              className="w-full p-2 bg-[#1a1a1a] border border-[#777] text-white text-center"
              style={{ borderRadius: 0, fontSize: '14px', cursor: 'pointer' }}
            />
            <button
              id="copy-url-btn"
              onClick={copyUrl}
              className="mt-2 text-[#9d9d9d] hover:text-[#0090dd] text-sm"
              style={{ display: 'block', margin: '4px auto 0' }}
            >
              Click to copy
            </button>
          </div>
          
          <div className="panel-share">
            <ul className="flex flex-wrap gap-2 justify-center items-center list-none p-0 m-0">
              <li>
                <button onClick={() => sharePopup('facebook')} className="btn-share" title="Share to Facebook">
                  <span className="share-icon share-icon-facebook"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('twitter')} className="btn-share" title="Share to Twitter">
                  <span className="share-icon share-icon-twitter"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('whatsapp')} className="btn-share" title="Share to WhatsApp">
                  <span className="share-icon share-icon-whatsapp"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('blogger')} className="btn-share" title="Share to Blogger">
                  <span className="share-icon share-icon-blogger"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('reddit')} className="btn-share" title="Share to Reddit">
                  <span className="share-icon share-icon-reddit"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('tumblr')} className="btn-share" title="Share to Tumblr">
                  <span className="share-icon share-icon-tumblr"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('pinterest')} className="btn-share" title="Share to Pinterest">
                  <span className="share-icon share-icon-pinterest"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('linkedin')} className="btn-share" title="Share to LinkedIn">
                  <span className="share-icon share-icon-linkedin"></span>
                </button>
              </li>
              <li>
                <button onClick={() => sharePopup('livejournal')} className="btn-share" title="Share to LiveJournal">
                  <span className="share-icon share-icon-livejournal"></span>
                </button>
              </li>
              <li>
                <button className="btn btn-primary btn-embed" style={{ borderRadius: 0, padding: '6px 12px', fontSize: '14px' }}>
                  Embed
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
