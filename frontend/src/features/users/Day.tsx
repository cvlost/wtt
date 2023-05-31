import React from 'react';
import { useParams } from 'react-router';

const Day = () => {
  const id = useParams().id as string;

  return <div>one Day {id}</div>;
};

export default Day;
