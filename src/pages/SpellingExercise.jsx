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
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const selectedCards = location.state?.selectedCards;
    if (selectedCards && selectedCards.length > 0) {
      setFlashcards(selectedCards);
      return;
    }
    const fetchFlashcards = async () => {
      try {
        console.log('Fetching flashcards with token:', user.token);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flashcards`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Flashcards response:', { status: response.status, data: response.data });
        setFlashcards(response.data);
      } catch (err) {
        console.error('Fetch flashcards error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
        setError(err.response?.data?.error || err.message || 'Failed to load flashcards');
        setFlashcards([]);
      }
    };
    fetchFlashcards();
  }, [user, navigate, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentCard = flashcards[currentIndex];
    if (userInput.trim().toLowerCase() === currentCard.word.toLowerCase()) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct word is: ${currentCard.word}`);
    }
  };

  const handleNext = () => {
    setUserInput('');
    setFeedback('');
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
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

  const currentCard = flashcards[currentIndex];

  return (
    <div className="mt-32 flex flex-col items-center justify-center px-4 space-y-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 text-black">
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
            <div>
              <label className="text-sm font-medium block text-center">Enter the word:</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full mt-2 rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Type the word"
                required
              />
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