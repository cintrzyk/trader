import opened from './actions/pull-request/opened-action';
import closed from './actions/pull-request/closed-action';

const combine = handlers => (payload) => {
  const handler = handlers[payload.action];
  return handler && handler(payload);
};

const handlers = {
  closed,
  opened,
};

export default combine(handlers);
