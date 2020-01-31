const mongoose = require('mongoose');


//database configure
var db = mongoose.connection;
//連線失敗
db.on('error', console.error.bind(console, 'connection error:'));
//連線成功
db.once('open', function () {
    console.log("buzzerDB connection success...");
});
//建立連線
mongoose.connect('mongodb://localhost/buzzer');

var schema = mongoose.Schema;
//buzzerStatus schema model
var buzzerStatusSchema = new schema({
    sendWarningToSlackOrNot: false
});


var buzzerStatus = mongoose.model('buzzerStatus', buzzerStatusSchema);

// make this available to our buzzerStatuss in our Node applications
module.exports = buzzerStatus;


