import React from 'react';

const FlashcardFace = ({ card, isFront, initialSide, speak }) => {
  return (
    <div
      style={{ backfaceVisibility: 'hidden', transform: isFront ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
      className="absolute w-full h-full flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg"
    >
      {initialSide === 'word' ? (
        isFront ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              {card.word}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(card.word);
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
              <span className="font-semibold">Translation:</span> {card.translation || 'No translation available'}
            </p>
            <p className="italic text-center text-black text-sm">
              {card.definition || 'No definition available'}
            </p>
          </div>
        )
      ) : (
        isFront ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <p className="text-sm text-center text-black">
              <span className="font-semibold">Translation:</span> {card.translation || 'No translation available'}
            </p>
            <p className="italic text-center text-black text-sm">
              {card.definition || 'No definition available'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              {card.word}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(card.word);
                }}
                className="text-black text-lg"
                title="Listen"
              >
                🔊
              </button>
            </h2>
          </div>
        )
      )}
    </div>
  );
};

export default FlashcardFace;