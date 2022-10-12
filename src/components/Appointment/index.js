import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import useVisualMode from "hooks/useVisualMode";
import Empty from "./Empty";
import Form from "./Form.js";
import Status from "./Status.js";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { bookInterview, interviewers, id, time, interview, cancelInterview } =
    props;

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function edit(id) {
    transition(EDIT);
  }

  function onSave(name, interviewer, id) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch((err) => {
        transition(ERROR_SAVE);
      });
  }

  function onDelete(id) {
    transition(CONFIRM);
  }

  function confirm() {
    transition(DELETING, true);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch((err) => {
        transition(ERROR_DELETE, true);
      });
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === SHOW && (
        <Show
          student={interview && interview.student}
          interviewer={interview && interview.interviewer}
          onDelete={onDelete}
          id={id}
          edit={edit}
        />
      )}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === EDIT && (
        <Form
          onCancel={() => back()}
          student={interview.student}
          interviewer={interview.interviewer}
          interviewers={interviewers}
          onSave={onSave}
          id={id}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Do you want to delete?"}
          confirm={() => confirm()}
          onCancel={() => back()}
        />
      )}

      {mode === CREATE && (
        <Form
          onCancel={() => back()}
          interviewers={interviewers}
          onSave={onSave}
          id={id}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not create appointment."
          onClose={() => transition(SHOW)}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not cancel appointment."
          onClose={() => transition(SHOW)}
        />
      )}
    </article>
  );
}
