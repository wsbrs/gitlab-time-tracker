const moment = require('moment');
const config = require('../../src/include/config');
const Report = require('../../src/models/report');
const Sinon = require('sinon');
const { describe } = require('mocha');
const Csv = require('csv-string');
const csv = require('../../src/output/csv');
const { assert } = require('chai');

describe('csv output', () => {
    /**
     * @type {Sinon.SinonSpyStatic}
     */
    let csvSpy;

    beforeEach(() => {
        csvSpy = Sinon.spy(Csv, 'stringify')
    })

    afterEach(() => {
        csvSpy.restore();
    })

    it('renders projects if more than one', () => {
        const issues = [
            {
                times: [
                    {
                        user: "user1",
                        project_namespace: "project1",
                        seconds: 360,
                        date: moment('2024-06-06 00:00:00')
                    },
                    {
                        user: "user2",
                        project_namespace: "project2",
                        seconds: 720,
                        date: moment('2024-06-06 00:00:00')
                    }
                ],
                stats: {time_estimate: 0, total_time_spent: 0}
            }
        ];
    
        const projectsMatcher = Sinon.match((value) => {
            return Array.isArray(value) && Array.isArray(value[0]) && value[0].includes('project1') && value[0].includes('project2')
        }, 'Both projects exist')

        let reportConfig = new config();
        reportConfig.set('report', ['stats'])
        let report = new Report(reportConfig);
        report.issues = issues;
        report.mergeRequests = [];

        let out = new csv(reportConfig, report);
        out.make();
        assert(csvSpy.calledWith(projectsMatcher), 'Not called properly')
    })

    it('does not render single project', () => {
        const issues = [
            {
                times: [
                    {
                        user: "user2",
                        project_namespace: "project2",
                        seconds: 720,
                        date: moment('2024-06-06 00:00:00')
                    }
                ],
                stats: {time_estimate: 0, total_time_spent: 0}
            }
        ];
    
        const projectsMatcher = Sinon.match((value) => {
            return Array.isArray(value) && Array.isArray(value[0]) && !value[0].includes('project2')
        }, 'Project does not exist')

        let reportConfig = new config();
        reportConfig.set('report', ['stats'])
        let report = new Report(reportConfig);
        report.issues = issues;
        report.mergeRequests = [];

        let out = new csv(reportConfig, report);
        out.make();
        assert(csvSpy.calledWith(projectsMatcher), 'Not called properly')
    })
})
