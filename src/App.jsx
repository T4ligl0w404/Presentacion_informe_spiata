import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Cover Slide Component
function CoverSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-amber-900 leading-tight">
          Ataque de Ransomware a BancoEstado
        </h1>
        <p className="text-3xl text-amber-800 font-light">(2020)</p>
        
        <div className="pt-12 border-t border-amber-200/30">
          <p className="text-lg text-amber-700/80 font-light">Presentado por</p>
          <p className="text-2xl text-amber-900 font-semibold mt-2">
            Atalía Anaís Spielmann Flores
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const modules = import.meta.glob('/docs_spiata/*.md', { as: 'raw' })
    Promise.all(
      Object.entries(modules).map(async ([path, loader]) => {
        const content = await loader()
        return { path, content }
      })
    ).then(files => {
      files.sort((a, b) => a.path.localeCompare(b.path))
      setSlides(files)
    })
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, slides.length))
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides])

  if (slides.length === 0) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="text-xl text-amber-700">Cargando presentación...</div>
    </div>
  )

  const totalSlides = slides.length + 1
  const isCover = index === 0
  const current = isCover ? null : slides[index - 1]

  const title = current ? (() => {
    const lines = current.content.split('\n')
    const headingIndex = lines.findIndex(line => /^#{1,6}\s+/.test(line))
    if (headingIndex !== -1) {
      const rawTitle = lines[headingIndex].replace(/^#{1,6}\s+/, '').trim()
      return rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)
    }
    const raw = current.path
      .replace(/.*\//, '')
      .replace('.md', '')
      .replace(/^\d+_/, '')
      .replace(/_spiata/, '')
      .replace(/_/g, ' ')
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  })() : ''

  const slideContent = current ? (() => {
    const lines = current.content.split('\n')
    const headingIndex = lines.findIndex(line => /^#{1,6}\s+/.test(line))
    if (headingIndex !== -1) {
      const remaining = [...lines]
      remaining.splice(headingIndex, 1)
      return remaining.join('\n').trim()
    }
    return current.content
  })() : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 flex flex-col items-center justify-center p-8">
      {/* Slide Container */}
      <div className="w-full max-w-5xl h-[75vh] bg-white rounded-xl shadow-xl p-16 overflow-hidden border border-amber-100/50">
        {/* Slide Header */}
        {!isCover && (
          <div className="mb-10 pb-6 border-b-2 border-amber-200/40">
            <h2 className="text-3xl font-bold text-amber-900">{title}</h2>
          </div>
        )}

        {/* Slide Content */}
        {isCover ? (
          <CoverSlide />
        ) : (
          <div className="h-full overflow-hidden">
            <div className="prose prose-sm max-w-none text-gray-800 h-full">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-amber-900 mb-3" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-amber-800 mb-2 mt-4" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-amber-700 mb-2 mt-3" {...props} />,
                  p: ({ node, ...props }) => <p className="text-sm text-gray-700 mb-2 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1 text-sm" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-700 mb-2 space-y-1 text-sm" {...props} />,
                  li: ({ node, ...props }) => <li className="text-gray-700 text-sm" {...props} />,
                  a: ({ node, ...props }) => <a className="text-amber-700 hover:text-amber-800 underline" {...props} />,
                  code: ({ node, ...props }) => <code className="bg-amber-50 px-1.5 py-0.5 rounded text-amber-900 font-mono text-xs" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-amber-300 pl-3 italic text-amber-700 my-2 text-sm" {...props} />,
                  table: ({ node, ...props }) => <table className="w-full text-sm md:text-base border border-amber-200/70 shadow-sm bg-amber-50" {...props} />,
                  th: ({ node, ...props }) => <th className="bg-amber-100 border border-amber-200 px-3 py-2 text-left text-sm md:text-base" {...props} />,
                  td: ({ node, ...props }) => <td className="border border-amber-200 px-3 py-2 text-sm md:text-base" {...props} />,
                }}
              >
                {slideContent}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-8 text-center text-sm text-amber-700/60">
        Usa las flechas o los botones para navegar
      </div>

      {/* Navigation Buttons - Elegant Design */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {/* Previous Button */}
        <button 
          onClick={() => setIndex(i => Math.max(i - 1, 0))}
          disabled={index === 0}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
            index === 0 
              ? 'bg-amber-100 text-amber-300 cursor-not-allowed' 
              : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-lg hover:scale-110'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Slide Counter with decorative dots */}
        <div className="flex items-center gap-3 px-6 py-2 bg-white/80 backdrop-blur rounded-full shadow-md border border-amber-200/30">
          <span className="text-sm font-semibold text-amber-900">{index + 1}</span>
          <span className="text-amber-300 text-lg">•</span>
          <span className="text-sm text-amber-700">{totalSlides}</span>
        </div>

        {/* Next Button */}
        <button 
          onClick={() => setIndex(i => Math.min(i + 1, slides.length))}
          disabled={index === slides.length}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
            index === slides.length 
              ? 'bg-amber-100 text-amber-300 cursor-not-allowed' 
              : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-lg hover:scale-110'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500" 
           style={{ width: `${((index + 1) / totalSlides) * 100}%` }}>
      </div>
    </div>
  )
}
