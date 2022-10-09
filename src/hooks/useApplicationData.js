import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    return axios.put(`api/appointments/${id}`, { interview }).then((res) => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      setState({
        ...state,
        appointments,
      });
    });
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`).then((res) => {
      const appointment = {
        ...state.appointments[id],
        interview: null,
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      setState({
        ...state,
        appointments,
      });
    });
  }

  return { state, setState, setDay, bookInterview, cancelInterview };
}
