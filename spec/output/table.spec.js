const moment = require('moment');
const config = require('../../src/include/config');
const Report = require('../../src/models/report');
const table = require('../../src/output/table');
const Sinon = require('sinon');

describe('Table output', () => {
    it('Renders projects if more than one', () => {
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
    
        const projectsMatcher = Sinon.match('project1').and(Sinon.match('project2'))
        let reportConfig = new config();
        reportConfig.set('report', ['stats'])
        let report = new Report(reportConfig);
        report.issues = issues;
        report.mergeRequests = [];

        let out = new table(reportConfig, report);
        let mdMock = Sinon.mock(out);
        mdMock.expects('headline').once();
        mdMock.expects('write').once().withArgs(projectsMatcher);
        out.make();
    });

    it('Does not render single project', () => {
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
    
        const projectsMatcher = Sinon.match(function(value) {
            return ((typeof(value) === 'string') && (/project2/.test(value) === false));
        })

        let reportConfig = new config();
        reportConfig.set('report', ['stats'])
        let report = new Report(reportConfig);
        report.issues = issues;
        report.mergeRequests = [];

        let out = new table(reportConfig, report);
        let mdMock = Sinon.mock(out);
        mdMock.expects('headline').once();
        mdMock.expects('write').once().withArgs(projectsMatcher);
        out.make();
    });
});

