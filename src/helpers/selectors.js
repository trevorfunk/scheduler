export function getAppointmentsForDay(state, day) {
 let dayAppointments = [];
  let appointmentData = [];


  for (const dayTitle of state.days) { 
    if (dayTitle.name === day) {
      dayAppointments = dayTitle.appointments;   
    };  
  };

  for (const appointment of dayAppointments) {
    const result = state.appointments[appointment.toString()];
    appointmentData.push(result);
  }
  return appointmentData;
};

export function getInterview(state, interview) {
 if (!interview) {
  return null;
 }

  const interviewData =
  {
   student: interview.student,
   interviewer: state.interviewers[interview.interviewer]
  }
  
 return interviewData;
 
};