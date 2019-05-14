import axios from 'axios';


// baseURL
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = 'http://localhost:8002/api/';
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'http://106.12.198.147/music2/api/';
}
// axios.defaults.baseURL = 'http://localhost:8002/api/';
// timeout
axios.defaults.timeout = 10000;

//get 
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

//post
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}