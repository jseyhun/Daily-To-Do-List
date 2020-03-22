module.exports = function(){
  var today = new Date();
  var monthOptions = {
    month: 'long',
    day: 'numeric'
  }
  var dayOfWeek = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(today);
  var monthAndDay =  new Intl.DateTimeFormat('en-US', monthOptions).format(today);
  return dayOfWeek + ', ' + monthAndDay;

}
