import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';

import db from '../db.json';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

const QuizContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState('');

  return (
    <>
      <Head>
        <title>AluraQuiz - The Legend of JavaScript</title>
        <meta name="og:image" content={db.bg} />
      </Head>
      <QuizBackground backgroundImage={db.bg}>
        <QuizContainer>
          <Widget>
            <Widget.Header>
              <h1>The Legend of Zelda</h1>
            </Widget.Header>
            <Widget.Content>
              <form onSubmit={(infosDoEvento) => {
                infosDoEvento.preventDefault();

                router.push(`quiz?name=${name}`);
              }}
              >
                <Input
                  name="nomedoUsuario"
                  value={name}
                  onChange={(e) => { setName(e.target.value); }}
                  placeholder="Diz aí seu nome"
                />
                <Button type="submit" disabled={name.length === 0}>
                  Jogar
                  {' '}
                  {name}
                </Button>
              </form>
            </Widget.Content>
          </Widget>

          <Widget>
            <Widget.Content>
              <h1>Quiz da galera</h1>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem!</p>
            </Widget.Content>
          </Widget>
          <Footer />
        </QuizContainer>
        <GitHubCorner projectUrl="https://github.com/leandrogripp" />
      </QuizBackground>
    </>
  );
}
