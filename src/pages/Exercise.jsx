import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaExchangeAlt, FaKeyboard, FaList, FaBook, FaSyncAlt } from 'react-icons/fa';

const Exercise = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const exerciseOptions = [
    {
      title: 'Flashcard Flip',
      description: 'Flip through flashcards to test your memory of words and their meanings.',
      icon: <FaExchangeAlt className="text-indigo-500 text-2xl" />,
      path: '/exercise/flip',
    },
    {
      title: 'Flashcard Flip (Selected)',
      description: 'Choose specific flashcards to flip through and test your memory.',
      icon: <FaSyncAlt className="text-indigo-500 text-2xl" />,
      path: '/exercise/flip-selected',
    },
    {
      title: 'Spelling Practice',
      description: 'Type the correct word based on its translation and definition.',
      icon: <FaKeyboard className="text-indigo-500 text-2xl" />,
      path: '/exercise/spelling',
    },
    {
      title: 'Spelling Practice (Selected)',
      description: 'Choose specific words to focus on for a customized practice session.',
      icon: <FaList className="text-indigo-500 text-2xl" />,
      path: '/exercise/select',
    },
    
  ];

  return (
    <div className="mt-10 mb-16 px-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-black text-center mb-6">Choose an Exercise Mode</h2>
        <div className="space-y-4">
          {exerciseOptions.map((option) => (
            <div
              key={option.title}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => navigate(option.path)}
            >
              <div className="flex items-center space-x-4">
                <div>{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-black">{option.title}</h3>
                  <p className="text-xs text-black opacity-80">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercise;