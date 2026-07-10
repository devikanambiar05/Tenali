import React, { useState, useMemo, useEffect, useRef } from 'react';
import './TryItAssessment.css';
import LearningContainer from './LearningContainer';

// --- Cute SVG Characters ---

export function KawaiiStar({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" style={{ display: 'block' }}>
      {/* Star outline and fill */}
      <path
        d="M 25,2 L 31.5,15.5 L 46.5,17.5 L 35.5,28 L 38.5,43 L 25,36 L 11.5,43 L 14.5,28 L 3.5,17.5 L 18.5,15.5 Z"
        fill="#fff8cf"
        stroke="#4a2c11"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Rosy Cheeks */}
      <circle cx="15" cy="26" r="3.5" fill="#f9abb2" opacity="0.8" />
      <circle cx="35" cy="26" r="3.5" fill="#f9abb2" opacity="0.8" />
      {/* Cute eyes */}
      <ellipse cx="19" cy="23" rx="2" ry="3" fill="#4a2c11" />
      <ellipse cx="31" cy="23" rx="2" ry="3" fill="#4a2c11" />
      {/* Cute smiling mouth */}
      <path
        d="M 23,25 Q 25,27.5 27,25"
        stroke="#4a2c11"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* White shine highlight */}
      <path
        d="M 25,6 A 2,2 0 0,0 23.5,8"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KawaiiApple({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" style={{ display: 'block' }}>
      {/* Stem */}
      <path
        d="M 25,12 Q 27,4 32,3"
        stroke="#5a3d28"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaf */}
      <path
        d="M 26,10 Q 33,5 36,12 Q 29,14 26,10 Z"
        fill="#7ebd56"
        stroke="#4a2c11"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Apple body */}
      <path
        d="M 25,13 C 18,13 10,16 10,26 C 10,36 18,44 25,43 C 32,44 40,36 40,26 C 40,16 32,13 25,13 Z"
        fill="#ff6b6b"
        stroke="#4a2c11"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Rosy Cheeks */}
      <circle cx="16" cy="29" r="3" fill="#ff9b9b" />
      <circle cx="34" cy="29" r="3" fill="#ff9b9b" />
      {/* Happy closed eyes ^ ^ */}
      <path
        d="M 17,24 Q 20,21 22,24"
        stroke="#4a2c11"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 28,24 Q 30,21 33,24"
        stroke="#4a2c11"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cute smiling mouth */}
      <path
        d="M 23,28 Q 25,31 27,28"
        stroke="#4a2c11"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* White shine highlight */}
      <ellipse cx="16" cy="18" rx="3" ry="1.5" transform="rotate(-30 16 18)" fill="#ffffff" />
    </svg>
  );
}

export function KawaiiBee({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" style={{ display: 'block' }}>
      <defs>
        {/* Clip path to restrict stripes to the rounded ellipse body contour */}
        <clipPath id="tlf-bee-body-clip">
          <ellipse cx="25" cy="30" rx="16" ry="13.2" />
        </clipPath>
      </defs>

      {/* Rear Wing (behind front wing) */}
      <path
        d="M 21,18 C 12,13 12,2 20,5 C 26,7 24,18 21,18 Z"
        fill="#ffffff"
        stroke="#1c1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Front Wing (in front of rear wing) */}
      <path
        d="M 25,18 C 19,7 28,1 36,9 C 42,15 36,25 25,18 Z"
        fill="#ffffff"
        stroke="#1c1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Black Stinger (rear-right) */}
      <path
        d="M 39,27 L 46,30 L 39,33 Z"
        fill="#1c1917"
        stroke="#1c1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Clipped Group for Yellow/Black body stripes */}
      <g clipPath="url(#tlf-bee-body-clip)">
        {/* Base yellow color */}
        <rect x="5" y="10" width="40" height="40" fill="#f0c243" />
        {/* Stripe 1 (middle-left) */}
        <path d="M 16,10 C 20,25 20,35 16,50 L 22,50 C 26,35 26,25 22,10 Z" fill="#1c1917" />
        {/* Stripe 2 (middle-right) */}
        <path d="M 26,10 C 30,25 30,35 26,50 L 32,50 C 36,35 36,25 32,10 Z" fill="#1c1917" />
        {/* Rear black end */}
        <path d="M 35,10 C 39,25 39,35 35,50 L 45,50 L 45,10 Z" fill="#1c1917" />
      </g>

      {/* Body contour outline */}
      <ellipse
        cx="25"
        cy="30"
        rx="16"
        ry="13.2"
        fill="none"
        stroke="#1c1917"
        strokeWidth="3.2"
      />

      {/* Antennae */}
      <path
        d="M 14,22 Q 10,21 9,23"
        stroke="#1c1917"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="23.5" r="2.2" fill="#1c1917" />

      <path
        d="M 16,20 Q 14,14 11,15"
        stroke="#1c1917"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="10" cy="15.5" r="2.2" fill="#1c1917" />

      {/* Side-facing single Eye */}
      <ellipse cx="14" cy="30" rx="1.5" ry="2.2" fill="#1c1917" />

      {/* Side-facing small smiling mouth on the contour edge of the face */}
      <path
        d="M 9.5,31.5 Q 11,33.5 10,35"
        stroke="#1c1917"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Map char names to Components
export const CHARACTER_COMPONENTS = {
  star: KawaiiStar,
  apple: KawaiiApple,
  bee: KawaiiBee
};

export const CHARACTER_PLURAL = {
  star: 'stars',
  apple: 'apples',
  bee: 'bees'
};

const CHARACTER_TYPES = ['star', 'apple', 'bee'];

// --- Helper Functions ---

function getRandomCharacter() {
  return CHARACTER_TYPES[Math.floor(Math.random() * CHARACTER_TYPES.length)];
}

function generateGridItems(quantity) {
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push({ col: c, row: r });
    }
  }
  
  const shuffled = cells.sort(() => Math.random() - 0.5);
  const items = [];
  
  for (let i = 0; i < quantity; i++) {
    const cell = shuffled[i];
    const jitterX = Math.floor(Math.random() * 21) - 10; // -10 to 10 px
    const jitterY = Math.floor(Math.random() * 21) - 10; // -10 to 10 px
    
    items.push({
      col: cell.col,
      row: cell.row,
      jitterX,
      jitterY
    });
  }
  
  return items;
}

function generateOriginalQuestion(level) {
  let band = 'easy';
  let type = 'mc';
  let min = 2, max = 4;

  if (level === 1) {
    band = 'easy';
    type = 'mc';
    min = 2; max = 4;
  } else if (level === 2) {
    band = 'medium';
    type = 'mc';
    min = 5; max = 7;
  } else {
    band = 'hard';
    type = 'numeric';
    min = 7; max = 9;
  }

  const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
  const characterType = getRandomCharacter();
  const items = generateGridItems(quantity);

  return {
    id: `orig_${level}_${Date.now()}`,
    level,
    type,
    band,
    quantity,
    characterType,
    items,
    isPractice: false
  };
}

function generatePracticeQuestion(level, previousPracticeCount) {
  let band = 'easy';
  let type = 'mc';
  let min = 2, max = 4;

  if (level === 1) {
    band = 'easy';
    type = 'mc';
    min = 2; max = 4;
  } else if (level === 2) {
    band = 'medium';
    type = 'mc';
    min = 5; max = 7;
  } else {
    band = 'hard';
    type = 'numeric';
    min = 7; max = 9;
  }

  let quantity = Math.floor(Math.random() * (max - min + 1)) + min;
  if (previousPracticeCount !== null && min < max) {
    while (quantity === previousPracticeCount) {
      quantity = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  // preferably use a different character
  const characterType = getRandomCharacter();
  const items = generateGridItems(quantity);

  return {
    id: `prac_${level}_${Date.now()}`,
    level,
    type,
    band,
    quantity,
    characterType,
    items,
    isPractice: true
  };
}

function generateOptions(target) {
  // Distractors close to target, e.g., correct is 8 -> options 7, 8, 9, 10
  const start = Math.max(1, target - Math.floor(Math.random() * 2.9));
  const opts = [];
  for (let i = 0; i < 4; i++) {
    opts.push(start + i);
  }
  return opts;
}

const CORRECT_ENCOURAGEMENTS = [
  "🌟 Great counting!",
  "Awesome!",
  "Nice work!",
  "Fantastic!",
  "Excellent counting!",
  "You're doing great!"
];

// --- Main TryItAssessment Component ---

export default function TryItAssessment({ onFinished, initialCharacter }) {
  const [level, setLevel] = useState(1);
  const [originalQuestion, setOriginalQuestion] = useState(() => {
    const q = generateOriginalQuestion(1);
    if (initialCharacter) {
      q.characterType = initialCharacter;
    }
    return q;
  });
  const [currentQuestionState, setCurrentQuestionState] = useState(null);
  const [loopMode, setLoopMode] = useState('original'); // 'original' or 'practice'
  const [previousPracticeCount, setPreviousPracticeCount] = useState(null);

  const activeQuestion = currentQuestionState || originalQuestion;
  const currentQuestion = activeQuestion;

  // Multiple choice selections
  const [selectedOption, setSelectedOption] = useState(null);
  // Numeric Q3 input
  const [numericAnswer, setNumericAnswer] = useState('');
  
  // Feedback states
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' or 'incorrect'
  const [feedbackText, setFeedbackText] = useState('');
  
  // Active counting state
  const [markedIndices, setMarkedIndices] = useState({});

  const handleItemClick = (idx) => {
    if (isAnswered) return;
    setMarkedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 420, height: 260 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth || 420,
          height: canvasRef.current.clientHeight || 260
        });
      }
    };

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(canvasRef.current);
    updateSize();

    return () => observer.disconnect();
  }, []);

  // Compute position coordinates dynamically inside the safe boundaries margin (Top-Left corner)
  const scatterPositions = useMemo(() => {
    if (!activeQuestion || !activeQuestion.items) return [];

    const margin = 16;
    const charWidth = 56;
    const charHeight = 56;

    const xMin = margin;
    const xMax = canvasSize.width - margin - charWidth;
    const yMin = margin;
    const yMax = canvasSize.height - margin - charHeight;

    return activeQuestion.items.map((item) => {
      // Divide container safe width/height into 3 grid sectors: 0, 0.5, 1
      const fractionX = item.col / 2;
      const fractionY = item.row / 2;

      const baseX = xMin + fractionX * (xMax - xMin);
      const baseY = yMin + fractionY * (yMax - yMin);

      let x = baseX + item.jitterX;
      let y = baseY + item.jitterY;

      // Apply runtime boundary validation and clamping to keep the entire character sprite inside the safe zone margin
      x = Math.max(xMin, Math.min(xMax, x));
      y = Math.max(yMin, Math.min(yMax, y));

      return { x, y };
    });
  }, [activeQuestion, canvasSize]);

  // Generate options for multiple choice questions
  const options = useMemo(() => {
    if (!activeQuestion || activeQuestion.type !== 'mc') return [];
    return generateOptions(activeQuestion.quantity);
  }, [activeQuestion?.id]);

  const handleMCSelect = (val) => {
    if (isAnswered) return;
    setSelectedOption(val);
  };

  const handleNumericChange = (e) => {
    if (isAnswered) return;
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setNumericAnswer(val);
    }
  };

  const handleSubmit = () => {
    if (isAnswered) return;

    let userAnswer = 0;
    if (activeQuestion.type === 'mc') {
      if (selectedOption === null) return;
      userAnswer = selectedOption;
    } else {
      if (numericAnswer === '') return;
      userAnswer = parseInt(numericAnswer, 10);
    }

    const isCorrect = userAnswer === activeQuestion.quantity;
    setIsAnswered(true);

    if (isCorrect) {
      setAnswerStatus('correct');
      // Pick random success phrase
      const msg = CORRECT_ENCOURAGEMENTS[Math.floor(Math.random() * CORRECT_ENCOURAGEMENTS.length)];
      setFeedbackText(msg);

      // Transition automatically after 1.2 seconds
      setTimeout(() => {
        advanceQuestion(true);
      }, 1200);
    } else {
      setAnswerStatus('incorrect');
      setFeedbackText("😊 No problem!\nLet's try some more questions.");

      // Transition automatically after 3 seconds
      setTimeout(() => {
        advanceQuestion(false);
      }, 3000);
    }
  };

  const advanceQuestion = (isCorrect) => {
    // Reset answer fields
    setSelectedOption(null);
    setNumericAnswer('');
    setIsAnswered(false);
    setAnswerStatus(null);
    setFeedbackText('');
    setMarkedIndices({});

    if (isCorrect) {
      if (loopMode === 'original') {
        // Original correct -> move to next level!
        if (level < 3) {
          const nextLevel = level + 1;
          const newOrig = generateOriginalQuestion(nextLevel);
          
          setLevel(nextLevel);
          setOriginalQuestion(newOrig);
          setCurrentQuestionState(newOrig);
          setLoopMode('original');
          setPreviousPracticeCount(null);
        } else {
          // Finished level 3 original correctly -> Try It is completed!
          onFinished(activeQuestion?.characterType || 'apple');
        }
      } else {
        // Practice question answered correctly -> Go back to original question
        setLoopMode('original');
        setCurrentQuestionState(originalQuestion);
      }
    } else {
      // Answered incorrectly -> generate a NEW practice question
      const newPractice = generatePracticeQuestion(level, previousPracticeCount);
      
      setLoopMode('practice');
      setPreviousPracticeCount(newPractice.quantity);
      setCurrentQuestionState(newPractice);
    }
  };

  if (!currentQuestion) return null;

  const CharComponent = CHARACTER_COMPONENTS[currentQuestion.characterType] || KawaiiStar;
  const pluralName = CHARACTER_PLURAL[currentQuestion.characterType] || 'objects';

  return (
    <LearningContainer>
      <div className="tlf-assessment-wrapper">
        <div className="tlf-assessment-card">
          <h2 className="tlf-assessment-title">
            Count the {pluralName}.
          </h2>
          
          <p className="tlf-assessment-helper">
            {currentQuestion.type === 'mc' ? 'Choose the correct answer.' : 'Type your answer.'}
          </p>

          {/* Natural scattered characters container */}
          <div className="tlf-scatter-canvas" ref={canvasRef}>
            {scatterPositions.map((pos, idx) => {
              const isMarked = !!markedIndices[idx];
              return (
                <div 
                  key={idx} 
                  className={`tlf-scatter-item${isMarked ? ' marked' : ''}`}
                  onClick={() => handleItemClick(idx)}
                  style={{ 
                    left: `${pos.x}px`, 
                    top: `${pos.y}px`,
                    animationDelay: `${idx * 0.05}s`
                  }}
                >
                  <CharComponent size={56} />
                  {isMarked && (
                    <div className="tlf-item-checkmark-badge">✓</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Multiple choice rendering */}
          {currentQuestion.type === 'mc' && (
            <div className="tlf-options-row">
              {options.map((opt) => {
                let statusClass = '';
                if (isAnswered) {
                  if (opt === currentQuestion.quantity) {
                    statusClass = 'correct';
                  } else if (opt === selectedOption && answerStatus === 'incorrect') {
                    statusClass = 'incorrect';
                  }
                } else if (selectedOption === opt) {
                  statusClass = 'selected';
                }

                return (
                  <button
                    key={opt}
                    className={`tlf-option-btn ${statusClass}`}
                    onClick={() => handleMCSelect(opt)}
                    disabled={isAnswered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Free numeric input rendering */}
          {currentQuestion.type === 'numeric' && (
            <div className="tlf-input-container">
              <input
                className={`tlf-numeric-input ${isAnswered && answerStatus === 'incorrect' ? 'incorrect' : ''}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={numericAnswer}
                onChange={handleNumericChange}
                disabled={isAnswered}
                autoFocus
                placeholder="?"
              />
            </div>
          )}

          {/* Submit button */}
          <button
            className="tlf-submit-btn"
            onClick={handleSubmit}
            disabled={
              isAnswered || 
              (currentQuestion.type === 'mc' && selectedOption === null) || 
              (currentQuestion.type === 'numeric' && numericAnswer === '')
            }
          >
            Submit
          </button>

          {/* Feedback area */}
          <div className="tlf-feedback-area">
            {isAnswered && (
              <div className={`tlf-feedback-message ${answerStatus}`}>
                {feedbackText.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </LearningContainer>
  );
}
