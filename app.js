const express = require('express')
const res = require('express/lib/response')
const calcError = require('./error')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/mean', (req, res, next) => {
    let nums = []
    if (!req.query.nums) throw new calcError('pass nums in as a non empty comma separated list', 400)
    try {
        for (let num of req.query.nums.split(',')){
            let val = Number(num)
            if (Number.isNaN(val)) throw new calcError(`${num} is not a number`, 500)
            else nums.push(val)   
        }
    }
    catch(err){
        next(err)
    }
   
    let numSum = nums.reduce((acc, val) => acc + val)
    let result = numSum / nums.length
    return res.send({ 'response': { 'operation': 'mean', 'value': result } })
})

app.get('/median', (req, res, next) => {
    if (!req.query.nums) throw new calcError('pass nums in as a non empty comma separated list', 400)
    let numArray = []
    try {
        for (let num of req.query.nums.split(',')){
            let val = Number(num)
            if (Number.isNaN(val)) throw new calcError(`${num} is not a number`, 500)
            else numArray.push(val)
        }
    }
    catch(err){
        next(err)
    }
    let nums = numArray.sort()
    let result;
    if (nums.length % 2 == 0) {
        result = (nums.length / 2) - 1
    } else {
        result = Math.floor(nums.length / 2)
    }
    return res.send({ 'response': { 'operation': 'median', 'value': nums[result] } })
})

app.get('/mode', (req, res, next) => {
    if (!req.query.nums) throw new calcError('pass nums in as a non empty comma separated list', 400)
    let nums = []
    try {
        for (let num of req.query.nums.split(',')){
            let val = Number(num)
            if (Number.isNaN(val)) throw new calcError(`${num} is not a number`, 500)
            else nums.push(val)   
        }
    }
    catch(err){
        next(err)
    }
    let freqObj = {}
    let max = 0;
    for (let i = 0; i < nums.length; i ++){
        if (!freqObj[nums[i]]){
            freqObj[nums[i]] = 1
        }
        else {
            freqObj[nums[i]] ++
        }
    }
    for (let [key, val] of Object.entries(freqObj)){
        if (val > max) max = key;
    }
    res.send({ 'response': { 'operation': 'mode', 'value': max} })
})

app.use((req, res, next) =>{
    const err = new calcError('Not Found', 404);
    return next(err)
})

app.use((err, req, res, next) => {
    return res.status(err.status).send(err.message)
})

app.listen(5000, function () {
    console.log('serving port 5000')
})