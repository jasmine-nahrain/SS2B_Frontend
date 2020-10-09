const proxy = 'http://127.0.0.1:8000/api/';
//const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDE5MTY0ODAsImlhdCI6MTYwMTkxNDY4MCwic3ViIjo4OTI3Mzk4fQ.O5hY-UK41Ztphxcq6gEA-5d-1JGLT5TXzOStzuxReNE";
/*
API GET EXAMS to return list of exams
Status codes: 200 OK
*/

class MissingTokenError extends Error {
    constructor() {
        super("Authentication token is missing.")
        this.name = "MissingTokenError"
    }
}

const getToken = () => {
    let token = localStorage.getItem('token');
    if (token === null) throw new MissingTokenError();
    return token;
}

export const getExams = async () => {
    try {
        let token = localStorage.getItem('token');
        if (token === null) throw new MissingTokenError();
        const url = proxy + "examiner/exam";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        let parsedData = await response.json();
        const status = response.status;

        // console.log('parsedData:', parsedData);
        // console.log('status:', status);
        // console.log('response: ', response)
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
        let token = localStorage.getItem('token');
        if (token === null) throw new MissingTokenError();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        });

        let parsedData = await response.json();
        const status = response.status;

        //console.log('parsedData:', parsedData);
        //console.log('status:', status);
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
    try {
        let token = getToken();

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

        const status = response.status;
        let parsedData = await response.json();
        // console.log(data);
        // console.log(status);
        // console.log(response);
        if (status === 201 || status == 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
}

/*
API Edit Exam to save new exam to db
Status codes: 200 OK
*/
export const editExam = async (exam_id, exam_name, subject_id, start_date, end_date, duration) => {
    try {
        let token = getToken();

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

        const status = response.status;
        let parsedData = await response.json();
        // console.log(parsedData);
        // console.log(status);
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
        let token = getToken();

        const url = proxy + "examiner/exam/delete/" + exam_id;

        //console.log('data:', data);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            }
        });

        const status = response.status;
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

        const status = response.status;
        // console.log('health response:', response);
        // console.log('health status:', status);
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
        let token = getToken();

        const url = proxy + "examinee/exam_recording";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        let parsedData = await response.json();
        const status = response.status;

        // console.log('parsedData:', parsedData);
        // console.log('status:', status);
        // console.log('response: ', response)
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
    try {
        let token = getToken();

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

        const status = response.status;
        let parsedData = await response.json();
        // console.log(data);
        // console.log(status);
        // console.log(response);
        if (status === 201 || status == 200) return parsedData;

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
    try {
        let token = getToken();

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

        const status = response.status;
        let parsedData = await response.json();
        // console.log(data);
        // console.log(status);
        // console.log(response);
        if (status === 201 || status == 200) return parsedData;

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
        let token = getToken();

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

        const status = response.status;
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
        let token = getToken();

        const url = proxy + "examiner/exam_warning";

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        let parsedData = await response.json();
        const status = response.status;

        // console.log('parsedData:', parsedData);
        // console.log('status:', status);
        // console.log('response: ', response)
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
    try {
        let token = getToken();

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

        const status = response.status;
        let parsedData = await response.json();
        // console.log(data);
        // console.log(status);
        // console.log(response);
        if (status === 201 || status == 200) return parsedData;

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
    try {
        let token = getToken();

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

        const status = response.status;
        let parsedData = await response.json();
        // console.log(data);
        // console.log(status);
        // console.log(response);
        if (status === 201 || status == 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
}

/*
 * DELETES exam warning
 * Status codes: 200 OK, 400 Bad Request, 500 Internal Server Error
*/
export const deleteExamWarning = async (exam_warning_id) => {
    try {
        let token = getToken();

        const url = proxy + "examiner/exam_warning/delete/" + exam_warning_id;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                "Authorization": token
            }
        });

        const status = response.status;
        //console.log('status:', status);
        return status === 200;
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
        return false;
    }
}
