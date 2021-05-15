import notificationService from './../services/notificationService';

let readMore = async (req, res) => {
    try {
        //get skip numerf from query param
        let skipNumber = +req.query.skipNumber;
        let notifications = await notificationService.readMore(req.user._id, skipNumber);
        return res.status(200).send(notifications);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}
let markAllAsRead = async (req, res) => {
    try {
        let targetUsers = req.body.targetUsers
        let mark = await notificationService.markAllAsRead(req.user._id, targetUsers);
        return res.status(200).json({ success: !!mark })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}
module.exports = {
    readMore,
    markAllAsRead
}