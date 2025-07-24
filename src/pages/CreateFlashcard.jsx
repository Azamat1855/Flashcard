import React, { useState } from 'react'

const CreateFlashcard = () => {
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [definition, setDefinition] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  
    const newCard = {
      word,
      translation,
      definition,
      id: Date.now(),
    }
  
    const existingCards = JSON.parse(localStorage.getItem('flashcards')) || []
    const updatedCards = [...existingCards, newCard]
    localStorage.setItem('flashcards', JSON.stringify(updatedCards))
  
    setWord('')
    setTranslation('')
    setDefinition('')
  }

  return (
    <div className="pb-14 mt-6 flex items-center justify-center px-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 space-y-3"
      >
        <div>
          <label className="text-black text-sm mb-1 block">Word</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
            placeholder="Enter word"
            required
          />
        </div>

        <div>
          <label className="text-black text-sm mb-1 block">Translation</label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
            placeholder="Enter translation"
            required
          />
        </div>

        <div>
          <label className="text-black text-sm mb-1 block">Definition</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20 resize-none h-20"
            placeholder="Enter definition"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1.5 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          Save Flashcard
        </button>
      </form>
    </div>
  )
}

export default CreateFlashcard