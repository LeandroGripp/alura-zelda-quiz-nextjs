import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import Link from '../src/components/Link';

import db from '../db.json';

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
          <QuizLogo />
          <Widget
            as={motion.section}
            transition={{delay: 0, duration: 0.5}}
            variants={{ 
              show: {opacity: 1, y: '0'},
              hidden: {opacity: 0, y:'100%'},
            }}
            initial="hidden"
            animate="show"
          >
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
                  {`Jogar ${name}`}
                </Button>
              </form>
            </Widget.Content>
          </Widget>

          <Widget
           as={motion.section}
           transition={{delay: 0.5, duration: 0.5}}
           variants={{ 
             show: {opacity: 1},
             hidden: {opacity: 0},
           }}
           initial="hidden"
           animate="show"
          >
            <Widget.Content>
              <h1>Quizzes da galera</h1>
              <ul>
                {db.external.map((linkExterno) => {
                  const [projectName, githubUser] = linkExterno
                    .replace(/\//g, '')
                    .replace('https:', '')
                    .replace('.vercel.app', '')
                    .split('.');

                  const textoDoLink = `${githubUser} / ${projectName}`;

                  return (
                    <li key={linkExterno}>
                      <Widget.Topic href={`/quiz/${projectName}___${githubUser}`} as={Link}>
                        {textoDoLink}
                      </Widget.Topic>
                    </li>
                  );
                })}
              </ul>
            </Widget.Content>
          </Widget>
          <Footer 
            as={motion.footer}
            transition={{delay: 1, duration: 0.5}}
            variants={{ 
              show: {opacity: 1, y: '0'},
              hidden: {opacity: 0, y:'100%'},
            }}
            initial="hidden"
            animate="show"
          />
        </QuizContainer>
        <GitHubCorner projectUrl="https://github.com/leandrogripp" />
      </QuizBackground>
    </>
  );
}
