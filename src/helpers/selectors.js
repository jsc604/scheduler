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

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    const interviewer = state.interviewers[interview.interviewer];
    return {
      student: interview.student,
      interviewer: {
        id: interviewer.id,
        name: interviewer.name,
        avatar: interviewer.avatar
      }
    };
  }
}

export function getInterviewersForDay(state, day) {
  const correctDay = state.days.find(days => days.name === day);
  if (!correctDay) {
    return [];
  }
  if (!correctDay.appointments) {
    return [];
  }
  const appointmentsForDay = correctDay.appointments.map(id => state.appointments[id]);
  const interviewers = appointmentsForDay.map(app => {
    if (app === undefined) {
      return [];
    }
    if (app.interview === null) {
      return [];
    } else {
      return state.interviewers[app.interview.interviewer]
    }
  })

  return [...new Set(interviewers)];
};
