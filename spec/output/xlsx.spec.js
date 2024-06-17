const moment = require('moment');
const config = require('../../src/include/config');
const Report = require('../../src/models/report');
const Sinon = require('sinon');
const { describe } = require('mocha');
const output = require('../../src/output/xlsx');
const XLSX = require('xlsx');
const { assert } = require('chai');

describe('XLSX output', () => {
    /**
     * @type {Sinon.SinonSpyStatic}
     */
    let xlsxSpy;

    beforeEach(() => {
        xlsxSpy = Sinon.spy(XLSX.utils, 'aoa_to_sheet')
    })

    afterEach(() => {
        xlsxSpy.restore();
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

        let out = new output(reportConfig, report);
        out.make();
        assert(xlsxSpy.calledWith(projectsMatcher), 'Not called properly')
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

        let out = new output(reportConfig, report);
        out.make();
        assert(xlsxSpy.calledWith(projectsMatcher), 'Not called properly')
    })
})
