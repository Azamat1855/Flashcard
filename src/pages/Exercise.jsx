import React, { useEffect, useState } from 'react'

const Exercise = () => {
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [initialSide, setInitialSide] = useState('word') // 'word' or 'translationAndDefinition'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flashcards')
      const parsed = stored ? JSON.parse(stored) : []
      setFlashcards(parsed)
      setInitialSide(Math.random() > 0.5 ? 'word' : 'translationAndDefinition')
    } catch (error) {
      console.error('Failed to load flashcards:', error)
      setFlashcards([])
    }
  }, [])

  const getRandomInitialSide = () => {
    return Math.random() > 0.5 ? 'word' : 'translationAndDefinition'
  }

  const handleFlip = () => setFlipped(!flipped)

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    setInitialSide(getRandomInitialSide())
  }

  const handlePrev = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1))
    setInitialSide(getRandomInitialSide())
  }

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentIndex(0)
    setFlipped(false)
    setInitialSide(getRandomInitialSide())
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  if (flashcards.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        No flashcards found.
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="mt-32 flex flex-col items-center justify-center px-4 space-y-10">
      {/* Flip Card */}
      <div
        className="w-80 h-52 relative cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s',
          }}
          className="w-full h-full relative"
        >
          {/* Front Side */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute w-full h-full flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg"
          >
            {initialSide === 'word' ? (
              <>
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  {currentCard.word}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      speak(currentCard.word)
                    }}
                    className="text-black text-lg"
                    title="Listen"
                  >
                    🔊
                  </button>
                </h2>
              </>
            ) : (
              <>
                <p className="text-sm text-center text-black">
                  <span className="font-semibold">Translation:</span>{' '}
                  {currentCard.translation || 'No translation available'}
                </p>
                <p className="italic text-center text-black text-sm mt-2">
                  {currentCard.definition || 'No definition available'}
                </p>
              </>
            )}
          </div>

          {/* Back Side */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute w-full h-full flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg"
          >
            {initialSide === 'word' ? (
              <>
                <p className="text-sm text-center text-black">
                  <span className="font-semibold">Translation:</span>{' '}
                  {currentCard.translation || 'No translation available'}
                </p>
                <p className="italic text-center text-black text-sm mt-2">
                  {currentCard.definition || 'No definition available'}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  {currentCard.word}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      speak(currentCard.word)
                    }}
                    className="text-black text-lg"
                    title="Listen"
                  >
                    🔊
                  </button>
                </h2>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-4">
        {['Previous', 'Shuffle', 'Next'].map((label) => {
          const action =
            label === 'Previous' ? handlePrev : label === 'Next' ? handleNext : handleShuffle
          return (
            <button
              key={label}
              onClick={action}
              className="w-28 px-4 py-2 bg-white/20 text-black border border-white/30 backdrop-blur-md rounded-xl shadow hover:bg-white/30 transition"
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Exercise
