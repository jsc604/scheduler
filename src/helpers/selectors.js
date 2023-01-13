export function getAppointmentsForDay(state, day) {
  const correctDay = state.days.find(days => days.name === day);
  if (!correctDay) {
    return [];
  }
  if (!correctDay.appointments) {
    return [];
  }
  return correctDay.appointments.map(id => state.appointments[id]);
};
