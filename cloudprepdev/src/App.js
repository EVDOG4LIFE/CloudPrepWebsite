import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showSelections, setShowSelections] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  const quizSelections = [
    {
      name: 'Certified Kubernetes Administrator',
      questionsUrl: '/api/questions/cka',
    },
    {
      name: 'Terraform Associate',
      questionsUrl: '/api/questions/tf',
    },
    {
      name: 'AWS DevOps Engineer',
      questionsUrl: '/api/questions/aws',
    },
  ];

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz.questionsUrl);
    }
  }, [selectedQuiz]);

  const fetchQuestions = async (questionsUrl) => {
    const response = await axios.get(questionsUrl);
    setQuestions(response.data);
  }

  const handleAnswerOptionClick = async (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className='app'>
      {showSelections ? (
        <div className='selections-section'>
          <h1>Please select a quiz:</h1>
          <ul>
            {quizSelections.map((selection) => (
              <li key={selection.name}>
                <button onClick={() => setSelectedQuiz(selection)}>{selection.name}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : showScore ? (
        <div className='score-section'>
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>{questions[currentQuestion].questionText}</div>
          </div>
          <div className='answer-section'>
            {questions[currentQuestion].answerOptions.map((answerOption) => (
              <button
                className={answerOption.isCorrect ? 'correct' : 'incorrect'}
                onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
