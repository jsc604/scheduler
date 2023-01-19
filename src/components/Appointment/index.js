import React from "react";
import 'components/Appointment/styles.scss';
import useVisualMode from "hooks/useVisualMode";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  };

  function deleteAppointment() {
    transition(DELETE, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  };

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={'Saving...'} />}
      {mode === DELETE && <Status message={'Deleting...'} />}
      {mode === ERROR_SAVE && <Error message={'Error saving appointment!'} onClose={back} />}
      {mode === ERROR_DELETE && <Error message={'Error deleting appointment!'} onClose={back} />}
      {mode === CONFIRM && <Confirm
        message={'Are you sure you want to delete this appointment?'}
        onConfirm={deleteAppointment}
        onCancel={back}
      />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          student={props.interview !== null && props.interview.student}
          interviewer={props.interview !== null && props.interview.interviewer.id}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(CREATE)}
        />
      )}
    </article>
  );
};