import React from "react";

import DayListItem from "./DayListItem";


export default function DayList({ days, day, setDay }) {
 return (
  <ul>
   {days.map(({ id, name, spots }) => {
    return <DayListItem key={id} name={name} spots={spots} setDay={setDay} selected={name === day}></DayListItem>
   })}
  </ul>
 );
}