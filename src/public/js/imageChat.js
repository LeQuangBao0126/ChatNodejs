
function imageChat(divId) {
  $(`#image-chat-${divId}`).on("change", function (e) {
    let fileData = $(this).prop("files")[0];
    let targetId = $(this).data("chat");
    let isChatGroup = false;
    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);
    if ($(`#image-chat-${divId}`).hasClass("chat-in-group")) {
      isChatGroup = true
      messageFormData.append("isChatGroup", isChatGroup);
    }
    if (fileData) {
      $.ajax({
        url: "/message/add-new-image",
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
          let messsageOfMe = $(`<div class="bubble  me bubble-image-file" data-mess-id="${data.message._id}"> </div> `);
          let imageChat = `
                <img
                src="data:${data.message.file.contentType}; base64, ${BufferToBase64(data.message.file.data.data)}"
                class="show-image-chat" />
                `;
          if (isChatGroup) {
            messsageOfMe.append(`
                            <img src="/images/users/${data.message.sender.avatar}" title="${data.message.sender.name}"
                            class="avatar-small" />
                            `);
            messsageOfMe.append(imageChat);
            increaseNumberMessageGroup(divId);
            dataToEmit.groupId = targetId;
          } else {
            messsageOfMe.html(imageChat);
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
            "Hình ảnh"
          );
          //step 6 : emit 
          socket.emit("chat-image", dataToEmit)
          //step 9 : add hình vô modal image
          let imageModalItem = `  <img
          src="data:${data.message.file.contentType}; base64, ${BufferToBase64(data.message.file.data.data)}" />`;
          $(`#imagesModal_${divId}`).find(".all-images").append(imageModalItem);
        },
        error: function (err) {
          alertify.notify(err, "error", 7)
        }
      })
    }
  });
}

$(document).ready(function () {
  socket.on("response-chat-image", function (response) {
    let divId = "";
    // Step 1 : handle message before showing
    let messageOfYou = $(`<div class="bubble  you bubble-image-file" data-mess-id="${response.message._id}"> </div> `);
    let imageChat = `
          <img
          src="data:${response.message.file.contentType}; base64, ${BufferToBase64(response.message.file.data.data)}"
          class="show-image-chat" />
          `;
    if (response.currentGroupId) {
      messageOfYou.append(`
          <img src="/images/users/${response.message.sender.avatar}" title="${response.message.sender.name}"
          class="avatar-small" />
          `);
      messageOfYou.append(imageChat);
      // chat nhom thi cong so luong tin nhan len 1
      divId = response.currentGroupId;
      if (response.currentUserId != $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(imageChat);
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
        "Hình ảnh"
      );
  });
})