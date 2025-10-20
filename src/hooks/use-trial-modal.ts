'use client'

import { useEffect, useState } from 'react'

const TRIAL_MODAL_SEEN_KEY = 'trial_modal_seen'

export function useTrialModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(TRIAL_MODAL_SEEN_KEY)
    if (!hasSeenModal) {
      setShowModal(true)
    }
  }, [])

  const closeModal = () => {
    localStorage.setItem(TRIAL_MODAL_SEEN_KEY, 'true')
    setShowModal(false)
  }

  return { showModal, closeModal }
}
