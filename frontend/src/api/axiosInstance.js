import axios from "axios"; // api call karann use karanva

const axiosInstance = axios.create({ // base url create karanva, api call karanna use karanva
    baseURL: "http://localhost:8081",
});

// ✅ REQUEST INTERCEPTOR (optional - for token)
axiosInstance.interceptors.request.use((config) => { // request send venn kalin run vena code ek
    const token = localStorage.getItem("token"); // local storage ekm token ek gannava
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // token ek thibboth header ekt add karanva
    }
    return config; // request config return karanva, api call venava
});

// ✅ RESPONSE INTERCEPTOR (for global error handling, e.g., auto logout on 401)
axiosInstance.interceptors.response.use( // response api call success venama run venava, error api call fail venama run venava
    (res) => res, // success response direct return karanva
    (err) => { // error response handle karanva
        if (err.response?.status === 401) {
            localStorage.clear(); // token clear karanva, user data clear karanva
            window.location.href = "/login"; // auto redirect karanva login page ekata, user unauthorized venama login page ekata redirect venava
        }
        return Promise.reject(err);// error response reject karanva, api call fail venama error handle karanna allow karanva
    }
);
export default axiosInstance;