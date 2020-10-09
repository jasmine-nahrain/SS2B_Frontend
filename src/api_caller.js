const proxy = 'http://127.0.0.1:8000/api/';
const token = localStorage.getItem('token');
/*
API GET EXAMS to return list of exams
Status codes: 200 OK
*/
export const getExams = async () => {
    try {
        const url = proxy + "examiner/exam";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        let parsedData = await response.json();
        const status = await response.status;

        console.log('parsedData:', parsedData);
        console.log('status:', status);
        console.log('response: ', response)
        if (status === 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return [[]];
}

/*
API GET EXAMINEES to return list of exams
Status codes: 200 OK
*/
export const getExaminees = async () => {
    try {
        const url = proxy + "examiner/examinee";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        });

        let parsedData = await response.json();
        const status = await response.status;

        console.log('parsedData:', parsedData);
        console.log('status:', status);
        if (status === 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return [[]];
}

/*
API Create Exam to save new exam to db
Status codes: 200 OK
*/
export const createExam = async (exam_name, subject_id, start_date, end_date, duration) => {
  try{
    const url = proxy + "examiner/exam/create";
    const data = JSON.stringify({
        "exam_name": exam_name,
        "subject_id": subject_id,
        "start_date": start_date,
        "end_date": end_date,
        "duration": duration,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: data
    });

    const status = await response.status;
    let parsedData = await response.json();
    console.log(data);
    console.log(status);
    console.log(response);
    if(status === 201 || status == 200) return parsedData;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}

/*
API Check for Unallowed Objects
Status codes: 200 OK, 400 BAD REQUEST, 500 INTERNAL SERVER ERROR
*/
export const deskcheck = async(image) => {
    try {
        const url = proxy + "examinee/deskcheck";

        // Creates form data object and adds image <-- not sure how to do this part
        var formdata = new FormData();
        //formdata.append("image", fileInput.files[0], "/C:/Users/Justin/Desktop/image1.jpg");
        // Delete this dummy line
        formdata.append("image", image);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        const response = await fetch(url, requestOptions);

        const status = response.status;
        console.log(status);

        if (status === 200) {
            let parsedData = await response.json();
            return parsedData
        }
        // fetch(url, requestOptions).then(function(response) {
        // // The response is a Response instance.
        // // You parse the data into a useable format using `.json()`
        //     return response.json();
        // }).then(function(data) {
        // // `data` is the parsed version of the JSON returned from the above endpoint.
        //     console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
        // });
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return null;
}

/*
API Upload Face Auth Image and Authenticate User
Status codes: 200 OK, 400 BAD REQUEST
*/
export const uploadFaceImage = async(user_id, image, authenticate=true) => {
    try {
        // Can either choose to upload image to authenticate or upload new image
        let url = proxy;
        if (authenticate) url += "examinee/face_authentication";
        else url += "examinee/upload_face";

        // Creates form data object and adds image & user id <-- not sure how to do get an image here
        var formdata = new FormData();
        //formdata.append("image", fileInput.files[0], "/C:/Users/Justin/Desktop/image1.jpg");
        formdata.append("user_id", user_id);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        const response = await fetch(url, requestOptions);

        const status = response.status;
        console.log(status);

        // If an upload of a new image, return True if successful
        if (!authenticate) return status === 200;
        // Else return if the sent image returned a positive id for the student
        if (status === 200) {
            let parsedData = await response.json();
            return parsedData["positive_id"]
        }
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return false;
}

/*
API Edit Exam to save new exam to db
Status codes: 200 OK
*/
export const editExam = async (exam_id, exam_name, subject_id, start_date, end_date, duration) => {
  try{
    const url = proxy + "examiner/exam/update";
    const data = JSON.stringify({
        "exam_id": exam_id,
        "exam_name": exam_name,
        "subject_id": subject_id,
        "start_date": start_date,
        "end_date": end_date,
        "duration": duration,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: data
    });

    const status = await response.status;
    let parsedData = await response;
    console.log(parsedData);
    console.log(status);
    return status === 201 || status == 200

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}

/*
Soft deletes circuit using student_id and circuit_name and returns true if successful
Status codes: 200 OK, 400 Bad Request, 500 Internal Server Error
*/
export const deleteExam = async (exam_id) => {
    try {
        const url = proxy + "examiner/exam/delete/" + exam_id;

        //console.log('data:', data);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            }
        });

        const status = await response.status;
        //console.log('status:', status);
        return status === 200;
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
        return false;
    }
}

/*
API Healthcheck to see if it's up and running
Status codes: 200 OK
*/
export const healthCheck = async () => {
    try {
        const url = proxy;

        const response = await fetch(url, {
            method: 'GET'
        });

        const status = await response.status;
        console.log('health response:', response);
        console.log('health status:', status);
        return status === 200;
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
        return false;
    }

}

/*
API GET EXAM RECORDING to return list of exams
Status codes: 200 OK
*/
export const getExamRecording = async () => {
    try {
        const url = proxy + "examinee/exam_recording";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        let parsedData = await response.json();
        const status = await response.status;

        console.log('parsedData:', parsedData);
        console.log('status:', status);
        console.log('response: ', response)
        if (status === 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return [[]];
}

/*
API Create Exam Recording to save new exam recording to db
Status codes: 200 OK
*/
export const createExamRecording = async (exam_id, user_id, time_started) => {
  try{
    const url = proxy + "examinee/exam_recording/create";
    const data = JSON.stringify({
        "exam_id": exam_id,
        "user_id": user_id,
        "time_started": time_started,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: data
    });

    const status = await response.status;
    let parsedData = await response.json();
    console.log(data);
    console.log(status);
    console.log(response);
    if(status === 201 || status == 200) return parsedData;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}


/*
API Edit Exam Recording to save new exam recording to db
Status codes: 200 OK
*/
export const editExamRecording = async (action, exam_recording_id) => {
  try{
    const url = proxy + "examinee/exam_recording/update";
    const data = JSON.stringify({
        "action": action,
        "exam_recording_id": exam_recording_id,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: data
    });

    const status = await response.status;
    let parsedData = await response.json();
    console.log(data);
    console.log(status);
    console.log(response);
    if(status === 201 || status == 200) return parsedData;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}

/*
 * DELETES exam recording
 * Status codes: 200 OK, 400 Bad Request, 500 Internal Server Error
*/
export const deleteExamRecording = async (exam_recording_id, user_id, password) => {
    try {
        const url = proxy + "examiner/exam_recording/" + exam_recording_id;
        const data = JSON.stringify({
            "user_id": user_id,
            "password": password,
        });

        //console.log('data:', data);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            body: data
        });

        const status = await response.status;
        //console.log('status:', status);
        return status === 200;
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
        return false;
    }
}

/*
API GET EXAM Warning to return list of exams
Status codes: 200 OK
*/
export const getExamWarning = async () => {
    try {
        const url = proxy + "examiner/exam_warning";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        let parsedData = await response.json();
        const status = await response.status;

        console.log('parsedData:', parsedData);
        console.log('status:', status);
        console.log('response: ', response)
        if (status === 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return [[]];
}

/*
API Create Exam warning to save new exam recording to db
Status codes: 200 OK
*/
export const createExamWarning = async (exam_recording_id, warning_time, description) => {
  try{
    const url = proxy + "examiner/exam_warning/create";
    const data = JSON.stringify({
        "exam_recording_id": exam_recording_id,
        "warning_time": warning_time,
        "description": description,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: data
    });

    const status = await response.status;
    let parsedData = await response.json();
    console.log(data);
    console.log(status);
    console.log(response);
    if(status === 201 || status == 200) return parsedData;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}


/*
API Edit Exam warning to save new exam recording to db
Status codes: 200 OK
*/
export const editExamWarning = async (exam_warning_id, warning_time, description) => {
  try{
    const url = proxy + "examiner/exam_warning/update";
    const data = JSON.stringify({
      "exam_warning_id": exam_warning_id,
      "warning_time": warning_time,
      "description": description,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: data
    });

    const status = await response.status;
    let parsedData = await response.json();
    console.log(data);
    console.log(status);
    console.log(response);
    if(status === 201 || status == 200) return parsedData;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}

/*
 * DELETES exam warning
 * Status codes: 200 OK, 400 Bad Request, 500 Internal Server Error
*/
export const deleteExamWarning = async (exam_warning_id, email, password) => {
    try {
        const url = proxy + "examiner/exam_warning/delete/" + exam_warning_id;
        const data = JSON.stringify({
            "email": email,
            "password": password,
        });

        //console.log('data:', data);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            },
            body: data
        });

        const status = await response.status;
        //console.log('status:', status);
        return status === 200;
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
        return false;
    }
}
