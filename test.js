import test from 'ava';
import Reporter from './index';

const events = [
  'start',
  'suite:start',
  'hook:start',
  'hook:end',
  'test:start',
  'test:end',
  'test:pass',
  'test:fail',
  'test:pending',
  'suite:end',
  'end',
];

var reporter;

test.before(t => {
  reporter = new Reporter();
});

events.forEach(event => test(event, t => {
  const data = {
    type: event,
    title: `title for ${event}`,
    parent: '',
    pending: false,
    file: `absolute filepath for ${event}`,
    specs: [''],
    event: event,
    runner: {},
  };

  if (event.indexOf('fail') > -1) {
    data.err = new Error('artificial error');
  }

  reporter.emit(event, data);
}));
