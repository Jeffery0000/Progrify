import React, { useState, useEffect } from 'react';

const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    author: "Paul J. Meyer"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "Either you run the day or the day runs you.",
    author: "Jim Rohn"
  }
];

const QuoteBox: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Change quote every day (using random quote based on the date)
    const today = new Date().toDateString();
    const randomIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length;
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg shadow-sm p-5">
      <blockquote className="relative text-lg font-medium">
        <span className="text-4xl absolute -top-2 -left-3 text-teal-400 opacity-50">"</span>
        <p className="relative z-10 mb-2">{currentQuote.text}</p>
        <footer className="text-teal-200 text-sm">— {currentQuote.author}</footer>
      </blockquote>
    </div>
  );
};

export default QuoteBox;