// ---------- USING useReducer ---------- 
import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const BOOK_INTERVIEW = 'BOOK_INTERVIEW';
const CANCEL_INTERVIEW = 'CANCEL_INTERVIEW';

function updateSpots(appointments, days) {
  return days.map(day => {
    const unbookedSpots = day.appointments.filter(appointmentId => !appointments[appointmentId].interview).length;
    return { ...day, spots: unbookedSpots };
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers };
    case BOOK_INTERVIEW:
      const appointments = { ...state.appointments, [action.id]: { ...state.appointments[action.id], interview: action.interview } };
      const days = updateSpots(appointments, state.days);
      return { ...state, appointments, days };
    case CANCEL_INTERVIEW:
      const cancelledAppointment = { ...state.appointments[action.id], interview: null };
      const updatedAppointments = { ...state.appointments, [action.id]: cancelledAppointment };
      const updatedDays = updateSpots(updatedAppointments, state.days);
      return { ...state, appointments: updatedAppointments, days: updatedDays };
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  };
};

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

  async function bookInterview(id, interview) {
    await axios.put(`http://localhost:8001/api/appointments/${id}`, { interview });
    return dispatch({ type: BOOK_INTERVIEW, id, interview });
  };

  async function cancelInterview(id) {
    await axios.delete(`http://localhost:8001/api/appointments/${id}`);
    return dispatch({ type: CANCEL_INTERVIEW, id });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

// ---------- USING useState ---------- 

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

//  function updateSpots(appointments, days) {
//   return days.map(day => {
//     const unbookedSpots = day.appointments.filter(appointmentId => !appointments[appointmentId].interview).length;
//     return { ...day, spots: unbookedSpots }
//   });
// }

//   async function bookInterview(id, interview) {
//     const appointment = { ...state.appointments[id], interview: { ...interview } };
//     const appointments = { ...state.appointments, [id]: appointment };
//     const updatedDays = updateSpots(appointments, state.days);

//     await axios.put(`http://localhost:8001/api/appointments/${id}`, appointment);
//     return setState({ ...state, appointments, days: updatedDays });
//   };

//   async function cancelInterview(id) {
//     const appointment = { ...state.appointments[id], interview: null };
//     const appointments = { ...state.appointments, [id]: appointment };
//     const updatedDays = updateSpots(appointments, state.days);

//     await axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment);
//     return setState({ ...state, appointments, days: updatedDays });
//   };

//   return { state, setDay, bookInterview, cancelInterview };
// };