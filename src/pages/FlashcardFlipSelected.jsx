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
  const [initialSide, setInitialSide] = useState('word');
  const [isPracticing, setIsPracticing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const themeContext = useTheme();
  const textColor = themeContext ? themeContext.textColor : 'text-black';

  useEffect(() => {
    console.log('FlashcardFlipSelected mounted, user:', user);
    if (!user || !user.token) {
      console.log('No user or token, redirecting to /login');
      navigate('/login');
      return;
    }
    const fetchFlashcards = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('VITE_API_URL is not defined in .env');
        }
        console.log('Fetching flashcards from:', `${apiUrl}/api/flashcards`, 'with token:', user.token);
        const response = await axios.get(`${apiUrl}/api/flashcards`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Flashcards response:', response.data);
        setFlashcards(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to load flashcards';
        console.error('Fetch flashcards error:', {
          status: err.response?.status,
          message: errorMsg,
          url: err.config?.url,
        });
        setError(errorMsg);
        setFlashcards([]);
      }
    };
    fetchFlashcards();
  }, [user, navigate]);

  const getRandomInitialSide = () => {
    return Math.random() > 0.5 ? 'word' : 'translationAndDefinition';
  };

  const handleSelectCard = (card) => {
    if (!card || !card._id) {
      console.error('Invalid card:', card);
      return;
    }
    setSelectedCards((prev) => {
      const newSelected = prev.some((c) => c._id === card._id)
        ? prev.filter((c) => c._id !== card._id)
        : [...prev, card];
      console.log('Selected cards:', newSelected);
      return newSelected;
    });
  };

  const handleStartPractice = () => {
    if (selectedCards.length === 0) {
      setError('Please select at least one flashcard to practice.');
      console.log('Error: No flashcards selected');
      return;
    }
    console.log('Starting practice with cards:', selectedCards);
    setIsPracticing(true);
    setError('');
    setIsFlipped(false);
    setCurrentCardIndex(0);
    setInitialSide(getRandomInitialSide());
  };

  const handleFlip = () => {
    if (!selectedCards[currentCardIndex]) {
      console.error('No card at index:', currentCardIndex);
      return;
    }
    setIsFlipped((prev) => !prev);
    console.log('Flipped card:', selectedCards[currentCardIndex], 'isFlipped:', !isFlipped);
  };

  const handleNextCard = () => {
    if (selectedCards.length === 0) {
      console.error('No selected cards to navigate');
      return;
    }
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % selectedCards.length);
    setInitialSide(getRandomInitialSide());
    console.log('Next card index:', (currentCardIndex + 1) % selectedCards.length);
  };

  const handlePrevCard = () => {
    if (selectedCards.length === 0) {
      console.error('No selected cards to navigate');
      return;
    }
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + selectedCards.length) % selectedCards.length);
    setInitialSide(getRandomInitialSide());
    console.log('Previous card index:', (currentCardIndex - 1 + selectedCards.length) % selectedCards.length);
  };

  const handleShuffle = () => {
    if (selectedCards.length === 0) {
      console.error('No selected cards to shuffle');
      return;
    }
    const shuffled = [...selectedCards].sort(() => Math.random() - 0.5);
    setSelectedCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setInitialSide(getRandomInitialSide());
    console.log('Shuffled cards:', shuffled);
  };

  const handleBackToSelection = () => {
    setIsPracticing(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setInitialSide('word');
    setSelectedCards([]);
    setError('');
    console.log('Returning to selection view');
  };

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported');
      return;
    }
    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    };
    const voicesLoaded = speechSynthesis.getVoices().length > 0;
    if (voicesLoaded) {
      speakNow();
    } else {
      speechSynthesis.onvoiceschanged = () => {
        speakNow();
      };
    }
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
    if (!currentCard) {
      console.error('No current card at index:', currentCardIndex);
      return (
        <div className="h-screen flex items-center justify-center text-black">
          Error: No card available
        </div>
      );
    }
    return (
      <div className="mt-32 flex flex-col items-center justify-center px-4 space-y-10 relative">
        <button
          onClick={handleBackToSelection}
          className="fixed top-24 px-4 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition"
        >
          Back to Selection
        </button>
        <div
          className="w-80 h-52 relative cursor-pointer"
          onClick={handleFlip}
          style={{ perspective: '1000px' }}
        >
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s',
            }}
            className="w-full h-full relative"
          >
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute w-full h-full flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg"
            >
              {initialSide === 'word' ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    {currentCard.word}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentCard.word);
                      }}
                      className="text-black text-lg"
                      title="Listen"
                    >
                      🔊
                    </button>
                  </h2>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <p className="text-sm text-center text-black">
                    <span className="font-semibold">Translation:</span>{' '}
                    {currentCard.translation || 'No translation available'}
                  </p>
                  <p className="italic text-center text-black text-sm">
                    {currentCard.definition || 'No definition available'}
                  </p>
                </div>
              )}
            </div>
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute w-full h-full flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg"
            >
              {initialSide === 'word' ? (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <p className="text-sm text-center text-black">
                    <span className="font-semibold">Translation:</span>{' '}
                    {currentCard.translation || 'No translation available'}
                  </p>
                  <p className="italic text-center text-black text-sm">
                    {currentCard.definition || 'No definition available'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    {currentCard.word}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentCard.word);
                      }}
                      className="text-black text-lg"
                      title="Listen"
                    >
                      🔊
                    </button>
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          {['Previous', 'Shuffle', 'Next'].map((label) => {
            const action =
              label === 'Previous'
                ? handlePrevCard
                : label === 'Next'
                ? handleNextCard
                : handleShuffle;
            return (
              <button
                key={label}
                onClick={action}
                className={`w-28 px-4 py-2 bg-white/20 text-black border border-white/30 backdrop-blur-md rounded-xl shadow hover:bg-white/30 transition ${
                  (label === 'Previous' || label === 'Next') && selectedCards.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={(label === 'Previous' || label === 'Next') && selectedCards.length <= 1}
              >
                {label}
              </button>
            );
          })}
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
        <p className="text-sm font-medium text-black">
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