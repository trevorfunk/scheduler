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

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  function updateSpots(addApp) {
    const days = state.days.map((day) => {
      if (day.name !== state.day) {
        return { ...day };
      } else {
        if (addApp === undefined) {
          return { ...day, spots: day.spots + 1 };
        } else if (addApp === addApp) {
          return { ...day, spots: day.spots - 1 };
        }
      }
    });
    return days;
  }

  function bookInterview(id, interview) {
    const addApp = "add Appointment";
    return axios.put(`api/appointments/${id}`, { interview }).then((res) => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      const days = updateSpots(addApp);
      setState((prev) => ({ ...prev, appointments, days }));
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

      const days = updateSpots();
      setState({ ...state, appointments, days });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
