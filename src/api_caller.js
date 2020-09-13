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
API GET EXAMINEES to return list of exams
Status codes: 200 OK
*/
export const getExaminees = async () => {
    try {
        const url = proxy + "examiner/examinee";

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
