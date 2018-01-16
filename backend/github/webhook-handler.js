import opened from './actions/pull-request/opened-action';

const combine = handlers => (payload) => {
  const handler = handlers[payload.action];
  return handler && handler(payload);
};

const handlers = {
  opened,
};

export default combine(handlers);
