import Vue from 'vue'
import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: `https://apiqa.lshmec.cn/4WX`,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 20000 // request timeout
})

export default service