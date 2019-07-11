const Visit = require('../models/visits');
const Fuse = require('fuse.js');

module.exports = {
  async get(req, res) {
    const visits = [];
    const { visitId, userId, searchString } = req.query;

    if (visitId) {
      try {
        const visit = await Visit.findById(visitId);
        visits.push({
          visitId: visit._id,
          userId: visit.userId,
          name: visit.name,
        });
      } catch (error) {
        res.status(404);
        return res.send(`No visit found with ID: ${visitId}`);
      }
    } else if (userId && searchString) {
      const visitsResults = await Visit.find({ userId }, null, {
        limit: 5,
        sort: '-_id',
      });
      const fuse = new Fuse(visitsResults, { keys: ['name'] });
      const results = fuse.search(searchString);
      visits.push(
        ...results.map(result => ({
          visitId: result._id,
          userId: result.userId,
          name: result.name,
        })),
      );
    }
    res.json(visits);
  },

  async post(req, res, next) {
    let visit;
    const { name, userId } = req.query;
    try {
      visit = await Visit.create({ name, userId });
    } catch (error) {
      return next(error);
    }
    res.json({ visitId: visit._id });
  },
};
