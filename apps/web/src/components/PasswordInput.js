'use client'

import { useState } from 'react'

/** Password field with an eye button to show or hide what is typed. */
export default function PasswordInput(props) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="password-field">
      <input {...props} type={isVisible ? 'text' : 'password'} />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          {isVisible && (
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
          )}
        </svg>
      </button>
    </div>
  )
}
