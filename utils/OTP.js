const OTP = {};
const mailer = require('../helpers/mailer');

OTP.generate = () => {
    return Math.floor(1000 + Math.random() * 9000)
}

OTP.sendMail = async ({to, subject = 'OTP', html = 'Body'}) => {
    const send = await mailer.sendMail({
        from: '"EduSafety" <fitriaamandalaila02@gmail.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        // text: "Hello world?", // plain text body
        html, // html body
    })
    return send
}


module.exports = OTP;