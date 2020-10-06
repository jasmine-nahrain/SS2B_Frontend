import axios from 'axios';

export const register = async newUser => {
    try {
        const res = await axios.post('/register', {
            user_id: newUser.user_id,
            is_examiner: newUser.is_examiner,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            password: newUser.password,
            confirm_examiner: newUser.confirm_examiner
        });
      
        //console.log(res);
        const status = await res.status;
        return status === 201;
    }
    catch (error) {
        console.log(error);
        //alert(`An error occured: "${error}"`);
        return false;
    }
}

export const login = async user => {
    try {
        const res = await axios.post('login', {
            user_id: user.user_id,
            password: user.password
        });
        
        const status = await res.status;
        if (status === 200) {
            localStorage.setItem('token', res.data.token);
            if (res.data.is_examiner) localStorage.setItem('examiner_id', res.data.user_id);
            else localStorage.setItem('user_id', res.data.user_id);
            localStorage.setItem('is_examiner', res.data.is_examiner);
        }
        return status === 200;
    }
    catch (error) {
        console.log(error);
        //alert(`An error occured: "${error}"`);
        return false;
    }
}

export const isValidPassword = (password) => {
    var min_length = 8;
    var letter = /[a-zA-Z]/;
    var number = /[0-9]/;
    return (password.length >= min_length) && number.test(password) && letter.test(password);
  }