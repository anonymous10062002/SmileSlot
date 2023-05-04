// interface Clinic {
//     name: string;
//     price: number;
// }

// interface Dentists {
//     name: string;
//     speciality: string;
//     availableTime: Date[];
// }

// interface Appointments {
//     dentist: string;
//     tooth: Dentist;
//     time: Date;
// }

// class Dentist {
//     private dentist: Dentist;
//     private clinic: Clinic;

//     constructor(dentist: Dentist, clinic: Clinic){
//         this.dentist = dentist;
//         this.clinic = clinic;
//     }

//     public getDentists(): Dentists[]{
//         return this.dentist;
//     }

//     public getClinic(): Clinic[]{
//         return this.clinic;
//     }

//     public findAvailableDentists(time: Date): Dentists[] {
//         return this.dentist.filter((s) => s.availableTimes.filter(el=>el.getTime()-time.getTime()===0));
//       }


//       public bookAppointment(dentist: Dentist, clinic: Clinic, time: Date): Appointment {
//         // Check if the stylist is available at the specified time
//         if (!this.dentist.filter((s) => s.availableTimes.filter(el=>el.getTime()-time.getTime()===0))) {
//           throw new Error(`Stylist ${dentist.name} is not available at ${time}`);
//         }
    
//         // Remove the time from the dentist's available times
//         dentist.availableTimes = dentist.availableTimes.filter((t) => t !== time);
    
//         // Create the appointment object
//         const appointment: Appointment = {
//           dentist,
//           clinic,
//           time,
//         };
    
//         return appointment;
//       }
    
// }