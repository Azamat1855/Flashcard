import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import CardContainer from '../components/CardContainer';

const CreateFlashcard = () => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [definition, setDefinition] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/flashcards`,
        {
          word,
          translation,
          definition,
          group: group.trim() || 'Ungrouped',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setWord('');
      setTranslation('');
      setDefinition('');
      setGroup('');
      navigate('/list');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create flashcard');
    }
  };

  return (
    <div className="pb-14 mt-6 flex items-center justify-center px-4 overflow-hidden">
      <CardContainer noShadow={true} className="space-y-3">
        <ErrorMessage error={error} />
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="word" className="text-black text-sm mb-1 block">
              Word
            </label>
            <input
              id="word"
              name="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter word"
              required
              className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label htmlFor="translation" className="text-black text-sm mb-1 block">
              Translation
            </label>
            <input
              id="translation"
              name="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter translation"
              required
              className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label htmlFor="definition" className="text-black text-sm mb-1 block">
              Definition
            </label>
            <textarea
              id="definition"
              name="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter definition"
              required
              className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20 resize-none h-20"
            />
          </div>
          <div>
            <label htmlFor="group" className="text-black text-sm mb-1 block">
              Group
            </label>
            <input
              id="group"
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder='Enter group name (optional, defaults to "Ungrouped")'
              className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <Button type="submit" variant="primary">
            Save Flashcard
          </Button>
        </form>
      </CardContainer>
    </div>
  );
};

export default CreateFlashcard;