import React from 'react';
import CardContainer from './CardContainer';
import Button from './Button';

const FlashcardItem = ({ card, onEdit, onDelete }) => (
  <CardContainer className="text-black overflow-hidden">
    <div className="bg-gradient-to-l from-indigo-300 to-purple-300 backdrop-blur-sm px-6 py-3 border-b rounded-xl border-white/20">
      <h2 className="text-lg font-semibold text-center">{card.word}</h2>
    </div>
    <div className="px-6 py-4 space-y-2">
      <p className="text-sm text-center">
        <span className="font-medium">Translation:</span> {card.translation}
      </p>
      <p className="italic text-center">{card.definition}</p>
    </div>
    <div className="flex border-t border-white/20 gap-2">
      <Button onClick={() => onEdit(card)} variant="secondary" className="w-1/2 border-r border-white/20">
        Edit
      </Button>
      <Button onClick={() => onDelete(card)} variant="secondary" className="w-1/2">
        Delete
      </Button>
    </div>
  </CardContainer>
);

export default FlashcardItem;