import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <p>{(error as Error)?.message}</p>
    </div>
  );
};

export { ErrorPage };
