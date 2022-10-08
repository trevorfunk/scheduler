import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import useVisualMode from "hooks/useVisualMode";
import Empty from "./Empty";
import Form from "./Form.js";
import Status from "./Status.js";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  const { bookInterview, dailyInterviewers, id, time, interview } = props;

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer, id) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    bookInterview(id, interview);
    transition(SHOW);
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status />}
      {mode === SHOW && (
        <Show student={interview.student} interviewer={interview.interviewer} />
      )}

      {mode === CREATE && (
        <Form
          onCancel={() => back(EMPTY)}
          dailyInterviewers={dailyInterviewers}
          save={save}
          id={id}
        />
      )}
    </article>
  );
}
