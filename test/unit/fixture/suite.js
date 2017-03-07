'use strict';

module.exports = function suite(eventName) {
  return {
    cid: '0-0',
    type: eventName,
    title: `title for ${eventName}`,
    parent: '',
    pending: false,
    file: `absolute filepath for ${eventName}`,
    specs: [''],
    event: eventName,
    runner: {'0': {browserName: 'firefox'}},
    specHash: '98d5f98abe0e1d6b68d654ead0a9ce77',
  };
};
