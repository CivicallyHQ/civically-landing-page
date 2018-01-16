import { ajax } from 'discourse/lib/ajax';

var sendContact = function(data) {
  return ajax('/landing/contact', { data: data, type: 'POST' });
};

export { sendContact };
