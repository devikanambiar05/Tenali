import React, { useState, useEffect, useRef } from 'react';
import './PercentExplanationApp.css';

export default function PercentExplanationApp({ onBack, PercentApp }) {
  // Views: 'LEVELS' (selection screen), 'EXPLANATION_L1' (level 1 guide), 'QUIZ' (practice quiz)
  const [view, setView] = useState('LEVELS');

  // If view is QUIZ, directly render the unmodified PercentApp
  if (view === 'QUIZ') {
    return <PercentApp onBack={() => setView('LEVELS')} />;
  }

  return (
    <div className="percent-exp-container">
      {view === 'LEVELS' ? (
        <LevelsSelectView onBack={onBack} onSelectLevel={(lvl) => setView(`EXPLANATION_L${lvl}`)} onSkipToQuiz={() => setView('QUIZ')} />
      ) : (
        <Level1ExplanationView onBack={() => setView('LEVELS')} onContinueToQuiz={() => setView('QUIZ')} />
      )
      }
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 1. LEVELS SELECTION VIEW
// ────────────────────────────────────────────────────────────────────────
function LevelsSelectView({ onBack, onSelectLevel, onSkipToQuiz }) {
  const levels = [
    {
      id: 1,
      title: 'Level 1: Find a Percentage',
      desc: 'Learn how to calculate a basic part of a whole (e.g., 20% of 80).',
      active: true,
    },
    {
      id: 2,
      title: 'Level 2: Increase / Decrease',
      desc: 'Understand percentages as markups, discounts, or growth.',
      active: false,
    },
    {
      id: 3,
      title: 'Level 3: Reverse Percentage',
      desc: 'Find the original quantity when given the percentage result.',
      active: false,
    },
    {
      id: 4,
      title: 'Level 4: Compound Percentage',
      desc: 'Apply successive percentage changes over multiple intervals.',
      active: false,
    },
  ];

  return (
    <div className="levels-layout">
      <div className="header-row">
        <button className="back-button" onClick={onBack}>← Home</button>
      </div>

      <h1 className="title-serif">Percentages</h1>
      <p className="subtitle-body">Master percentage concepts step-by-step through interactive explanations.</p>

      <div className="levels-grid">
        {levels.map((lvl) => (
          <div
            key={lvl.id}
            className={`level-card ${lvl.active ? 'active' : 'locked'}`}
            onClick={() => lvl.active && onSelectLevel(lvl.id)}
          >
            <div className="level-badge">{lvl.active ? 'Ready' : 'Locked'}</div>
            <h3>{lvl.title}</h3>
            <p>{lvl.desc}</p>
            {lvl.active ? (
              <button className="learn-btn">Start Learning →</button>
            ) : (
              <span className="coming-soon">Coming Soon</span>
            )}
          </div>
        ))}
      </div>

      <div className="skip-quiz-container">
        <p className="skip-text">Already confident with percentage methods?</p>
        <button className="skip-btn" onClick={onSkipToQuiz}>
          Skip to Practice Quiz
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 2. LEVEL 1 EXPLANATION VIEW
// ────────────────────────────────────────────────────────────────────────
function Level1ExplanationView({ onBack, onContinueToQuiz }) {
  // Interactive Visual State
  const [percent, setPercent] = useState(25);
  const [whole, setWhole] = useState(200);
  const [customWhole, setCustomWhole] = useState('200');

  // Theory Step State
  const [theoryStep, setTheoryStep] = useState(1);
  const totalTheorySteps = 4;

  // Worked Example Step State
  const [exampleStep, setExampleStep] = useState(1);
  const totalExampleSteps = 4;

  // Copied indicator state
  const [copied, setCopied] = useState(false);

  // Sync custom whole input state
  const handleWholeChange = (e) => {
    const val = e.target.value;
    setCustomWhole(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 10000) {
      setWhole(parsed);
    }
  };

  const setWholePreset = (val) => {
    setWhole(val);
    setCustomWhole(String(val));
  };

  // Math Calculations
  const calculatedPart = ((percent / 100) * whole).toFixed(1).replace(/\.0$/, '');

  // Copy AI Prompt function
  const aiPromptText = `Explain the concept of 'finding a percentage of a whole number' using a simple real-life analogy. Detail the step-by-step method, and explain why dividing the percentage by 100 works. Keep the explanation general without using specific numerical values.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiPromptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Check if explanation is completed (reaches the AI prompt box)
  const isExplanationFinished = theoryStep === totalTheorySteps && exampleStep === totalExampleSteps;

  return (
    <div className="explanation-layout">
      <div className="header-row">
        <button className="back-button" onClick={onBack}>← Levels</button>
      </div>

      <h1 className="title-serif">Level 1: Find a Percentage</h1>
      <p className="subtitle-body">Interact with the visual model below to build your intuition, then check the theory and worked example.</p>

      {/* ── SECTION A: INTERACTIVE SPATIAL PERCENT BAR ── */}
      <div className="explanation-card interactive-card">
        <h2 className="section-title">1. Interactive Visual Model</h2>
        <p className="section-subtitle">Drag the slider and select different wholes to see how percentages represent parts of a quantity.</p>

        {/* Live Equation Banner */}
        <div className="equation-banner">
          <div className="math-display">
            Find <span className="highlight-accent">{percent}%</span> of <span className="highlight-purple">{whole}</span>
            <span className="equals"> = </span>
            <span className="highlight-green">{calculatedPart}</span>
          </div>
          <div className="math-breakdown">
            ({percent} / 100) × {whole} = {(percent / 100).toFixed(2)} × {whole} = {calculatedPart}
          </div>
        </div>

        {/* The Spatial Percent Bar */}
        <div className="percent-bar-wrapper">
          <div className="percent-bar-labels">
            <span>0</span>
            <span>{whole / 4}</span>
            <span>{whole / 2}</span>
            <span>{(3 * whole) / 4}</span>
            <span>{whole}</span>
          </div>
          <div className="percent-bar-container">
            <div className="percent-bar-track"></div>
            <div className="percent-bar-fill" style={{ width: `${percent}%` }}>
              <span className="percent-fill-label">{percent}%</span>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="controls-row">
          <div className="control-group slider-group">
            <label>Percentage: <strong>{percent}%</strong></label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={percent}
              onChange={(e) => setPercent(parseInt(e.target.value, 10))}
              className="accent-slider"
            />
          </div>

          <div className="control-group whole-group">
            <label>Whole Amount: <strong>{whole}</strong></label>
            <div className="presets-row">
              {[50, 100, 200, 500].map((preset) => (
                <button
                  key={preset}
                  className={`preset-btn ${whole === preset ? 'active' : ''}`}
                  onClick={() => setWholePreset(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="custom-input-wrapper">
              <span className="input-prefix">Custom:</span>
              <input
                type="text"
                value={customWhole}
                onChange={handleWholeChange}
                placeholder="E.g., 80"
                className="whole-text-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION B: CLICK-THROUGH THEORY ── */}
      <div className="explanation-card theory-card">
        <h2 className="section-title">2. Concept Theory</h2>
        
        <div className="theory-steps-list">
          {theoryStep >= 1 && (
            <div className="step-item fade-in">
              <div className="step-num">1</div>
              <div className="step-content">
                <strong>What is a percentage?</strong> A percentage is a way of expressing a quantity as a fraction of 100. The term comes from the Latin <em>per centum</em>, meaning "by the hundred."
              </div>
            </div>
          )}
          {theoryStep >= 2 && (
            <div className="step-item fade-in">
              <div className="step-num">2</div>
              <div className="step-content">
                <strong>Visualize the grid:</strong> Imagine the whole amount (e.g., {whole}) is divided into 100 equal parts. Each part contains 1% of the total. For {whole}, each 1% is equal to {whole / 100}.
              </div>
            </div>
          )}
          {theoryStep >= 3 && (
            <div className="step-item fade-in">
              <div className="step-content">
                <strong>Converting the Percent:</strong> To make it ready for calculation, we convert the percentage sign into a divisor of 100. So {percent}% is written as <span className="monospace">({percent} / 100)</span> or <span className="monospace">{(percent / 100).toFixed(2)}</span>.
              </div>
            </div>
          )}
          {theoryStep >= 4 && (
            <div className="step-item fade-in">
              <div className="step-num">4</div>
              <div className="step-content">
                <strong>The General Formula:</strong> To calculate the part, scale the whole amount by this fraction:
                <div className="formula-block">
                  Part = (Percent / 100) × Whole
                </div>
              </div>
            </div>
          )}
        </div>

        {theoryStep < totalTheorySteps ? (
          <button className="next-reveal-btn" onClick={() => setTheoryStep(prev => prev + 1)}>
            Next Idea
          </button>
        ) : (
          <div className="completion-badge">✓ Theory Completed</div>
        )}
      </div>

      {/* ── SECTION C: WORKED EXAMPLE ── */}
      <div className="explanation-card example-card">
        <h2 className="section-title">3. Step-by-Step Worked Example</h2>
        <p className="section-subtitle">Problem: Find 15% of 80.</p>

        <div className="example-steps-list">
          {exampleStep >= 1 && (
            <div className="step-item fade-in">
              <div className="step-indicator">Step 1</div>
              <div className="step-content">
                Convert the percentage to a fraction over 100:
                <div className="math-equation">15% = 15 / 100</div>
              </div>
            </div>
          )}
          {exampleStep >= 2 && (
            <div className="step-item fade-in">
              <div className="step-indicator">Step 2</div>
              <div className="step-content">
                Set up the multiplication equation by scaling the whole amount:
                <div className="math-equation">(15 / 100) × 80</div>
              </div>
            </div>
          )}
          {exampleStep >= 3 && (
            <div className="step-item fade-in">
              <div className="step-indicator">Step 3</div>
              <div className="step-content">
                Convert the fraction to a decimal to simplify the math:
                <div className="math-equation">0.15 × 80</div>
              </div>
            </div>
          )}
          {exampleStep >= 4 && (
            <div className="step-item fade-in">
              <div className="step-indicator">Step 4</div>
              <div className="step-content">
                Multiply to get the final answer:
                <div className="math-equation">0.15 × 80 = 12</div>
                <p style={{ marginTop: '8px', color: 'var(--clr-correct)' }}>So, <strong>15% of 80 is 12</strong>.</p>
              </div>
            </div>
          )}
        </div>

        {exampleStep < totalExampleSteps ? (
          <button className="next-reveal-btn" onClick={() => setExampleStep(prev => prev + 1)}>
            Next Step
          </button>
        ) : (
          <div className="completion-badge">✓ Example Completed</div>
        )}
      </div>

      {/* ── SECTION D: CLOSING DESCRIPTIVE PROMPT BOX ── */}
      <div className="explanation-card prompt-card">
        <h2 className="section-title">4. AI Study Assistant Prompt</h2>
        <p className="section-subtitle">Copy this generic prompt and paste it into any AI chat tool (like Gemini or ChatGPT) for further personalized analogies and drills.</p>

        <div className="prompt-box">
          <p className="prompt-content-text">{aiPromptText}</p>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
            {copied ? '✓ Copied!' : '📋 Copy Prompt'}
          </button>
        </div>
      </div>

      {/* ── CONTINUATION TO PRACTICE ── */}
      {isExplanationFinished && (
        <div className="finish-action-block fade-in">
          <p>Well done! You have completed the concept introduction.</p>
          <button className="continue-practice-btn" onClick={onContinueToQuiz}>
            Continue to Practice Quiz
          </button>
        </div>
      )}
    </div>
  );
}
