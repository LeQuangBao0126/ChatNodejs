
function attachmentChat(divId) {
   $(`#attachment-chat-${divId}`).on("change", function () {
      // console.log($(this).prop("files")[0]);
      let fileData = $(this).prop("files")[0];
      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append("my-attachment-chat", fileData);
      messageFormData.append("uid", targetId);
      if ($(`#attachment-chat-${divId}`).hasClass("chat-in-group")) {
         isChatGroup = true
         messageFormData.append("isChatGroup", isChatGroup);
      }
      if (fileData) {
         $.ajax({
            url: "/message/add-new-attachment",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: messageFormData,
            success: function (data) {
               console.log(data);
               let dataToEmit = {
                  message: data.message
               }
               // Step 1 : handle message before showing
               let messsageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"> </div> `);

               let attachmentChat = `
                    <a href="data:${data.message.file.contentType}; base64, ${BufferToBase64(data.message.file.data.data)} "
                              download="${data.message.file.fileName}">
                              ${data.message.file.fileName}
                    </a>
                `;
               if (isChatGroup) {
                  messsageOfMe.append(`
                            <img src="/images/users/${data.message.sender.avatar}" title="${data.message.sender.name}"
                            class="avatar-small" />
                            `);
                  messsageOfMe.append(attachmentChat);
                  increaseNumberMessageGroup(divId);
                  dataToEmit.groupId = targetId;
               } else {
                  messsageOfMe.html(attachmentChat);
                  dataToEmit.contactId = targetId;
               }
               // Step 2 : append message to screen chat 
               $(`.right .chat[data-chat=${divId}]`).append(messsageOfMe);
               nineScrollRight(divId);
               //Step 3 : remove all data input in emojiarea 
               $(".emojionearea").find(".emojionearea-editor").text("");
               //Step 4 : change data in left side ..darta preview  time tin nhắn mới nhất
               $(`.person[data-chat=${divId}]`).find("span.time").html(
                  moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow()
               );
               $(`.person[data-chat=${divId}]`).find("span.preview").html(
                  "Tệp đính kèm ..."
               );
               //step 6 : emit 
               socket.emit("chat-attachment", dataToEmit)
               //step 9 : add tệp vô modal attchemt
               let attachmentModalItem = `   
               <li>
                  <a href="data:${data.message.file.contentType}; base64, ${BufferToBase64(data.message.file.data.data)} "
                     download="${data.message.file.fileName}">
                     ${data.message.file.fileName}
                  </a>
               </li>
               `;
               $(`#attachmentsModal_${divId}`).find(".list-attachments").append(attachmentModalItem);
            }
         });
      }
   })
}
$(document).ready(function () {
   socket.on("response-chat-attachment", function (response) {
      console.log("response-chat-attachment");
      let divId = "";
      // Step 1 : handle message before showing
      let messageOfYou = $(`<div class="bubble  you bubble-attachment-file" data-mess-id="${response.message._id}"> </div> `);

      let attachmentChat = `
      <a href="data:${response.message.file.contentType}; base64, ${BufferToBase64(response.message.file.data.data)} "
                  download="${response.message.file.fileName}">
                  ${response.message.file.fileName}
            </a>
            `;
      if (response.currentGroupId) {
         messageOfYou.append(`
            <img src="/images/users/${response.message.sender.avatar}" title="${response.message.sender.name}"
            class="avatar-small" />
            `);
         messageOfYou.append(attachmentChat);
         // chat nhom thi cong so luong tin nhan len 1
         divId = response.currentGroupId;
         if (response.currentUserId != $("#dropdown-navbar-user").data("uid")) {
            increaseNumberMessageGroup(divId);
         }
      } else {
         messageOfYou.html(attachmentChat);
         divId = response.currentUserId;
      }
      // Step 2 : append message to screen chat 
      $(".person").find("span.time").removeClass("realtime-received-chat");
      if (response.currentUserId != $("#dropdown-navbar-user").data("uid")) {
         $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
         nineScrollRight(divId);
         $(`.person[data-chat=${divId}]`).find("span.time")
            .addClass("realtime-received-chat")
      }
      //Step 3 : remove all data input in emojiarea  : nothing
      //Step 4 : change data in left side ..darta preview  time tin nhắn mới nhất  
      $(`.person[data-chat=${divId}]`).find("span.time")
         .html(
            moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow()
         );

      $(`.person[data-chat=${divId}]`).find("span.preview")
         .html(
            "Tệp đính kèm ..."
         );
   });
})