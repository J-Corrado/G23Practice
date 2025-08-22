import {useState} from "react";
import {resultInitialState} from './questions';

const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);

  
    const {question, choices, correctAnswer} = questions[currentQuestion];


    const onAnswerClick = (answer, index) => {
        if (isAnswered) return; // prevent re-clicking after answering

        setAnswerIdx(index);
        setIsAnswered(true);
        setIsCorrect(index === correctIndex);
        
    };

    const onClickNext = () => {
    setResult((prev) =>
      isCorrect
        ? { ...prev, score: prev.score + 5, correctAnswers: prev.correctAnswers + 1 }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );

    setAnswerIdx(null);
    setIsAnswered(false);
    setIsCorrect(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setShowResult(true);
    }
  };

     const onClickBack = () => {
    if (currentQuestion === 0) return;

    // Not touching score here (keeps logic simple). Adjust if you need to reverse scoring.
    setResult((prev) => isCorrect
        ? { ...prev, score: prev.score - 5, correctAnswers: prev.correctAnswers - 1 }
        : { ...prev, wrongAnswers: prev.wrongAnswers - 1 }
    );

    setAnswerIdx(null);
    setIsAnswered(false);
    setIsCorrect(null);

    setCurrentQuestion((q) => q - 1);
  };

    const onTryAgain = () => {
        setResult(resultInitialState);
        setShowResult(false);

    }
    
    // put these above the return in Quiz.jsx
const styles = {
  base: {
    cursor: "pointer",
    padding: "10px 12px",
    border: "2px solid solid",
    borderRadius: 8,
    marginBottom: 8,
    transition: "background-color .15s ease, border-color .15s ease",
  },
  selected: { borderColor: "#0d6efd", background: "#e7f1ff" },
  correct:  { borderColor: "#198754", background: "#d1e7dd" },
  wrong:    { borderColor: "#dc3545", background: "#f8d7da" },
};

// safer: handle both index and string correctAnswer
const correctIndex =
  typeof correctAnswer === "number"
    ? correctAnswer
    : choices.indexOf(correctAnswer);


const styleFor = (index) => {
 
  if (!isAnswered) {
    return answerIdx === index
      ? { ...styles.base, ...styles.selected }
      : styles.base;
  }
  
  if (correctIndex >= 0) {
    return index === correctIndex
      ? { ...styles.base, ...styles.correct }
      : { ...styles.base, ...styles.wrong };
  }
  
  return index === answerIdx
    ? { ...styles.base, ...styles.wrong }
    : styles.base;
};
    return (<div className="quiz-container">
            {!showResult ? (
            <>
                <span className="active-question-no">{currentQuestion + 1}</span>
                <span className="total-question">/{questions.length}</span>
                <h2 >{question}</h2>
                <ul className="answers">
  {choices.map((choice, index) => (
    <li
      key={`${currentQuestion}-${index}`} 
      className="answer"
      style={styleFor(index)}
      onClick={() => onAnswerClick(choice, index)}
      role="button"
      aria-pressed={answerIdx === index}
    >
      {choice}
    </li>
  ))}
</ul>

                <div className="footer" style={{justifyContent:"space-between"}}>
                    <button onClick={onClickBack} style={{visibility: currentQuestion < 1 ? 'hidden' : 'visible' }} >Back</button>
                    <button onClick={onClickNext} disabled={!isAnswered}>
                        {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                    </button>       
                </div>
            </>) : <div className="result">
                    <h3>Result</h3>
                    <p>
                        Total Questions: <span>{questions.length}</span>
                    </p>
                    <p>
                        Total Score: <span>{result.score}</span>
                    </p>
                    <p>
                        Correct Answers: <span>{result.correctAnswers}</span>
                    </p>
                    <p>
                        Wrong Answers: <span>{result.wrongAnswers}</span>
                    </p>
                    <button onClick={onTryAgain}>Try again</button>
            </div>}
        </div>
    );
};
export default Quiz;