const { get, post } = require('./visits');
const Visit = require('../models/visits');

describe('Visits Controllers', () => {
  const jsonMock = jest.fn();
  const statusMock = jest.fn();
  const sendMock = jest.fn();
  const res = {
    json: jsonMock,
    send: sendMock,
    status: statusMock,
  };
  const next = jest.fn();
  beforeEach(() => {
    jsonMock.mockClear();
    statusMock.mockClear();
    sendMock.mockClear();
  });

  test('post', async () => {
    const req = { query: { name: 'AJ', userId: '1234' } };
    const visitId = '12345';
    Visit.create = jest.fn().mockResolvedValueOnce({ _id: visitId });
    await post(req, res, next);
    expect(jsonMock).toHaveBeenCalledWith({ visitId });
    expect(next).not.toHaveBeenCalled();
  });

  test('post - error', async () => {
    const req = { query: { name: 'AJ', userId: '1234' } };
    const error = 'error';
    Visit.create = jest.fn().mockRejectedValue(error);
    await post(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(jsonMock).not.toHaveBeenCalled();
  });

  test('get - findById success', async () => {
    const req = { query: { visitId: '1234' } };
    const visit = { _id: '123', userId: '456', name: 'McDonalds' };
    Visit.findById = jest.fn().mockResolvedValueOnce(visit);
    await get(req, res, next);
    expect(jsonMock).toHaveBeenCalledWith([
      { visitId: visit._id, userId: visit.userId, name: visit.name },
    ]);
    expect(statusMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  test('get - findById error', async () => {
    const req = { query: { visitId: '1234' } };
    Visit.findById = jest.fn().mockRejectedValueOnce();
    await get(req, res, next);
    expect(jsonMock).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(sendMock).toHaveBeenCalledWith(
      `No visit found with ID: ${req.query.visitId}`,
    );
  });

  test('get - search', async () => {
    const req = {
      query: { userId: '1234', searchString: 'MCDONALD’S LAS VEGAS' },
    };
    const visit = { _id: '1234', userId: '4567', name: "McDonald's" };
    Visit.find = jest.fn().mockResolvedValueOnce([visit]);
    await get(req, res, next);
    expect(jsonMock).toHaveBeenCalledWith([
      { visitId: visit._id, userId: visit.userId, name: visit.name },
    ]);
    expect(statusMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  test('get - no params', async () => {
    const req = {
      query: {},
    };
    await get(req, res, next);
    expect(jsonMock).toHaveBeenCalledWith([]);
    expect(statusMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });
});
