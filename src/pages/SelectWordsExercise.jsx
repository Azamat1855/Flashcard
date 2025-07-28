import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SelectWordsExercise = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
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
      setError('Please select at least one word to practice.');
      return;
    }
    navigate('/exercise/spelling', { state: { selectedCards } });
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

  return (
    <div className="mt-12 mb-24 px-4 flex flex-col items-center space-y-6">
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
          Selected: <span className="font-semibold">{selectedCards.length} word(s)</span>
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

export default SelectWordsExercise;