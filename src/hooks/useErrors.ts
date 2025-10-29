import { useState } from 'react';
import { ErrorMessage } from '../types/error';

const useErrors = () => {
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.LoadingTodos,
  );

  const hideError = () => {
    setShowErrorNotification(false);

    setTimeout(() => {
      setErrorMessage(ErrorMessage.Null);
    }, 800);
  };

  const showError = (errorMsg: ErrorMessage) => {
    setErrorMessage(errorMsg);
    setShowErrorNotification(true);

    setTimeout(() => {
      hideError();
    }, 4000);
  };

  return {
    errorMessage,
    showErrorNotification,
    showError,
    hideError,
    setErrorMessage,
  };
};

export default useErrors;
