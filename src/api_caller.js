const proxy = 'http://127.0.0.1:8000/api/';

/*
API GET EXAMS to return list of exams
Status codes: 200 OK
*/
export const getExams = async () => {
    try {
        const url = proxy + "examiner/exam";

        const response = await fetch(url, {
            method: 'GET'
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
    const data = {
        "exam_name": exam_name,
        "subject_id": subject_id,
        "start_date": start_date,
        "end_date": end_date,
        "duration": duration
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });

    const status = await response.status;
    console.log(data);
    console.log(status);
    return status === 201 || status == 200;

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
