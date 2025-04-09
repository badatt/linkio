import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function () {
  const { slug } = useParams();
  const [message, setMessage] = React.useState<string>('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/links/${slug}`)
      .then((response) => {
        console.log('Response:', response.data);
        if (response.data) {
          window.location.href = response.data.location;
        } else {
          setMessage('Error: No data received');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Error: Unable to load the URL');
      });
  }, [slug]);

  return <div>{message}</div>;
}
