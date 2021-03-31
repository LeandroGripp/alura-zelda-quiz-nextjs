import React from 'react';
import QuizScreen from '../../src/screens/Quiz';

import db from '../../db.json';

export default function QuizPage() {
  return <QuizScreen db={db} />;
}
