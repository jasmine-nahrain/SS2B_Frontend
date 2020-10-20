import { convertToParamString, getToken } from './functions.js';

const proxy = 'http://127.0.0.1:8000/api/';

/*
API GET EXAMS to return list of exams
Status codes: 200 OK
*/

export const getExams = async (parameters=null) => {
    try {
        let token = getToken();

        let params = convertToParamString(parameters);
        const url = proxy + "examiner/exam" + params;

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
    return {"exams":[], "next_page_exists":false};
}

/*
API GET EXAMINEES to return list of exams
Status codes: 200 OK
*/
export const getExaminees = async (parameters=null) => {
    try {

        let token = getToken();

        let params = convertToParamString(parameters);
        const url = proxy + "examiner/examinee" + params;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        });
        // console.log(parameters);
        let parsedData = await response.json();
        const status = response.status;

        // console.log('parsedData:', parsedData);
        // console.log('status:', status);
        if (status === 200) return parsedData;

    } catch (error) {
        console.error(error.stack || error);
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return {"users":[], "next_page_exists":false};
}

/*
API Create Exam to save new exam to db
Status codes: 200 OK
*/
export const createExam = async (exam_name, subject_id, start_date, end_date, duration, document_link) => {
    try {
        let token = getToken();

        const url = proxy + "examiner/exam/create";
        const data = JSON.stringify({
            "exam_name": exam_name,
            "subject_id": subject_id,
            "start_date": start_date,
            "end_date": end_date,
            "duration": duration,
            "document_link": document_link
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
API Check for Unallowed Objects
Status codes: 200 OK, 400 BAD REQUEST, 500 INTERNAL SERVER ERROR
*/
export const deskcheck = async(image) => {
    try {
        // Needs to be updated so it gets token as per other branch and throws error if not found
        let token = getToken();
        const url = proxy + "examinee/deskcheck";

        // Creates form data object and adds image <-- not sure how to do this part
        var formdata = new FormData();
        formdata.append("image", image);

        var requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": token
            },
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
        let token = 'null';
        if (authenticate) token = getToken();

        let url = proxy;
        if (authenticate) url += "examinee/face_authentication";
        else url += "examinee/upload_face";

        // Creates form data object and adds image & user id <-- not sure how to do get an image here
        var formdata = new FormData();
        formdata.append("user_id", user_id);
        formdata.append("image", image);

        var requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": token
            },
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
export const editExam = async (exam_id, exam_name, subject_id, start_date, end_date, duration, document_link) => {
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
            "document_link": document_link
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
    return null;
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
export const getExamRecording = async (parameters=null) => {
    try {
        let token = getToken();
        let params = convertToParamString(parameters);
        const url = proxy + "examinee/exam_recording" + params;

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
    return {"exams_recordings":[], "next_page_exists":false};
}

/*
API Create Exam Recording to save new exam recording to db
Status codes: 200 OK
*/
export const createExamRecording = async (exam_id, user_id) => {
    try {
        let token = getToken();
        //const time_started = new Date().toLocaleTimeString('it-IT');
        const url = proxy + "examinee/exam_recording/create";
        const data = JSON.stringify({
            "exam_id": exam_id,
            "user_id": user_id
            //"time_started": time_started,
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
        console.log(data);
        console.log(status);
        console.log(response);
        if (status === 201 || status == 200) return parsedData;

    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return null;
}


/*
API Edit Exam Recording to save new exam recording to db
Status codes: 200 OK
Possible values for action include "end" and "update_link", "end" by default
*/
export const editExamRecording = async (exam_recording_id, action="end", video_link=null) => {
    try {
        let token = getToken();

        const url = proxy + "examinee/exam_recording/update";
        action = action.toLowerCase();

        if (["end","update_link"].includes(action)) {
            // Fine for video_link to be null - if action is end, it'll be ignored
            const data = JSON.stringify({
                "action": action,
                "exam_recording_id": exam_recording_id,
                "video_link": video_link
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
        }
        
    } catch (error) {
        console.log(error);
        alert(`An error occured: "${error}"`);
    }
    return null;
}

/*
 * DELETES exam recording
 * Status codes: 200 OK, 400 Bad Request, 500 Internal Server Error
*/
export const deleteExamRecording = async (exam_recording_id) => {
    try {
        let token = getToken();

        const url = proxy + "examiner/exam_recording/" + exam_recording_id;

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
API GET EXAM Warning to return list of exams
Status codes: 200 OK
*/
export const getExamWarning = async (parameters=null) => {
    try {
        let token = getToken();
        let params = convertToParamString(parameters);
        const url = proxy + "examiner/exam_warning" + params;

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
    return {'exam_warnings':[], 'next_page_exists':false};
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
    return null;
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
    return null;
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
