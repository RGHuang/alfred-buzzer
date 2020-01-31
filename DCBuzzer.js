require('dotenv').config();
const slackAPI = require('slackbots');
var CronJob = require('cron').CronJob;
// Dependencies
const buzzerStatus = require('./BuzzerStatus');
const targetChannel = 'buzzer_alfred';

const statusID = Object("5e32ad7bf54a873b56d5f994");

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'DC_Buzzer'
    })
/*
var initStatus = new buzzerStatus({
    sendWarningToSlackOrNot: false
})
writeDataIntoDB(initStatus);
*/


var checkStatusCron = new CronJob('* 2 * * * * ', async function () {
    console.log('start checking');
    var buzzerFalseStatus = await getBuzzerStatus();
    console.log('status', buzzerFalseStatus._id);
    console.log(buzzerFalseStatus.sendWarningToSlackOrNot);
    slackBot.on('message', () => {
        if (!buzzerFalseStatus.sendWarningToSlackOrNot) {
            slackBot.postMessageToChannel(targetChannel, 'DC Bot is not working!');
        } else {
            console.log('dcbot alive!');
            changeStatusToFalse();
        }
    })
}, null, true, 'America/Los_Angeles');
checkStatusCron.start();



function changeStatusToFalse() {
    buzzerStatus.updateOne({ _id: statusID },
        { sendWarningToSlackOrNot: false }).then(result => {
            console.log(result);
        })
}


async function getBuzzerStatus() {
    try {
        var status = buzzerStatus.findOne({ _id: statusID }).exec();
        return status;
    } catch (err) {
        console.error(err);
    }
}
