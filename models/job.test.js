"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("POST ROUTE / create new job", function () {
  let newJob = {
    companyHandle: "apple",
    title: "Test Engineer",
    salary: 100000,
    equity: "0.01",
  };

  test("Create a New Job", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("find all jobs in the database that either match the filters or without any filters", function () {
  test("Find All Jobs in the database", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: 1,
        title: "TestJob1",
        salary: 10000,
        equity: "0.05",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: 2,
        title: "TestJob2",
        salary: 50000,
        equity: "3",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: 3,
        title: "TestJob3",
        salary: 100000,
        equity: "0",
        companyHandle: "c2",
        companyName: "C2",
      }
    ]);
  });

  test("Minimum Salary Filter", async function () {
    let jobs = await Job.findAll({ minSalary: 100000 });
    expect(jobs).toEqual([
      {
        id: 3,
        title: "TestJob3",
        salary: 100000,
        equity: "0",
        companyHandle: "c2",
        companyName: "C2",
      },
    ]);
  });

  test("Equity Filter", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
        {
        id: 1,
        title: "TestJob1",
        salary: 10000,
        equity: "0.05",
        companyHandle: "c1",
        companyName: "C1",
        },
        {
        id: 2,
        title: "TestJob2",
        salary: 50000,
        equity: "3",
        companyHandle: "c1",
        companyName: "C1",
        }
    ]);
  });

  test("Name: Filter", async function () {
    let jobs = await Job.findAll({ title: "2" });
    expect(jobs).toEqual([
        {
        id: 2,
        title: "TestJob2",
        salary: 50000,
        equity: "3",
        companyHandle: "c1",
        companyName: "C1",
        }
    ]);
  });
});

/************************************** get */

describe("GET ROUTE/ Get One Job By Id", function () {
  test("Get job by ID", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
      id: 1,
      title: "TestJob1",
      salary: 10000,
      equity: "0.05",
      company: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("Job Not Found", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("PATCH Route : Update Job", function () {
  let updateData = {
    title: "NewJob Title",
    salary: 75000,
    equity: "5",
  };
  test("Update Job", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      companyHandle: "c1",
      ...updateData,
    });
  });

  test("Job Update Without Data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("DELETE Route /delete", function () {
  test("Delete Job", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=$1", [1]);
    expect(res.rows.length).toEqual(0);
  });
});
