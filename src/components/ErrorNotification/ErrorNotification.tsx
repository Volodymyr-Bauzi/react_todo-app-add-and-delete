import cn from 'classnames';
import { ErrorMessage } from '../../types/error';

type ErrorNotificationProps = {
  errorMsg: ErrorMessage;
  isErrorShown: boolean;
  onHideError: () => void;
};

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMsg,
  isErrorShown,
  onHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isErrorShown,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {errorMsg}
    </div>
  );
};

export default ErrorNotification;
