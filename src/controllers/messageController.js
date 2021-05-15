import { validationResult } from 'express-validator/check';
import messageService from './../services/messageService';
import multer from 'multer';
import { app } from './../config/app';
import fsExtra from 'fs-extra';
import { promisify } from 'util';
import ejs from 'ejs';
import { convertBinaryToBase64, lastItemOfArray, convertTimestampToHumanTime } from './../helpers/clientHelper'
//
const renderFile = promisify(ejs.renderFile).bind(ejs);

let addNewMessage = async (req, res) => {
    // let errors = validationResult(req).errors;
    // let errorArr = [];
    // if (!errors.length) {
    // } else {
    //     errorArr = errors.map(error => error.msg);
    //     req.flash("errors", errorArr);
    //     return res.status(500).send(errorArr);
    // }
    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;
        //them vao messageService
        let newMessage = await messageService.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
        if (newMessage) {
            return res.status(200).send({ message: newMessage })
        }
    } catch (err) {
        return res.status(500).send(err);
    }
}

////////////////////////////////
let storageImageChat = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, app.image_message_directory);
    },
    filename: (req, file, cb) => {
        let ImageMessageName = `${Date.now()}-${file.originalname}`;
        cb(null, ImageMessageName);
    }
})
let ImageMessageUploadFile = multer({ storage: storageImageChat }).single("my-image-chat");
////////////////////////////////////
let addNewImage = (req, res) => {
    ImageMessageUploadFile(req, res, async (error) => {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid;
        let messageVal = req.file;
        let isChatGroup = req.body.isChatGroup;
        let newMessage = await messageService.addNewImage(sender, receiverId, messageVal, isChatGroup);
        /// khi upload xong xóa ảnh vi data đã dc luu vo mongodb
        await fsExtra.remove(`${app.image_message_directory}/${messageVal.filename}`)
        //cuoi cung moi return ve client
        if (newMessage) {
            return res.status(200).send({ message: newMessage })
        }
    })
}
////attachment 
////////////////////////////////
let storageAttachmentChat = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, app.image_message_directory);
    },
    filename: (req, file, cb) => {
        console.log("file tu storage", file)
        let AttachmentMessageName = `${Date.now()}-${file.originalname}`;
        cb(null, AttachmentMessageName);
    }
})
let AttachmentMessageUploadFile = multer({ storage: storageAttachmentChat }).single("my-attachment-chat");
let addNewAttachment = (req, res) => {
    AttachmentMessageUploadFile(req, res, async (error) => {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid;
        let messageVal = req.file;
        let isChatGroup = req.body.isChatGroup;
        console.log("receiverId", receiverId);
        console.log("messageVal", messageVal);
        console.log("isChatGroup", isChatGroup);
        let newAttachment = await messageService.addNewAttachment(sender, receiverId, messageVal, isChatGroup);
        console.log("newAttachment", newAttachment);

        await fsExtra.remove(`${app.attachment_message_directory}/${messageVal.filename}`)
        //cuoi cung moi return ve client
        if (newAttachment) {
            return res.status(200).send({ message: newAttachment })
        }
    })
}

let readMore = async (req, res) => {
    let targetId = req.query.targetId;
    let skipMessage = +req.query.skipMessage;
    let chatInGroup = req.query.chatInGroup == "true" ? true : false;
    //get more item messages 
    let newMessages = await messageService.readMore(req.user._id, skipMessage, targetId, chatInGroup);
    let dataToRender = {
        newMessages: newMessages,
        bufferToBase64: convertBinaryToBase64,
        user: req.user
    }
    let rightSideData = await renderFile("src/views/main/readMoreMessages/_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src/views/main/readMoreMessages/_imageModal.ejs", dataToRender);
    let attachmentModalData = await renderFile("src/views/main/readMoreMessages/_attachmentModal.ejs", dataToRender);
    return res.status(200).send({
        rightSideData, imageModalData, attachmentModalData
    })
}
module.exports = {
    addNewMessage,
    addNewImage,
    addNewAttachment,
    readMore
}