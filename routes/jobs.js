const express = require("express");


const db = require("../db");

const err = require("../expressError.js");

const Job = require("../models/job.js");
const { checkAdminStatus } = require("../middleware/auth");



const router = express.Router();


// All Jobs 
// GET "/jobs"
// Add filters for minimum salary as "minSalary", check for equity as "equity" and job title search as "title" in the query string

router.get("/", async function(req, res, next) {

    try {
        const qObj = req.query;
        if (req.query.minSalary !== undefined) qObj.minSalary = Number(req.query.minSalary);
        if (req.query.title !== undefined) qObj.title = req.query.title;
        if (req.query.hasEquity === "true") qObj.hasEquity = 1;

        const allJobs = await Job.getAllJobs(qObj);
        return res.json(allJobs);

    } catch(e) {
        return next(e);
    }

})

router.post("/", checkAdminStatus, async function(req, res, next) {
    // Create New Job
    // POST { title, salary, equity, companyHandle }
    // Only Admins are allowed to create Jobs

    try {
        const newJob = Job.createJob(req.body);
        return res.json(newJob)
    } catch(e) {
        return next(e)
    }
})


router.get("/:jobId", async function(req, res, next) {
    // Get a specific job by ID
    // 
    try {
        const foundJob = await Job.findJob(req.params.jobId);
        return res.json(foundJob)
    } catch(e) {
        return next(e)
    }
})


router.patch("/:jobId", checkAdminStatus, async function(req, res, next) {
    // Update a specific job by ID
    // Update data : {title, salary, equity}
    // Only Admins are allowed to updated Jobs
    try {
        const updatedJob = await Job.updateJob(req.params.jobId, req.body);
        console.log(updatedJob);
        return res.json(updatedJob)
    } catch(e) {
        return next(e)
    }
})


router.delete("/:jobId", checkAdminStatus, async function(req, res, next) {
    // Delte a specifc job by ID
    // DELETE /jobId
    // Only Admins are allowed to delete Jobs

    try {
        const removedJob = Job.deleteJob(req.params.jobId);
        return res.json({
            status: "Deleted",
            job: removedJob
        })
    } catch(e) {
        return next(e)
    }
})


module.exports = router;