var he = require('he');

export default function TriviaPiece({question, answers, id, selectAnswer, checkAnswers}) {
    return (
        <div>
            <h3 className='question-text'>{he.decode(question)}</h3>
            <div>
                {answers.map(answer => 
                    <button key={answer.id} 
                            className= {`answer-button 
                                        ${answer.isSelected && "selected"} 
                                        ${answer.isCorrect && checkAnswers && "correct"}
                                        ${answer.isSelected && !answer.isCorrect && checkAnswers && "incorrect"}`}
                            onClick={()=> !answer.isSelected && selectAnswer(id, answer.id)}
                            disabled={checkAnswers}
                    >       
                        {he.decode(answer.string)}
                    </button>)}
            </div>
            <hr />
        </div>
    )
}