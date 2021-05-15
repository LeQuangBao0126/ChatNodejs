function textAndEmojiChat(divId) {
   $(".emojionearea").unbind("keyup").on("keyup", function (element) {
      let currentEmojiOneArea = $(this);
      if (element.which == 13) {
         let targetId = $(`#write-chat-${divId}`).data("chat");
         let messageVal = $(`#write-chat-${divId}`).val();
         if (!targetId.length || !messageVal.length) {
            return false;
         }
         let dataTextEmojiForSend = {
            uid: targetId,
            messageVal: messageVal
         }
         if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
            dataTextEmojiForSend.isChatGroup = true;
         }
         $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
            // console.log("data.message", data.message);
            // console.log("dataTextEmojiForSend.isChatGroup", dataTextEmojiForSend.isChatGroup);
            let dataToEmit = {
               message: data.message
            }
            // Step 1 : handle message before showing
            let messsageOfMe = $(`<div class="bubble  me" data-mess-id="${data.message._id}"> </div> `);
            if (dataTextEmojiForSend.isChatGroup) {
               messsageOfMe.append(`
               <img src="/images/users/${data.message.sender.avatar}" title="${data.message.sender.name}"
               class="avatar-small" />
               `);
               messsageOfMe.append(data.message.text);
               // chat nhom thi cong so luong tin nhan len 1
               increaseNumberMessageGroup(divId);
               //dom toi man hinh để hien tin nhắn ra luôn
               dataToEmit.groupId = targetId;
            } else {
               messsageOfMe.text(data.message.text);
               dataToEmit.contactId = targetId;
            }
            // Step 2 : append message to screen chat 
            $(`.right .chat[data-chat=${divId}]`).append(messsageOfMe);
            //  debugger;
            nineScrollRight(divId);

            //Step 3 : remove all data input in emojiarea 
            $(`#write-chat-${divId}`).val("");
            $(".emojionearea").find(".emojionearea-editor").text("");
            //Step 4 : change data in left side ..darta preview  time tin nhắn mới nhất
            $(`.person[data-chat=${divId}]`).find("span.time").html(
               moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow()
            );
            $(`.person[data-chat=${divId}]`).find("span.preview").html(
               data.message.text
            );
            //Step 5 : move conversation to the top
            // $(`.person[data-chat=${divId}]`).on("click.moveConversationToTop", function () {
            //    let dataToMove = $(this).parent();
            //    $(this).closest("ul").prepend(dataToMove);
            //    $(this).off("click.moveConversationToTop");
            // });
            // $(`.person[data-chat=${divId}]`).click();
            //Step 6 : emit real time 
            socket.emit("chat-text-emoji", dataToEmit)
            TypingOff(divId)
         }).fail(function (res) {
            console.log("loi ", res);
         })
      }
   });
}
$(document).ready(function () {
   socket.on("response-chat-text-emoji", function (response) {
      console.log(response);
      let divId = "";
      // Step 1 : handle message before showing
      let messageOfYou = $(`<div class="bubble  you" data-mess-id="${response.message._id}"> </div> `);
      if (response.currentGroupId) {
         messageOfYou.append(`
            <img src="/images/users/${response.message.sender.avatar}" title="${response.message.sender.name}"
            class="avatar-small" />
            `);
         messageOfYou.append(response.message.text);
         // chat nhom thi cong so luong tin nhan len 1
         divId = response.currentGroupId;
         if (response.currentUserId != $("#dropdown-navbar-user").data("uid")) {
            increaseNumberMessageGroup(divId);
         }
      } else {
         messageOfYou.text(response.message.text);
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
            response.message.text
         );
   });

})