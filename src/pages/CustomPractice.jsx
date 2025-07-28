import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const CustomPractice = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isPracticing, setIsPracticing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
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
  };

  const handleNextCard = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedCards.length);
  };

  const handlePrevCard = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedCards.length) % selectedCards.length);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    setShowAnswer(true);
  };

  const handleBackToSelection = () => {
    setIsPracticing(false);
    setCurrentCardIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
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
            Practice Flashcard ({currentCardIndex + 1}/{selectedCards.length})
          </h2>
          <div className="space-y-4">
            <p className="text-lg font-semibold text-center">{currentCard.word}</p>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter translation or definition"
                className="w-full px-3 py-2 rounded-xl bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-500/80 text-white rounded-xl hover:bg-indigo-600 transition"
              >
                Check Answer
              </button>
            </form>
            {showAnswer && (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Translation:</span> {currentCard.translation}
                </p>
                <p className="text-sm italic">
                  <span className="font-medium">Definition:</span> {currentCard.definition}
                </p>
              </div>
            )}
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
    <div className="mt-32 mb-24 px-4 flex flex-col items-center space-y-6">
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
        <p className={`text-sm font-medium ${textColor}`}>
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

export default CustomPractice;