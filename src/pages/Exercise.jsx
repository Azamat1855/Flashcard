import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import FlashcardFace from '../components/FlashcardFace';

const Exercise = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [initialSide, setInitialSide] = useState('word');
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
        setInitialSide(Math.random() > 0.5 ? 'word' : 'translationAndDefinition');
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

  const getRandomInitialSide = () => {
    return Math.random() > 0.5 ? 'word' : 'translationAndDefinition';
  };

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setInitialSide(getRandomInitialSide());
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
    setInitialSide(getRandomInitialSide());
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    setInitialSide(getRandomInitialSide());
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
        <ErrorMessage error={error} />
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
    <div className="mt-32 flex flex-col items-center justify-center px-4 space-y-10">
      <div
        className="w-80 h-52 relative cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s',
          }}
          className="w-full h-full relative"
        >
          <FlashcardFace card={currentCard} isFront={true} initialSide={initialSide} speak={speak} />
          <FlashcardFace card={currentCard} isFront={false} initialSide={initialSide} speak={speak} />
        </div>
      </div>
      <div className="flex space-x-4">
        <Button onClick={handlePrev} variant="secondary">Previous</Button>
        <Button onClick={handleShuffle} variant="secondary">Shuffle</Button>
        <Button onClick={handleNext} variant="secondary">Next</Button>
      </div>
    </div>
  );
};

export default Exercise;