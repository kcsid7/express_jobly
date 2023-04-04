
const db = require("../db.js");

const err = require("../expressError.js");
const { sqlForPartialUpdate } = require("../helpers/sql.js")



class Job {
    // Job class that is used to interact with the database to fetch, update, and delete job data
    // Job table contains { id, title, salary, equity, company_handle } as Columns
    // Job table "company_handle" references the Companies tables "handle" column and is deleted on cascade


    static async getAllJobs(qObj={}) {
        // Gets all jobs
        // matches the query of minSalary, equity option, company

        const { title, minSalary, hasEquity } = qObj

        const paramValues = []
        const filterConditions = []
        
        // Check if values are defined in the queryObject
        if (minSalary !== undefined) {
        paramValues.push(minSalary);
        filterConditions.push(`salary >= $${paramValues.length}`);
        }
        
        if (title !== undefined) {
        paramValues.push(`%${title}%`)
        filterConditions.push(`title ILIKE $${paramValues.length}`);
        }


        if (hasEquity !== undefined) {
        paramValues.push(hasEquity);
        filterConditions.push(`equity > 0`);
        }
        

        let queryStr = `
                        SELECT jobs.*, companies.name FROM jobs 
                        LEFT JOIN companies
                        ON companies.handle = jobs.company_handle
                        `

        if (filterConditions.length > 0) {
            queryStr = queryStr + ` WHERE ` + filterConditions.join(" AND ")
        }

        queryStr += ";";

        const qRes = await db.query(queryStr, paramValues)

        return qRes.rows;
    }


    static async createJob(job) {
        const { title, salary, equity, companyHandle } = job
        const result = await db.query(
            `INSERT INTO jobs (title, salary, equity, company_handle) VALUES ($1, $2, $3, $4) 
                RETURNING id, title, salary, equity, company_handle`,
            [ title, salary, equity, companyHandle ]);

      let newJob = result.rows[0];
  
      return newJob;
    }


    static async findJob(job) {
        const foundJob = await db.query(`SELECT * from jobs WHERE id = $1`, [job]);
      
        if ( !foundJob.rows[0] ) throw new err.NotFoundError(`Job ${id} not found!`)

        return foundJob.rows[0];
    }

    static async updateJob(job, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const handleVarIdx = "$" + (values.length + 1);
    
        const querySql = `UPDATE jobs 
                          SET ${setCols} 
                          WHERE id = ${handleVarIdx} 
                          RETURNING id, 
                                    title, 
                                    salary, 
                                    equity, 
                                    company_handle`;
        const result = await db.query(querySql, [...values, job]);
        const updatedJob = result.rows[0];
    
        if (!updatedJob) throw new NotFoundError(`No company: ${job}`);
           
        return updatedJob;
    }

    static async deleteJob(jobId) {
        const removedJob = await db.query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [jobId])
        
        if ( !removedJob.rows[0] ) throw new err.NotFoundError(`Job ${id} not found!`)
        
        return removedJob.rows[0]
    }
}

module.exports = Job;