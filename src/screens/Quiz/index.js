/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

          <img style={{ width: '20%' }} src="https://thumbs.gfycat.com/HollowNaughtyAfricanhornbill-small.gif" alt="Loading spinner" />
        </div>
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results }) {
  const router = useRouter();

  const { name } = router.query;

  const numberOfCorrect = results.reduce((acc, val) => (val ? acc + 1 : acc),
    0);

  return (
    <Widget>
      <Widget.Header>
        Resultado final
      </Widget.Header>
      <Widget.Content>
        {`Mandou bem, ${name}!`}
        <br />
        <br />
        {`Você acertou ${numberOfCorrect} questões!`}
        <br />
        <ul>
          {results.map((result, index) => {
            const key = `question__${index}`;
            return (
              <li key={key}>
                {`#${(index + 1).toString().padStart(2, '0')} \xa0\xa0 Resultado: \xa0\xa0 ${result ? 'Acertou' : 'Errou'}`}
              </li>
            );
          })}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const hasAlternativeSelected = selectedAlternative !== undefined;
  const isCorrect = selectedAlternative === question.answer;
  const questionId = `question__${questionIndex}`;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              onSubmit(selectedAlternative);
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 2 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              /* selected={alternativeIndex === selectedAlternative} */
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  checked={selectedAlternative === alternativeIndex}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Você Acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você Errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizScreen({ db }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  const [results, setResults] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz(selected) {
    setResults([...results, db.questions[questionIndex].answer === selected]);

    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}

QuestionWidget.protoTypes = {
  question: PropTypes.object.isRequired,
  questionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
