import React from "react";

import InterviewerListItem from "./InterviewerListItem";
import 'components/InterviewerList.scss'


export default function InterviewerList({ interviewers, value, onChange }) {
      return (
            <section className="interviewers">
                  <h4 className="interviewers__header text--light">Interviewer</h4>
                  <ul className="interviewers__list">{interviewers.map(({ id, name, avatar }) => {
                        return <InterviewerListItem
                              key={id}
                              id={id}
                              name={name}
                              avatar={avatar}
                              selected={id === value}
                              setInterviewer={() => onChange(id)}
                        ></InterviewerListItem>
                  })}</ul>
            </section>
      )

}