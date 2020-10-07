import axios from 'axios';
const proxy = 'http://127.0.0.1:8000/api/';

/*
API Register
Status codes: 200 OK || 201 CREATED
*/
export const register = async (newUser) => {
  try{
    const url = proxy + "register";
    const data = JSON.stringify({
      user_id: newUser.user_id,
      is_examiner: newUser.is_examiner,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      password: newUser.password,
      confirm_examiner: newUser.confirm_examiner
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });

    const status = await res.status;
    let parsedData = await res.json();
    console.log(parsedData)
    console.log(res)
    return status == 200 || status == 201;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}

/*
API Login
Status codes: 200 OK
*/
export const login = async (user_id, password) => {
  try{
    const url = proxy + "login";
    const data = JSON.stringify({
        "user_id": user_id,
        "password": password,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });

    const status = await res.status;
    let parsedData = await res.json();
    console.log(parsedData)
    console.log(res)

    if (status === 200) {
        localStorage.setItem('token', parsedData.token);
        if (parsedData.is_examiner) localStorage.setItem('examiner_id', parsedData.user_id);
        else localStorage.setItem('user_id', parsedData.user_id);
        localStorage.setItem('is_examiner', parsedData.is_examiner);
    }

    return status == 200;

  } catch (error) {
      console.log(error);
      alert(`An error occured: "${error}"`);
  }
}

export const isValidPassword = (password) => {
    var min_length = 8;
    var letter = /[a-zA-Z]/;
    var number = /[0-9]/;
    return (password.length >= min_length) && number.test(password) && letter.test(password);
  }
