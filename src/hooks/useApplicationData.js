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

  //Function to get data from the api using axios
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

  function updateSpots(state, appointments) {
    const dayObj = state.days.find((d) => d.name === state.day);
    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    const newDay = { ...dayObj, spots };
    const days = state.days.map((d) => (d.name === state.day ? newDay : d));

    return days;
  }
  //Function adds new appoinment to database so it can show user saved appointment
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

      const days = updateSpots(state, appointments);
      setState((prev) => ({ ...state, appointments, days }));
    });
  }
  //Function deletes id in the database so it can show user canceled appointment
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

      const days = updateSpots(state, appointments);
      setState((prev) => ({ ...state, appointments, days }));
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
