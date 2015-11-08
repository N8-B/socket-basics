var moment = require('moment');

var now = moment();

// console.log(now.format());
//
// console.log('UNIX timestamp in seconds: ' + now.format('X'));
// console.log('JavaScript timestamp in milliseconds: ' + now.format('x'));
// console.log('JS timestamp: ' + now.valueOf());

var timestamp = 1447009549752;
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.local().format('h:mm a'));

// now.subtract(1, 'year');
// console.log(now.format());

// console.log(now.format('MMM Do YYYY, h:mma'));
