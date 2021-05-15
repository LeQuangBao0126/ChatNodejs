import moment from 'moment';
let convertBinaryToBase64 = (buffer) => {
    //buffer la du lieu dang binary 
    return Buffer.from(buffer).toString("base64");
}
let lastItemOfArray = (arr) => {
    if (!arr.length) {
        return [];
    }
    return arr[arr.length - 1];
}
let convertTimestampToHumanTime = (timestamp) => {
    if (!timestamp) {
        return null;
    }
    return moment(timestamp).locale("vi").startOf("seconds").fromNow();
}
module.exports = {
    convertBinaryToBase64,
    lastItemOfArray,
    convertTimestampToHumanTime
}