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