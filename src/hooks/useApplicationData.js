// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function useApplicationData() {

//   const [state, setState] = useState({
//     day: 'Monday',
//     days: [],
//     appointments: {},
//     interviewers: {}
//   })

//   const setDay = day => setState({ ...state, day });

//   useEffect(() => {
//     Promise.all([
//       axios.get('http://localhost:8001/api/days'),
//       axios.get('http://localhost:8001/api/appointments'),
//       axios.get('http://localhost:8001/api/interviewers'),
//     ]).then((all) => {
//       setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
//     });
//   }, []);

//   function bookInterview(id, interview) {
//     const appointment = { ...state.appointments[id], interview: { ...interview } };
//     const appointments = { ...state.appointments, [id]: appointment };

//     const day = state.days.find(day => day.appointments.includes(id));
//     const dayIndex = state.days.indexOf(day);
//     const days = [...state.days];
//     days[dayIndex].spots--;

//     return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
//       .then(() => setState({ ...state, appointments }));
//   };

//   function cancelInterview(id) {
//     const appointment = { ...state.appointments[id], interview: null };
//     const appointments = { ...state.appointments, [id]: appointment };

//     const day = state.days.find(day => day.appointments.includes(id));
//     const dayIndex = state.days.indexOf(day);
//     const days = [...state.days];
//     days[dayIndex].spots++;

//     return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment)
//       .then(() => setState({ ...state, appointments }));
//   };

//   return { state, setDay, bookInterview, cancelInterview };
// };

import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const BOOK_INTERVIEW = 'BOOK_INTERVIEW';
const CANCEL_INTERVIEW = 'CANCEL_INTERVIEW';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case BOOK_INTERVIEW:
      const appointment = { ...state.appointments[action.id], interview: action.interview };
      const appointments = { ...state.appointments, [action.id]: appointment };
      const day = state.days.find(day => day.appointments.includes(action.id));
      const dayIndex = state.days.indexOf(day);
      const days = [...state.days];
      days[dayIndex].spots--;
      return { ...state, appointments, days }
    case CANCEL_INTERVIEW:
      const cancelledAppointment = { ...state.appointments[action.id], interview: null };
      const updatedAppointments = { ...state.appointments, [action.id]: cancelledAppointment };
      const foundDay = state.days.find(day => day.appointments.includes(action.id));
      const foundDayIndex = state.days.indexOf(foundDay);
      const updatedDays = [...state.days];
      updatedDays[foundDayIndex].spots++;
      return { ...state, appointments: updatedAppointments, days: updatedDays }
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers'),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    });
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: BOOK_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => dispatch({ type: CANCEL_INTERVIEW, id }));
  }

  return { state, setDay, bookInterview, cancelInterview };
};