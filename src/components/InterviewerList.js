import React from "react";

import InterviewerListItem from "./InterviewerListItem";
import 'components/InterviewerList.scss'


export default function InterviewerList({ interviewers, interviewer, setInterviewer }) {
return (
 <section className="interviewers">
  <h4 className="interviewers__header text--light">Interviewer</h4>
  <ul className="interviewers__list">{interviewers.map(({ id, name, avatar }) => {
   return <InterviewerListItem key={id} id={id} name={name} avatar={avatar} selected={id === interviewer} setInterviewer={setInterviewer} ></InterviewerListItem>
      })}</ul>
</section>
)

}