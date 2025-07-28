import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { FaCheckCircle, FaArrowRight, FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

const FlashcardFlipSelected = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { textColor } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flashcards`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFlashcards(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load flashcards');
        setFlashcards([]);
      }
    };
    fetchFlashcards();
  }, [user, navigate]);

  const handleSelectCard = (card) => {
    setSelectedCards((prev) =>
      prev.some((c) => c._id === card._id)
        ? prev.filter((c) => c._id !== card._id)
        : [...prev, card]
    );
  };

  const handleStartPractice = () => {
    if (selectedCards.length === 0) {
      setError('Please select at least one flashcard to practice.');
      return;
    }
    setIsPracticing(true);
    setError('');
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedCards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedCards.length) % selectedCards.length);
  };

  const handleBackToSelection = () => {
    setIsPracticing(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedCards([]);
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        Error: {error}
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        No flashcards found.
      </div>
    );
  }

  if (isPracticing) {
    const currentCard = selectedCards[currentCardIndex];
    return (
      <div className="mt-32 mb-16 px-4 flex flex-col items-center space-y-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 text-black">
          <h2 className={`text-xl font-bold ${textColor} text-center mb-4`}>
            Flashcard Flip ({currentCardIndex + 1}/{selectedCards.length})
          </h2>
          <div
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center transition-transform duration-500 hover:scale-105 cursor-pointer relative"
            onClick={handleFlip}
          >
            <p className="text-lg font-semibold">
              {isFlipped ? (
                <>
                  <span className="font-medium">Translation:</span> {currentCard.translation}
                  <br />
                  <span className="font-medium">Definition:</span> <i>{currentCard.definition}</i>
                </>
              ) : (
                currentCard.word
              )}
            </p>
            <FaSyncAlt className="absolute top-3 right-3 text-indigo-500 text-xl" />
          </div>
        </div>
        <div className="w-full max-w-md flex justify-between">
          <button
            onClick={handlePrevCard}
            className="px-4 py-2 bg-gray-500/80 text-white rounded-xl hover:bg-gray-600 transition flex items-center gap-2"
            disabled={selectedCards.length === 1}
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            onClick={handleBackToSelection}
            className="px-4 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition"
          >
            Back to Selection
          </button>
          <button
            onClick={handleNextCard}
            className="px-4 py-2 bg-indigo-500/80 text-white rounded-xl hover:bg-indigo-600 transition flex items-center gap-2"
            disabled={selectedCards.length === 1}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-24 mt-12 px-4 flex flex-col items-center space-y-6">
      {flashcards.map((card) => (
        <div
          key={card._id}
          className={`w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl text-black overflow-hidden cursor-pointer transition-transform duration-300 transform hover:scale-105 ${
            selectedCards.some((c) => c._id === card._id)
              ? 'border-indigo-500 bg-indigo-100/30 scale-105'
              : 'scale-100'
          }`}
          onClick={() => handleSelectCard(card)}
        >
          <div className="bg-gradient-to-l from-indigo-300 to-purple-300 backdrop-blur-sm px-6 py-3 border-b border-white/20 relative">
            <h2 className="text-lg font-semibold text-center">{card.word}</h2>
            {selectedCards.some((c) => c._id === card._id) && (
              <FaCheckCircle className="absolute top-3 right-3 text-indigo-500 text-xl" />
            )}
          </div>
          <div className="px-6 py-4 space-y-2">
            <p className="text-sm text-center">
              <span className="font-medium">Translation:</span> {card.translation}
            </p>
            <p className="italic text-center">{card.definition}</p>
          </div>
        </div>
      ))}
      <div className="fixed bottom-24 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-3 flex justify-between items-center">
        <p className={`text-sm font-medium text-black`}>
          Selected: <span className="font-semibold">{selectedCards.length} flashcard(s)</span>
        </p>
        <button
          onClick={handleStartPractice}
          className="px-4 py-2 bg-indigo-500/80 text-white rounded-xl hover:bg-indigo-600 transition disabled:opacity-50"
          disabled={selectedCards.length === 0}
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default FlashcardFlipSelected;