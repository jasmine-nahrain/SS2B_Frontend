export const getUserID = (is_student=true) => {
  if (is_student) return parseInt(localStorage.getItem('student_id'));
  else return parseInt(localStorage.getItem('admin_id'));
}
