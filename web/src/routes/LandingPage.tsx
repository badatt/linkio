import React from 'react';
import { useParams } from 'react-router-dom';

export default function () {
  const { slug } = useParams();
  return <div>Landing page for {slug}</div>;
}
