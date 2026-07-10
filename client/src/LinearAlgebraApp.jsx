import { useEffect, useState, useRef } from 'react'
import './LinearAlgebraApp.css'

const API = import.meta.env.VITE_API_BASE_URL || ''

function textMatches(input, keywords) {
  const t = (input || '').toLowerCase().trim()
  return keywords.some(k => t.includes(k.toLowerCase()))
}

const MODULES = [
  { id: 1, emoji: '\uD83D\uDCC8', title: 'Linear Relations', start: 1, end: 14 },
  { id: 2, emoji: '\uD83D\uDD10', title: 'Matrix Applications', start: 15, end: 21 },
  { id: 3, emoji: '\uD83C\uDF30', title: 'Spaces & Transformations', start: 22, end: 36 },
  { id: 4, emoji: '\uD83C\uDFC6', title: 'Fundamental Theorem', start: 37, end: 45 },
  { id: 5, emoji: '\uD83C\uDF93', title: 'Capstone Review', start: 46, end: 50 },
  { id: 6, emoji: '\uD83C\uDF10', title: 'Real-World Applications', start: 51, end: 56 },
];
const MISSIONS = [
  // Mission 1
  {
    id: 1, emoji: '\uD83D\uDCB0', title: 'Piggy Bank Detectives',
    story: "Ram's pocket money is twice Lakshman's. They save everything. Plot their weekly savings (R, L) and spot the pattern!",
    goal: 'Understand direct proportion - points lie on a line through the origin.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What pattern do you observe in the points (R, L)?',
    options: [
      'They lie on a straight line through the origin',
      'They are scattered randomly',
      'They form a curve',
      'They are all on the x-axis'
    ],
    correct: 0,
    explanation: "Since Ram = 2 x Lakshman, points are (2L,L) = t(2,1). All scalar multiples lie on the same line through the origin!",
    ggbHint: 'Type coordinates like (10,20) and (20,40). Then type: Line((0,0),(10,20)).',
    ggbSteps: [
      'Click in the Input bar at bottom.',
      'Type: (10,20) and press Enter.',
      'Type: (20,40) and press Enter.',
      'Type: Line((0,0),(10,20)) and press Enter.',
      'Both points lie on same line through origin!'
    ],
    quiz: [
      { q: "If Ram's savings = 3x Lakshman's, points (L,R) will be...", options: ['On a line through origin', 'On a curve', 'Random', 'All on y-axis'], correct: 0 },
      { q: 'For (6,3), the ratio R:L is...', options: ['2:1', '1:2', '3:1', '1:1'], correct: 0 },
      { q: 'Will (4,2) lie on same line?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDE95', title: 'Taxi Fare', story: 'Base Rs25 + Rs12/km. Total=12x+25', question: 'Y-intercept?', answer: '25' },
      { emoji: '\uD83D\uDCF1', title: 'Phone Plan', story: 'Rs199/mo + Rs1/min. Total=199+1x', question: 'Slope?', answer: '1' },
      { emoji: '\uD83C\uDFAC', title: 'Netflix', story: 'Rs149 + Rs50/screen', question: 'Total for 2 screens?', answer: '249' },
      { emoji: '\u26FD', title: 'Fuel Cost', story: 'Rs105/litre. Cost=105x', question: 'Why through origin?', answer: 'no base cost' },
      { emoji: '\uD83D\uDCE6', title: 'Shipping', story: 'Rs40 + Rs20/kg', question: 'Cost for 3kg?', answer: '100' },
      { emoji: '\u26A1', title: 'Electricity', story: 'Rs200 + Rs8/unit', question: 'Fixed charge?', answer: '200' },
      { emoji: '\uD83C\uDF33', title: 'Tree Growth', story: '50cm + 20cm/yr', question: 'Height after 5yr?', answer: '150' },
      { emoji: '\uD83C\uDF70', title: 'Bakery', story: 'Rs500 + Rs200/kg cake', question: 'Type of function?', answer: 'linear' },
      { emoji: '\u2708\uFE0F', title: 'Flight', story: 'Rs2500 + Rs5/km', question: 'Distance for Rs3500?', answer: '200' },
    ],
    solveExplanation: 'Ram = 2xLakshman. Points are (2L,L)=L(2,1). Scalar multiples lie on a line through the origin.'
  },
  // Mission 2
  {
    id: 2, emoji: '\uD83D\uDDFA\uFE0F', title: 'Treasure Map',
    story: 'Atul at (0,0). Walk: right 2, up 1 (Bala). right 1, up 1 (Chetan). right 1, up 1 (Divya). Are B,C,D on a line?',
    goal: 'Plot consecutive points and check collinearity.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'Are Bala, Chetan and Divya on a straight line?',
    options: [
      'Yes - on line y = x - 1',
      'Yes - on line y = x + 1',
      'No - not collinear',
      'Yes - on line y = 2x'
    ],
    correct: 0,
    explanation: 'B=(2,1), C=(3,2), D=(4,3). Slope=(2-1)/(3-2)=1. Eqn: y-1=1(x-2) so y=x-1. All collinear!',
    ggbHint: 'Plot points using coordinates. Then type: Line((2,1),(3,2)).',
    ggbSteps: [
      'Type: (0,0) - Atul house (A)',
      'From A: right 2, up 1 -> (2,1) = Bala',
      'From B: right 1, up 1 -> (3,2) = Chetan',
      'From C: right 1, up 1 -> (4,3) = Divya',
      'Type: Line((2,1),(3,2)). Does (4,3) lie on it?'
    ],
    quiz: [
      { q: 'What is slope of line containing B,C,D?', options: ['1', '2', '0.5', '-1'], correct: 0 },
      { q: 'Equation of this line?', options: ['y = x - 1', 'y = x + 1', 'y = 2x', 'y = -x + 3'], correct: 0 },
      { q: 'Next house in pattern?', options: ['(5,4)', '(4,5)', '(5,3)', '(6,4)'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCCD', title: 'GPS Path', story: 'GPS tracks waypoints. If collinear, walking straight!', question: 'What does collinear mean?', answer: 'on same line' },
      { emoji: '\uD83D\uDCD0', title: 'Architecture', story: 'Architects check column center alignment.', question: 'Why?', answer: 'alignment' },
      { emoji: '\uD83D\uDE86', title: 'Railway Tracks', story: 'Sleepers must be collinear for smooth travel.', question: 'What if not?', answer: 'derailment' },
    ],
    solveExplanation: 'B=(2,1), C=(3,2), D=(4,3). Slope=1. All satisfy y=x-1 -> collinear!'
  },
  // Mission 3
  {
    id: 3, emoji: '\uD83C\uDFAF', title: 'Darts at the Origin',
    story: 'Plot y=x, y=2x, y=10x. They all hit the bullseye (0,0)! Why?',
    goal: 'Why lines of form y=ax always pass through origin.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Why do all lines of form y = ax pass through the origin?',
    options: null,
    correct: null,
    expectedKeywords: ['origin', '(0,0)', 'zero', 'no constant', 'b=0', 'intercept is zero'],
    explanation: 'When x=0, y=a*0=0 for ANY a. So (0,0) is always on the line!',
    ggbHint: 'Type each equation. Look at y when x=0.',
    ggbSteps: [
      'Type: y = x and press Enter.',
      'Type: y = 2x and press Enter.',
      'Type: y = 10x and press Enter.',
      'Click on (0,0) - all 3 lines pass through it!',
      'Now type: y = -5x. Does it also pass through (0,0)?'
    ],
    quiz: [
      { q: 'Does y = -3x pass through the origin?', type: 'yesno', correct: 0 },
      { q: 'Does y = 0.5x + 0 pass through origin?', type: 'yesno', correct: 0 },
      { q: 'What about y = x + 1?', options: ['No - constant 1 shifts it up', 'Yes', 'Only when x=1', 'Never'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCB0', title: 'Simple Interest', story: 'Interest = Rate x Principal. Principal=0 -> Interest=0!', question: 'Through origin?', answer: 'yes' },
      { emoji: '\uD83D\uDED2', title: 'Unit Pricing', story: 'Cost = Price x Quantity. Zero qty -> zero cost.', question: 'Through origin?', answer: 'yes' },
      { emoji: '\uD83C\uDFC3', title: 'Distance', story: 'Distance = Speed x Time. At t=0, d=0.', question: 'Slope?', answer: 'speed' },
      { emoji: '\uD83D\uDCA7', title: 'Water Flow', story: 'Volume = Rate x Time. At t=0, empty tank.', question: 'Through origin?', answer: 'yes' },
    ],
    solveExplanation: 'When x=0, y=a(0)=0. So (0,0) satisfies the equation for any a. The origin is always on y=ax!'
  },
  // Mission 4
  {
    id: 4, emoji: '\uD83E\uDDF1', title: 'The Brick Wall',
    story: 'Plot y = 2x + 1. Try to make it pass through origin. Can you? Why not?',
    goal: 'Understand how the constant term shifts the line off the origin.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Why does y = 2x + 1 NOT pass through the origin?',
    options: null,
    correct: null,
    expectedKeywords: ['constant', 'intercept', 'b=1', 'b = 1', '+1', 'when x=0', 'y=1', 'y equals 1', 'shift', 'not zero'],
    explanation: 'When x=0, y = 2(0) + 1 = 1, not 0. So (0,0) is NOT on the line. The +1 shifts the line up by 1.',
    ggbHint: 'Type the equation. Then type (0,0) and see if the line passes through it.',
    ggbSteps: [
      'Type: y = 2x + 1 and press Enter.',
      'Type: (0,0) and press Enter - this is the origin.',
      'Does the line pass through (0,0)? No!',
      'Type: y = 2x and compare. What is different?',
      'The +1 shifts the whole line UP by 1 unit!'
    ],
    quiz: [
      { q: 'What is y when x=0 for y=2x+1?', options: ['1', '0', '2', '-1'], correct: 0 },
      { q: 'Where does y=2x+1 cross the y-axis?', options: ['(0,1)', '(0,0)', '(1,0)', '(0,2)'], correct: 0 },
      { q: 'If we remove the +1, does y=2x pass through origin?', options: ['Yes', 'No', 'Only at x=0', 'Never'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDE95', title: 'Taxi Fare', story: 'Base fare Rs25 + Rs12/km. At x=0, fare=Rs25!', question: 'Y-intercept?', answer: '25' },
      { emoji: '\uD83D\uDCF1', title: 'Phone Plan', story: 'Rs199 + Rs1/min. At x=0, total=199.', question: 'Intercept value?', answer: '199' },
      { emoji: '\u26A1', title: 'Electricity', story: 'Rs200 fixed + Rs8/unit.', question: 'Intercept value?', answer: '200' },
      { emoji: '\uD83C\uDF33', title: 'Tree Height', story: 'Sapling 50cm + 20cm/yr. At year 0, 50cm.', question: 'Through origin?', answer: 'no' },
    ],
    solveExplanation: 'When x=0, y=2(0)+1=1. The constant term is the y-intercept - where the line meets the y-axis.'
  },
  // Mission 5
  {
    id: 5, emoji: '\uD83C\uDFAE', title: 'Game Controller',
    story: 'Create sliders for a and b. Watch the line y = ax + b dance as you drag!',
    goal: 'Explore how slope (a) and intercept (b) change the line visually.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'If you increase the slope a, what happens to the line?',
    options: [
      'The line gets steeper',
      'The line shifts up',
      'The line shifts right',
      'The line gets flatter'
    ],
    correct: 0,
    explanation: 'The slope a controls steepness. Larger a = steeper line. The intercept b controls vertical position.',
    ggbHint: 'Create sliders for a and b, then type y = a*x + b.',
    ggbSteps: [
      'Click the Slider tool (look for it in toolbar).',
      'Create slider named a with min=-5, max=5, step=0.1',
      'Create slider named b with min=-5, max=5, step=0.1',
      'Type: y = a*x + b in the Input bar.',
      'Drag the sliders and watch the line!'
    ],
    quiz: [
      { q: 'What does slider a control?', options: ['Slope/steepness', 'Height/position', 'Both', 'Neither'], correct: 0 },
      { q: 'If b=0, where does the line pass?', options: ['Through origin', 'Above origin', 'Below origin', 'Nowhere'], correct: 0 },
      { q: 'If you set a=0 and b=3, what do you get?', options: ['Horizontal line at y=3', 'Vertical line at x=3', 'Line through origin', 'A curve'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFC3', title: 'Running Speed', story: 'Slope=speed, intercept=starting distance ahead.', question: 'What does slope represent?', answer: 'speed' },
      { emoji: '\uD83D\uDCB5', title: 'Savings', story: 'Slope=save per week, intercept=initial savings.', question: 'Intercept =?', answer: 'initial savings' }
    ],
    solveExplanation: 'Slope a = steepness. Intercept b = where line crosses y-axis. Together they define every line!'
  },
  // Mission 6
  {
    id: 6, emoji: '\uD83E\uDD1D', title: 'Meeting Point',
    story: 'Plot 2x+3y=7 and 3x+4y=10. Where do they meet? This is our first MATRIX problem!',
    goal: 'Connect simultaneous equations to matrix form.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What does the intersection point of the two lines represent?',
    options: [
      'The solution (x,y) that satisfies both equations',
      'The x-intercept of line 1',
      'The y-intercept of line 2',
      'The origin'
    ],
    correct: 0,
    explanation: 'The intersection gives (x,y) that works for BOTH equations. This is exactly the matrix equation Ax=b!',
    ggbHint: 'Type both equations. Use Intersect tool to find where they cross.',
    ggbSteps: [
      'Type: 2x + 3y = 7 in Input bar and press Enter.',
      'Type: 3x + 4y = 10 and press Enter.',
      'Click the Intersect tool (two curves crossing icon).',
      'Click on line 1, then click on line 2.',
      'What point does GeoGebra show?'
    ],
    quiz: [
      { q: 'The matrix for 2x+3y=7, 3x+4y=10 is...', options: ['[[2,3],[3,4]]', '[[2,3],[4,3]]', '[[7,10],[3,4]]', '[[1,0],[0,1]]'], correct: 0 },
      { q: 'Solve 2x+3y=7 and 3x+4y=10. What is (x,y)?', options: ['x=2,y=1', 'x=1,y=2', 'x=3,y=1', 'x=2,y=2'], correct: 0 },
      { q: 'How many solutions does this system have?', options: ['Exactly one', 'Infinite', 'None', 'Two'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDE9C', title: 'Supply-Demand', story: 'Supply: p=2q+1, Demand: p=-3q+20. Intersection = equilibrium!', question: 'What does intersection represent?', answer: 'equilibrium price' },
      { emoji: '\uD83C\uDFE2', title: 'Break-even', story: 'Cost: C=100+20x, Revenue: R=50x. Break-even = intersection.', question: 'Break-even x?', answer: '3.33' },
      { emoji: '\uD83C\uDFD7\uFE0F', title: 'Construction', story: 'Beam1: y=2x+1, Beam2: y=-x+4. Find intersection (x,y) for support.', question: 'Intersection (x,y)?', answer: 'x=1,y=3' },
    ],
    solveExplanation: 'The matrix [[2,3],[3,4]] times vector [x,y] equals vector [7,10]. Intersection solves Ax=b!'
  },
  // Mission 7
  {
    id: 7, emoji: '\uD83D\uDD31', title: 'Time Machine',
    story: 'f(x)=3x+2. If f(a)=17, can you find a? Is it unique? Can you REVERSE any function?',
    goal: 'Understand invertible functions - one input gives one output, and vice versa.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'Find \u03b1 such that f(\u03b1) = 17 for f(x)=3x+2',
    correct: 5,
    tolerance: 0,
    explanation: '3a+2=17 -> 3a=15 -> a=5. Unique! f is invertible because it is one-to-one.',
    ggbHint: 'Type f(x)=3x+2. Then type f(5). Try changing the input.',
    ggbSteps: [
      'Type: f(x) = 3x + 2 and press Enter.',
      'Type: f(5) and press Enter. See what GeoGebra gives.',
      'Now try: Solve(3x+2=17) and press Enter.',
      'GeoGebra shows x=5. That is the unique answer!'
    ],
    quiz: [
      { q: 'Is f(x)=3x+2 invertible? Why?', options: ['Yes - each x gives unique y', 'No - multiple x give same y', 'Yes - it is always positive', 'No - it is not a function'], correct: 0 },
      { q: 'What is the inverse function f\u207b\u00b9(y)?', options: ['(y-2)/3', 'y/3 - 2', '3y+2', 'y-2'], correct: 0 },
      { q: 'If f(a)=17, what is a?', options: ['5', '3', '7', '2'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCC8', title: 'Temperature', story: 'Celsius to Fahrenheit: F=1.8C+32. Invert to get C from F!', question: 'Inverse function gives?', answer: 'Celsius' },
      { emoji: '\uD83D\uDCB0', title: 'Currency', story: 'USD to INR: INR=83xUSD. Inverse: USD=INR/83.', question: 'What does inverse do?', answer: 'reverse conversion' },
      { emoji: '\uD83C\uDFE0', title: 'Tax Calculation', story: 'Tax: T=0.3xIncome. Inverse tells income from tax paid.', question: 'Inverse =?', answer: 'Income = T/0.3' },
    ],
    solveExplanation: '3a+2=17 -> 3a=15 -> a=5. Each x has exactly one y (and vice versa) => invertible!'
  },
  // Mission 8
  {
    id: 8, emoji: '\uD83C\uDFA2', title: 'Parabola Slide',
    story: 'f(x)=x\u00b2-10. What is f(5)? Slide along the parabola and find out!',
    goal: 'Evaluate a function by tracing along its curve in GeoGebra.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'f(x) = x\u00b2 - 10. What is f(5)?',
    correct: 15,
    tolerance: 0,
    explanation: 'f(5) = 5\u00b2 - 10 = 25 - 10 = 15. The point (5,15) lies on the parabola.',
    ggbHint: 'Type f(x)=x^2-10. Then type f(5). Trace along the curve!',
    ggbSteps: [
      'Type: f(x) = x^2 - 10 and press Enter.',
      'Type: (5, f(5)) and press Enter.',
      'GeoGebra plots the point (5,15)!',
      'Click and drag on the curve - watch y change as x moves.'
    ],
    quiz: [
      { q: 'What is f(0) for f(x)=x\u00b2-10?', options: ['-10', '0', '10', '-5'], correct: 0 },
      { q: 'What is f(-5)?', options: ['15', '-10', '25', '-35'], correct: 0 },
      { q: 'Is f(x)=x\u00b2-10 invertible?', options: ['No - two x give same y', 'Yes - it is a function', 'Yes - it is always positive', 'No - it is not a function'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFB0', title: 'Projectile', story: 'Height of ball: h(t)= -5t\u00b2 + 20t. h(2) gives height at t=2s.', question: 'What is height at t=2?', answer: '20' },
      { emoji: '\uD83C\uDFAF', title: 'Profit Curve', story: 'Profit: P(x)= -x\u00b2 + 100x. P(30) = profit at 30 units.', question: 'P(30) =?', answer: '2100' },
      { emoji: '\uD83C\uDF0A', title: 'Tide Height', story: 'Tide: h(t)= 2sin(t) + 5. h(3) = tide height at hour 3.', question: 'What kind of function?', answer: 'trigonometric' },
    ],
    solveExplanation: 'f(5) = 25 - 10 = 15. The point (5,15) is on the parabola. Simple substitution!'
  },
  // Mission 9
  {
    id: 9, emoji: '\uD83C\uDFAF', title: 'Hit the Target',
    story: 'f(x)=x\u00b2-10. f(a)=54. Find a. Can there be TWO answers?',
    goal: 'Discover that inverse of parabola is not a function - two inputs give same output.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Find value(s) of a such that f(a) = 54 for f(x)=x\u00b2-10',
    expectedKeywords: ['8', '-8', '\u00b18', 'plus minus 8', '\u00B1', '8 and -8', 'two'],
    explanation: 'a\u00b2 - 10 = 54 -> a\u00b2 = 64 -> a = 8 or a = -8. TWO values! Not invertible.',
    ggbHint: 'Type: Solve(x^2 - 10 = 54). GeoGebra shows two solutions!',
    ggbSteps: [
      'Type: f(x) = x^2 - 10 and press Enter.',
      'Type: y = 54 and press Enter (horizontal line).',
      'Find intersection of f(x) and y=54 using Intersect tool.',
      'How many intersection points? TWO! Both are answers.'
    ],
    quiz: [
      { q: 'How many values of a satisfy f(a)=54?', options: ['2', '1', '0', 'Infinite'], correct: 0 },
      { q: 'What are the two values?', options: ['8 and -8', '8 and 8', '-8 and -10', '10 and -10'], correct: 0 },
      { q: 'Why are there two answers?', options: ['Parabola is symmetric', 'Function is linear', '54 is a perfect square', 'f is invertible'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCE1', title: 'Signal Strength', story: 'Signal = d\u00b2 - 10. Two positions give same signal strength!', question: 'Why two positions?', answer: 'symmetric' },
      { emoji: '\uD83C\uDFC8', title: 'Projectile Height', story: 'Ball reaches same height twice - going up and coming down.', question: 'Two solutions mean?', answer: 'going up and down' },
    ],
    solveExplanation: 'a\u00b2 = 64 -> a = 8 or a = -8. The parabola is symmetric, so two x give same y.'
  },
  // Mission 10
  {
     id: 10, emoji: '\uD83C\uDFAA', title: 'Roller Coaster',
    story: 'g(x) = x\u00b3 - x\u00b2 - 14x + 2. If g(x) = -22, find x. A cubic can be wild!',
    goal: 'Solve a cubic equation - multiple solutions possible.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Solve g(x) = -22 for g(x) = x\u00b3 - x\u00b2 - 14x + 2',
    expectedKeywords: ['-4', '2', '3', 'three solutions', '-4, 2, 3'],
    explanation: 'x\u00b3 - x\u00b2 - 14x + 2 = -22 -> x\u00b3 - x\u00b2 - 14x + 24 = 0 -> (x+4)(x-2)(x-3) = 0. So x = -4, 2, or 3',
    ggbHint: 'Type: Solve(x^3 - x^2 - 14x + 2 = -22). How many solutions? Three!',
    ggbSteps: [
      'Type: g(x) = x^3 - x^2 - 14x + 2 and press Enter.',
      'Type: y = -22 and press Enter (horizontal line).',
      'Use Intersect tool to find where g(x) and y=-22 meet.',
      'Count the intersections! Three points: x = -4, 2, and 3.'
    ],
    quiz: [
      { q: 'How many intersection points does the cubic have with y=-22?', options: ['3', '1', '2', '0'], correct: 0 },
      { q: 'Can a cubic have more solutions than a quadratic?', options: ['Yes - higher degree, more solutions', 'No - they are same', 'Only if no constant term', 'Only if positive'], correct: 0 },
    ],
    realLife: [
      { emoji: '\uD83C\uDFAE', title: 'Video Game Physics', story: 'Character jump follows cubic path. Same height at 3 different times!', question: 'How many solutions possible?', answer: 'up to 3' },
      { emoji: '\uD83D\uDCC9', title: 'Stock Market', story: 'Stock price as cubic function. Same price at 3 different days.', question: 'Why multiple?', answer: 'cubic shape' },
    ],
    solveExplanation: 'Cubic can have up to 3 real solutions. g(x) = -22 gives x = -4, 2, or 3.'
  },
  // Mission 11
  {
    id: 11, emoji: '\uD83D\uDE80', title: 'Dimensional Portal',
    story: 'What are R, R\u00b2, and R\u00b3? A point lives in different dimensions!',
    goal: 'Understand dimensional spaces - 1D line, 2D plane, 3D space.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'A point needs 2 coordinates in R\u00b2. What does this mean?',
    options: [
      '2D plane - every point is (x,y)',
      '1D line - every point is (x)',
      '3D space - every point is (x,y,z)',
      '4D space - every point is (x,y,z,w)'
    ],
    correct: 0,
    explanation: 'R = 1D number line (one coordinate). R\u00b2 = 2D plane (two coordinates). R\u00b3 = 3D space (three coordinates).',
    ggbHint: 'Plot a point in 2D (R\u00b2) with (x,y). GeoGebra shows both axes.',
    ggbSteps: [
      'Type: (2,3) and press Enter - a point in R\u00b2.',
      'Type: (0,0) - the origin in R\u00b2.',
      'Notice you need TWO numbers to describe any location.',
      'In R (1D), you would need ONE number. In R\u00b3, THREE numbers!'
    ],
    quiz: [
      { q: 'R = ?', options: ['1D number line', '2D plane', '3D space', 'Set of functions'], correct: 0 },
      { q: 'How many coordinates for a point in R\u00b3?', options: ['3', '2', '1', '4'], correct: 0 },
      { q: 'The origin in R\u00b2 is...', options: ['(0,0)', '(0)', '(0,0,0)', '(1,1)'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDF0D', title: 'GPS Coordinates', story: 'Latitude, longitude = point in R\u00b2 on Earth surface.', question: 'What space?', answer: 'R\u00b2' },
      { emoji: '\uD83D\uDCF1', title: 'Phone Location', story: 'Lat, Lon, Altitude = point in R\u00b3.', question: 'Third coordinate?', answer: 'altitude' },
      { emoji: '\uD83C\uDFB5', title: 'Sound Waves', story: 'Frequency, amplitude, time = R\u00b3.', question: 'How many dimensions?', answer: '3' },
    ],
    solveExplanation: 'R = 1D, R\u00b2 = 2D, R\u00b3 = 3D. Higher dimensions = more coordinates to describe position!'
  },
  // Mission 12
  {
    id: 12, emoji: '\uD83C\uDF00', title: 'Transformation Machine',
    story: '\u03c6(x,y) = (2x+3y, 3x+4y). This IS a matrix! Write it as a 2x2 matrix.',
    goal: 'See a function as a matrix transformation.',
    ggbType: 'geometry',
    answerType: 'mcq',
    prompt: 'What matrix represents \u03c6(x,y) = (2x+3y, 3x+4y)?',
    options: [
      '[[2,3],[3,4]]',
      '[[2,3],[4,3]]',
      '[[3,2],[4,3]]',
      '[[2,4],[3,3]]'
    ],
    correct: 0,
    explanation: '\u03c6(x,y) = (2x+3y, 3x+4y). The coefficient matrix is [[2,3],[3,4]]. First row gives x\u2019, second gives y\u2019.',
    ggbHint: 'Plot a vector, then apply the transformation. GeoGebra can do matrix multiplication!',
    ggbSteps: [
      'Type: M = {{2,3},{3,4}} and press Enter.',
      'Type: v = (1,2) and press Enter.',
      'Type: M*v and press Enter.',
      'GeoGebra shows the transformed vector!'
    ],
    quiz: [
      { q: 'What is \u03c6(1,0)?', options: ['(2,3)', '(3,4)', '(1,0)', '(0,0)'], correct: 0 },
      { q: 'What is \u03c6(0,1)?', options: ['(3,4)', '(2,3)', '(0,1)', '(1,0)'], correct: 0 },
      { q: 'Why study matrices as functions?', options: ['Unified framework for transformations', 'They are easier to compute', 'They look nice', 'No reason'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDDA5', title: 'Image Processing', story: 'Each pixel (r,g,b) transformed by a matrix for filters!', question: 'What does matrix do?', answer: 'transforms colors' },
      { emoji: '\uD83C\uDFA8', title: 'Computer Graphics', story: 'Rotate, scale, shear objects using 3x3 matrices.', question: 'What transformation?', answer: 'rotate' },
      { emoji: '\uD83E\uDD16', title: 'AI/ML', story: 'Neural network layers are just matrix multiplications!', question: 'Layers =?', answer: 'matrix transforms' },
    ],
    solveExplanation: '\u03c6(x,y) = (2x+3y, 3x+4y). First row coefficients: [2,3]. Second row: [3,4]. Matrix = [[2,3],[3,4]]!'
  },
  // Mission 13
  {
    id: 13, emoji: '\uD83E\uDDE9', title: 'Jigsaw Puzzle',
    story: 'Can you REVERSE the transformation? If \u03c6(x,y) = (2x+3y, 3x+4y), can you always find (x,y) from the output?',
    goal: 'Check if a matrix is invertible by checking if its determinant is non-zero.',
    ggbType: 'geometry',
    answerType: 'mcq',
    prompt: 'Is the transformation \u03c6 invertible? (determinant = 2*4 - 3*3 = -1)',
    options: [
      'Yes - determinant = -1, non-zero so invertible',
      'No - determinant = -1, negative so not invertible',
      'Yes - determinant = 1',
      'No - determinant = 0'
    ],
    correct: 0,
    explanation: 'det = 2*4 - 3*3 = 8 - 9 = -1. Non-zero determinant means the matrix is invertible!',
    ggbHint: 'Compute the determinant in GeoGebra. Then try to invert the matrix.',
    ggbSteps: [
      'Type: M = {{2,3},{3,4}} and press Enter.',
      'Type: Determinant(M) and press Enter. Result = -1',
      'Type: M^(-1) and press Enter. This is the inverse!',
      'A non-zero determinant means you can reverse the transformation.'
    ],
    quiz: [
      { q: 'What is det([[1,2],[2,4]])?', options: ['0', '1', '-2', '4'], correct: 0 },
      { q: 'A zero determinant means...', options: ['Not invertible (information lost)', 'Perfectly invertible', 'Determinant is infinite', 'Matrix is identity'], correct: 0 },
      { q: 'Why is inverse important?', options: ['Solves Ax=b by x=A\u207b\u00b9b', 'Makes matrix bigger', 'Changes dimension', 'No practical use'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFC8', title: 'Robotics', story: 'Robot arm needs to reverse its transformation to find joint angles from position.', question: 'What does inverse give?', answer: 'joint angles' },
      { emoji: '\uD83D\uDCCA', title: 'Data Analysis', story: 'PCA uses eigenvectors to compress data. Invert to reconstruct.', question: 'Compression needs?', answer: 'invertibility' },
    ],
    solveExplanation: 'det = ad - bc = 2*4 - 3*3 = -1. Non-zero => invertible. A\u207b\u00b9 exists!'
  },
  // Mission 14
  {
    id: 14, emoji: '\uD83D\uDC7B', title: 'The Vanishing Act',
    story: 'Matrix [[1,2],[2,4]] has determinant ZERO. Which vectors VANISH (map to origin)?',
    goal: 'Find the null space / kernel of a non-invertible matrix.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Find a non-zero vector (x,y) such that [[1,2],[2,4]]*(x,y) = (0,0)',
    expectedKeywords: ['2,-1', '2, -1', '(2,-1)', '(2, -1)', '(-2,1)', '(-2, 1)', 'x=-2y', 'x=2y', 't(2,-1)'],
    explanation: 'x+2y=0 and 2x+4y=0. Both say x=-2y. So (x,y) = t*(-2,1). All vectors on this line map to origin!',
    ggbHint: 'Type M={{1,2},{2,4}}. Det(M) is 0. Find v such that M*v=(0,0).',
    ggbSteps: [
      'Type: M = {{1,2},{2,4}} and press Enter.',
      'Type: Determinant(M) - it is ZERO!',
      'Type: v = (2, -1) and press Enter.',
      'Type: M*v and press Enter. Result: (0,0)!',
      'These vectors form the KERNEL or NULL SPACE.'
    ],
    quiz: [
      { q: 'What does det=0 mean?', options: ['Matrix is singular - info lost', 'Matrix is perfect', 'Determinant is undefined', 'Matrix is identity'], correct: 0 },
      { q: 'The set of vectors mapping to origin is called...', options: ['Kernel/Null space', 'Range/Image', 'Column space', 'Row space'], correct: 0 },
      { q: 'How many vectors map to origin?', options: ['Infinite (a whole line)', 'Only the zero vector', 'Exactly one', 'Two'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Image Blur', story: 'Blurry image = original passed through singular matrix. Info lost!', question: 'Can we perfectly restore?', answer: 'no - info lost' },
      { emoji: '\uD83D\uDD0A', title: 'Audio Compression', story: 'Lossy compression = singular transform. Some info vanishes.', question: 'What vanishes?', answer: 'null space info' },
      { emoji: '\uD83D\uDCE6', title: 'Network Routing', story: 'Some traffic patterns cancel out at a node (kernel).', question: 'What does kernel represent?', answer: 'vanishing flows' },
    ],
    solveExplanation: 'det=0 -> singular. [[1,2],[2,4]]*(x,y)=(0,0) -> x+2y=0 -> x=-2y. Line of vectors map to origin!'
  },
  // Mission 15
  {
    id: 15, emoji: '\uD83D\uDD10', title: 'Hill Cipher',
    story: "A=0, B=1, ..., Z=25. SUDARSHANA = 18,20,3,0,17,18,7,0,13,0. Encrypt with matrix [[2,3],[3,4]] → pairs (18,20)→(96,134), (3,0)→(6,9), (17,18)→(88,123). Decrypt using the inverse matrix!",
    goal: 'Use matrix multiplication and inverses for encryption/decryption.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'How do you decrypt ciphertext pairs back to the original message?',
    options: [
      'Multiply each pair by inverse of [[2,3],[3,4]]',
      'Divide each encrypted number by 2',
      'Transpose the encrypted pairs',
      'Plot the points and find the line'
    ],
    correct: 0,
    explanation: 'Decryption = multiply each ciphertext pair by the inverse matrix. The inverse of [[2,3],[3,4]] is [[4,-3],[-3,2]] (mod 26 arithmetic).',
    ggbHint: 'Type M={{2,3},{3,4}}. Multiply M*{{18},{20}} to get the first encrypted pair. Find inverse with Invert[M].',
    ggbSteps: [
      'Type: M = {{2,3},{3,4}} and press Enter.',
      'Type: M * {{18},{20}} and press Enter → (96,134).',
      'Type: M * {{3},{0}} → (6,9). Continue for all pairs.',
      'Type: Invert[M] to get the decryption key.',
      'Multiply inverse by each encrypted pair to recover letters!'
    ],
    quiz: [
      { q: 'Encrypted value of (S,U)=(18,20) under [[2,3],[3,4]]?', options: ['(96,134)', '(88,123)', '(6,9)', '(14,21)'], correct: 0 },
      { q: 'What operation decrypts Hill Cipher?', options: ['Inverse matrix multiplication', 'Transpose', 'Addition', 'Determinant'], correct: 0 },
      { q: 'Does the encryption matrix need to be invertible?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF1', title: 'Messaging Apps', story: 'WhatsApp uses matrix-based encryption to secure messages.', question: 'What matrix operation encrypts?', answer: 'matrix multiplication' },
      { emoji: '\uD83C\uDF10', title: 'Online Banking', story: 'Banks encrypt transactions using linear transformations.', question: 'Rows = ?', answer: 'encrypted output' },
      { emoji: '\uD83D\uDD75\uFE0F', title: 'Military Comms', story: 'Hill Cipher was used for secure battlefield communication in WWII.', question: 'Why inverse needed?', answer: 'to decrypt' },
    ],
    solveExplanation: 'M={{2,3},{3,4}}. Encrypt: M * [letter pair]. Decrypt: M_inverse * [encrypted pair]. Must be invertible!'
  },
  // Mission 16
  {
    id: 16, emoji: '\u2615', title: "Baker's Cafe",
    story: 'Table1: 3 adults + 1 child = \u20B91200. Table2: 1 adult + 2 children = \u20B91000. Can you find cost per adult (A) and child (C)? Then try: 3A+1C=1200, 1A+2C=1000, 1A+1C=900 — overdetermined! No exact solution — just minimize error.',
    goal: 'Solve systems with more equations than unknowns (least squares idea).',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What happens when you have 3 equations for 2 unknowns?',
    options: [
      'No exact solution — system is overdetermined',
      'Always exact solution',
      'Infinitely many solutions',
      'Exactly one solution'
    ],
    correct: 0,
    explanation: '3 equations, 2 unknowns = overdetermined. The extra equation may conflict. No exact (A,C) satisfies all three. Can only minimize error (least squares).',
    ggbHint: 'Plot all three lines. Do they intersect at one point? Type: Solve({3A+1C=1200,1A+2C=1000,1A+1C=900},{A,C})',
    ggbSteps: [
      'Type: 3x + y = 1200 and press Enter.',
      'Type: x + 2y = 1000 and press Enter.',
      'Type: x + y = 900 and press Enter.',
      'Observe — no single intersection for all three!',
      'The system has NO exact solution.'
    ],
    quiz: [
      { q: 'Solve: 3A+1C=1200, 1A+2C=1000', options: ['A=280, C=360', 'A=200, C=400', 'A=300, C=300', 'A=250, C=350'], correct: 0 },
      { q: 'With 3 equations & 2 unknowns, the system is...', options: ['Overdetermined', 'Underdetermined', 'Square', 'Identity'], correct: 0 },
      { q: 'Can we find an exact solution for overdetermined systems?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCC8', title: 'Business Forecasting', story: 'Use past sales data (many points) to estimate trend line (few params).', question: 'More data points than parameters?', answer: 'overdetermined' },
      { emoji: '\uD83D\uDCF1', title: 'GPS Positioning', story: 'GPS uses 4+ satellite signals to pinpoint 3D location.', question: 'Why extra equations?', answer: 'reduce error' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Medical Imaging', story: 'CT scans take many X-ray measurements to reconstruct a single image.', question: 'What math finds best fit?', answer: 'least squares' },
    ],
    solveExplanation: '3A+1C=1200, 1A+2C=1000 ⇒ A=280, C=360. Adding 1A+1C=900 gives conflict — no exact solution. Overdetermined systems minimize error instead.'
  },
  // Mission 17
  {
    id: 17, emoji: '\uD83D\uDD04', title: 'Markov Chain',
    story: 'City (C) and Suburb (S): each year 90% stay in C, 10% move to S; 80% stay in S, 20% move to C. From 1000 people in City, what is long-run distribution? Keep multiplying by transition matrix [[0.9,0.2],[0.1,0.8]]!',
    goal: 'Model state transitions using matrices and find steady state.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'After many years, what fraction of people end up in the City?',
    correct: 0.667,
    tolerance: 0.01,
    explanation: 'Steady state: M*v = v. Solve [[0.9,0.2],[0.1,0.8]]*[c,s]=[c,s] with c+s=1. City stabilizes at 2/3 ≈ 66.7%, Suburb at 1/3 ≈ 33.3%.',
    ggbHint: 'Type: M={{0.9,0.2},{0.1,0.8}}. Multiply M*{1000,0} repeatedly. Watch the values converge!',
    ggbSteps: [
      'Type: M = {{0.9,0.2},{0.1,0.8}}.',
      'Type: {1000, 0} for starting in City.',
      'Type: M * {1000, 0} → {900, 100} after year 1.',
      'Keep multiplying: M*ans each time.',
      'Values converge to ~667 City, ~333 Suburb!'
    ],
    quiz: [
      { q: 'What is the steady state City fraction?', options: ['66.7%', '50%', '80%', '90%'], correct: 0 },
      { q: 'What matrix equation defines steady state?', options: ['M*v = v', 'M*v = 0', 'M*v = 1', 'v*M = 0'], correct: 0 },
      { q: 'Does every Markov chain reach a steady state?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFD9\uFE0F', title: 'Urban Planning', story: 'Predict city-suburb population shifts using transition matrices.', question: 'Long-run population?', answer: 'steady state' },
      { emoji: '\uD83D\uDCC8', title: 'Stock Market', story: 'Markov models predict bull/bear market transitions over time.', question: 'What does steady state represent?', answer: 'long-term probability' },
      { emoji: '\uD83E\uDDEA', title: 'Genetics', story: 'Gene frequency changes across generations follow Markov chains.', question: 'What is transition matrix?', answer: 'mutation rates' },
    ],
    solveExplanation: 'M = [[0.9,0.2],[0.1,0.8]]. Repeated multiplication converges to eigenvector with eigenvalue 1: City ~ 66.7%, Suburb ~ 33.3%.'
  },
  // Mission 18
  {
    id: 18, emoji: '\uD83E\uDD14', title: 'Guess the Solution',
    story: "Matrix form of overdetermined system: [[3,1],[1,2],[1,1]] * [A,C] = [1200,1000,900]. Can you guess A and C that come close? Try A=280, C=360 — error in 3rd equation is 280+360=640 ≠ 900. Keep guessing to minimize the total error!",
    goal: 'Understand overdetermined systems — more equations than unknowns, no exact solution.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'For A=280, C=360, what is 1A+1C? (The error vs 900)',
    correct: 640,
    tolerance: 1,
    explanation: '1A+1C = 280+360 = 640, but the third equation says it should be 900. Error = 260. With 3 equations and 2 unknowns, no (A,C) satisfies all three exactly.',
    ggbHint: 'Type: 3x+y=1200, x+2y=1000, x+y=900. No single intersection! Try {{3,1},{1,2},{1,1}}*{{280},{360}} in CAS.',
    ggbSteps: [
      'Type: 3x + y = 1200 and press Enter.',
      'Type: x + 2y = 1000 and press Enter.',
      'Type: x + y = 900 and press Enter.',
      'See how all three do NOT meet at one point.',
      'Try different (x,y) values — you can only minimize error!'
    ],
    quiz: [
      { q: 'How many rows in the matrix [[3,1],[1,2],[1,1]]?', options: ['3', '2', '1', '4'], correct: 0 },
      { q: 'Can 3 equations with 2 unknowns have an exact solution?', type: 'yesno', correct: 1 },
      { q: 'What do we call a system with more equations than unknowns?', options: ['Overdetermined', 'Underdetermined', 'Square', 'Singular'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCC9', title: 'Weather Prediction', story: 'Thousands of data points to estimate just a few weather parameters.', question: 'More equations than unknowns?', answer: 'overdetermined' },
      { emoji: '\uD83D\uDCF7', title: 'Photo Enhancement', story: 'Millions of pixels adjusted using few filter parameters.', question: 'What minimizes error?', answer: 'least squares' },
      { emoji: '\uD83C\uDFC0', title: 'Sports Analytics', story: 'Player stats from many games to estimate a few skill ratings.', question: 'Can all stats fit exactly?', answer: 'no overdetermined' },
    ],
    solveExplanation: '3 equations, 2 unknowns → overdetermined. No exact (A,C) works for all three. 1A+1C = 640 ≠ 900. Minimize error instead.'
  },
  // Mission 19
  {
    id: 19, emoji: '\uD83E\uDDE9', title: 'Why No Solution?',
    story: "Three lines: 3A+1C=1200, 1A+2C=1000, 1A+1C=900. In a plane, two lines intersect at one point. A third line may not pass through that point. Each equation is a constraint — too many constraints, no perfect fit! Matrix: [[3,1],[1,2],[1,1]]*[A,C] = [1200,1000,900].",
    goal: 'See geometrically why overdetermined linear systems have no exact solution.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'Why can three lines in a plane NOT all intersect at a single point?',
    options: [
      'A third line may miss the intersection of the first two',
      'Lines are always parallel',
      'Three lines always meet at one point',
      'Only curved lines can intersect'
    ],
    correct: 0,
    explanation: 'Two lines intersect at exactly one point (unless parallel). A third random line almost never passes through that same point. So 3 equations in 2 unknowns are usually inconsistent — no solution exists.',
    ggbHint: 'Plot all three lines. The first two cross at one point. Does the third pass through it?',
    ggbSteps: [
      'Type: 3x + y = 1200.',
      'Type: x + 2y = 1000.',
      'Find their intersection.',
      'Type: x + y = 900.',
      'Does the third line pass through the intersection? No!'
    ],
    quiz: [
      { q: 'Two non-parallel lines in a plane intersect at...', options: ['Exactly one point', 'No points', 'Infinite points', 'Two points'], correct: 0 },
      { q: 'A third line usually ___ through that intersection.', options: ['does NOT pass', 'always passes', 'is parallel to', 'is the same as'], correct: 0 },
      { q: 'Can an overdetermined system have an exact solution?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Engineering Design', story: 'Bridge must satisfy strength, cost, and weight constraints — often conflicting.', question: 'What do engineers minimize?', answer: 'error' },
      { emoji: '\uD83D\uDCCB', title: 'Survey Data', story: 'Multiple survey questions to estimate few traits — no perfect fit.', question: 'Overdetermined means?', answer: 'more equations than unknowns' },
      { emoji: '\uD83C\uDFAF', title: 'Target Practice', story: 'Hitting multiple targets with one shot is impossible — like satisfying all equations.', question: 'What does one shot represent?', answer: 'one solution attempt' },
    ],
    solveExplanation: 'Two lines intersect at a point. A third line is unlikely to pass through that same point. → 3 equations in 2 unknowns: usually no solution.'
  },
  // Mission 20
  {
    id: 20, emoji: '\uD83D\uDE0A', title: 'Mood Markov Chain',
    story: 'Two states: Happy (H) and Stressed (S). Transition matrix [[0.3,0.7],[0.5,0.5]]. If 1000 people start Happy, multiply repeatedly: after 1 step → 300 Happy, 700 Stressed; after 2 steps → 440 H, 560 S; after 3 steps → 412 H, 588 S. Eventually converges to ~417 H, ~583 S no matter where you start!',
    goal: 'Compute steady-state distribution of a 2-state Markov chain.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'How many people end up Happy at steady state? (starting with 1000)',
    correct: 417,
    tolerance: 5,
    explanation: 'Steady state: π*P = π. Solve [h,s]*[[0.3,0.7],[0.5,0.5]] = [h,s] with h+s=1. h=0.3h+0.5s → 0.7h=0.5s → h/s=5/7. So h=5/12≈0.4167 → 417 people.',
    ggbHint: 'Type M={{0.3,0.7},{0.5,0.5}}. Multiply M*{1000,0} repeatedly. Values converge to {417,583}!',
    ggbSteps: [
      'Type: M = {{0.3,0.7},{0.5,0.5}} and press Enter.',
      'Type: {1000, 0} for 1000 Happy people initially.',
      'Type: M * {1000, 0} → {300, 700} after step 1.',
      'Keep pressing Enter to repeat M*ans.',
      'After many steps: {417, 583} — steady state!'
    ],
    quiz: [
      { q: 'What is the steady-state fraction of Happy people?', options: ['5/12 ≈ 41.7%', '1/2 = 50%', '7/12 ≈ 58.3%', '1/3 ≈ 33.3%'], correct: 0 },
      { q: 'Does the steady state depend on the initial state?', type: 'yesno', correct: 1 },
      { q: 'Each row of the transition matrix must sum to...', options: ['1', '0', '-1', '0.5'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCCA', title: 'Employee Mood', story: 'Company tracks Happy/Stressed transitions monthly to predict workforce morale.', question: 'Long-run Happy%?', answer: '41.7%' },
      { emoji: '\uD83D\uDCF1', title: 'App Users', story: 'Users switch between Free and Premium plans each month.', question: 'What is steady state?', answer: 'long-term distribution' },
      { emoji: '\uD83D\uDCB1', title: 'Stock Market', story: 'Bull vs Bear market transitions follow a Markov chain.', question: 'Rows sum to?', answer: '1' },
    ],
    solveExplanation: 'πP=π → [h,s]*[[0.3,0.7],[0.5,0.5]]=[h,s] with h+s=1. Solving: h=5/12≈0.417, s=7/12≈0.583. Out of 1000: ~417 Happy, ~583 Stressed.'
  },
  // Mission 21
  {
     id: 21, emoji: '\uD83C\uDFD9\uFE0F', title: '3-State Location Chain',
    story: 'Three locations: Park (P), Apartment (A), Restaurant (R). Transition matrix (columns sum to 1): [[0.5,0.5,0.1],[0.3,0.1,0.8],[0.2,0.4,0.1]]. If 1000 people start in Park, multiply repeatedly until values stabilize. Steady state ~= 402 in Park, 353 in Apartment, 246 in Restaurant.',
    goal: 'Compute steady-state distribution of a 3-state Markov chain.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'How many people end up in Apartment at steady state? (starting with 1000 in Park)',
    correct: 353,
    tolerance: 5,
    explanation: 'Steady state: M*v = v. Solve [[0.5,0.5,0.1],[0.3,0.1,0.8],[0.2,0.4,0.1]]*[p,a,r]=[p,a,r] with p+a+r=1000. From eq1: p = a + 0.2r. Sub into eq2: a = 1.433r, so p = 1.633r. Then p+a+r = 4.067r = 1000 → r=246, a=353, p=401. ~402 Park, ~353 Apartment, ~246 Restaurant.',
    ggbHint: 'Type M={{0.5,0.5,0.1},{0.3,0.1,0.8},{0.2,0.4,0.1}}. Multiply M*{1000,0,0} repeatedly to see convergence!',
    ggbSteps: [
      'Type: M = {{0.5,0.5,0.1},{0.3,0.1,0.8},{0.2,0.4,0.1}}.',
      'Type: {1000, 0, 0} — all 1000 start in Park.',
      'Type: M * {1000, 0, 0} = {500, 300, 200} for step 1.',
      'Keep multiplying: M * ans repeatedly.',
      'Values converge to ~{402, 353, 246}!'
    ],
    quiz: [
      { q: 'What is the steady-state fraction in Apartment?', options: ['353/1000 ≈ 35.3%', '402/1000 ≈ 40.2%', '246/1000 ≈ 24.6%', '1/3 ≈ 33.3%'], correct: 0 },
      { q: 'How many states does this Markov chain have?', options: ['3', '2', '4', '1'], correct: 0 },
      { q: 'Is the steady state independent of the starting state?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFD4\uFE0F', title: 'Urban Mobility', story: 'People move between Park, Apartment, and Restaurant daily.', question: 'Long-run Restaurant%?', answer: '24.6%' },
      { emoji: '\uD83D\uDED2', title: 'Shopping Patterns', story: 'Customers move between Online, Store A, and Store B.', question: 'What does steady state mean?', answer: 'stable market share' },
      { emoji: '\uD83C\uDF0D', title: 'Epidemiology', story: 'Disease spreads between Susceptible, Infected, Recovered states.', question: 'Markov model predicts?', answer: 'long-term infection rate' },
    ],
    solveExplanation: 'M=[[0.5,0.5,0.1],[0.3,0.1,0.8],[0.2,0.4,0.1]]. Solving M*v=v with p+a+r=1000: a=353, p=402, r=246. Steady state converges regardless of start.'
  },
  // Mission 22
  {
    id: 22, emoji: '\u27A1', title: 'Perpendicular Vectors 2D',
    story: 'Draw vector [1,1]. Find all vectors [x,y] perpendicular to it: [1,1]·[x,y]=0 → x+y=0 → y=-x. Now generalize: replace [1,1] with [a,b]. For any [a,b], perpendicular vectors satisfy ax+by=0 — a whole line through origin!',
    goal: 'Find perpendicular vectors via dot product = 0.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the set of all vectors perpendicular to [1,1]?',
    options: [
      'Line y = -x',
      'Line y = x',
      'The origin only',
      'The whole plane'
    ],
    correct: 0,
    explanation: '[1,1]·[x,y]=0 means x+y=0, so y=-x. This is a line through origin. For any [a,b], the perpendicular set is the line ax+by=0.',
    ggbHint: 'Type: v = (1,1). Then type: w = (x,y). Perpendicular when Dot(v,w)=0. Solve for y.',
    ggbSteps: [
      'Type: v = (1,1) and press Enter.',
      'Type: w = (x,y) and press Enter.',
      'Type: Dot(v,w)=0 → x + y = 0.',
      'So y = -x — all vectors on this line!',
      'Try with v = (a,b) — get ax + by = 0.'
    ],
    quiz: [
      { q: 'Dot product of perpendicular vectors is...', options: ['0', '1', '-1', 'Infinity'], correct: 0 },
      { q: 'Set of vectors perpendicular to [a,b] is...', options: ['Line ax+by=0', 'Line bx+ay=0', 'Point (0,0)', 'Plane'], correct: 0 },
      { q: 'Is the zero vector perpendicular to every vector?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Force Analysis', story: 'Perpendicular forces act independently — their dot product is zero.', question: 'Dot product of perpendicular forces?', answer: '0' },
      { emoji: '\uD83D\uDCF1', title: 'Signal Processing', story: 'Orthogonal signals don\'t interfere — used in WiFi and 5G.', question: 'Orthogonal means?', answer: 'perpendicular' },
      { emoji: '\uD83E\uDD16', title: 'AI & ML', story: 'Word vectors use orthogonality to represent unrelated concepts.', question: 'Unrelated vectors are?', answer: 'perpendicular' },
    ],
    solveExplanation: 'Dot product [1,1]·[x,y]=x+y=0 → y=-x. All perpendicular vectors lie on this line through origin.'
  },
  // Mission 23
  {
    id: 23, emoji: '\uF8FF', title: '3D Perpendicular & Lines',
    story: 'Find (x,y,z) satisfying [1,2,3]·[x,y,z]=0 → x+2y+3z=0 (a plane through origin). Now plot T={α(1,2,1)} — a line through origin. Plot S={β(2,7,3)} — another line. Both lines lie in the plane x+2y+3z=0? Check: (1,2,1)·(1,2,3)=1+4+3=8≠0 — no! T and S are NOT in that plane.',
    goal: 'Explore 3D perpendicular sets (planes) and parametric lines.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'What geometric shape is the set { (x,y,z) : x+2y+3z=0 }?',
    expectedKeywords: ['plane', 'plane through origin', '2d plane'],
    explanation: 'One linear equation in 3 unknowns defines a plane through the origin. T is a line in direction (1,2,1), S is a line in direction (2,7,3).',
    ggbHint: 'Type: x+2y+3z=0 to see the plane. Type: (1,2,1) to plot a point on T. Type: (2,7,3) for S.',
    ggbSteps: [
      'Type: x + 2y + 3z = 0 — see the plane.',
      'Type: (1,2,1) for a point on T line.',
      'Type: (2,7,3) for a point on S line.',
      'These points do NOT lie on the plane!',
      'T and S are lines through the origin in different directions.'
    ],
    quiz: [
      { q: 'Equation x+2y+3z=0 defines a...', options: ['Plane through origin', 'Line through origin', 'Point', 'Sphere'], correct: 0 },
      { q: 'T={α(1,2,1)} is a...', options: ['Line through origin', 'Plane', 'Point', 'Circle'], correct: 0 },
      { q: 'Does (2,7,3) satisfy x+2y+3z=0?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\u2708\uFE0F', title: 'Flight Paths', story: 'A plane in 3D space models possible flight routes with one constraint.', question: 'How many constraints for a plane?', answer: 'one equation' },
      { emoji: '\uD83C\uDFD0\uFE0F', title: 'Robotics', story: 'Robot arm positions satisfying one constraint form a plane.', question: 'Degrees of freedom?', answer: '2' },
      { emoji: '\uD83D\uDDFA\uFE0F', title: 'GPS', story: 'One satellite gives a sphere; intersection of spheres gives position.', question: 'How many satellites for 3D?', answer: '4' },
    ],
    solveExplanation: '[1,2,3]·[x,y,z]=0 → x+2y+3z=0 → a plane through origin. T and S are lines through origin (1D subspaces).'
  },
  // Mission 24
  {
    id: 24, emoji: '\uD83C\uDFD9\uFE0F', title: 'Span & Null Space',
    story: 'W = {α(1,2,1)+β(2,7,3)} — a plane spanned by two vectors. Now find all (x,y,z) such that EVERY w∈W satisfies w·[x,y,z]=0. That means: (1,2,1)·(x,y,z)=0 AND (2,7,3)·(x,y,z)=0. Solve: x+2y+z=0, 2x+7y+3z=0 → x=y, z=-3x → (x,y,z)=t(1,1,-3). This is the NULL SPACE of the plane!',
    goal: 'Find the null space (perpendicular set) of a 2D plane in 3D.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'The set of vectors perpendicular to EVERY vector in W is a...',
    options: [
      'Line through origin',
      'Plane through origin',
      'Point (origin)',
      'The whole space'
    ],
    correct: 0,
    explanation: 'Two independent equations in 3 unknowns give a 1D solution = line through origin. Direction: (1,1,-3). This line is the null space — perpendicular to the entire plane W.',
    ggbHint: 'Type: plane = z = -x-2y. Then type: (1,1,-3). Is it perpendicular to (1,2,1) and (2,7,3)?',
    ggbSteps: [
      'Type: x+2y+z=0 and 2x+7y+3z=0.',
      'Solve: from first, z = -x-2y.',
      'Sub in second: 2x+7y+3(-x-2y)=0 → -x+y=0 → x=y.',
      'Then z = -x-2x = -3x.',
      'So (x,y,z) = t*(1,1,-3) — a LINE!'
    ],
    quiz: [
      { q: 'Two equations in 3 unknowns give how many free variables?', options: ['1', '0', '2', '3'], correct: 0 },
      { q: 'Null space direction of plane W?', options: ['(1,1,-3)', '(1,2,1)', '(2,7,3)', '(0,0,1)'], correct: 0 },
      { q: 'Is the null space perpendicular to the plane?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE1\uFE0F', title: 'Computer Graphics', story: 'Camera view direction is perpendicular to the image plane (null space).', question: 'View direction = ?', answer: 'null space of plane' },
      { emoji: '\uD83D\uDCC8', title: 'Data Science', story: 'PCA finds directions (null space) of minimum variance in data.', question: 'PCA finds?', answer: 'perpendicular directions' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Structural Engineering', story: 'Forces perpendicular to a beam don\'t affect its length.', question: 'Perpendicular force does?', answer: 'no work' },
    ],
    solveExplanation: 'W = span{(1,2,1),(2,7,3)}. Perpendicular condition: (1,2,1)·(x,y,z)=0 and (2,7,3)·(x,y,z)=0. Solving: x=y, z=-3x → line t*(1,1,-3).'
  },
  // Mission 25
  {
    id: 25, emoji: '\uD83D\uDCCA', title: 'Matrix Null Space',
    story: "A = [[1,2,3],[4,5,6],[7,8,9]]. Find all (x,y,z) with A*(x,y,z)=0. This means: x+2y+3z=0, 4x+5y+6z=0, 7x+8y+9z=0. Row3 = Row2 - Row1 (redundant!). Solve first two: x+2y+3z=0, 4x+5y+6z=0 → subtract 4×first from second: -3y-6z=0 → y=-2z, then x=z. So (x,y,z)=t*(1,-2,1)! Connection: this is the NULL SPACE of A — just like all previous perpendicular questions!",
    goal: 'Compute the null space of a 3×3 singular matrix.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Find a non-zero vector (x,y,z) satisfying A*(x,y,z) = (0,0,0)',
    expectedKeywords: ['(1,-2,1)', '1,-2,1', '(1, -2, 1)', 't*(1,-2,1)', 't(1,-2,1)'],
    explanation: 'A has rank 2 (row3 = row2 - row1), so null space is 1D. Solving gives (x,y,z)=t*(1,-2,1). This is the same idea as previous questions: find vectors orthogonal to all rows.',
    ggbHint: 'Type M={{1,2,3},{4,5,6},{7,8,9}}. Find Det(M) — it\'s 0! Solve M*{x,y,z}={0,0,0}.',
    ggbSteps: [
      'Type: M = {{1,2,3},{4,5,6},{7,8,9}}.',
      'Type: Determinant(M) — ZERO! Matrix is singular.',
      'Type: Solve(M*{x,y,z}={0,0,0},{x,y,z}).',
      'Result: {x=z, y=-2z} — one free variable.',
      'So (x,y,z) = t*(1,-2,1) — a line!'
    ],
    quiz: [
      { q: 'Rank of [[1,2,3],[4,5,6],[7,8,9]]?', options: ['2', '1', '3', '0'], correct: 0 },
      { q: 'Null space direction vector?', options: ['(1,-2,1)', '(1,2,3)', '(1,1,-3)', '(1,2,1)'], correct: 0 },
      { q: 'Is null space perpendicular to every row of A?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Image Compression', story: 'Null space represents image details lost during compression.', question: 'Lost info = ?', answer: 'null space components' },
      { emoji: '\uD83D\uDD0A', title: 'Audio Filtering', story: 'Noise removal = projecting audio onto subspace orthogonal to null space.', question: 'Null space contains?', answer: 'filtered-out noise' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Vibration Analysis', story: 'Null space of stiffness matrix = modes of free vibration.', question: 'Null space = ?', answer: 'zero-energy modes' },
    ],
    solveExplanation: 'A=[[1,2,3],[4,5,6],[7,8,9]] has rank 2. Solving Ax=0: x=z, y=-2z → null space = t*(1,-2,1). Perpendicular to all rows!'
  },
  // Mission 26
  {
    id: 26, emoji: '\uD83D\uDD2D', title: 'Three Subspaces',
    story: "A = [[1,2,3],[4,5,6],[7,8,9]]. Three sets: \u211C={α(1,2,3)+β(4,5,6)+γ(7,8,9)} = ROW SPACE (span of rows). C={α(1,4,7)+β(2,5,8)+γ(3,6,9)} = COLUMN SPACE (span of columns). N={(x,y,z)|x(1,4,7)+y(2,5,8)+z(3,6,9)=0} = NULL SPACE. Observe: every vector in \u211C is perpendicular to every vector in N! This is the FUNDAMENTAL THEOREM of linear algebra.",
    goal: 'Identify row space, column space, and null space; see row space ⟂ null space.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the relationship between row space ℛ and null space N?',
    options: [
      'They are perpendicular',
      'They are the same set',
      'They are parallel',
      'They are unrelated'
    ],
    correct: 0,
    explanation: 'The Fundamental Theorem: Row space ⟂ Null space. Every row dot every null vector = 0. For A, ℛ=span{(1,2,3),(4,5,6)} and N=span{(1,-2,1)}. Check: (1,2,3)·(1,-2,1)=0, (4,5,6)·(1,-2,1)=0.',
    ggbHint: 'Type: r1=(1,2,3), r2=(4,5,6), n=(1,-2,1). Compute Dot(r1,n) and Dot(r2,n). Both are 0!',
    ggbSteps: [
      'Type: r1=(1,2,3), r2=(4,5,6), n=(1,-2,1).',
      'Type: Dot(r1,n) → 0. Perpendicular!',
      'Type: Dot(r2,n) → 0. Also perpendicular!',
      'Row space = plane, Null space = line.',
      'Together they span ALL of space!'
    ],
    quiz: [
      { q: 'Dimension of row space of A?', options: ['2', '1', '3', '0'], correct: 0 },
      { q: 'Row space and null space are...', options: ['Perpendicular', 'Parallel', 'Identical', 'Opposite'], correct: 0 },
      { q: 'Do row space and null space together span the whole space?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFC6', title: 'Recommendation Systems', story: 'Netflix finds user preferences (row space) vs irrelevant patterns (null space).', question: 'Null space = ?', answer: 'irrelevant features' },
      { emoji: '\uD83D\uDCC8', title: 'Economics', story: 'Input-output models separate growth directions (row space) from equilibrium (null space).', question: 'Equilibrium = ?', answer: 'null space' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Control Theory', story: 'Controllable states (row space) vs uncontrollable (null space).', question: 'Controllable = ?', answer: 'row space' },
    ],
    solveExplanation: 'Fundamental Theorem: Row space ⟂ Null space. ℛ=span{(1,2,3),(4,5,6)}, N=span{(1,-2,1)}. Check dot products = 0!'
  },
  // Mission 27
  {
    id: 27, emoji: '\uD83D\uDDD1\uFE0F', title: 'Collapsing Dimension',
    story: 'B = [[1,2],[2,4]] as a function B:\u211D\u00B2\u2192\u211D\u00B2. Line 2y+x=4: apply B → B*(x,y) = (x+2y, 2x+4y) = (x+2y, 2(x+2y)). Since x+2y=4 → B maps EVERY point on the line to (4,8)! The whole line collapses to a single point! For any k, 2y+x=k maps to (k,2k). Range of B = {t*(1,2)} — a 1D line! B COLLAPSES a dimension!',
    goal: 'See how a singular matrix collapses lines/planes onto lower dimensions.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What shape is the range of B = [[1,2],[2,4]]?',
    options: [
      'A line through origin',
      'A plane',
      'The whole 2D plane',
      'A single point'
    ],
    correct: 0,
    explanation: 'det(B)=0, so B is singular. B maps 2D plane onto a 1D line (direction (1,2)). Any line 2y+x=k maps to point (k,2k). Information along perpendicular direction is LOST — dimension collapses!',
    ggbHint: 'Type: B={{1,2},{2,4}}. Type: B*{4,0} and B*{2,1}. Both points on 2y+x=4 give the same result!',
    ggbSteps: [
      'Type: B = {{1,2},{2,4}}.',
      'Type: B*{4,0} → (4,8).',
      'Type: B*{2,1} → (4,8) again! Same output!',
      'All points on 2y+x=4 map to (4,8).',
      'B collapses entire lines to points!'
    ],
    quiz: [
      { q: 'Determinant of [[1,2],[2,4]]?', options: ['0', '1', '-3', '4'], correct: 0 },
      { q: 'Range of B is the line through...', options: ['(1,2)', '(2,4)', '(1,0)', '(0,1)'], correct: 0 },
      { q: 'Does B map distinct lines 2y+x=k to distinct points?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: '3D to 2D Photo', story: 'A camera collapses 3D world onto a 2D image — depth dimension is lost.', question: 'Lost dimension = ?', answer: 'depth' },
      { emoji: '\uD83D\uDCC8', title: 'Data Compression', story: 'PCA drops low-variance dimensions to compress data with minimal loss.', question: 'Dropped dimensions =?', answer: 'null space' },
      { emoji: '\uD83C\uDFAF', title: 'Shadow Projection', story: 'A 3D object\'s shadow collapses one dimension — like a singular matrix.', question: 'Collapsed = ?', answer: 'one dimension' },
    ],
    solveExplanation: 'B=[[1,2],[2,4]] has det=0. 2y+x=k maps to (k,2k) — lines collapse to points. Range = line t*(1,2). B collapses 2D → 1D.'
  },
  // Mission 28
  {
    id: 28, emoji: '\uD83D\uDDFA\uFE0F', title: 'Span Plot 3D',
    story: 'W = { \u03b1(1,2,1) + \u03b2(2,7,3) | \u03b1,\u03b2 \u2208 \u211D }. Plot the two vectors and their span in GeoGebra 3D. What shape does W make? Hint: two non-parallel vectors in 3D sweep out a flat surface through the origin.',
    goal: 'Visualize the span of two vectors as a plane through the origin in 3D.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What geometric object does W = span{(1,2,1), (2,7,3)} represent?',
    options: [
      'A plane through the origin',
      'A line through the origin',
      'A single point (the origin)',
      'The entire 3D space'
    ],
    correct: 0,
    explanation: 'Two linearly independent vectors in \u211D\u00B3 span a 2D plane through the origin. W = { \u03b1(1,2,1) + \u03b2(2,7,3) } = all linear combinations = a plane!',
    ggbHint: 'Switch to 3D Graphics. Type: v=(1,2,1) and w=(2,7,3). Then type: Plane(v,w) to see the span.',
    ggbSteps: [
      'Click View \u2192 3D Graphics to open the 3D view.',
      'Type: v = (1,2,1) and press Enter.',
      'Type: w = (2,7,3) and press Enter.',
      'Type: Plane(v, w) and press Enter — this is W!',
      'Drag to rotate the 3D view and see the plane through origin.'
    ],
    quiz: [
      { q: 'How many dimensions does W have?', options: ['2 (a plane)', '1 (a line)', '0 (a point)', '3 (whole space)'], correct: 0 },
      { q: 'What is the minimum number of vectors needed to span W?', options: ['2', '1', '3', '0'], correct: 0 },
      { q: 'Does the origin belong to W?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\u2708\uFE0F', title: 'Flight Routes', story: 'A plane\'s feasible velocity set = span of two direction vectors — any combination is possible!', question: 'Span of 2 vectors in 3D?', answer: 'plane' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Robotic Arm', story: 'A 2-joint arm spans a plane of reachable positions.', question: 'What does span represent?', answer: 'reachable positions' },
      { emoji: '\uD83C\uDF0D', title: 'GPS', story: 'Two satellite ranges (spheres) intersect in a circle. Third gives position.', question: 'Two vectors span?', answer: 'plane' },
    ],
    solveExplanation: 'W = span{(1,2,1), (2,7,3)} = { \u03b1(1,2,1) + \u03b2(2,7,3) }. Two independent vectors in \u211D\u00B3 always span a plane through the origin!'
  },
  // Mission 29
  {
    id: 29, emoji: '\u27A1', title: 'Perpendicular to Plane',
    story: 'In Q1 (Mission 28), W was a plane through origin. Now find ALL vectors (x,y,z) that are perpendicular to EVERY vector in W. This is the NULL SPACE of W. Every w\u2208W must satisfy w\u00b7(x,y,z)=0, so in particular: (1,2,1)\u00b7(x,y,z)=0 AND (2,7,3)\u00b7(x,y,z)=0.',
    goal: 'Find the line through origin perpendicular to a given plane (the null space).',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'The set of all vectors perpendicular to EVERY vector in W is a...',
    options: [
      'Line through origin — the null space direction (1,1,-3)',
      'Plane through origin',
      'Single point (origin only)',
      'The whole 3D space'
    ],
    correct: 0,
    explanation: 'Solve: x+2y+z=0 and 2x+7y+3z=0. Subtract 2\u00d7first from second: 3y+z=0 \u2192 z=-3y. Then x+2y-3y=0 \u2192 x=y. So (x,y,z) = t(1,1,-3) — a LINE through origin! This is the null space of the plane W.',
    ggbHint: 'Type: Solve({x+2y+z=0, 2x+7y+3z=0}, {x,y,z}). GeoGebra gives the parametric solution!',
    ggbSteps: [
      'Type: x + 2y + z = 0 and press Enter (a plane).',
      'Type: 2x + 7y + 3z = 0 and press Enter (another plane).',
      'The intersection of these two planes is a LINE.',
      'Type: (1,1,-3) and check if it satisfies both equations.',
      'All points t(1,1,-3) are perpendicular to the whole plane W!'
    ],
    quiz: [
      { q: 'Two planes intersect in a...', options: ['Line', 'Point', 'Plane', 'Sphere'], correct: 0 },
      { q: 'What is the null space direction of W?', options: ['(1,1,-3)', '(1,2,1)', '(2,7,3)', '(1,-2,1)'], correct: 0 },
      { q: 'Is the null space perpendicular to every vector in W?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Camera View', story: 'Camera looks along the null space direction perpendicular to the image plane.', question: 'View direction = ?', answer: 'null space of image plane' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Structural Forces', story: 'Forces perpendicular to a beam do not stretch it — they are in the null space.', question: 'Null space forces do?', answer: 'no work' },
      { emoji: '\uD83D\uDCC8', title: 'Data PCA', story: 'PCA finds the null space (low variance directions) orthogonal to main data plane.', question: 'Null space = ?', answer: 'minimum variance' },
    ],
    solveExplanation: '(1,2,1)\u00b7(x,y,z)=0 and (2,7,3)\u00b7(x,y,z)=0 \u2192 x=y, z=-3x \u2192 (x,y,z) = t(1,1,-3). A line through origin perpendicular to the plane W!'
  },
  // Mission 30
  {
    id: 30, emoji: '\uD83D\uDCCA', title: 'Null Space Again',
    story: 'A = [[1,4,7],[2,5,8],[3,6,9]]. Find all (x,y,z) such that A*(x,y,z) = (0,0,0). Write out: x+4y+7z=0, 2x+5y+8z=0, 3x+6y+9z=0. Notice: Row3 = 2\u00d7Row2 \u2212 Row1, so redundant! Solve the first two and find the null space direction.',
    goal: 'Compute the null space of a different 3\u00d73 singular matrix.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Find a non-zero vector (x,y,z) satisfying A*(x,y,z) = (0,0,0) for A = [[1,4,7],[2,5,8],[3,6,9]]',
    expectedKeywords: ['(1,-2,1)', '1,-2,1', '(1, -2, 1)', 't(1,-2,1)', 't*(1,-2,1)'],
    explanation: 'x+4y+7z=0 and 2x+5y+8z=0. Subtract 2\u00d7first from second: -3y-6z=0 \u2192 y=-2z. Then x+4(-2z)+7z=0 \u2192 x-z=0 \u2192 x=z. So (x,y,z) = t(1,-2,1). Same null space direction as the previous matrix!',
    ggbHint: 'Type: M={{1,4,7},{2,5,8},{3,6,9}}. Compute Det(M) — it is 0! Solve(M*{x,y,z}={0,0,0},{x,y,z}).',
    ggbSteps: [
      'Type: M = {{1,4,7},{2,5,8},{3,6,9}}.',
      'Type: Determinant(M) — ZERO! Matrix is singular.',
      'Type: Solve(M*{x,y,z}={0,0,0},{x,y,z}).',
      'Result: {x=z, y=-2z} — one free variable.',
      'So null space = t(1,-2,1) — a line!'
    ],
    quiz: [
      { q: 'Determinant of [[1,4,7],[2,5,8],[3,6,9]]?', options: ['0', '1', '-1', '3'], correct: 0 },
      { q: 'Null space direction (x,y,z) = ?', options: ['(1,-2,1)', '(1,2,1)', '(1,1,-3)', '(2,-1,0)'], correct: 0 },
      { q: 'Does the null space depend on which rows are redundant?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Image Compression', story: 'JPEG compression discards null-space components to reduce file size.', question: 'What is discarded?', answer: 'null space components' },
      { emoji: '\uD83D\uDD0A', title: 'Audio Noise', story: 'Audio filters remove noise by projecting onto subspace orthogonal to null space.', question: 'Noise lives in?', answer: 'null space' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Vibration', story: 'Null space of stiffness matrix = zero-energy vibration modes.', question: 'Zero-energy modes = ?', answer: 'null space' },
    ],
    solveExplanation: 'A=[[1,4,7],[2,5,8],[3,6,9]]. Solving Ax=0: from first two eqns, y=-2z, x=z \u2192 (x,y,z) = t(1,-2,1). Same null space as before!'
  },
  // Mission 31
  {
    id: 31, emoji: '\uD83D\uDD2D', title: 'Three Spaces Again',
    story: 'With A = [[1,4,7],[2,5,8],[3,6,9]], identify three fundamental subspaces: \u211C = Row Space = span of rows = { \u03b1(1,4,7) + \u03b2(2,5,8) + \u03b3(3,6,9) }, C = Column Space = span of columns = { \u03b1(1,2,3) + \u03b2(4,5,6) + \u03b3(7,8,9) }, N = Null Space = { (x,y,z) | A*(x,y,z) = 0 } = t(1,-2,1). Visualize each set in GeoGebra!',
    goal: 'Identify Row Space, Column Space, and Null Space of A.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'The Row Space \u211C of A is a...',
    options: [
      'Plane through origin (2D)',
      'Line through origin (1D)',
      'Point (origin)',
      'The whole 3D space'
    ],
    correct: 0,
    explanation: 'Since det(A)=0, A has rank 2. The row space is a plane through origin (2D), column space is also a plane (2D), and null space is a line (1D). Rank-Nullity: rank + nullity = 3 \u2192 2 + 1 = 3.',
    ggbHint: 'Plot rows as points: (1,4,7), (2,5,8). Plot the plane they span. Plot null direction (1,-2,1).',
    ggbSteps: [
      'Type: r1=(1,4,7), r2=(2,5,8) — two rows.',
      'Type: Plane(r1, r2) — this is the Row Space \u211C!',
      'Type: n=(1,-2,1) — the null space direction.',
      'Type: Dot(r1,n) and Dot(r2,n) — both 0!',
      'Row space plane and null space line are perpendicular!'
    ],
    quiz: [
      { q: 'Rank of [[1,4,7],[2,5,8],[3,6,9]]?', options: ['2', '1', '3', '0'], correct: 0 },
      { q: 'Nullity (dimension of null space)?', options: ['1', '2', '0', '3'], correct: 0 },
      { q: 'Do the row space and column space have the same dimension?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFC6', title: 'Recommendation Systems', story: 'User preferences live in row space; irrelevant patterns (null space) are filtered out.', question: 'Row space = ?', answer: 'user preferences' },
      { emoji: '\uD83D\uDCC8', title: 'Economics', story: 'Input-output models: reachable outputs = column space.', question: 'Column space = ?', answer: 'reachable outputs' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Control Theory', story: 'Controllable states = row space; uncontrollable = null space.', question: 'Uncontrollable = ?', answer: 'null space' },
    ],
    solveExplanation: 'A has rank 2. Row space = plane, Column space = plane, Null space = line t(1,-2,1). rank(2) + nullity(1) = 3 dimensions!'
  },
  // Mission 32
  {
    id: 32, emoji: '\u2716', title: 'Check Orthogonality',
    story: 'Verify using GeoGebra that every vector in \u211C (Row Space) is perpendicular to every vector in N (Null Space) for A = [[1,4,7],[2,5,8],[3,6,9]]. Take r1=(1,4,7), r2=(2,5,8), n=(1,-2,1). Compute dot products and see!',
    goal: 'Verify the Fundamental Theorem: Row Space \u22a5 Null Space.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the dot product (1,4,7)\u00b7(1,-2,1)?',
    options: [
      '0 — they are perpendicular!',
      '1',
      '-1',
      '7'
    ],
    correct: 0,
    explanation: '(1,4,7)\u00b7(1,-2,1) = 1\u00b71 + 4\u00b7(-2) + 7\u00b71 = 1 - 8 + 7 = 0. Similarly (2,5,8)\u00b7(1,-2,1) = 2 - 10 + 8 = 0. Every row is orthogonal to every null space vector. This is the Fundamental Theorem!',
    ggbHint: 'Type: r1=(1,4,7), r2=(2,5,8), n=(1,-2,1). Type: Dot(r1,n) and Dot(r2,n). Both are 0!',
    ggbSteps: [
      'Type: r1 = (1,4,7) and press Enter.',
      'Type: r2 = (2,5,8) and press Enter.',
      'Type: n = (1,-2,1) and press Enter.',
      'Type: Dot(r1, n) — GeoGebra shows 0!',
      'Type: Dot(r2, n) — also 0! Row space \u22a5 Null space.'
    ],
    quiz: [
      { q: 'Dot(1,4,7) with (1,-2,1) = ?', options: ['0', '1', '-8', '7'], correct: 0 },
      { q: 'If Dot(r,n)=0, r and n are...', options: ['Perpendicular', 'Parallel', 'Same direction', 'Opposite'], correct: 0 },
      { q: 'Does every row have dot product 0 with every null space vector?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDDA5', title: 'Computer Graphics', story: 'Orthogonal basis separates light (row space) from shadows (null space) in rendering.', question: 'Orthogonal means?', answer: 'dot product = 0' },
      { emoji: '\uD83D\uDCF1', title: 'Signal Processing', story: 'Orthogonal Frequency Division Multiplexing (OFDM) uses perpendicular carriers.', question: 'Why orthogonal carriers?', answer: 'no interference' },
      { emoji: '\uD83E\uDD16', title: 'AI Embeddings', story: 'Word embeddings use orthogonality to separate unrelated concepts.', question: 'Unrelated = ?', answer: 'perpendicular vectors' },
    ],
    solveExplanation: '(1,4,7)\u00b7(1,-2,1) = 1-8+7 = 0. (2,5,8)\u00b7(1,-2,1) = 2-10+8 = 0. Fundamental Theorem: Row Space \u22a5 Null Space!'
  },
  // Mission 33
  {
    id: 33, emoji: '\uD83D\uDCC9', title: 'Line to Point',
    story: 'B = [[1,2],[2,4]] maps \u211D\u00B2 \u2192 \u211D\u00B2. Plot the line 2y + x = 4. For every point on this line, compute B*(x,y) = (x+2y, 2x+4y). Since x+2y=4 on this line, B*(x,y) = (4, 8) for EVERY point on the line! The entire line collapses to a single point!',
    goal: 'See how a singular matrix collapses a whole line to a single point.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What does B = [[1,2],[2,4]] do to the line 2y + x = 4?',
    options: [
      'Collapses every point on the line to (4,8)',
      'Maps the line to another line',
      'Rotates the line 90 degrees',
      'Stretches the line into a plane'
    ],
    correct: 0,
    explanation: 'For any (x,y) on 2y+x=4, B*(x,y) = (x+2y, 2x+4y) = (4, 2\u00d74) = (4,8). The entire line maps to a single point! B loses information along the direction perpendicular to (1,2).',
    ggbHint: 'Type: B={{1,2},{2,4}}. Pick two points on the line 2y+x=4, e.g. (4,0) and (2,1). Apply B to both — same result!',
    ggbSteps: [
      'Type: B = {{1,2},{2,4}} and press Enter.',
      'Type: B*{4,0} — results in (4,8).',
      'Type: B*{2,1} — also (4,8)! Same output!',
      'Every point on 2y+x=4 maps to the same point.',
      'B collapses the whole line to a single point!'
    ],
    quiz: [
      { q: 'Determinant of B = [[1,2],[2,4]]?', options: ['0', '1', '2', '-3'], correct: 0 },
      { q: 'All points on 2y+x=4 map to...', options: ['(4,8)', '(2,1)', '(1,2)', '(0,0)'], correct: 0 },
      { q: 'Does a non-singular matrix also collapse lines to points?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Camera Projection', story: 'A camera collapses the entire 3D world onto a 2D sensor — many points map to one pixel.', question: 'Many 3D points map to?', answer: 'one pixel' },
      { emoji: '\uD83D\uDCCB', title: 'Data Aggregation', story: 'Summing sales by region collapses many transactions to single totals.', question: 'Aggregation = ?', answer: 'collapsing data' },
      { emoji: '\uD83C\uDFAF', title: 'Shadow', story: 'A 3D object\'s shadow collapses one dimension — many points share same shadow.', question: 'Shadow collapses?', answer: 'one dimension' },
    ],
    solveExplanation: 'B=[[1,2],[2,4]] has det=0. On line 2y+x=4: B*(x,y) = (x+2y, 2x+4y) = (4, 8) for ALL points. Whole line collapses to one point!'
  },
  // Mission 34
  {
    id: 34, emoji: '\uD83D\uDCC8', title: 'Many Lines Collapse',
    story: 'Same B = [[1,2],[2,4]]. Now try different lines parallel to 2y+x=4: (i) 2y+x=10, (ii) 2y+x=62, (iii) 2y+x=1800. For each line k, compute B*(x,y) for any (x,y) on the line. What do all points on line 2y+x=k map to?',
    goal: 'Discover that each parallel line collapses to a different point.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'All points on the line 2y + x = k map to what point under B = [[1,2],[2,4]]?',
    options: [
      '(k, 2k) — each parallel line collapses to a distinct point',
      '(0,0) — all lines collapse to origin',
      '(2k, k)',
      '(1,2) — all lines collapse to same point'
    ],
    correct: 0,
    explanation: 'For any (x,y) on 2y+x=k, B*(x,y) = (x+2y, 2x+4y) = (k, 2k). Each distinct k gives a distinct output point (k, 2k). Parallel lines map to different points on the range line!',
    ggbHint: 'Pick points on different lines: (10,0) for k=10, (62,0) for k=62, (1800,0) for k=1800. Apply B to each.',
    ggbSteps: [
      'Type: B = {{1,2},{2,4}}.',
      'Type: B*{10,0} → (10,20) for the line 2y+x=10.',
      'Type: B*{62,0} → (62,124) for 2y+x=62.',
      'Type: B*{1800,0} → (1800,3600) for 2y+x=1800.',
      'Each line 2y+x=k maps to (k, 2k)!'
    ],
    quiz: [
      { q: 'Line 2y+x=10 maps to which point?', options: ['(10,20)', '(20,10)', '(5,10)', '(10,10)'], correct: 0 },
      { q: 'Line 2y+x=62 maps to which point?', options: ['(62,124)', '(124,62)', '(31,62)', '(62,62)'], correct: 0 },
      { q: 'Do different values of k give different output points?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCC9', title: 'Income Brackets', story: 'Different tax brackets (lines) map to different tax amounts (points) — each bracket is distinct.', question: 'Different k map to?', answer: 'different points' },
      { emoji: '\uD83D\uDED2', title: 'Pricing Tiers', story: 'Each quantity tier (line) maps to a distinct total price (point).', question: 'Each tier maps to?', answer: 'distinct price' },
      { emoji: '\uD83C\uDFC3', title: 'Race Times', story: 'Each finishing time band maps to a distinct score in a race.', question: 'Different bands = ?', answer: 'different scores' },
    ],
    solveExplanation: 'For 2y+x=k: B*(x,y) = (x+2y, 2x+4y) = (k, 2k). Each distinct k \u2192 distinct point (k,2k) on the range line t(1,2).'
  },
  // Mission 35
  {
    id: 35, emoji: '\u221E', title: 'General Collapse Formula',
    story: 'Generalize: B = [[1,2],[2,4]] maps the line 2y + x = k to (k, 2k). The range of B is all points of the form t*(1,2) — a line through origin. Every point in the output space gets contributions only along direction (1,2). The perpendicular direction (2,-1) is the null space — all info along it is LOST.',
    goal: 'Derive the general formula: B maps 2y+x=k to (k,2k).',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'What is the null space direction of B = [[1,2],[2,4]]? (Find non-zero (x,y) with B*(x,y) = (0,0))',
    expectedKeywords: ['(2,-1)', '2,-1', '(2, -1)', 't(2,-1)', 't*(2,-1)', '(-2,1)', 'x=-2y', 'y=-x/2'],
    explanation: 'Solve: x+2y=0 and 2x+4y=0. Both equations say x=-2y. So (x,y) = t*(-2,1) or t*(2,-1). This is the null space — direction along which info vanishes. The range is the line t*(1,2) — perpendicular to the null space.',
    ggbHint: 'Type: B={{1,2},{2,4}}. Solve(B*{x,y}={0,0},{x,y}). The null space is perpendicular to the range direction (1,2)!',
    ggbSteps: [
      'Type: B = {{1,2},{2,4}}.',
      'Type: Solve(B*{x,y}={0,0},{x,y}).',
      'GeoGebra shows: x = -2y — null space line!',
      'Type: v = (2,-1) and B*v — get (0,0).',
      'Null space direction (2,-1), range direction (1,2). Perpendicular!'
    ],
    quiz: [
      { q: 'Null space direction of [[1,2],[2,4]]?', options: ['(2,-1)', '(1,2)', '(1,-2)', '(2,1)'], correct: 0 },
      { q: 'Range direction of [[1,2],[2,4]]?', options: ['(1,2)', '(2,-1)', '(1,0)', '(0,1)'], correct: 0 },
      { q: 'Are null space and range perpendicular?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Data Compression', story: 'PCA keeps range directions (high variance) and discards null space (low variance).', question: 'Range = ?', answer: 'high variance directions' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Mechanical Engineering', story: 'Stiffness matrix: range = deformable modes, null space = rigid body motions.', question: 'Null space = ?', answer: 'rigid body modes' },
      { emoji: '\uD83D\uDCC8', title: 'Economics', story: 'Input-output: range = achievable outputs, null space = self-canceling flows.', question: 'Self-canceling = ?', answer: 'null space' },
    ],
    solveExplanation: 'B=[[1,2],[2,4]]: B*(x,y)=(0,0) \u2192 x+2y=0 \u2192 x=-2y. Null space = t(2,-1). Range = t(1,2). They are perpendicular! Rank 1, nullity 1.'
  },
  // Mission 36
  {
    id: 36, emoji: '\uD83C\uDF1F', title: 'Dimension Collapse',
    story: 'Putting it all together: B = [[1,2],[2,4]] maps the 2D plane (\u211D\u00B2) onto a 1D line. The null space (direction (2,-1)) has dimension 1 — all vectors along it vanish. The range (direction (1,2)) has dimension 1 — outputs live here. Rank (dimension of range) = 1, Nullity (dimension of null space) = 1. Rank + Nullity = 2 = dimension of input space! This is the Rank-Nullity Theorem!',
    goal: 'Understand that B collapses a dimension: 2D input \u2192 1D output.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'Why does B = [[1,2],[2,4]] "collapse a dimension"?',
    options: [
      'It maps the 2D plane onto a 1D line — one dimension is lost',
      'It maps everything to zero',
      'It rotates the plane',
      'It reflects the plane'
    ],
    correct: 0,
    explanation: 'det(B)=0 means B is singular. The null space is 1D (vectors along (2,-1) vanish). The range is 1D (line t*(1,2)). So B takes 2D input \u2192 1D output. One dimension collapses! Rank-Nullity: rank(1) + nullity(1) = input dim(2).',
    ggbHint: 'Compute Range of B: B*{1,0} = (1,2). B*{0,1} = (2,4). Both are multiples of (1,2). Range = line t(1,2). Null space = line t(2,-1).',
    ggbSteps: [
      'Type: B = {{1,2},{2,4}}.',
      'Type: B*{1,0} = (1,2) — first basis vector maps to (1,2).',
      'Type: B*{0,1} = (2,4) = 2(1,2) — also on same line!',
      'The two basis vectors both land on the same line t(1,2).',
      'Output has only 1 dimension, not 2. One dimension collapsed!'
    ],
    quiz: [
      { q: 'Rank of [[1,2],[2,4]]?', options: ['1', '2', '0', '3'], correct: 0 },
      { q: 'Nullity of [[1,2],[2,4]]?', options: ['1', '2', '0', '3'], correct: 0 },
      { q: 'Rank + Nullity = ?', options: ['2 = dimension of input space', '1', '3', '0'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: '3D to 2D Photo', story: 'Camera collapses 3D \u2192 2D. The depth dimension is lost (null space of projection).', question: 'Depth = ?', answer: 'null space of camera' },
      { emoji: '\uD83D\uDCCB', title: 'Data Summary', story: 'Summarizing a table (many columns) into a single score collapses dimensions.', question: 'Collapsing dimensions = ?', answer: 'reducing information' },
      { emoji: '\uD83E\uDD16', title: 'Neural Networks', story: 'A layer mapping 1000 \u2192 10 neurons collapses 990 dimensions (null space).', question: 'Collapsed dims = ?', answer: 'null space dimensions' },
    ],
    solveExplanation: 'B: \u211D\u00B2 \u2192 \u211D\u00B2, det=0. Null space = line t(2,-1) (nullity=1). Range = line t(1,2) (rank=1). Rank+Nullity = 1+1 = 2 = dim(input). One dimension collapses!'
  },
  // Mission 37
  {
     id: 37, emoji: '\uD83D\uDD0D', title: 'Four Subspaces Intro',
    story: 'M = [[1,2],[3,6]]. Plot and explain three sets: R = Row Space = span{(1,2),(3,6)} \u2014 linear combos of rows. C = Column Space = span{(1,3),(2,6)} \u2014 linear combos of columns. N = Null Space = {(x,y) | x(1,3)+y(2,6)=0}. Notice: (3,6) = 3(1,2) and (2,6) = 2(1,3) \u2014 both rows and columns are multiples!',
    goal: 'Visualize row space, column space, and null space of a rank-1 matrix.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What dimensions do the row space and column space of M = [[1,2],[3,6]] have?',
    options: [
      'Both are 1D lines through origin (rank = 1)',
      'Both are 2D planes (rank = 2)',
      'Row space is 1D, column space is 2D',
      'Both are points at the origin'
    ],
    correct: 0,
    explanation: 'M has rank 1 because (3,6)=3(1,2) and (2,6)=2(1,3). Row space = line t(1,2). Column space = line t(1,3). Null space solves x+3y=0 from column equation = line t(-3,1) \u2014 all are 1D! Rank 1, nullity 1.',
    ggbHint: 'Type: M={{1,2},{3,6}}. Compute Det(M)=0. Rows: r1=(1,2), r2=(3,6) \u2014 collinear! Columns: c1=(1,3), c2=(2,6) \u2014 also collinear!',
    ggbSteps: [
      'Type: M = {{1,2},{3,6}} and press Enter.',
      'Type: Determinant(M) \u2014 it is 0!',
      'Rows: (1,2) and (3,6) \u2014 both on line t(1,2)!',
      'Columns: (1,3) and (2,6) \u2014 both on line t(1,3)!',
      'Solve M*{x,y}={0,0} \u2014 null space = line t(-3,1).'
    ],
    quiz: [
      { q: 'Rank of [[1,2],[3,6]]?', options: ['1', '2', '0', '3'], correct: 0 },
      { q: 'Row space direction = ?', options: ['(1,2)', '(1,3)', '(-3,1)', '(3,1)'], correct: 0 },
      { q: 'Are all three subspaces 1D lines?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Image Filter', story: 'A rank-1 filter keeps only one pattern \u2014 all other info is lost.', question: 'Rank-1 keeps?', answer: 'one direction' },
      { emoji: '\uD83D\uDCC8', title: 'Single Factor Model', story: 'Stock returns explained by one factor = rank-1 matrix of covariances.', question: 'Rank-1 means?', answer: 'one factor drives all' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Simple Lever', story: 'Force applied along one direction only \u2014 rank-1 mechanical system.', question: 'Rank-1 direction = ?', answer: 'line of action' },
    ],
    solveExplanation: 'M=[[1,2],[3,6]] has det=0, rank=1. Row space = t(1,3), column space = t(1,2), null space = t(-3,1). All 1D!'
  },
  // Mission 38
  {
    id: 38, emoji: '\u2716', title: 'Row Space \u22a5 Null Space',
    story: 'For M = [[1,2],[3,6]], verify that every vector in the row space R is perpendicular to every vector in the null space N. R = line t(1,3), N = line t(-3,1). Compute dot product (1,3)\u00b7(-3,1) and see!',
    goal: 'Verify the Fundamental Theorem for a simple rank-1 matrix.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the dot product of row direction (1,3) and null direction (-3,1)?',
    options: [
      '0 \u2014 they are perpendicular!',
      '1',
      '-3',
      '10'
    ],
    correct: 0,
    explanation: '(1,3)\u00b7(-3,1) = 1\u00b7(-3) + 3\u00b71 = -3 + 3 = 0. The row space and null space are perpendicular lines through origin. This is the Fundamental Theorem for any matrix!',
    ggbHint: 'Type: r=(1,3), n=(-3,1). Compute Dot(r,n) \u2014 result is 0! Plot both vectors \u2014 they look perpendicular.',
    ggbSteps: [
      'Type: r = (1,3) and press Enter.',
      'Type: n = (-3,1) and press Enter.',
      'Type: Dot(r, n) \u2014 GeoGebra shows 0!',
      'The row space and null space are perpendicular.',
      'This holds for EVERY matrix: R(M) \u22a5 N(M).'
    ],
    quiz: [
      { q: 'Dot product of (1,3) and (-3,1) = ?', options: ['0', '1', '-9', '10'], correct: 0 },
      { q: 'R(M) and N(M) are...', options: ['Perpendicular subspaces', 'Parallel lines', 'The same line', 'Unrelated'], correct: 0 },
      { q: 'Is the zero vector in both R(M) and N(M)?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDDA5', title: 'Image Processing', story: 'Signal (row space) and noise (null space) are separated by orthogonality.', question: 'Noise lives in?', answer: 'null space' },
      { emoji: '\uD83D\uDCF1', title: 'Communications', story: 'Orthogonal channels carry independent signals without interference.', question: 'Orthogonal channels = ?', answer: 'non-interfering' },
      { emoji: '\uD83E\uDD16', title: 'ML Features', story: 'Relevant features (row space) vs irrelevant (null space) are orthogonal.', question: 'Irrelevant = ?', answer: 'null space features' },
    ],
    solveExplanation: '(1,3)\u00b7(-3,1) = -3+3 = 0. R(M) = t(1,3), N(M) = t(-3,1). They are perpendicular! Fundamental Theorem: R(M) \u22a5 N(M).'
  },
  // Mission 39
  {
     id: 39, emoji: '\uD83D\uDD04', title: 'Null Space of M and M\u1d40',
    story: 'For M = [[1,2],[3,6]], find N(M) and N(M\u1d40). N(M) solves M*(x,y) = (0,0) \u2192 x+2y=0, 3x+6y=0 \u2192 x=-2y \u2192 line t(-2,1). N(M\u1d40) solves M\u1d40*(x,y) = (0,0) where M\u1d40 = [[1,3],[2,6]] \u2192 x+3y=0, 2x+6y=0 \u2192 x=-3y \u2192 line t(-3,1). N(M) is perpendicular to R(M)! N(M\u1d40) is perpendicular to C(M)!',
    goal: 'Find and visualize the null spaces of M and its transpose.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is N(M\u1d40) for M = [[1,2],[3,6]]?',
    options: [
      'Line t(-3,1) \u2014 perpendicular to column space of M',
      'Line t(-2,1) \u2014 same as N(M)',
      'Line t(1,3) \u2014 same as row space',
      'The origin only'
    ],
    correct: 0,
    explanation: 'M\u1d40 = [[1,3],[2,6]]. Solve M\u1d40*(x,y) = (0,0): x+3y=0, 2x+6y=0 \u2192 x=-3y. So N(M\u1d40) = t(-3,1). C(M) = t(1,3). Check orthogonality: (1,3)\u00b7(-3,1) = -3+3 = 0. C(M) \u22a5 N(M\u1d40). Similarly, R(M) = t(1,2), N(M) = t(-2,1). (1,2)\u00b7(-2,1) = -2+2 = 0. R(M) \u22a5 N(M).',
    ggbHint: 'Type: M={{1,2},{3,6}}. Compute MT = Transpose(M) = {{1,3},{2,6}}. Solve(MT*{x,y}={0,0},{x,y}).',
    ggbSteps: [
      'Type: M = {{1,2},{3,6}}.',
      'Type: MT = Transpose(M) = {{1,3},{2,6}}.',
      'Type: Solve(M*{x,y}={0,0},{x,y}) \u2192 N(M) = t(-2,1).',
      'Type: Solve(MT*{x,y}={0,0},{x,y}) \u2192 N(M\u1d40) = t(-3,1).',
      'Check: Dot(column of M, N(M\u1d40)) = 0. Perpendicular!'
    ],
    quiz: [
      { q: 'N(M) for [[1,2],[3,6]] = ?', options: ['t(-2,1)', 't(-3,1)', 't(1,2)', 't(1,3)'], correct: 0 },
      { q: 'N(M\u1d40) for [[1,2],[3,6]] = ?', options: ['t(-3,1)', 't(-2,1)', 't(1,3)', 't(1,2)'], correct: 0 },
      { q: 'Is N(M\u1d40) perpendicular to C(M)?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Control Systems', story: 'N(M) = uncontrollable inputs, N(M\u1d40) = unobservable outputs.', question: 'N(M\u1d40) = ?', answer: 'unobservable outputs' },
      { emoji: '\uD83D\uDCCA', title: 'Statistics', story: 'N(M) = redundant predictors, N(M\u1d40) = unmeasurable responses.', question: 'What is N(M) in regression?', answer: 'redundant predictors' },
      { emoji: '\uD83D\uDCF1', title: 'Coding Theory', story: 'Error-correcting codes: N(M) = codewords, N(M\u1d40) = detectable errors.', question: 'N(M\u1d40) detects?', answer: 'errors' },
    ],
    solveExplanation: 'M=[[1,2],[3,6]] has rank 1. N(M)=t(-2,1), N(M\u1d40)=t(-3,1). C(M)=t(1,3) is perpendicular to N(M\u1d40). R(M)=t(1,2) is perpendicular to N(M).'
  },
  // Mission 40
  {
     id: 40, emoji: '\uD83C\uDF31', title: 'Orthogonal Subspaces',
    story: 'The four fundamental subspaces for any matrix M satisfy: C(M) \u22a5 N(M\u1d40) and R(M) \u22a5 N(M). Verify these for M = [[1,2],[3,6]]: C(M)=t(1,3), N(M\u1d40)=t(-3,1) \u2014 dot = -3+3 = 0. R(M)=t(1,2), N(M)=t(-2,1) \u2014 dot = -2+2 = 0. Both pairs confirmed orthogonal!',
    goal: 'Verify the four subspace orthogonal relationships.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'C(M) \u22a5 N(M\u1d40) means columns of M are perpendicular to...',
    options: [
      'Null space of the transpose \u2014 both dot products = 0',
      'Null space of M \u2014 same as row space relationship',
      'Row space of M',
      'Column space of M\u1d40'
    ],
    correct: 0,
    explanation: 'For M=[[1,2],[3,6]]: C(M)=t(1,3), N(M\u1d40)=t(-3,1). Dot = (1,3)\u00b7(-3,1) = -3+3=0. And R(M)=t(1,2), N(M)=t(-2,1). Dot = (1,2)\u00b7(-2,1) = -2+2=0. Both orthogonal pairs confirmed!',
    ggbHint: 'Type columns: c1=(1,3), c2=(2,6). They are collinear. Type nMT = (-3,1). Dot(c1, nMT)=0! Then check R(M) \u22a5 N(M).',
    ggbSteps: [
      'Type: c = (1,3) \u2014 column direction of M.',
      'Type: nMT = (-3,1) \u2014 N(M\u1d40) direction.',
      'Type: Dot(c, nMT) \u2014 equals 0! C(M) \u22a5 N(M\u1d40).',
      'Type: r = (1,2) \u2014 row direction of M.',
      'Type: nM = (-2,1) \u2014 N(M) direction. Dot(r, nM)=0! R(M) \u22a5 N(M).'
    ],
    quiz: [
      { q: 'C(M) is perpendicular to which subspace?', options: ['N(M\u1d40)', 'N(M)', 'R(M)', 'C(M\u1d40)'], correct: 0 },
      { q: 'R(M) is perpendicular to which subspace?', options: ['N(M)', 'N(M\u1d40)', 'C(M)', 'C(M\u1d40)'], correct: 0 },
      { q: 'Do the four subspaces form two orthogonal pairs?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFC6', title: 'Signal Processing', story: 'Four subspaces: signal (R), noise (N), measurement (C), ambiguity (N(M\u1d40)).', question: 'Signal space = ?', answer: 'row space' },
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Structural Engineering', story: 'Forces (C) and rigid motions (N(M\u1d40)) are orthogonal in equilibrium.', question: 'Rigid motions = ?', answer: 'N(M\u1d40)' },
      { emoji: '\uD83D\uDCC8', title: 'Econometrics', story: 'Instrumental variables: instruments (R) are orthogonal to errors (N).', question: 'Instruments \u22a5 ?', answer: 'errors (N)' },
    ],
    solveExplanation: 'Four subspaces: C(M) \u22a5 N(M\u1d40) and R(M) \u22a5 N(M). M=[[1,2],[3,6]]: C(M)=t(1,3)\u22a5t(-3,1)=N(M\u1d40). R(M)=t(1,2)\u22a5t(-2,1)=N(M).'
  },
  // Mission 41
  {
    id: 41, emoji: '\uD83D\uDCCA', title: 'All Four of A',
     story: 'A = [[1,4,7],[2,5,8],[3,6,9]]. Find and visualize all four fundamental subspaces: N(A), C(A), R(A), N(A\u1d40). A has rank 2. N(A) = t(1,-2,1) (line). R(A) and C(A) are planes. N(A\u1d40) = t(1,-2,1) as well \u2014 both null spaces are the same line! R(A) \u22a5 N(A) and C(A) \u22a5 N(A\u1d40). Rank-nullity: rank(2) + nullity(1) = dim(3).',

    goal: 'Visualize all four fundamental subspaces of a 3\u00d73 rank-2 matrix.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the dimension of N(A\u1d40) for A = [[1,4,7],[2,5,8],[3,6,9]]?',
    options: [
      '1 (a line) \u2014 same as N(A)',
      '2 (a plane)',
      '0 (origin only)',
      '3 (whole space)'
    ],
    correct: 0,
    explanation: 'A\u1d40 = [[1,2,3],[4,5,6],[7,8,9]] has rank 2, nullity 1. N(A\u1d40) = t(1,-2,1). The four subspaces: R(A)=plane (span of rows), C(A)=plane (span of columns), N(A)=line t(1,-2,1), N(A\u1d40)=line t(1,-2,1). R(A) \u22a5 N(A) and C(A) \u22a5 N(A\u1d40). Rank-nullity: rank=2, nullity=1, dim=3.',
    ggbHint: 'Type: A={{1,4,7},{2,5,8},{3,6,9}}. Compute rank with Rank(A)=2. NullSpace(A) and NullSpace(Transpose(A)).',
    ggbSteps: [
      'Type: A = {{1,4,7},{2,5,8},{3,6,9}}.',
      'Type: Rank(A) \u2014 shows 2.',
      'Type: Solve(A*{x,y,z}={0,0,0},{x,y,z}) \u2192 N(A).',
      'Type: AT = Transpose(A). Solve(AT*{x,y,z}={0,0,0}) \u2192 N(A\u1d40).',
      'Both null spaces are lines in 3D through the origin.'
    ],
    quiz: [
      { q: 'Rank of A = [[1,4,7],[2,5,8],[3,6,9]]?', options: ['2', '1', '3', '0'], correct: 0 },
      { q: 'N(A) direction = ?', options: ['(1,-2,1)', '(1,2,1)', '(1,1,-3)', '(2,-1,0)'], correct: 0 },
      { q: 'Are the four subspaces of A all 1D lines?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Circuit Analysis', story: 'Kirchhoff\'s laws: R(A)=loop equations, N(A)=currents satisfying all loops.', question: 'Loop equations = ?', answer: 'row space' },
      { emoji: '\uD83D\uDCF1', title: 'Networks', story: 'Four subspaces model input-output relations in a communication network.', question: 'C(A) = ?', answer: 'reachable outputs' },
      { emoji: '\uD83D\uDCC8', title: 'Portfolio Theory', story: 'R(A)=return factors, N(A)=risk-free combinations, C(A)=achievable returns, N(A\u1d40)=pricing kernels.', question: 'Risk-free = ?', answer: 'N(A)' },
    ],
    solveExplanation: 'A=[[1,4,7],[2,5,8],[3,6,9]], rank=2. R(A)=plane, C(A)=plane, N(A)=t(1,-2,1), N(A\u1d40)=t(1,-2,1). R(A)\u22a5N(A), C(A)\u22a5N(A\u1d40).'
  },
  // Mission 42
  {
    id: 42, emoji: '\uD83D\uDCCB', title: 'Rank by Example',
    story: 'Consider M : \u211D\u2074 \u2192 \u211D\u2074, a 4\u00d74 matrix. Give one example matrix for each case: (a) rank 4, (b) rank 3, (c) rank 2, (d) rank 1, (e) rank 0. For each, verify its rank in GeoGebra and explain why the range has that dimension.',
    goal: 'Build 4\u00d74 matrices of every possible rank and understand range dimension.',
    ggbType: 'graphing',
    answerType: 'text',
    prompt: 'Type a 4\u00d74 matrix M in GeoGebra and compute Rank(M). What rank does M = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,0]] have?',
    expectedKeywords: ['3', 'rank 3'],
    explanation: 'That matrix has 3 pivots \u2192 rank 3. The range (column space) is 3D. For rank 4: identity I_4. Rank 2: put 1s in first two diagonal entries, zeros elsewhere. Rank 1: put 1 at (1,1), zeros elsewhere. Rank 0: zero matrix. The rank always equals the dimension of the range!',
    ggbHint: 'Type: M1=Identity(4) for rank 4. M2={{1,0,0,0},{0,1,0,0},{0,0,0,0},{0,0,0,0}} for rank 2. Use Rank(M) to verify.',
    ggbSteps: [
      'Type: I = Identity(4) \u2014 rank 4, range = whole \u211D\u2074.',
      'Type: M3 = {{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,0}} \u2014 rank 3.',
      'Type: M2 = {{1,0,0,0},{0,1,0,0},{0,0,0,0},{0,0,0,0}} \u2014 rank 2.',
      'Type: M1 = {{1,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0}} \u2014 rank 1.',
      'Type: Z = {{0,0,0,0},{0,0,0,0},{0,0,0,0},{0,0,0,0}} \u2014 rank 0.'
    ],
    quiz: [
      { q: 'Rank of Identity(4) = ?', options: ['4', '3', '2', '1'], correct: 0 },
      { q: 'Rank of the zero 4\u00d74 matrix = ?', options: ['0', '4', '1', 'undefined'], correct: 0 },
      { q: 'Does rank always equal the dimension of the range?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Mechanical Systems', story: 'Rank = number of independent degrees of freedom in a mechanism.', question: 'Rank 4 = ?', answer: '4 DOF' },
      { emoji: '\uD83D\uDCC8', title: 'Data Science', story: 'Rank of data matrix = number of independent features in the dataset.', question: 'Rank = ?', answer: 'independent features' },
      { emoji: '\uD83C\uDF0D', title: 'Networks', story: 'Rank of adjacency matrix = number of independent paths in a network.', question: 'Rank 0 = ?', answer: 'disconnected nodes' },
    ],
    solveExplanation: 'Rank = dim(range). Rank 4: I_4. Rank 3: diag(1,1,1,0). Rank 2: diag(1,1,0,0). Rank 1: diag(1,0,0,0). Rank 0: zero matrix. Range dimension = rank!'
  },
  // Mission 43
  {
    id: 43, emoji: '\uD83D\uDCC8', title: 'Range Contains Line',
    story: 'If a linear transformation A : \u211D\u00B3 \u2192 \u211D\u00B3 has a point (a,b,c) in its range, then it also contains the entire line S = { \u03b1(a,b,c) | \u03b1 \u2208 \u211D }. Why? Because A(\u03b1x) = \u03b1A(x) = \u03b1(a,b,c). Since A is linear, scaling the input scales the output. So the range is always a subspace \u2014 closed under scaling!',
    goal: 'Prove that the range contains the entire line through any point in it.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'If (2,4,6) is in the range of A, what else must be in the range?',
    options: [
      'All scalar multiples \u03b1(2,4,6) \u2014 the whole line through origin',
      'Only (2,4,6) itself',
      'Only the origin',
      'Any point in the plane'
    ],
    correct: 0,
    explanation: 'If (a,b,c) = A(x), then for any \u03b1, A(\u03b1x) = \u03b1A(x) = \u03b1(a,b,c). So the entire line { \u03b1(a,b,c) } is contained in the range. This shows the range is a subspace \u2014 closed under scalar multiplication.',
    ggbHint: 'Pick a matrix, e.g. A={{1,0,0},{0,1,0},{0,0,1}}. Then A*(1,2,3) = (1,2,3). Now compute A*(2,4,6) = 2(1,2,3).',
    ggbSteps: [
      'Type: A = {{1,0,0},{0,1,0},{0,0,1}}.',
      'Type: A*{1,2,3} \u2192 (1,2,3) in range.',
      'Type: A*(2*{1,2,3}) = A*{2,4,6} \u2192 (2,4,6) = 2(1,2,3).',
      'The whole line \u03b1(1,2,3) is in the range.',
      'Any subspace is closed under scaling!'
    ],
    quiz: [
      { q: 'If v is in range, what about 5v?', options: ['Also in range (by linearity)', 'Only if 5v = v', 'Never in range', 'Depends on the matrix'], correct: 0 },
      { q: 'Is the range always a subspace?', type: 'yesno', correct: 0 },
      { q: 'What property of linear maps guarantees this?', options: ['Scalar multiplication: A(\u03b1x) = \u03b1A(x)', 'Addition: A(x+y) = A(x)+A(y)', 'Both', 'Neither'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Amplifier', story: 'Doubling input voltage doubles output \u2014 scaling property of linear systems.', question: 'Double input = ?', answer: 'double output' },
      { emoji: '\uD83D\uDCF7', title: 'Zoom', story: 'Zooming in on an image scales all coordinates uniformly.', question: 'Scaling = ?', answer: 'multiply all coordinates' },
      { emoji: '\uD83D\uDCC8', title: 'Economics', story: 'Doubling all inputs doubles all outputs in a linear production model.', question: 'Doubling = ?', answer: 'scaling property' },
    ],
    solveExplanation: 'If (a,b,c) = A(x) is in range, then A(\u03b1x) = \u03b1A(x) = \u03b1(a,b,c). So the whole line through (a,b,c) is in range. Range is always a subspace!'
  },
  // Mission 44
  {
    id: 44, emoji: '\uD83D\uDDFA\uFE0F', title: 'Range Contains Span',
    story: 'Continuing from Q7: if the range contains points (a,b,c) and (d,e,f), then it also contains T = { \u03b1(a,b,c) + \u03b2(d,e,f) | \u03b1,\u03b2 \u2208 \u211D }. This is because if (a,b,c) = A(x) and (d,e,f) = A(y), then A(\u03b1x+\u03b2y) = \u03b1A(x) + \u03b2A(y) = \u03b1(a,b,c) + \u03b2(d,e,f). The range is closed under addition and scaling \u2014 a subspace!',
    goal: 'Prove that the range contains the span of any two vectors in it.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'If (1,0,0) and (0,1,0) are in the range of A, what else must be in the range?',
    options: [
      'The whole xy-plane { \u03b1(1,0,0) + \u03b2(0,1,0) }',
      'Only the two points themselves',
      'Only the origin',
      'The entire 3D space'
    ],
    correct: 0,
    explanation: 'If (1,0,0)=A(x) and (0,1,0)=A(y), then for any \u03b1,\u03b2: A(\u03b1x+\u03b2y) = \u03b1(1,0,0)+\u03b2(0,1,0). So the entire span (the xy-plane) is contained in the range. The range is always a subspace \u2014 closed under linear combinations!',
    ggbHint: 'Use a matrix whose range you know, e.g. A={{1,0,0},{0,1,0},{0,0,0}}. Range is the xy-plane. Pick any two points and take combinations.',
    ggbSteps: [
      'Type: A = {{1,0,0},{0,1,0},{0,0,0}} \u2014 range = xy-plane.',
      'Type: A*{1,0,0} = (1,0,0) \u2014 in range.',
      'Type: A*{0,1,0} = (0,1,0) \u2014 also in range.',
      'Type: A*(2*{1,0,0} + 3*{0,1,0}) = A*{2,3,0} = (2,3,0) \u2014 also in range!',
      'Any combination \u03b1(1,0,0)+\u03b2(0,1,0) is in range.'
    ],
    quiz: [
      { q: 'If v and w are in range, is v + w also in range?', type: 'yesno', correct: 0 },
      { q: 'The span of two linearly independent vectors in \u211D\u00B3 is a...', options: ['Plane', 'Line', 'Point', 'Cube'], correct: 0 },
      { q: 'What property guarantees v+w is in range?', options: ['Additivity: A(x+y) = A(x)+A(y)', 'Scalar multiplication', 'Both', 'Neither'], correct: 2 }
    ],
    realLife: [
      { emoji: '\uD83C\uDF08', title: 'Color Mixing', story: 'If red and blue are achievable colors, any linear combination (purple shades) is also achievable.', question: 'Color mixing = ?', answer: 'span of colors' },
      { emoji: '\uD83C\uDFB5', title: 'Sound Synthesis', story: 'If two frequencies are producible, any weighted mix is also producible.', question: 'Freq mix = ?', answer: 'linear combination' },
      { emoji: '\uD83C\uDFA8', title: 'Graphics', story: 'If two basis colors exist, any color in their span can be rendered.', question: 'Color space = ?', answer: 'span of basis colors' },
    ],
    solveExplanation: 'If v=A(x), w=A(y) in range, then A(\u03b1x+\u03b2y) = \u03b1v+\u03b2w. So span{v,w} \u2286 range. Range is a subspace \u2014 closed under linear combinations!'
  },
  // Mission 45
  {
    id: 45, emoji: '\uD83C\uDF93', title: 'Dimension Observation',
    story: 'S = { \u03b1(a,b,c) } always has dimension 1 \u2014 it is a line through the origin. But T = { \u03b1(a,b,c) + \u03b2(d,e,f) } does NOT always have dimension 2. If (a,b,c) and (d,e,f) are linearly dependent (one is a multiple of the other), T is just a line (dim 1). Show both cases in GeoGebra: (i) T is a plane (dim 2) when vectors are independent, (ii) T is a line (dim 1) when they are dependent.',
    goal: 'Understand that span dimension depends on linear independence.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the dimension of T = span{(1,2,3), (2,4,6)}?',
    options: [
      '1 \u2014 (2,4,6) = 2(1,2,3), so they are dependent',
      '2 \u2014 they are independent',
      '0 \u2014 both are zero',
      '3 \u2014 they span the whole space'
    ],
    correct: 0,
    explanation: '(2,4,6) = 2(1,2,3), so the two vectors are linearly dependent. T = span{(1,2,3)} = line (dim 1). For a plane (dim 2), you need two linearly independent vectors like (1,0,0) and (0,1,0). The dimension of a span equals the number of linearly independent vectors.',
    ggbHint: 'Plot v=(1,2,3) and w=(2,4,6). They lie on the same line through origin. Now plot v=(1,0,0) and w=(0,1,0) \u2014 they define a plane.',
    ggbSteps: [
      'Type: v = (1,2,3), w = (2,4,6).',
      'Plot both \u2014 they are collinear! span is 1D line.',
      'Now type: v2 = (1,0,0), w2 = (0,1,0).',
      'Plot both \u2014 they define the xy-plane! span is 2D.',
      'Dimension of span = number of linearly independent vectors.'
    ],
    quiz: [
      { q: 'Are (1,2,3) and (2,4,6) linearly independent?', type: 'yesno', correct: 1 },
      { q: 'Are (1,0,0) and (0,1,0) linearly independent?', type: 'yesno', correct: 0 },
      { q: 'Dimension of span of two dependent vectors = ?', options: ['1', '2', '0', '3'], correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Redundant Sensors', story: 'Two sensors giving the same reading = dependent \u2014 only 1 independent measurement.', question: 'Dependent sensors = ?', answer: 'redundant info' },
      { emoji: '\uD83D\uDCCA', title: 'Survey Questions', story: 'Two questions that always get same answer = linearly dependent.', question: 'Dependent questions = ?', answer: 'same info' },
      { emoji: '\uD83D\uDCF1', title: 'Music', story: 'Two instruments playing the same note in unison = dependent sound.', question: 'Unison = ?', answer: 'linearly dependent' },
    ],
    solveExplanation: 'S = \u03b1(a,b,c) always has dim 1. T = span{v,w}: if w = cv (dependent) then dim=1; if independent then dim=2. Dimension = number of linearly independent vectors!'
  },
  // Mission 46
  {
    id: 46, emoji: '\uD83D\uDD0D', title: 'The Big Picture',
    story: 'For ANY matrix A (size m\u00d7n), four subspaces define its behavior: R(A) = Row Space = span of rows (in \u211D\u207F). C(A) = Column Space = span of columns (in \u211D\u1D40). N(A) = Null Space = {x | Ax=0} (in \u211D\u207F). N(A\u1d40) = Left Null Space = {y | A\u1d40y=0} (in \u211D\u1D40). Review with A = [[1,2],[3,6]]: R(A) = t(1,3), C(A) = t(1,2), N(A) = t(-2,1), N(A\u1d40) = t(-3,1).',
    goal: 'See the complete map of the four fundamental subspaces.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'For A = [[1,2],[3,6]], which subspace lives in \u211D\u00B2 (same space as the input)?',
    options: [
      'Both R(A) and N(A) \u2014 they are in the input space',
      'Both C(A) and N(A\u1d40) \u2014 they are in the output space',
      'Only R(A) \u2014 it is in the input space',
      'Only N(A) \u2014 it is in the input space'
    ],
    correct: 0,
    explanation: 'R(A) \u2282 \u211D\u207F (input space) and N(A) \u2282 \u211D\u207F (input space). C(A) \u2282 \u211D\u1D40 (output space) and N(A\u1d40) \u2282 \u211D\u1D40 (output space). R(A) and N(A) are perpendicular subspaces of \u211D\u207F. C(A) and N(A\u1d40) are perpendicular subspaces of \u211D\u1D40. Together they form the complete picture!',
    ggbHint: 'For any matrix A, use GeoGebra to find: NullSpace(A) gives N(A). NullSpace(Transpose(A)) gives N(A\u1d40). Rank(A) gives dimension of R(A) and C(A).',
    ggbSteps: [
      'Type: A = {{1,2},{3,6}}.',
      'Type: Rank(A) = 1 \u2014 R(A) and C(A) are 1D.',
      'Type: N(A) = t(-2,1) \u2014 line in input space.',
      'Type: N(A\u1d40) = t(-3,1) \u2014 line in output space.',
      'R(A) \u22a5 N(A) in input space, C(A) \u22a5 N(A\u1d40) in output space.'
    ],
    quiz: [
      { q: 'R(A) and N(A) live in...', options: ['Input space (\u211D\u207F)', 'Output space (\u211D\u1D40)', 'Different spaces', 'Nowhere'], correct: 0 },
      { q: 'C(A) and N(A\u1d40) live in...', options: ['Output space (\u211D\u1D40)', 'Input space (\u211D\u207F)', 'Different spaces', 'Nowhere'], correct: 0 },
      { q: 'Do R(A) and N(A) span the entire input space?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'System Design', story: 'Inputs decompose into controllable (R) and uncontrollable (N) components.', question: 'Controllable = ?', answer: 'row space' },
      { emoji: '\uD83D\uDCF1', title: 'Communications', story: 'Outputs decompose into signal (C) and noise (N\u1d40) at the receiver.', question: 'Signal = ?', answer: 'column space' },
      { emoji: '\uD83D\uDCC8', title: 'Data Science', story: 'PCA projects data onto R(A) (signal) and discards N(A) (noise).', question: 'Discarded = ?', answer: 'null space' },
    ],
    solveExplanation: 'Four subspaces: R(A), N(A) in input space \u211D\u207F; C(A), N(A\u1d40) in output space \u211D\u1D40. R \u22a5 N and C \u22a5 N\u1d40. Dimensions: rank + nullity = n.'
  },
  // Mission 47
  {
    id: 47, emoji: '\u2716', title: 'Orthogonality Checkup',
    story: 'Verify all orthogonal relationships for A = [[1,4,7],[2,5,8],[3,6,9]] using GeoGebra. Check: (i) R(A) \u22a5 N(A) \u2014 dot product of every row with every null vector = 0. (ii) C(A) \u22a5 N(A\u1d40) \u2014 dot product of every column with every left null vector = 0. These are not optional \u2014 they always hold for ANY matrix!',
    goal: 'Verify the two orthogonal pairs for a 3\u00d73 rank-2 matrix.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is Dot((1,4,7), (1,-2,1)) where (1,4,7) is a row and (1,-2,1) is the null space direction?',
    options: [
      '0 \u2014 they are perpendicular',
      '1',
      '-1',
      '8'
    ],
    correct: 0,
    explanation: '(1,4,7)\u00b7(1,-2,1) = 1-8+7 = 0. (2,5,8)\u00b7(1,-2,1) = 2-10+8 = 0. R(A) \u22a5 N(A). Similarly, columns (1,2,3)\u00b7(1,-2,1) = 1-4+3 = 0. C(A) \u22a5 N(A\u1d40). These always hold!',
    ggbHint: 'Type rows: r1=(1,4,7), r2=(2,5,8). Type null direction n=(1,-2,1). Dot(r1,n) and Dot(r2,n) both = 0.',
    ggbSteps: [
      'Type: r1=(1,4,7), r2=(2,5,8) \u2014 rows of A.',
      'Type: c1=(1,2,3), c2=(4,5,6) \u2014 columns of A.',
      'Type: n=(1,-2,1) \u2014 N(A) and N(A\u1d40) direction.',
      'Type: Dot(r1,n) = 0, Dot(r2,n) = 0 \u2014 R(A) \u22a5 N(A).',
      'Type: Dot(c1,n) = 0, Dot(c2,n) = 0 \u2014 C(A) \u22a5 N(A\u1d40).'
    ],
    quiz: [
      { q: 'Dot product of (1,4,7) and (1,-2,1) = ?', options: ['0', '1', '-2', '8'], correct: 0 },
      { q: 'Dot product of (4,5,6) and (1,-2,1) = ?', options: ['0', '4-10+6=0', '3', '-3'], correct: 0 },
      { q: 'Are the two orthogonal pairs always true for any matrix?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE1\uFE0F', title: 'Image Restoration', story: 'Decompose a blurry image: signal in R(A), noise in N(A). Orthogonal means they don\'t mix!', question: 'Signal \u22a5 Noise means?', answer: 'independent components' },
      { emoji: '\uD83D\uDCF1', title: 'Wireless Channels', story: 'Orthogonal frequency channels carry data without interference.', question: 'Why orthogonal?', answer: 'no interference' },
      { emoji: '\uD83E\uDD16', title: 'AI Features', story: 'Orthogonal feature representations capture independent aspects of data.', question: 'Orthogonal = ?', answer: 'independent information' },
    ],
    solveExplanation: 'R(A) \u22a5 N(A): every row dot every null vector = 0. C(A) \u22a5 N(A\u1d40): every column dot every left null vector = 0. Always true for any matrix!'
  },
  // Mission 48
  {
    id: 48, emoji: '\uD83D\uDCCA', title: 'Rank-Nullity Review',
    story: 'The Rank-Nullity Theorem: For A : \u211D\u207F \u2192 \u211D\u1D40, rank(A) + nullity(A) = n (number of columns). Verify for different matrices: A=[[1,0],[0,1]] \u2192 rank=2, nullity=0, n=2. B=[[1,2],[2,4]] \u2192 rank=1, nullity=1, n=2. C=[[1,2,3],[4,5,6],[7,8,9]] \u2192 rank=2, nullity=1, n=3. Always rank + nullity = number of columns!',
    goal: 'Verify the Rank-Nullity Theorem for different examples.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'For A = [[1,2,3],[4,5,6],[7,8,9]], what is nullity(A) = n - rank(A)? (n = 3)',
    correct: 1,
    tolerance: 0,
    explanation: 'Rank(A) = 2 (since row3 = row2 - row1). Nullity = n - rank = 3 - 2 = 1. This matches: N(A) = t(1,-2,1) which is a 1D line. Rank + Nullity = 2 + 1 = 3 = n. Verified!',
    ggbHint: 'Type: A={{1,2,3},{4,5,6},{7,8,9}}. Compute Rank(A). Subtract from number of columns to get nullity.',
    ggbSteps: [
      'Type: A = {{1,2,3},{4,5,6},{7,8,9}}.',
      'Type: Rank(A) \u2014 shows 2.',
      'Nullity = 3 - rank = 1. Verify with N(A) = t(1,-2,1).',
      'Now test: B={{1,2},{2,4}}. Rank(B)=1, nullity=2-1=1.',
      'Rank + Nullity = number of columns. Always!'
    ],
    quiz: [
      { q: 'Rank + Nullity = ?', options: ['Number of columns (n)', 'Number of rows (m)', 'min(m,n)', 'max(m,n)'], correct: 0 },
      { q: 'For B = [[1,2],[2,4]], rank + nullity = ?', options: ['2', '1', '3', '0'], correct: 0 },
      { q: 'Does rank + nullity always equal the number of columns?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Degrees of Freedom', story: 'Rank = number of independent inputs; nullity = number of redundant constraints.', question: 'Redundancies = ?', answer: 'nullity' },
      { emoji: '\uD83D\uDCCA', title: 'Statistics', story: 'In regression, rank = independent predictors; nullity = collinear predictors.', question: 'Collinear = ?', answer: 'null space' },
      { emoji: '\uD83D\uDCF1', title: 'Coding Theory', story: 'Rank = message bits; nullity = parity check bits in error correction.', question: 'Parity bits = ?', answer: 'nullity' },
    ],
    solveExplanation: 'Rank-Nullity: rank(A) + nullity(A) = n (columns). A=[[1,2,3],[4,5,6],[7,8,9]]: rank=2, nullity=1, n=3. Always check with GeoGebra!'
  },
  // Mission 49
  {
    id: 49, emoji: '\uD83C\uDFC6', title: 'Capstone Challenge',
    story: 'Given M = [[2,4],[1,2],[3,6]] (3\u00d72 matrix). Find ALL four subspaces using GeoGebra: R(M), C(M), N(M), N(M\u1d40). What are their dimensions? How are they related? Hint: M has rank 1 (all rows are multiples of (1,2), all columns are multiples of (2,1,3)\u1d40).',
    goal: 'Apply the full four-subspace analysis to a new matrix.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the dimension of N(M) for M = [[2,4],[1,2],[3,6]]?',
    options: [
      '1 \u2014 nullity = n - rank = 2 - 1 = 1',
      '0 \u2014 matrix is invertible',
      '2 \u2014 everything maps to zero',
      '3 \u2014 all vectors are in null space'
    ],
    correct: 0,
    explanation: 'M is 3\u00d72, rank 1 (all rows multiples of (1,2)). Nullity = n - rank = 2 - 1 = 1. N(M) = t(-2,1). R(M) = t(1,2) in \u211D\u00B2. C(M) = t(2,1,3) in \u211D\u00B3. N(M\u1d40) = solutions to M\u1d40y=0 \u2014 a plane in \u211D\u00B3 (dimension 2). Check: C(M) \u22a5 N(M\u1d40) and R(M) \u22a5 N(M).',
    ggbHint: 'Type: M={{2,4},{1,2},{3,6}}. Rank(M)=1. Solve(M*{x,y}={0,0}) for N(M). Solve(Transpose(M)*{x,y,z}={0,0,0}) for N(M\u1d40).',
    ggbSteps: [
      'Type: M = {{2,4},{1,2},{3,6}}.',
      'Type: Rank(M) \u2014 it is 1.',
      'Type: Solve(M*{x,y}={0,0},{x,y}) \u2192 N(M) = t(-2,1).',
      'Type: MT = Transpose(M). Solve(MT*{x,y,z}={0,0,0}) \u2192 N(M\u1d40) = plane.',
      'R(M) = t(1,2) in \u211D\u00B2, C(M) = t(2,1,3) in \u211D\u00B3, N(M) = t(-2,1), N(M\u1d40) = plane.'
    ],
    quiz: [
      { q: 'Rank of 3\u00d72 matrix with all rows collinear?', options: ['1', '2', '3', '0'], correct: 0 },
      { q: 'R(M) lives in which space?', options: ['\u211D\u00B2 (input space)', '\u211D\u00B3 (output space)', '\u211D\u2074', '\u211D'], correct: 0 },
      { q: 'Is C(M) a line in \u211D\u00B3?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Engineering Systems', story: 'A 3 sensors measuring 2 variables \u2014 the extra sensor is redundant (rank 1).', question: 'Redundant sensor = ?', answer: 'dependent row' },
      { emoji: '\uD83D\uDCCA', title: 'Survey Analysis', story: '3 survey questions measuring 1 underlying trait \u2014 rank-1 data matrix.', question: 'Rank 1 = ?', answer: 'one underlying factor' },
      { emoji: '\uD83D\uDCF1', title: 'Network Traffic', story: '3 routers forwarding 2 data streams \u2014 rank determines throughput.', question: 'Throughput = ?', answer: 'rank of routing matrix' },
    ],
    solveExplanation: 'M=[[2,4],[1,2],[3,6]] (3\u00d72, rank 1). R(M)=t(1,2) in \u211D\u00B2, C(M)=t(2,1,3) in \u211D\u00B3, N(M)=t(-2,1), N(M\u1d40)=plane. R\u22a5N, C\u22a5N\u1d40. Rank+Nullity=n!'
  },
  // Mission 50
  {
    id: 50, emoji: '\uD83C\uDF1F', title: 'Wisdom Achieved',
    story: 'Congratulations! You have completed the Linear Algebra mission. Let us summarize the wisdom: (1) A matrix defines four subspaces: Row Space, Column Space, Null Space, Left Null Space. (2) Row Space \u22a5 Null Space in the input domain. (3) Column Space \u22a5 Left Null Space in the output domain. (4) Rank-Nullity: rank(A) + nullity(A) = n. (5) A singular matrix collapses dimensions \u2014 information is lost along the null space. You now see linear algebra as the study of subspaces and their relationships!',
    goal: 'Celebrate the achievement and summarize the key insights.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'Which statement best captures the essence of linear algebra?',
    options: [
      'Every matrix reveals four subspaces with orthogonal pairs and dimension relationships',
      'Matrices are just numbers in a grid',
      'Determinants are the most important concept',
      'Linear algebra is about solving equations only'
    ],
    correct: 0,
    explanation: 'Linear algebra is fundamentally about the four subspaces and their orthogonal relationships. Every matrix tells a story: R(A) shows what inputs matter, N(A) shows what inputs are lost, C(A) shows what outputs are reachable, and N(A\u1d40) shows what outputs are unreachable. Rank tells us how many dimensions survive!',
    ggbHint: 'Use GeoGebra to explore any matrix and discover its four subspaces. Each matrix has a story to tell!',
    ggbSteps: [
      'Pick any matrix and type it into GeoGebra.',
      'Compute Rank(A) \u2014 how many dimensions survive?',
      'Find N(A) \u2014 what information is lost?',
      'Find C(A) \u2014 what outputs are reachable?',
      'Remember: every matrix has this beautiful structure!'
    ],
    quiz: [
      { q: 'How many fundamental subspaces does a matrix define?', options: ['4', '2', '3', '1'], correct: 0 },
      { q: 'The dimension of C(A) equals...', options: ['Rank(A)', 'Nullity(A)', 'Number of rows', 'Number of columns'], correct: 0 },
      { q: 'Have you achieved Linear Algebra wisdom?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDEE0\uFE0F', title: 'Engineering', story: 'Every linear system in engineering is understood through its four subspaces.', question: 'Key to systems?', answer: 'four subspaces' },
      { emoji: '\uD83D\uDCCA', title: 'Data Science', story: 'Dimensionality reduction, PCA, and regression all rely on subspace thinking.', question: 'Core math?', answer: 'linear algebra subspaces' },
      { emoji: '\uD83E\uDD16', title: 'AI & ML', story: 'Neural networks are compositions of linear transformations \u2014 each layer has its four subspaces.', question: 'Each layer = ?', answer: 'a linear transformation' },
    ],
    solveExplanation: 'Four subspaces, two orthogonal pairs, rank-nullity theorem: the complete picture of any linear transformation. Congratulations on your Linear Algebra wisdom!'
  },
  // Mission 51
  {
    id: 51, emoji: '\uD83C\uDFAC', title: 'User-Item Matrix',
    story: 'Netflix has users and movies. Build a 3\u00d74 rating matrix R where rows = users (Alice, Bob, Charlie) and columns = movies (M1, M2, M3, M4). Ratings: Alice=(5,3,0,1), Bob=(4,0,0,1), Charlie=(1,1,5,4). This matrix has rank? Compute Rank(R) in GeoGebra. The null space reveals which rating patterns never occur!',
    goal: 'Understand the user-item rating matrix and its rank.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'What is the rank of the 3\u00d74 rating matrix R = [[5,3,0,1],[4,0,0,1],[1,1,5,4]]?',
    options: [
      '3 \u2014 all three users have independent preferences',
      '2 \u2014 one user is a linear combo of others',
      '1 \u2014 all users rate the same way',
      '4 \u2014 more columns than rows means full rank'
    ],
    correct: 0,
    explanation: 'Rank(R) = 3 (full row rank). Each user has an independent rating pattern. The null space is {0} (only the zero vector maps to zero). The column space is 3D \u2014 ratings live in a 3D subspace of \u211D\u2074. SVD would reveal latent features like "genre preferences"!',
    ggbHint: 'Type: R={{5,3,0,1},{4,0,0,1},{1,1,5,4}}. Compute Rank(R) in GeoGebra. Try NullSpace(R) as well.',
    ggbSteps: [
      'Type: R = {{5,3,0,1},{4,0,0,1},{1,1,5,4}}.',
      'Type: Rank(R) \u2014 shows 3. Full row rank!',
      'Type: NullSpace(R) \u2014 only {0}.',
      'Each user rating vector is linearly independent.',
      'No redundancy in user preferences \u2014 3 independent taste profiles.'
    ],
    quiz: [
      { q: 'Rank of a 3\u00d74 matrix can be at most...', options: ['3', '4', '7', '12'], correct: 0 },
      { q: 'What does rank measure in a rating matrix?', options: ['Number of independent taste profiles', 'Number of movies', 'Number of users', 'Total ratings'], correct: 0 },
      { q: 'If rank < number of users, what does that mean?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFAC', title: 'Netflix', story: 'Netflix\'s rating matrix has millions of users and movies \u2014 but low rank reveals genre patterns!', question: 'Low rank = ?', answer: 'latent preferences' },
      { emoji: '\uD83D\uDCF1', title: 'Amazon', story: 'Purchase history matrix: users \u00d7 products. Rank reveals product categories.', question: 'Rank reveals?', answer: 'product categories' },
      { emoji: '\uD83C\uDFB5', title: 'Spotify', story: 'User \u00d7 song play count matrix. Low-rank structure = music taste dimensions!', question: 'Taste dimensions = ?', answer: 'latent factors from SVD' },
    ],
    solveExplanation: 'R = 3\u00d74 rating matrix, rank 3. Each user is independent \u2014 no redundant tastes. In real systems, rating matrices are approximately low-rank = latent factors!'
  },
  // Mission 52
  {
    id: 52, emoji: '\uD83D\uDEE0\uFE0F', title: 'Collaborative Filtering',
    story: 'To recommend movies to Bob, find users similar to Bob using dot products / cosine similarity. Bob = (4,0,0,1). Alice = (5,3,0,1). Dot(Bob, Alice) = 4\u00b75 + 0\u00b73 + 0\u00b70 + 1\u00b71 = 21. Charlie = (1,1,5,4). Dot(Bob, Charlie) = 4\u00b71 + 0\u00b71 + 0\u00b75 + 1\u00b74 = 8. Alice is more similar! Recommend movies Alice liked that Bob hasn\'t seen: M2 (rating 3)!',
    goal: 'Use dot products to find similar users for recommendations.',
    ggbType: 'graphing',
    answerType: 'num',
    prompt: 'What is the dot product of Bob (4,0,0,1) and Charlie (1,1,5,4)?',
    correct: 8,
    tolerance: 0,
    explanation: 'Dot(Bob, Charlie) = 4\u00b71 + 0\u00b71 + 0\u00b75 + 1\u00b74 = 4 + 0 + 0 + 4 = 8. Dot(Bob, Alice) = 21, so Alice is more similar. Collaborative filtering: find nearest neighbors (highest dot product / cosine similarity) and recommend items they liked that you haven\'t seen.',
    ggbHint: 'Type vectors: bob=(4,0,0,1), alice=(5,3,0,1), charlie=(1,1,5,4). Compute Dot(bob,alice) and Dot(bob,charlie).',
    ggbSteps: [
      'Type: bob = (4,0,0,1), alice = (5,3,0,1), charlie = (1,1,5,4).',
      'Type: Dot(bob, alice) = 21 \u2014 high similarity.',
      'Type: Dot(bob, charlie) = 8 \u2014 lower similarity.',
      'Alice is Bob\'s nearest neighbor.',
      'Recommend M2 (rating 3 from Alice, unrated by Bob)!'
    ],
    quiz: [
      { q: 'Dot product measures...', options: ['Similarity between vectors', 'Distance', 'Rank', 'Determinant'], correct: 0 },
      { q: 'Who is Bob most similar to?', options: ['Alice (dot=21)', 'Charlie (dot=8)', 'Equally similar', 'Neither'], correct: 0 },
      { q: 'If two users have dot product 0, are they similar?', type: 'yesno', correct: 1 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFAC', title: 'Netflix', story: '"Users who liked this also liked..." = collaborative filtering by dot product similarity!', question: 'Similar users = ?', answer: 'high dot product' },
      { emoji: '\uD83D\uDED2', title: 'Amazon', story: '"Frequently bought together" recommendations use purchase vector similarity.', question: 'Bought together = ?', answer: 'similar purchase vectors' },
      { emoji: '\uD83C\uDFB5', title: 'Spotify', story: 'Discover Weekly uses collaborative filtering on listening history vectors.', question: 'Discover Weekly = ?', answer: 'collaborative filtering' },
    ],
    solveExplanation: 'Dot(Bob,Alice)=21 > Dot(Bob,Charlie)=8. Alice is more similar. Recommend movies Alice liked that Bob hasn\'t seen \u2014 collaborative filtering in action!'
  },
  // Mission 53
  {
    id: 53, emoji: '\uD83D\uDD0D', title: 'Web as a Graph',
    story: 'Google PageRank models the web as a directed graph. Pages = nodes, Links = edges. Consider 4 pages: A\u2192B, A\u2192C, B\u2192C, C\u2192A, D\u2192C. Build the adjacency matrix where M(i,j)=1 if page j links to page i. Then normalize columns so each column sums to 1 \u2014 this is a Markov chain transition matrix! The steady-state eigenvector gives page rankings.',
    goal: 'Build the web graph adjacency matrix and understand the PageRank Markov chain.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'For the web graph A\u2192B, A\u2192C, B\u2192C, C\u2192A, D\u2192C, which page has the most incoming links?',
    options: [
      'C (3 incoming links: from A, B, D)',
      'A (1 incoming link: from C)',
      'B (1 incoming link: from A)',
      'D (0 incoming links)'
    ],
    correct: 0,
    explanation: 'C has 3 incoming links (from A, B, D). In PageRank, more incoming links = more important. The adjacency column-stochastic matrix is: [[0,0,1,0],[1,0,0,0],[1,1,0,1],[0,0,0,0]]. The eigenvector with eigenvalue 1 gives PageRank scores!',
    ggbHint: 'Type: M={{0,0,1,0},{1,0,0,0},{1,1,0,1},{0,0,0,0}}. Each column shows outgoing links. Normalize so columns sum to 1.',
    ggbSteps: [
      'Type: M = {{0,0,1,0},{1,0,0,0},{1,1,0,1},{0,0,0,0}}.',
      'Column 1: A links to B and C.',
      'Column 2: B links to C.',
      'Column 3: C links to A.',
      'Column 4: D links to C. Page C has most links!'
    ],
    quiz: [
      { q: 'In PageRank, incoming links from important pages = ?', options: ['Higher rank', 'Lower rank', 'No effect', 'Negative rank'], correct: 0 },
      { q: 'The PageRank algorithm solves which eigenvector problem?', options: ['Mv = v (eigenvalue 1)', 'Mv = 0', 'Mv = 2v', 'Mv = -v'], correct: 0 },
      { q: 'Is the web graph adjacency matrix usually sparse?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDD0D', title: 'Google Search', story: 'PageRank was Google\'s original ranking algorithm \u2014 eigenvector of the web graph!', question: 'PageRank = ?', answer: 'eigenvector of web graph' },
      { emoji: '\uD83D\uDCF1', title: 'Social Media', story: 'Twitter influence = eigenvector centrality of the follow graph.', question: 'Influence = ?', answer: 'eigenvector centrality' },
      { emoji: '\uD83C\uDFC6', title: 'Sports Rankings', story: 'Team rankings use eigenvector centrality on win-loss graph.', question: 'Rankings = ?', answer: 'eigenvector of win matrix' },
    ],
    solveExplanation: 'PageRank: adjacency matrix \u2192 column-stochastic \u2192 eigenvector with eigenvalue 1 = page importance scores. More incoming links from important pages = higher rank!'
  },
  // Mission 54
  {
    id: 54, emoji: '\uD83D\uDCCA', title: 'Power Method',
    story: 'To compute PageRank, use the Power Method: start with any vector v\u2080, repeatedly multiply by the transition matrix M. After enough iterations, v converges to the dominant eigenvector (PageRank). For M = column-stochastic matrix of 4 pages, start with v=(0.25,0.25,0.25,0.25) and multiply by M repeatedly until stable.',
    goal: 'Compute the PageRank eigenvector using repeated matrix multiplication.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'Starting with v=(0.25,0.25,0.25,0.25), after one multiplication by M (from Q53), which page has the highest score?',
    options: [
      'C \u2014 gets links from A, B, D giving it highest probability',
      'A \u2014 gets a link from C',
      'B \u2014 gets a link from A',
      'D \u2014 gets no links, score drops to 0'
    ],
    correct: 0,
    explanation: 'M*v = (0.25\u00d70 + 0.25\u00d70 + 0.25\u00d71 + 0.25\u00d70, 0.25\u00d71 + 0, 0.25\u00d71 + 0.25\u00d71 + 0.25\u00d70 + 0.25\u00d71, 0) = (0.25, 0.25, 0.75, 0). Page C has the highest score (0.75)! Repeated multiplication converges to the true PageRank vector where C remains highest.',
    ggbHint: 'Type: M={{0,0,1,0},{1,0,0,0},{1,1,0,1},{0,0,0,0}}. Type: v0={0.25,0.25,0.25,0.25}. Compute M*v0 repeatedly.',
    ggbSteps: [
      'Type: M = {{0,0,1,0},{1,0,0,0},{1,1,0,1},{0,0,0,0}}.',
      'Type: v0 = {0.25, 0.25, 0.25, 0.25}.',
      'Type: v1 = M*v0 = (0.25, 0.25, 0.75, 0). C leads!',
      'Keep multiplying: v2 = M*v1. Values converge.',
      'The steady state = eigenvector with eigenvalue 1 = PageRank!'
    ],
    quiz: [
      { q: 'The Power Method converges to which eigenvector?', options: ['Dominant (eigenvalue 1)', 'Smallest eigenvalue', 'Second largest', 'Any eigenvector'], correct: 0 },
      { q: 'After first multiplication, C\'s score was...', options: ['0.75', '0.25', '0.5', '1.0'], correct: 0 },
      { q: 'Does the power method always converge?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDD0D', title: 'Google', story: 'Google\'s original PageRank computed on billions of pages using power iteration.', question: 'Scale = ?', answer: 'billions of pages' },
      { emoji: '\uD83D\uDCF1', title: 'Twitter', story: 'Twitter\'s WhoToFollow uses personalized PageRank via power iteration.', question: 'WhoToFollow = ?', answer: 'personalized PageRank' },
      { emoji: '\uD83D\uDCCA', title: 'Citation Networks', story: 'Academic paper importance = eigenvector of citation graph via power method.', question: 'Important papers = ?', answer: 'high eigenvector score' },
    ],
    solveExplanation: 'Power method: v_{k+1} = M v_k. Converges to dominant eigenvector (eigenvalue 1) = PageRank scores. C has highest score (0.75), D has lowest (0).'
  },
  // Mission 55
  {
    id: 55, emoji: '\uD83D\uDCC8', title: 'Dimensionality Reduction',
    story: 'PCA (Principal Component Analysis) finds the directions of maximum variance in data. Given 2D points: (1,1), (2,2), (3,3), (1,4), (2,5), (3,6). Center the data (subtract mean), compute covariance matrix, find eigenvectors. The eigenvector with largest eigenvalue = first principal component \u2014 direction of most variance. Project data onto this component to reduce from 2D to 1D!',
    goal: 'Use eigendecomposition to find principal components and reduce dimensions.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'For points along y=x (1,1), (2,2), (3,3), what is the first principal component direction?',
    options: [
      '(1,1) \u2014 direction of largest variance along the line',
      '(1,-1) \u2014 perpendicular to the data',
      '(1,0) \u2014 horizontal direction',
      '(0,1) \u2014 vertical direction'
    ],
    correct: 0,
    explanation: 'Points (1,1), (2,2), (3,3) vary along y=x. The covariance matrix eigenvector with largest eigenvalue is (1,1) (normalized). The second eigenvector (1,-1) has zero eigenvalue \u2014 no variance in that direction. PCA would project onto (1,1), reducing 2D \u2192 1D while preserving all variance!',
    ggbHint: 'Plot points: (1,1),(2,2),(3,3),(1,4),(2,5),(3,6). They roughly follow y=x. The first PC = direction (1,1).',
    ggbSteps: [
      'Plot the points: (1,1), (2,2), (3,3), (1,4), (2,5), (3,6).',
      'Observe: most variance is along the line y=x direction.',
      'First principal component = direction (1,1) (45\u00b0 line).',
      'Second PC = perpendicular direction (1,-1) \u2014 little variance.',
      'Project onto first PC: 2D \u2192 1D along y=x!'
    ],
    quiz: [
      { q: 'PCA finds directions of...', options: ['Maximum variance', 'Minimum variance', 'Zero variance', 'Random directions'], correct: 0 },
      { q: 'Eigenvector with largest eigenvalue = ?', options: ['First principal component', 'Last principal component', 'Mean of data', 'Covariance matrix'], correct: 0 },
      { q: 'Does reducing dimensions always lose some information?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83D\uDCF7', title: 'Face Recognition', story: 'Eigenfaces: PCA on face images reduces millions of pixels to ~100 eigenface coefficients!', question: 'Eigenfaces = ?', answer: 'principal components of faces' },
      { emoji: '\uD83D\uDCCA', title: 'Finance', story: 'PCA reduces hundreds of stock returns to a few market factors (eigenvectors of covariance).', question: 'Market factors = ?', answer: 'principal components' },
      { emoji: '\uD83E\uDD16', title: 'Genomics', story: 'PCA reduces thousands of gene expression levels to 2-3 components for visualization.', question: 'Gene expression dims = ?', answer: 'reduced by PCA' },
    ],
    solveExplanation: 'PCA: center data \u2192 covariance matrix \u2192 eigenvectors. Largest eigenvalue = direction of max variance. Projecting onto top components reduces dimensions while preserving variance!'
  },
  // Mission 56
  {
    id: 56, emoji: '\uD83C\uDF1F', title: 'SVD & The Big Picture',
    story: 'The Singular Value Decomposition (SVD) A = U\u03a3V\u1d40 unifies everything you have learned: U columns = eigenvectors of AA\u1d40 (left singular vectors = basis for column space). V columns = eigenvectors of A\u1d40A (right singular vectors = basis for row space). Non-zero singular values = square roots of eigenvalues. Zero singular values = null space! SVD reveals the four subspaces and their dimensions automatically!',
    goal: 'Connect SVD to the four subspaces and see the complete picture.',
    ggbType: 'graphing',
    answerType: 'mcq',
    prompt: 'For A = [[1,2],[2,4]] (rank 1), how many non-zero singular values does SVD give?',
    options: [
      '1 \u2014 rank = number of non-zero singular values',
      '2 \u2014 all 2\u00d72 matrices have 2 singular values',
      '0 \u2014 singular values are always zero',
      '3 \u2014 extra for the null space'
    ],
    correct: 0,
    explanation: 'A=[[1,2],[2,4]] has rank 1, so SVD gives 1 non-zero singular value (\u03c3\u2081 = \u221a(5\u00b2+0) = 5 approximately). The zero singular value corresponds to the null space direction. SVD automatically separates the range (non-zero \u03c3) from the null space (zero \u03c3). Number of non-zero singular values = rank!',
    ggbHint: 'Type: A={{1,2},{2,4}}. GeoGebra can compute SVD: SingularValues(A) gives the list. Count non-zero ones = rank!',
    ggbSteps: [
      'Type: A = {{1,2},{2,4}}.',
      'Type: Rank(A) = 1.',
      'Type: SingularValues(A) \u2192 one non-zero value.',
      'The number of non-zero singular values = rank!',
      'SVD gives the complete picture: range basis (U), row space basis (V), and rank (\u03c3).'
    ],
    quiz: [
      { q: 'Number of non-zero singular values = ?', options: ['Rank of the matrix', 'Number of rows', 'Number of columns', 'Size of matrix'], correct: 0 },
      { q: 'Zero singular values correspond to...', options: ['Null space directions', 'Range directions', 'Row space directions', 'Column space directions'], correct: 0 },
      { q: 'Does SVD reveal all four subspaces?', type: 'yesno', correct: 0 }
    ],
    realLife: [
      { emoji: '\uD83C\uDFAC', title: 'Netflix Prize', story: 'SVD was the core of winning Netflix Prize solution \u2014 factorize rating matrix into U\u03a3V!', question: 'Netflix SVD = ?', answer: 'user-movie latent factors' },
      { emoji: '\uD83D\uDCF7', title: 'Image Compression', story: 'JPEG uses SVD-like DCT to compress images \u2014 keep top singular values, discard the rest.', question: 'Compression = ?', answer: 'keep top singular values' },
      { emoji: '\uD83D\uDCCA', title: 'Topic Modeling', story: 'SVD on document-word matrix = Latent Semantic Analysis, finds document topics.', question: 'LSA = ?', answer: 'SVD on document matrix' },
    ],
    solveExplanation: 'SVD: A = U\u03a3V\u1d40. Non-zero \u03c3 = rank. Zero \u03c3 = null space. U columns span C(A), V columns span R(A). SVD reveals all four subspaces at once!'
  },
];

/* ── GeoGebra embed component ──────────────────────── */
function GGBEmbed({ missionId, ggbType }) {
  const [ggbFailed, setGgbFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const wrapRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const el = wrapRef.current;
    if (!el) return;
    const containerId = 'ggb-c-' + missionId + '-' + Date.now();

    const tryInject = () => {
      if (!window.GGBApplet || cancelled) { setGgbFailed(true); return; }
      const rect = el.getBoundingClientRect();
      const w = Math.max(rect.width - 2, 300);
      const h = Math.max(rect.height - 2, 300);
      const params = {
        appName: ggbType || 'graphing',
        width: Math.round(w),
        height: Math.round(h),
        showToolBar: true,
        showMenuBar: false,
        showAlgebraInput: true,
        enableRightClick: false,
        language: 'en',
        borderColor: '#2c2622',
        id: containerId,
      };
      try {
        const applet = new window.GGBApplet(params);
        applet.inject(containerId);
        readyRef.current = true;
      } catch (e) {
        if (!cancelled) setGgbFailed(true);
      }
    };

    const inner = document.createElement('div');
    inner.id = containerId;
    inner.style.width = '100%';
    inner.style.height = '100%';
    el.innerHTML = '';
    el.appendChild(inner);

    const timer = setTimeout(tryInject, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [missionId, fullscreen]);

  return (
    <div className={'la-ggb-outer' + (fullscreen ? ' fullscreen' : '')}>
      <div className="la-ggb-wrap" ref={wrapRef}>
        {ggbFailed && (
          <div className="fallback-message">
            <p>GeoGebra could not load. Try refreshing or work on paper!</p>
          </div>
        )}
      </div>
      <button className="la-ggb-fullscreen-btn" onClick={() => setFullscreen(v => !v)} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
        {fullscreen ? '✕' : '⛶'}
      </button>
    </div>
  );
}

/* ── Mini graph for real-life expanded view ──────────── */
function parseLinearParams(story) {
  const pat1 = story.match(/=\s*(\d+(?:\.\d+)?)\s*x\s*\+\s*(\d+(?:\.\d+)?)/);
  if (pat1) return { m: +pat1[1], b: +pat1[2] };
  const pat2 = story.match(/=\s*(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*x/i);
  if (pat2) return { m: +pat2[2], b: +pat2[1] };
  const pat3 = story.match(/=\s*(\d+(?:\.\d+)?)\s*x\s*[\.\s,;]/);
  if (pat3) return { m: +pat3[1], b: 0 };
  const pat4 = story.match(/(\d+(?:\.\d+)?)\D*\+\s*\D*(\d+(?:\.\d+)?)\D*\//);
  if (pat4) return { m: +pat4[2], b: +pat4[1] };
  const pat5 = story.match(/=\s*(\d+(?:\.\d+)?)\s*x\s*\+\s*(\d+(?:\.\d+)?)/i);
  if (pat5) return { m: +pat5[1], b: +pat5[2] };
  const pat6 = story.match(/(\d+(?:\.\d+)?)\s*x\s*\+\s*(\d+(?:\.\d+)?)/);
  if (pat6) return { m: +pat6[1], b: +pat6[2] };
  const pat7 = story.match(/=\s*(\d+(?:\.\d+)?)\s*[a-z]\s*\+\s*(\d+(?:\.\d+)?)/i);
  if (pat7) return { m: +pat7[1], b: +pat7[2] };
  const pat8 = story.match(/=\s*(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*[a-z]/i);
  if (pat8) return { m: +pat8[2], b: +pat8[1] };
  const pat9 = story.match(/=-\s*(\d+(?:\.\d+)?)\s*[a-z]\s*\+\s*(\d+(?:\.\d+)?)/i);
  if (pat9) return { m: -(+pat9[1]), b: +pat9[2] };
  const pat11 = story.match(/=\s*(\d+(?:\.\d+)?)\s*x(?!\s*[\+\-])/i);
  if (pat11) return { m: +pat11[1], b: 0 };
  return null;
}

function parseAxisLabels(story) {
  const s = story.toLowerCase();
  const unitMap = {'/km':'km','/min':'min','/screen':'screens','/litre':'litres','/liter':'litres','/kg':'kg','/unit':'units','/yr':'years','/week':'weeks','/hr':'hrs','/hour':'hrs','/day':'days','/mo':'mo'};
  let xLabel = 'x';
  for (const [k,v] of Object.entries(unitMap)) { if (s.includes(k)) { xLabel = v; break; } }
  if (s.includes('time') && xLabel==='x') xLabel = 'time';
  if (s.includes('quantity') && xLabel==='x') xLabel = 'quantity';
  let yLabel = 'y';
  if (s.includes('total=')||s.includes('total ')) yLabel = 'Total';
  else if (s.includes('fare')) yLabel = 'Fare (Rs)';
  else if (s.includes('interest')) yLabel = 'Interest';
  else if (s.includes('revenue')) yLabel = 'Revenue';
  else if (s.includes('cost')) yLabel = 'Cost (Rs)';
  else if (s.includes('price')) yLabel = 'Price';
  else if (s.includes('height')||s.includes('cm')||s.includes('cm/yr')) yLabel = 'Height (cm)';
  else if (s.includes('volume')) yLabel = 'Volume';
  else if (s.includes('distance')) yLabel = 'Distance';
  else if (s.includes('profit')) yLabel = 'Profit';
  if (s.includes('rs') && yLabel==='y') yLabel = 'Cost (Rs)';
  if (s.includes('inr') && yLabel==='y') yLabel = 'INR';
  return { xLabel, yLabel };
}

function MiniGraph({ story }) {
  const { xLabel, yLabel } = parseAxisLabels(story || '');
  const params = parseLinearParams(story);
  const hasEq = params && !isNaN(params.m) && !isNaN(params.b);
  const W = 260, H = 210, titleH = hasEq ? 24 : 0, pad = 36;
  const defaultMax = 10;
  const fmt = v => Number.isInteger(v) ? v.toString() : v.toFixed(1);

  let m, b, xMax, yEnd, yMax, eqLabel, sx, sy, xTicks, yTicks, xStep, yStep;
  if (hasEq) {
    m = params.m; b = params.b;
    xMax = Math.max(10, Math.min(50, Math.ceil(Math.abs(b) / (Math.abs(m) || 1) * 0.8)));
    yEnd = m * xMax + b;
    yMax = Math.max(b, yEnd, 10) * 1.2;
    xTicks = Math.min(Math.floor(xMax / 2) + 1, 6);
    yTicks = Math.min(Math.floor(yMax / 2) + 1, 6);
    xStep = Math.ceil(xMax / xTicks);
    yStep = Math.ceil(yMax / yTicks);
    const mStr = m === 1 ? '' : m === -1 ? '-' : fmt(m);
    eqLabel = `y = ${mStr}x${b > 0 ? ' + ' + b : b < 0 ? ' - ' + Math.abs(b) : ''}`;
  } else {
    xMax = defaultMax; yEnd = defaultMax; yMax = defaultMax * 1.2;
    xTicks = 5; yTicks = 5; xStep = 2; yStep = 2;
    eqLabel = null;
  }
  sx = x => pad + (x / xMax) * (W - 2 * pad);
  sy = y => (H - titleH - pad) - (y / yMax) * (H - titleH - 2 * pad);
  const legendX = W - 75, legendY = titleH + 4;

  return (
    <div style={{ textAlign: 'center', marginBottom: 6 }}>
      {eqLabel && <div style={{ fontSize:'0.85rem', fontWeight:600, color:'#e67e22', marginBottom:2, fontFamily:'var(--font-mono, monospace)' }}>{eqLabel}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="la-mini-graph" style={{ width:'100%', maxWidth:300, display:'inline-block', background:'#fafafa', borderRadius:8, border:'1px solid #e0e0e0' }}>
        {Array.from({length: xTicks+1}, (_, i) => i * xStep).map(v => (
          <line key={`gx${v}`} x1={sx(v)} y1={sy(0)} x2={sx(v)} y2={sy(yMax)} stroke="#eee" strokeWidth={0.5} />
        ))}
        {Array.from({length: yTicks+1}, (_, i) => i * yStep).map(v => (
          <line key={`gy${v}`} x1={sx(0)} y1={sy(v)} x2={sx(xMax)} y2={sy(v)} stroke="#eee" strokeWidth={0.5} />
        ))}
        <line x1={sx(0)} y1={sy(0)} x2={sx(xMax)} y2={sy(0)} stroke="#999" strokeWidth={1.5} />
        <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(yMax)} stroke="#999" strokeWidth={1.5} />

        {hasEq && <line x1={sx(0)} y1={sy(b)} x2={sx(xMax)} y2={sy(yEnd)} stroke="#e67e22" strokeWidth={2.5} strokeLinecap="round" />}

        {Array.from({length: xTicks+1}, (_, i) => i * xStep).filter(v => v > 0).map(v => (
          <text key={`xl${v}`} x={sx(v)} y={sy(0)+14} fontSize={8} fill="#888" textAnchor="middle">{v}</text>
        ))}
        {Array.from({length: yTicks+1}, (_, i) => i * yStep).filter(v => v > 0).map(v => (
          <text key={`yl${v}`} x={sx(0)-8} y={sy(v)+3} fontSize={8} fill="#888" textAnchor="end">{v}</text>
        ))}
        <text x={sx(0)-5} y={sy(0)-4} fontSize={8} fill="#888" textAnchor="middle">O</text>

        <text x={sx(xMax)-5} y={sy(0)+16} fontSize={10} fill="#333" fontWeight={600}>{xLabel}</text>
        <text x={sx(0)+7} y={sy(yMax)+3} fontSize={10} fill="#333" fontWeight={600}>{yLabel}</text>

        {hasEq && b > 0 && (
          <>
            <line x1={sx(0)} y1={sy(b)} x2={sx(xMax*0.15)} y2={sy(b)} stroke="#e74c3c" strokeWidth={0.5} strokeDasharray="2,2" />
            <text x={sx(0)-5} y={sy(b/2)} fontSize={8} fill="#e74c3c" textAnchor="end" opacity={0.6}>b</text>
          </>
        )}
        {hasEq && <circle cx={sx(0)} cy={sy(b)} r={4.5} fill="#e74c3c" stroke="#fff" strokeWidth={1.5} />}
        {hasEq && <text x={sx(0)-6} y={sy(b)-8} fontSize={9} fill="#e74c3c" textAnchor="end" fontWeight={600}>{`(0, ${fmt(b)})`}</text>}
        {hasEq && yEnd > 0 && (
          <text x={sx(xMax)} y={sy(yEnd)-8} fontSize={9} fill="#e67e22" textAnchor="middle" fontWeight={600}>{`(${fmt(xMax)}, ${fmt(yEnd)})`}</text>
        )}

        {hasEq && (
          <>
            <rect x={legendX} y={legendY} width={68} height={34} rx={4} fill="#fff" stroke="#e0e0e0" strokeWidth={0.5} />
            <text x={legendX+6} y={legendY+13} fontSize={8} fill="#e74c3c" fontWeight={600}>{`b = ${fmt(b)}`}</text>
            <text x={legendX+6} y={legendY+26} fontSize={8} fill="#e67e22" fontWeight={600}>{`m = ${fmt(m)}`}</text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ── LinearAlgebraApp component ────────────────────── */
function LinearAlgebraApp({ onBack }) {
  const [currentMission, setCurrentMission] = useState(() => {
    try {
      const solved = JSON.parse(localStorage.getItem('la_solved') || '[]');
      const mod2 = JSON.parse(localStorage.getItem('la_module') || '1');
      const mod = MODULES.find(m => m.id === mod2) || MODULES[0];
      const modSolved = solved.filter(id => id >= mod.start && id <= mod.end);
      const next = mod.start + modSolved.length;
      return next <= mod.end ? next : mod.end;
    } catch { return 1; }
  });
  const [currentModule, setCurrentModule] = useState(() => {
    try { return parseInt(localStorage.getItem('la_module') || '1', 10); } catch { return 1; }
  });
  const [phase, setPhase] = useState('intro');
  const [skillLevel, setSkillLevel] = useState(null);
  const [showSteps, setShowSteps] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [solvedMissions, setSolvedMissions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('la_solved') || '[]'); } catch { return []; }
  });
  const [selectedRL, setSelectedRL] = useState(null);
  const [showRLSummary, setShowRLSummary] = useState(false);
  const [rlAnswer, setRlAnswer] = useState('');
  const [rlFeedback, setRlFeedback] = useState(null);
  const [shuffledQuiz, setShuffledQuiz] = useState([]);
  const [shuffledMCQ, setShuffledMCQ] = useState(null);
  const [quizDifficulty, setQuizDifficulty] = useState(null);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function shuffleQuiz(qs) {
    return shuffle(qs).map(q => {
      if (q.type === 'yesno') return { ...q, options: ['Yes', 'No'] };
      const opts = shuffle(q.options);
      const correctText = q.options[q.correct];
      return { ...q, options: opts, correct: opts.indexOf(correctText) };
    });
  }

  function shuffleMCQOptions(mission) {
    if (mission.answerType !== 'mcq' || !mission.options) return null;
    const opts = shuffle(mission.options);
    const correctText = mission.options[mission.correct];
    return { options: opts, correct: opts.indexOf(correctText) };
  }

  const mission = MISSIONS.find(m => m.id === currentMission) || MISSIONS[0];
  const mod = MODULES.find(m => m.id === currentModule) || MODULES[0];
  const modMissions = MISSIONS.filter(m => m.id >= mod.start && m.id <= mod.end);
  const isFirstMission = currentMission <= mod.start;
  const isLastMission = currentMission >= mod.end;
  const modSolvedCount = solvedMissions.filter(id => id >= mod.start && id <= mod.end).length;
  const modTotal = mod.end - mod.start + 1;
  const moduleComplete = modSolvedCount >= modTotal;

  useEffect(() => {
    try { localStorage.setItem('la_solved', JSON.stringify([...new Set(solvedMissions)])); } catch {}
  }, [solvedMissions]);

  const markSolved = (id) => {
    setSolvedMissions(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const checkAnswer = () => {
    const m = mission;
    const input = answer.trim();
    let correct = false;
    let msg = '';

    if (m.answerType === 'mcq') {
      const correctIdx = shuffledMCQ ? shuffledMCQ.correct : m.correct;
      correct = parseInt(input, 10) === correctIdx;
      msg = correct ? 'Correct!' : 'Not quite. Look at what GeoGebra shows.';
    } else if (m.answerType === 'num') {
      const val = parseFloat(input);
      if (isNaN(val)) { setFeedback({ correct: false, message: 'Please enter a number!', detail: '' }); setAttempts(a => a + 1); return; }
      const tol = m.tolerance !== undefined ? m.tolerance : 0.001;
      correct = Math.abs(val - m.correct) <= tol;
      msg = correct ? 'Correct!' : 'Not right. Try again using GeoGebra.';
    } else if (m.answerType === 'text') {
      correct = textMatches(input, m.expectedKeywords || []);
      msg = correct ? 'Correct! Your understanding is right.' : 'Not quite. Try exploring in GeoGebra more.';
    }

    setAttempts(a => a + 1);
    setFeedback({ correct, message: msg, detail: m.explanation || '' });
    if (correct) markSolved(m.id);
  };

  const startSkillCheck = () => setPhase('skill');
  const startPlay = () => {
    const hideAll = skillLevel === 'perfect';
    setPhase('play'); setFeedback(null); setAnswer(''); setAttempts(0);
    setShowHint(false); setShowAnswer(false); setShowSteps(!hideAll);
    setSelectedRL(null); setRlAnswer(''); setRlFeedback(null);
    setQuizAnswers({}); setQuizSubmitted(false); setQuizPassed(false);
    setShuffledMCQ(shuffleMCQOptions(mission));
  };
  const startQuiz = (diff) => {
    setPhase('quiz'); setQuizAnswers({}); setQuizSubmitted(false); setQuizPassed(false);
    setQuizDifficulty(diff);
    let items = mission.quiz || [];
    if (diff === 'easy') items = items.filter(q => q.type !== 'yesno');
    let shuffled = shuffleQuiz(items);
    if (diff === 'hard' && mission.answerType === 'num' && mission.correct !== undefined && mission.correct !== null) {
      shuffled.push({ q: 'Extra: ' + mission.prompt, options: [], correct: null, _isNum: true, _answer: mission.correct, _tol: mission.tolerance });
    }
    setShuffledQuiz(shuffled);
  };
  const nextMission = () => {
    if (currentMission < mod.end) { setCurrentMission(c => c + 1); setPhase('intro'); }
    else if (currentModule < MODULES.length) {
      const nextMod = MODULES.find(m => m.id === currentModule + 1);
      if (nextMod) { setCurrentModule(nextMod.id); setCurrentMission(nextMod.start); setPhase('intro');
        try { localStorage.setItem('la_module', String(nextMod.id)); } catch {} }
    }
  };
  const selectQuizOption = (qi, oi) => setQuizAnswers(prev => ({ ...prev, [qi]: oi }));
  const goToMission = (id) => {
    if (id === currentMission || (id > mod.end) || (id < mod.start)) return;
    setCurrentMission(id);
    setPhase('intro');
    setFeedback(null); setAnswer(''); setAttempts(0);
    setShowHint(false); setShowAnswer(false);
    setSelectedRL(null); setRlAnswer(''); setRlFeedback(null);
    setQuizAnswers({}); setQuizSubmitted(false); setQuizPassed(false);
    setShuffledMCQ(null);
    setQuizDifficulty(null);
    setSkillLevel(null);
  };

  const submitQuiz = () => {
    const qs = shuffledQuiz;
    let allCorrect = qs.every((q, i) => quizAnswers[i] === q.correct);
    setQuizSubmitted(true);
    setQuizPassed(allCorrect);
  };

  const handleRLSelect = (idx) => {
    if (selectedRL === idx) { setSelectedRL(null); setRlFeedback(null); setRlAnswer(''); }
    else { setSelectedRL(idx); setRlAnswer(''); setRlFeedback(null); }
  };

  const guidancePanel = () => {
    if (phase !== 'play' || !mission) return null;
    const showDetailed = (skillLevel === 'new' && showSteps) || (attempts >= 2 && showSteps);
    return (
      <div>
        <button className="la-guidance-toggle" onClick={() => setShowSteps(!showSteps)}>
          {showSteps ? 'Hide steps' : 'Show steps'}
        </button>
        {showSteps && mission.ggbSteps && (
          <div className="la-guidance">
            {mission.ggbSteps.map((step, i) => <div key={i} className="la-guidance-step"><span className="step-num">{i + 1}.</span> {step}</div>)}
          </div>
        )}
        {showHint && <div className="la-guidance-hint"><strong>Hint: </strong>{mission.ggbHint}</div>}
        {showAnswer && <div className="la-guidance" style={{ borderLeftColor: 'var(--la-accent)' }}><strong>Explanation: </strong>{mission.solveExplanation}</div>}
      </div>
    );
  };

  const actionButtons = () => (
    <div className="la-action-row">
      <button className="la-action-btn" onClick={() => setShowHint(!showHint)}>{showHint ? 'Hide hint' : 'What do I do?'}</button>
      <button className="la-action-btn" onClick={() => setShowSteps(!showSteps)}>{showSteps ? 'Hide steps' : 'Show me!'}</button>
      <button className="la-action-btn" onClick={() => { setShowAnswer(!showAnswer); setShowSteps(true); }}>{showAnswer ? 'Hide answer' : 'Give up'}</button>
    </div>
  );

  const answerArea = () => {
    if (!mission) return null;
    if (mission.answerType === 'mcq') {
      const mcqData = shuffledMCQ || { options: mission.options, correct: mission.correct };
      return (
        <div className="la-answer-area">
          <div className="la-question-prompt">{mission.prompt}</div>
          <div className="la-mcq-grid">
            {mcqData.options.map((opt, i) => (
              <button key={i} className={'la-mcq-option' + (answer === String(i) ? ' selected' : '')} onClick={() => setAnswer(String(i))}>{opt}</button>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button className="la-check-btn" onClick={checkAnswer} disabled={answer === ''}>Check</button>
          </div>
        </div>
      );
    }
    if (mission.answerType === 'num') {
      return (
        <div className="la-answer-area">
          <div className="la-question-prompt">{mission.prompt}</div>
          <div className="la-input-row">
            <input className="la-num-input" type="text" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Enter number" autoFocus />
            <button className="la-check-btn" onClick={checkAnswer} disabled={!answer.trim()}>Check</button>
          </div>
        </div>
      );
    }
    if (mission.answerType === 'text') {
      return (
        <div className="la-answer-area">
          <div className="la-question-prompt">{mission.prompt}</div>
          <div className="la-input-row">
            <input className="la-text-input" type="text" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer..." autoFocus />
            <button className="la-check-btn" onClick={checkAnswer} disabled={!answer.trim()}>Check</button>
          </div>
        </div>
      );
    }
    return null;
  };

  const feedbackArea = () => {
    if (!feedback) return null;
    return (
      <div className={'la-feedback ' + (feedback.correct ? 'correct' : 'wrong')}>
        <div className="la-feedback-message">{feedback.message}</div>
        {feedback.detail && <div className="la-feedback-detail">{feedback.detail}</div>}
      </div>
    );
  };

  const quizSection = () => {
    const qs = shuffledQuiz;
    const allAnswered = qs.every((_, i) => {
      const ans = quizAnswers[i];
      if (ans === undefined) return false;
      const q = qs[i];
      if (q._isNum) return ans !== '';
      return true;
    });
    if (!quizDifficulty) {
      return (
        <div className="la-quiz-section">
          <div className="la-quiz-title">Quick Test</div>
          <p style={{ marginBottom: 10, fontWeight: 500 }}>Choose difficulty:</p>
          <div className="la-skill-check">
            <button className={'la-skill-btn' + (quizDifficulty === 'easy' ? ' selected' : '')} onClick={() => startQuiz('easy')}>Easy (MCQ only)</button>
            <button className={'la-skill-btn' + (quizDifficulty === 'medium' ? ' selected' : '')} onClick={() => startQuiz('medium')}>Medium (All types)</button>
            <button className={'la-skill-btn' + (quizDifficulty === 'hard' ? ' selected' : '')} onClick={() => startQuiz('hard')}>Hard (+ numerical)</button>
          </div>
        </div>
      );
    }
    return (
      <div className="la-quiz-section">
        <div className="la-quiz-title">Quick Test <span style={{ fontSize:'0.7rem', opacity:0.6, textTransform:'uppercase' }}>({quizDifficulty})</span></div>
        {qs.map((q, i) => {
          const selected = quizAnswers[i];
          const isCorrect = quizSubmitted && (q._isNum ? selected !== '' && Math.abs(parseFloat(selected) - q._answer) <= (q._tol || 0.001) : selected === q.correct);
          const isWrong = quizSubmitted && selected !== undefined && !isCorrect;
          if (q._isNum) {
            return (
              <div key={i} className="la-quiz-question">
                <div className="la-quiz-q-text">{q.q}</div>
                <div className="la-input-row">
                  <input className="la-num-input" type="text" value={selected || ''} onChange={e => selectQuizOption(i, e.target.value)} placeholder="Enter number" disabled={quizSubmitted} />
                </div>
                {quizSubmitted && <div className={'la-quiz-result ' + (isCorrect ? 'pass' : 'fail')}>{isCorrect ? 'Correct!' : 'Wrong'}</div>}
              </div>
            );
          }
          return (
            <div key={i} className="la-quiz-question">
              <div className="la-quiz-q-text">{q.q}</div>
              <div className={'la-quiz-options' + (q.type === 'yesno' ? ' yesno' : '')}>
                {q.type === 'yesno'
                  ? ['Yes', 'No'].map((o, oi) => {
                      let cls = 'la-quiz-opt';
                      if (selected === oi) cls += ' selected';
                      if (isCorrect && oi === q.correct) cls += ' correct';
                      if (isWrong && oi === selected) cls += ' wrong';
                      return <button key={oi} className={cls} onClick={() => !quizSubmitted && selectQuizOption(i, oi)} disabled={quizSubmitted}>{o}</button>;
                    })
                  : q.options.map((o, oi) => {
                      let cls = 'la-quiz-opt';
                      if (selected === oi) cls += ' selected';
                      if (isCorrect && oi === q.correct) cls += ' correct';
                      if (isWrong && oi === selected) cls += ' wrong';
                      return <button key={oi} className={cls} onClick={() => !quizSubmitted && selectQuizOption(i, oi)} disabled={quizSubmitted}>{o}</button>;
                    })
                }
              </div>
              {quizSubmitted && <div className={'la-quiz-result ' + (isCorrect ? 'pass' : 'fail')}>{isCorrect ? 'Correct!' : isWrong ? 'Wrong' : ''}</div>}
            </div>
          );
        })}
        {!quizSubmitted && <button className="la-quiz-next-btn" onClick={submitQuiz} disabled={!allAnswered}>Submit Quiz</button>}
        {quizSubmitted && (
          <div>
            <div className={'la-quiz-result ' + (quizPassed ? 'pass' : 'fail')}>{quizPassed ? 'All correct!' : 'Some wrong. Try again!'}</div>
            {quizPassed && <button className="la-quiz-next-btn" onClick={nextMission}>{isLastMission ? 'Finish Module' : 'Next Mission'}</button>}
            {!quizPassed && <button className="la-quiz-next-btn" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); startQuiz(quizDifficulty); }}>Retry Quiz</button>}
          </div>
        )}
      </div>
    );
  };


  const makeMissionDescriptive = (m) => {
    return (
      <>
        <div style={{ fontWeight:700, color:'var(--la-accent)', marginBottom:4 }}>Your Mission: {m.goal}</div>
        <div style={{ fontWeight:400, fontSize:'0.9rem', lineHeight:1.5 }}>{m.story}</div>
      </>
    );
  };

  const makeDescriptiveQuestion = (rl) => {
    const q = (rl.question || '').toLowerCase();
    const s = (rl.story || '');
    if (q.includes('y-intercept')||q.includes('intercept value')||q.includes('intercept?')) return `Looking at the graph above, what is the y-intercept? That is, what is the value of y when x is 0 in this scenario?`;
    if (q.includes('slope?')) return `What is the slope of this line? Remember, slope represents the rate of change — how much y increases for each unit increase in x.`;
    if (q.includes('total for')) return `Using the graph, figure out the total value when x is the given number in this real-world context.`;
    if (q.includes('why through origin')) return `Why does this line pass through the origin (0,0)? Look at the graph — what is special about the y-intercept?`;
    if (q.includes('cost for')) return `Based on the graph, what is the total cost for the given quantity? Find the y-value at the corresponding x-value.`;
    if (q.includes('fixed charge')) return `What is the fixed charge or base cost in this scenario? This is the y-intercept — the cost when usage is zero.`;
    if (q.includes('height after')) return `Using the graph, find the height after the given number of years. What is the y-value at that x-value?`;
    if (q.includes('type of function')) return `What type of function is represented by this line? Is it linear, quadratic, or something else? How can you tell from the graph?`;
    if (q.includes('distance for')) return `Looking at the graph, find the x-value (distance) that gives the total cost shown. Trace from the y-value to the line and down to the x-axis.`;
    if (q.includes('what does intersection')) return `What does the intersection point of these two lines represent in this real-world scenario? Think about what it means when the two quantities are equal.`;
    if (q.includes('break-even')) return `What is the break-even point? This is where cost equals revenue — the x-value at which the two lines intersect.`;
    if (q.includes('what does collinear')) return `What does it mean for points to be collinear? Look at the graph — do all the points lie on a single straight line?`;
    if (q.includes('through origin?')) return `Does this line pass through the origin (0,0)? Look at the graph and check whether (0,0) lies on the line.`;
    if (q.includes('what does inverse')) return `What does the inverse of this function tell us? How do we reverse the calculation to find the original input from the output?`;
    if (q.includes('inverse')) return `What is the inverse of this function? How would you reverse the calculation to go from y back to x?`;
    if (q.includes('intersection')) return `Find where the two lines cross. Solve the equations together to get (x,y) — the coordinates of their meeting point.`;
    if (q.includes('why')) return `Look at the graph and explain: ${q}`;
    return `Based on the graph above, ${q} Look at the line and the labeled points to figure out the answer.`;
  };

  const realLifeSection = () => {
    const rls = mission.realLife || [];
    const rl = selectedRL !== null ? rls[selectedRL] : null;
    return (
      <div className="la-reallife">
        <div className="la-reallife-title">Real-Life Applications</div>
        <div className="la-reallife-grid">
          {rls.map((rlItem, i) => (
            <button key={i} className={'la-reallife-card' + (selectedRL === i ? ' active' : '')} onClick={() => handleRLSelect(i)}>
              <span className="rl-emoji">{rlItem.emoji}</span>
              <span className="rl-title">{rlItem.title}</span>
            </button>
          ))}
        </div>
        {selectedRL !== null && (
          <div className="la-reallife-expanded">
            <MiniGraph story={rl.story} />
            <div className="rl-story">{rl.story}</div>
            <div className="rl-puzzle-box">
              <div className="rl-question">
                <strong>{showRLSummary ? 'Quick question:' : 'What to find:'}</strong>
                {showRLSummary ? rl.question : makeDescriptiveQuestion(rl)}
              </div>
              <button className="rl-summary-toggle" onClick={() => setShowRLSummary(v => !v)}>
                {showRLSummary ? 'Show Full Context' : 'View Summary'}
              </button>
              <div className="rl-input-area">
                <input className="la-text-input" type="text" value={rlAnswer}
                  onChange={e => setRlAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  style={{ flex: 1, minWidth: 150 }}
                    onKeyDown={e => {
                    if (e.key === 'Enter' && rlAnswer.trim()) {
                      const exp = (rl.answer || '').replace(/\s+/g,'').toLowerCase();
                      const got = rlAnswer.replace(/\s+/g,'').toLowerCase();
                      setRlFeedback(got.includes(exp) || got === exp ? '✓ Correct! Well done!' : '✗ Not quite. Try again!');
                    }
                  }} />
                <button className="la-check-btn" onClick={() => {
                  const exp = (rl.answer || '').replace(/\s+/g,'').toLowerCase();
                  const got = rlAnswer.replace(/\s+/g,'').toLowerCase();
                  setRlFeedback(got.includes(exp) || got === exp ? '✓ Correct! Well done!' : '✗ Not quite. Try again!');
                }} disabled={!rlAnswer.trim()}>Check</button>
              </div>
              {rlFeedback && (
                <div className={'rl-feedback ' + (rlFeedback.startsWith('✓') ? 'correct' : 'wrong')}>
                  {rlFeedback}
                </div>
              )}
              {rlFeedback && rlFeedback.startsWith('✓') && (
                <div className="rl-done">Great! You understand how this concept applies in real life!</div>
              )}
              {rlFeedback && rlFeedback.startsWith('✗') && (
                <div className="rl-hint">Hint: Look at the graph above and think about what changes in this scenario!</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (moduleComplete) {
    const allModules = MODULES.every(m => {
      const cnt = solvedMissions.filter(id => id >= m.start && id <= m.end).length;
      return cnt >= (m.end - m.start + 1);
    });
    const isLastMod = currentModule >= MODULES.length;
    if (allModules) {
      return (
        <div className="la-module">
          <button className="la-back" onClick={onBack}>&larr; Home</button>
          <div className="la-complete">
            <h2>All Modules Complete!</h2>
            <div className="big-score">{solvedMissions.length}/36</div>
            <p>You mastered Linear Algebra!</p>
            <button className="la-quiz-next-btn" onClick={onBack} style={{ marginTop: 16, maxWidth: 300, margin: '16px auto 0' }}>Back to Home</button>
          </div>
        </div>
      );
    }
    const pct = Math.round((modSolvedCount / modTotal) * 100);
    return (
      <div className="la-module">
        <button className="la-back" onClick={onBack}>&larr; Home</button>
        <div className="la-complete">
          <h2>{mod.emoji} {mod.title} Complete!</h2>
          <div className="big-score">{modSolvedCount}/{modTotal}</div>
          <p>Score: {pct}%</p>
          {!isLastMod && (
            <button className="la-quiz-next-btn" onClick={() => {
              const nextMod = MODULES.find(m => m.id === currentModule + 1);
              if (nextMod) { setCurrentModule(nextMod.id); setCurrentMission(nextMod.start); setPhase('intro');
                try { localStorage.setItem('la_module', String(nextMod.id)); } catch {} }
            }} style={{ maxWidth: 300, margin: '16px auto 0' }}>
              Next Module &rarr;
            </button>
          )}
          <button className="la-quiz-next-btn" onClick={onBack} style={{ maxWidth: 300, margin: '8px auto 0' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="la-module">
      <button className="la-back" onClick={onBack}>&larr; Home</button>
      <div className="la-header">
        <span className="la-module-pill">
          <button className="la-module-nav-btn" onClick={() => {
            const prevMod = MODULES.find(m => m.id === currentModule - 1);
            if (prevMod) { setCurrentModule(prevMod.id); setCurrentMission(prevMod.start); setPhase('intro');
              try { localStorage.setItem('la_module', String(prevMod.id)); } catch {} }
          }} disabled={currentModule <= 1}>&lsaquo;</button>
          {mod.emoji} Module {mod.id}: {mod.title}
          <button className="la-module-nav-btn" onClick={() => {
            const nextMod = MODULES.find(m => m.id === currentModule + 1);
            if (nextMod) { setCurrentModule(nextMod.id); setCurrentMission(nextMod.start); setPhase('intro');
              try { localStorage.setItem('la_module', String(nextMod.id)); } catch {} }
          }} disabled={currentModule >= MODULES.length}>&rsaquo;</button>
        </span>
        <h1>{mission.emoji} {mission.title}</h1>
        <p>Module {currentModule} &middot; Mission {currentMission - mod.start + 1} of {modTotal}</p>
      </div>

      <div className="la-progress">
        <button className="la-nav-btn" onClick={() => goToMission(currentMission - 1)} disabled={currentMission <= mod.start || !solvedMissions.includes(currentMission - 1)}>&larr; Prev</button>
        {modMissions.map((m, idx) => {
          const absId = m.id;
          const canClick = solvedMissions.includes(absId) || absId <= currentMission;
          return (
            <div key={absId} className={'la-progress-dot' + (solvedMissions.includes(absId) ? ' solved' : '') + (absId === currentMission ? ' active' : '') + (absId > currentMission ? ' locked' : '') + (canClick ? ' clickable' : '')} title={'Mission ' + absId} onClick={canClick ? () => goToMission(absId) : undefined}>
              {solvedMissions.includes(absId) ? '\u2713' : (idx + 1)}
            </div>
          );
        })}
        <button className="la-nav-btn" onClick={() => goToMission(currentMission + 1)} disabled={currentMission >= mod.end || !solvedMissions.includes(currentMission + 1)}>Next &rarr;</button>
      </div>

      {phase === 'intro' && (
        <div className="la-mission">
          <div className="la-mission-goal"><strong>Your Mission:</strong> {mission.goal}</div>
          <p style={{ lineHeight: 1.6, color: 'var(--la-text-soft)', marginBottom: 14 }}>{mission.story}</p>
          <button className="la-quiz-next-btn" onClick={startSkillCheck} style={{ maxWidth: 250, margin: '0 auto' }}>Accept Mission</button>
        </div>
      )}

      {phase === 'skill' && (
        <div className="la-mission">
          <p style={{ marginBottom: 10, fontWeight: 500 }}>How comfortable are you with GeoGebra?</p>
          <div className="la-skill-check">
            <button className={'la-skill-btn' + (skillLevel === 'new' ? ' selected' : '')} onClick={() => setSkillLevel('new')}>Show me the ropes</button>
            <button className={'la-skill-btn' + (skillLevel === 'little' ? ' selected' : '')} onClick={() => setSkillLevel('little')}>I know some things</button>
            <button className={'la-skill-btn' + (skillLevel === 'perfect' ? ' selected' : '')} onClick={() => setSkillLevel('perfect')}>Let me cook - no hints</button>
          </div>
          <button className="la-check-btn" onClick={startPlay} disabled={!skillLevel} style={{ width: '100%', marginTop: 8 }}>Start Exploring</button>
        </div>
      )}

      {phase === 'play' && (
        <div className="la-mission">
          <div className="la-question-prompt" style={{ fontSize:'1rem', margin:'0 0 8px', lineHeight:1.5, fontWeight:600 }}>
            {makeMissionDescriptive(mission)}
          </div>
          <GGBEmbed missionId={currentMission} ggbType={mission.ggbType} />
          {actionButtons()}
          {guidancePanel()}
          {answerArea()}
          {feedbackArea()}
          {feedback && feedback.correct && !quizSubmitted && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button className="la-quiz-next-btn" onClick={() => { setPhase('quiz'); setQuizAnswers({}); setQuizSubmitted(false); setQuizPassed(false); setQuizDifficulty(null); setShuffledQuiz([]); }} style={{ maxWidth: 300, margin: '0 auto' }}>Take the Quick Test</button>
            </div>
          )}
        </div>
      )}

      {phase === 'quiz' && (
        <div className="la-mission">
          {quizSection()}
        </div>
      )}

      {phase === 'quiz' && quizSubmitted && quizPassed && (
        <div className="la-mission">
          <div className="la-reallife-title" style={{ textAlign: 'center', marginBottom: 12 }}>Unlocked: Real-Life Applications</div>
          {realLifeSection()}
        </div>
      )}
    </div>
  );
}

export default LinearAlgebraApp;
