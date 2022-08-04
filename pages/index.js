import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import { NextSeo } from 'next-seo';
import BlueBlob from "../components/BlueBlob"
import TriviaPiece from "../components/TriviaPiece"
import YellowBlob from "../components/YellowBlob"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [trivia, setTrivia] = useState([])
  const [checkAnswers, setCheckAnswers] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  function getNewData() {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then(res => res.json())
      .then(json => setTrivia(json.results.map(result => {
        const answers = []
        answers.push({
          id: nanoid(),
          string: result.correct_answer,
          isCorrect: true,
          isSelected: false
        })
        result.incorrect_answers.forEach(answer => {
          answers.push({
            id: nanoid(),
            string: answer,
            isCorrect: false,
            isSelected: false
          })
        })
        return {
          id: nanoid(),
          question: result.question,
          answers: shuffle(answers)
        }
       })))
  }

  useEffect(() => {
    getNewData()
  }, [])

  useEffect(() => {
    console.log(trivia)
  }, [trivia])

  function selectAnswer(triviaId, answerId) {
    setTrivia(prevTrivia => {
      return prevTrivia.map(triviaPiece => {
        return triviaPiece.id === triviaId ?
          ({
            ...triviaPiece, 
            answers: triviaPiece.answers.map(answer => {
              return answer.id === answerId ?
                {
                  ...answer,
                  isSelected: true
                } :
                {
                  ...answer,
                  isSelected: false
                }
            })
          }) :
          triviaPiece
      })
    })
  }

  function submitAnswers() {
    setCheckAnswers(true)
    let correctTally = 0;
    trivia.forEach(triviaPiece => {
      triviaPiece.answers.forEach(answer => {
        answer.isCorrect && answer.isSelected && correctTally++
      })
    })
    setCorrectAnswers(correctTally)
  }

  function newGame() {
    getNewData()
    setCorrectAnswers(0)
    setCheckAnswers(false)
  }
  
  return (
    <>
      <NextSeo
        title="Quizzical"
        description="A quiz application to test your knowledge."
      />
      <main>
              <div className="blob-container-1">
                <BlueBlob />
              </div>

              { showIntro ? 

                <div className="intro-container">
                  <h1 className="title">Quizzical</h1>
                  <h3 className="description">Test Your Trivia Knowledge</h3>
                  <button className="start-button" onClick={() => setShowIntro(false)}>Start Quiz</button>
                  <br />
                  <small>Developed by Carl Locigno</small>
                </div> :
                
                <div className="questions-container">
                  {trivia.map(triviaPiece => 
                    <TriviaPiece
                      key={triviaPiece.id} 
                      question={triviaPiece.question} 
                      answers={triviaPiece.answers} 
                      id={triviaPiece.id}
                      selectAnswer={selectAnswer}
                      checkAnswers={checkAnswers}
                    />
                  )}
                  <div className="bottom-container">
                    {checkAnswers && <h3 className="bottom-text">{`You scored ${correctAnswers}/5 correct answers`}</h3>}
                    <button 
                      className="check-answers-button"
                      onClick={checkAnswers ? newGame : submitAnswers}
                    >
                      {checkAnswers ? "Play Again" : "Check Answers"}
                    </button>
                  </div>
                </div>
              }

              <div className="blob-container-2">
                <YellowBlob />
              </div>         
      </main>
    </>
  )
}

