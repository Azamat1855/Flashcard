import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import CardContainer from '../components/CardContainer';

const CreateFlashcard = () => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [definition, setDefinition] = useState('');
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
      console.log('Creating flashcard:', { word, translation, definition });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/flashcards`,
        {
          word,
          translation,
          definition,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Create flashcard response:', { status: response.status, data: response.data });
      setWord('');
      setTranslation('');
      setDefinition('');
      navigate('/list');
    } catch (err) {
      console.error('Create flashcard error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      setError(err.response?.data?.error || err.message || 'Failed to create flashcard');
    }
  };

  return (
    <div className="pb-14 mt-6 flex items-center justify-center px-4 overflow-hidden">
      <CardContainer className="space-y-3">
        <ErrorMessage error={error} />
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Word"
            name="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter word"
            required
          />
          <InputField
            label="Translation"
            name="translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Enter translation"
            required
          />
          <InputField
            label="Definition"
            name="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Enter definition"
            required
            isTextarea
          />
          <Button type="submit" variant="primary">
            Save Flashcard
          </Button>
        </form>
      </CardContainer>
    </div>
  );
};

export default CreateFlashcard;