export const getUserID = (is_student=true) => {
  if (is_student) return parseInt(localStorage.getItem('student_id'));
  else return parseInt(localStorage.getItem('admin_id'));
}

export const getMonth = (month) => {
  switch(month) {
    case 'Jan': return '01';
    case 'Feb': return '02';
    case 'Mar': return '03';
    case 'Apr': return '04';
    case 'May': return '05';
    case 'Jun': return '06';
    case 'Jul': return '07';
    case 'Aug': return '08';
    case 'Sep': return '09';
    case 'Oct': return '10';
    case 'Nov': return '11';
    case 'Dec': return '12';
  }
}

export const getCurrentDate = () => {
  return new Date().toLocaleDateString("GMT").split('/');
}

export const inProgress = (row) => {
  var currentDate = getCurrentDate();
  var start = row.start_date.split(" ");
  var end = row.end_date.split(" ");

  var start_date = start[0].split('-');
  var end_date = end[0].split('-');

  if(end_date[2] >= currentDate[0] && end_date[1] >= currentDate[1] &&
    end_date[0] >= currentDate[2] &&
    start_date[2] <= currentDate[0] && start_date[1] <= currentDate[1] &&
      start_date[0] <= currentDate[2]) {
       return true;
   } else {
     return false;
   }
}


export const getEndDate = (start_time, start_date, duration_hours, duration_minutes) => {
  var time = start_time.split(':');
  time[0] = parseInt(time[0]) + parseInt(duration_hours);
  time[1] = parseInt(time[1]) + parseInt(duration_minutes);
  var startDate = start_date.split('-');

  for(var i = 0; i < startDate.length; i++) {
    startDate[i] = parseInt(startDate[i]);
  }

  if(time[1] >= 60) {
    time[1] -= 60;
    time[0] += 1;
  }
  if(time[0] >= 24) {
    time[0] -= 24;
    startDate[2]++;
  }
  let date = new Date(startDate[0], startDate[1]-1, startDate[2], time[0], time[1]);
  return date;
}

export const getDate = (date,  time) => {
  var dateArr = date.split('-')
  var timeArr =  time.split(':');
  return new Date(dateArr[0], dateArr[1]-1, dateArr[2], timeArr[0], timeArr[1]);
}

export const getTime = (hours, minutes) => {
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).toLocaleTimeString('it-IT');
}
