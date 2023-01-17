import { useState, useEffect } from "react";
import axios from "axios";

export default function (useApplicationData) {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers'),
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = { ...state.appointments[id], interview: { ...interview } };
    const appointments = { ...state.appointments, [id]: appointment };
    const day = state.days.find(day => day.appointments.includes(id));
    const dayIndex = state.days.indexOf(day);

    const days = [...state.days];
    days[dayIndex].spots--;

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => setState({ ...state, appointments }));
  };

  function cancelInterview(id) {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const day = state.days.find(day => day.appointments.includes(id));
    const dayIndex = state.days.indexOf(day);

    const days = [...state.days];
    days[dayIndex].spots++;


    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => setState({ ...state, appointments }));
  };

  return { state, setDay, bookInterview, cancelInterview };
};