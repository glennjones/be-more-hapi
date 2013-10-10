// Handlebars helper 
// takes a number 3456 and return 3,456

module.exports = function(number) {
    if(number){
      number = number.toString();
      return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else{
      return number;
    }
}
