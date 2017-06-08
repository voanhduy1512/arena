const _ = require('lodash');
const Queues = require('../../bull');
const QueueHelpers = require('../helpers/queueHelpers');

async function handler(req, res) {
  const name = req.params.queueName;
  const queue = await Queues.get(name);
  if (!queue) return res.status(404).render('dashboard/templates/queueNotFound.hbs', {name});

  /*
    TODO(randall): get feedback on practicality of this idea
    Description: Get elapsed time for currently processing job

    const jobTypes = ['waiting', 'active', 'completed', 'failed', 'delayed'];
    const jobTimestamps = (await Promise.all(jobTypes.map((type) => queue[`get${_.capitalize(type)}`](0, 0))))
      .map((jobs) => _.first(jobs) || {})
      .map((job) => job['timestamp']);
    const jobTimestampsMap = {};
    for (let typeIndex of _.range(jobTypes.length)) {
      jobTimestampsMap[jobTypes[typeIndex]] = jobTimestamps[typeIndex];
    }
  */

  const jobCounts = await QueueHelpers.getJobCounts(queue);
  const stats = await QueueHelpers.getStats(queue);

  return res.render('dashboard/templates/queueDetails.hbs', {
    name,
    jobCounts,
    stats
  });
}

module.exports = handler;