import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '#/paraglide/messages'
import LocaleSwitcher from '../components/LocaleSwitcher'

export const Route = createFileRoute('/demo/i18n')({
  component: App,
})

function App() {
  const [total, setTotal] = useState(0)

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)] gap-4">
        <p>{m.example_message()}</p>
        <div className="flex flex-col items-center gap-3">
          <p className="text-2xl font-semibold">
            {m.name({ total: total === 0 ? '0' : total })}
          </p>
          <div className="flex gap-2 text-base">
            <button
              type="button"
              className="cursor-pointer rounded-full border border-white/30 px-4 py-2 hover:bg-white/10"
              onClick={() => setTotal((count) => Math.max(0, count - 1))}
              aria-label="Remove ticket"
            >
              −
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-full border border-white/30 px-4 py-2 hover:bg-white/10"
              onClick={() => setTotal((count) => count + 1)}
              aria-label="Add ticket"
            >
              +
            </button>
          </div>
        </div>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://inlang.com/m/gerre34r/library-inlang-paraglideJs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {m.learn_router()}
        </a>
        <div className="mt-3">
          <LocaleSwitcher />
        </div>
      </header>
    </div>
  )
}
