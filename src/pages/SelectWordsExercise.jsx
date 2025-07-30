import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SelectWordsExercise = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to /login');
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
        console.log('Flashcards response:', { status: response.status, data: response.data });
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

  const groupedFlashcards = flashcards.reduce((acc, card) => {
    const group = card.group || 'Ungrouped';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(card);
    return acc;
  }, {});

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
    console.log('Toggled group:', group, 'Expanded:', !expandedGroups[group]);
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

  const handleSelectGroup = (group) => {
    const groupCards = groupedFlashcards[group] || [];
    if (!groupCards.length) {
      console.log('No cards in group:', group);
      return;
    }
    const allSelected = groupCards.every((card) => selectedCards.some((c) => c._id === card._id));
    setSelectedCards((prev) => {
      let newSelected;
      if (allSelected) {
        newSelected = prev.filter((c) => !groupCards.some((gc) => gc._id === c._id));
      } else {
        const existingIds = new Set(prev.map((c) => c._id));
        newSelected = [
          ...prev,
          ...groupCards.filter((card) => !existingIds.has(card._id)),
        ];
      }
      console.log('Group selection toggled:', group, 'All selected:', !allSelected, 'Selected cards:', newSelected);
      return newSelected;
    });
  };

  const handleStartPractice = () => {
    if (selectedCards.length === 0) {
      setError('Please select at least one word to practice.');
      console.log('Error: No flashcards selected');
      return;
    }
    console.log('Starting practice with cards:', selectedCards);
    navigate('/exercise/spelling', { state: { selectedCards } });
  };

  const handleBackToSelection = () => {
    navigate('/exercise');
    console.log('Returning to exercise selection');
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
    <div className="mt-12 mb-24 px-4 flex flex-col items-center space-y-4 relative">
      {Object.keys(groupedFlashcards).sort().map((group) => {
        const groupCards = groupedFlashcards[group] || [];
        const allSelected = groupCards.length > 0 && groupCards.every((card) =>
          selectedCards.some((c) => c._id === card._id)
        );
        return (
          <div key={group} className="w-full max-w-md">
            <div
              className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 cursor-pointer"
              onClick={() => toggleGroup(group)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectGroup(group);
                  }}
                  className="w-5 h-5 text-indigo-500 bg-white/80 border-white/30 rounded focus:ring-indigo-500"
                  disabled={!groupCards.length}
                />
                <h2 className="text-lg font-semibold text-black">{group} ({groupCards.length})</h2>
              </div>
              <button className="text-black">
                {expandedGroups[group] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            {expandedGroups[group] && (
              <div className="space-y-4 mt-2">
                {groupCards.map((card) => (
                  <div
                    key={card._id}
                    className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-black overflow-hidden cursor-pointer ${
                      selectedCards.some((c) => c._id === card._id)
                        ? 'border-indigo-500 bg-indigo-100/30'
                        : ''
                    }`}
                    onClick={() => handleSelectCard(card)}
                  >
                    <div className="bg-gradient-to-l from-indigo-300 to-purple-300 backdrop-blur-sm px-6 py-3 border-b border-white/20 relative">
                      <h2 className="text-lg font-semibold text-center text-black">{card.word}</h2>
                      {selectedCards.some((c) => c._id === card._id) && (
                        <FaCheckCircle className="absolute top-3 right-3 text-indigo-500 text-xl" />
                      )}
                    </div>
                    <div className="px-6 py-4 space-y-2">
                      <p className="text-sm text-center text-black">
                        <span className="font-medium">Translation:</span> {card.translation}
                      </p>
                      <p className="italic text-center text-black">{card.definition}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="fixed bottom-24 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex justify-between items-center">
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