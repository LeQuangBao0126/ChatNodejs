function readMoreMessages() {
  $(`.right .chat`).unbind("scroll").on("scroll", function (e) {
    //get the first message 
    console.log($(this).scrollTop());
    let firstMessage = $(this).find(".bubble:first");
    //get position of first message 
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();
    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="/images/chat/message-loading.gif" class="message-loading" />`;
      if (!$(this).find("img").hasClass("message-loading")) {
        $(this).prepend(messageLoading);
      }
      let targetId = $(this).data("chat");
      let skipMessage = $(this).find(".bubble").length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

      $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function (data) {
        // console.log(data.rightSideData);
        if (data.rightSideData.trim() == "") {
          alertify.notify("Bạn không còn tin nhắn nào cũ hơn !", "error", 7);
          return;
        }
        //step 1 : handle right side 
        $(`.right .chat[data-chat =${targetId}]`).prepend(data.rightSideData);
        //step 2 : prevent scroll ;
        $(`.right .chat[data-chat =${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);
        //step 4 : hanle imageModal
        $(`#imagesModal_${targetId}`).find(".all-images").prepend(data.imageModalData);
      });

    }
  });
}
$(document).ready(function () {
  readMoreMessages();
})