import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const SpellingExercise = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to /login');
      navigate('/login');
      return;
    }
    const selectedCards = location.state?.selectedCards;
    console.log('Selected cards received from SelectWordsExercise:', selectedCards);
    if (selectedCards && Array.isArray(selectedCards) && selectedCards.length > 0) {
      console.log('Using selected cards:', selectedCards);
      setFlashcards(selectedCards);
      setInitialFetchDone(true);
    } else {
      console.log('No selected cards, fetching all flashcards');
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
          console.log('Flashcards response:', { status: response.status, data: response.data });
          const cards = Array.isArray(response.data) ? response.data : [];
          setFlashcards(cards);
          setInitialFetchDone(true);
        } catch (err) {
          const errorMsg = err.response?.data?.error || err.message || 'Failed to load flashcards';
          console.error('Fetch flashcards error:', {
            status: err.response?.status,
            message: errorMsg,
            url: err.config?.url,
          });
          setError(errorMsg);
          setFlashcards([]);
          setInitialFetchDone(true);
        }
      };
      fetchFlashcards();
    }
  }, [user, navigate, location.state]);

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported');
      setFeedback('Speech synthesis not supported in this browser');
      return;
    }

    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
      console.log('Speaking word:', text.trim());
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentCard = flashcards[currentIndex];
    if (!currentCard) {
      console.error('No current card at index:', currentIndex);
      setFeedback('Error: No card available');
      return;
    }
    const trimmedInput = userInput.trim().toLowerCase();
    const correctWord = currentCard.word.trim().toLowerCase();
    console.log('Submit:', { userInput: trimmedInput, correctWord, rawInput: userInput, rawCorrectWord: currentCard.word });
    if (trimmedInput === correctWord) {
      setFeedback('Correct!');
      setFlashcards((prev) => {
        const newFlashcards = prev.filter((_, index) => index !== currentIndex);
        console.log('Card removed, remaining flashcards:', newFlashcards);
        setCurrentIndex((prev) => {
          if (newFlashcards.length === 0) return 0;
          return prev >= newFlashcards.length ? 0 : prev;
        });
        return newFlashcards;
      });
      setUserInput('');
    } else {
      setFeedback(`Incorrect. The correct word is: ${currentCard.word.trim()}`);
      setUserInput('');
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }
  };

  const handleNext = () => {
    setUserInput('');
    setFeedback('');
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    console.log('Next card index:', (currentIndex + 1) % flashcards.length);
  };

  const handleBackToSelection = () => {
    navigate('/exercise/select');
    console.log('Returning to selection view');
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        Error: {error}
      </div>
    );
  }

  if (flashcards.length === 0 && !initialFetchDone) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        No flashcards found.
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="mt-32 flex flex-col items-center justify-center px-4 space-y-6 relative">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-black">
          <p className="text-center text-lg font-semibold">Congratulations! All words spelled correctly.</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="mt-32 flex flex-col items-center justify-center px-4 space-y-6 relative">
      {location.state?.selectedCards && (
        <button
          onClick={handleBackToSelection}
          className="fixed top-24 px-4 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition"
        >
          Back to Selection
        </button>
      )}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-black">
        <h2 className="text-xl font-bold text-center mb-4">
          Words left: {flashcards.length}
        </h2>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm">
              <span className="font-semibold">Translation:</span> {currentCard.translation || 'No translation available'}
            </p>
            <p className="italic text-sm">
              {currentCard.definition || 'No definition available'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 mt-2 rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Type the word"
                required
              />
              <button
                type="button"
                onClick={() => speak(currentCard.word)}
                className="mt-2 px-3 py-1.5 bg-white/20 text-black border border-white/30 rounded-xl hover:bg-white/30 transition"
                title="Listen to the word"
              >
                🔊
              </button>
            </div>
            {feedback && (
              <p className={`text-center text-sm ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
                {feedback}
              </p>
            )}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500/80 text-white rounded-xl hover:bg-indigo-600 transition"
              >
                Check
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-white/20 text-black border border-white/30 rounded-xl hover:bg-white/30 transition"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpellingExercise;