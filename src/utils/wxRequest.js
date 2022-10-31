import Vue from 'vue'
import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: `http://wx.lsh-cat.com:8901`,
    // baseURL: `https://wx.lsh-cat.com`,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 20000 // request timeout
})

export default service