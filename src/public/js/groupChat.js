function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function (resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}
function callCreateGroupChat() {
  $('#btn-create-group-chat').unbind("click").bind('click', function () {
    let listUserGroupChat = []
    if ($('ul#friends-added').find("li").length < 2) {
      alertify.notify("Tối thiểu 3 người trong nhóm chat nhé bạn", "error", 7);
      listUserGroupChat = [];
      return;
    }
    let nameGroupChat = $("#input-name-group-chat").val();
    if (!nameGroupChat.length) {
      alertify.notify("Bạn phải nhập tên nhóm trò chuyện ", "error", 7);
      listUserGroupChat = [];
      return;
    }
    $('ul#friends-added').find("li").each((index, item) => {
      let id = $(item).data("uid");
      listUserGroupChat.push({ "userId": id });
    })
    $.post("/group-chat/add-new", {
      arrayIds: listUserGroupChat,
      groupChatName: nameGroupChat
    }, function (data) {
      console.log(data.groupchat);
      //step 1 : hide modal 
      $("#input-name-group-chat").val("");
      $("#btn-cancel-group-chat").click();
      $("#groupChatModal").modal("hide");
      //step 2 : them vao left side 
      let subGroupChatName = data.groupchat.name;
      if (subGroupChatName.length > 15) {
        subGroupChatName = subGroupChatName.substr(0, 12)
      }
      let conversationGroup = `
                        <a href="#uid_${data.groupchat._id}" data-id="${data.groupchat._id}" class="room-chat"
                        data-target="#to_${data.groupchat._id}">
                        <li class="person group-chat" data-chat="${data.groupchat._id}">
                            <div class="left-avatar">
                                <img src="images/users/group-avatar-trungquandev.png" alt="">
                            </div>
                            <span class="name">
                                <span class="group-chat-name">Group:</span>
                              ${subGroupChatName}...
                            </span>
                            <span class="time">
                            </span>
                            <span class="preview">
                            </span>
                        </li>
                    </a>
            `;
      $("#all-chat").find("ul").prepend(conversationGroup);
      $("#group-chat").find("ul").prepend(conversationGroup);
      //step 3 : handle right side 
      let rightSideData = `  <div class="right tab-pane " data-chat="${data.groupchat._id}"
         id="to_${data.groupchat._id}">
         <div class="top">
           <span>To: <span class="name">
           ${data.groupchat.name}
             </span></span>
           <span class="chat-menu-right">
             <a href="#attachmentsModal_${data.groupchat._id}" class="show-attachments" data-toggle="modal">
               Tệp đính kèm
               <i class="fa fa-paperclip"></i>
             </a>
           </span>
           <span class="chat-menu-right">
             <a href="javascript:void(0)">&nbsp;</a>
           </span>
           <span class="chat-menu-right">
             <a href="#imagesModal_${data.groupchat._id}" class="show-images" data-toggle="modal">
               Hình ảnh
               <i class="fa fa-photo"></i>
             </a>
           </span>
           <!-- ------- user amount vs so luong tin nhan trong group -->
           <span class="chat-menu-right">
             <a href="javascript:void(0)">&nbsp;</a>
           </span>
           <span class="chat-menu-right">
             <a href="javascript:void(0)" class="number-member" data-toggle="modal">
               <span class="show-number-member">
                 ${data.groupchat.userAmount}
               </span>
               <i class="fa fa-user"></i>
             </a>
           </span>
           <!-- dem so luong tin nhan -->
           <span class="chat-menu-right">
             <a href="javascript:void(0)">&nbsp;</a>
           </span>
           <span class="chat-menu-right">
             <a href="javascript:void(0)" class="number-message" data-toggle="modal">
               <span class="show-number-message">
                 ${data.groupchat.messageAmount}
               </span>
               Tin Nhắn
             </a>
           </span>
         </div>
         <div class="content-chat">
           <div class="chat chat-in-group" data-chat="${data.groupchat._id}">
           </div>
         </div>
         <div class="write" data-chat="${data.groupchat._id}">
           <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupchat._id}"
             data-chat="${data.groupchat._id}">
           <div class="icons">
             <a href="#" class="icon-chat" data-chat="${data.groupchat._id}"><i class="fa fa-smile-o"></i></a>
             <label for="image-chat-${data.groupchat._id}">
               <input type="file" id="image-chat-${data.groupchat._id}" name="my-image-chat "
                 class="image-chat chat-in-group" data-chat="${data.groupchat._id}">
               <i class="fa fa-photo"></i>
             </label>
             <label for="attachment-chat-${data.groupchat._id}">
               <input type="file" id="attachment-chat-${data.groupchat._id}" name="my-attachment-chat"
                 class="attachment-chat chat-in-group" data-chat="${data.groupchat._id}">
               <i class="fa fa-paperclip"></i>
             </label>
             <a href="javascript:void(0)" id="video-chat-group" data-toggle="modal">
               <i class="fa fa-video-camera"></i>
             </a>
             <!-- #streamModal -->
           </div>
         </div>
       </div>`;
      $("#screen-chat").prepend(rightSideData);
      //step 4 : 
      changeScreenChat()
      ///step 5 : handle Image Modal 
      let imageModalItem = `
                  <div class="modal fade" id="imagesModal_${data.groupchat._id}" role="dialog">
                  <div class="modal-dialog modal-lg">
                     <div class="modal-content">
                        <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện.
                              </h4>
                        </div>
                        <div class="modal-body">
                              <div class="all-images" style="visibility: hidden;">
                              </div>
                        </div>
                     </div>
                  </div>
            </div>
            </div>
                  `;
      $("body").append(imageModalItem);
      gridPhotos(5);
      //step 6 : attachment modal 
      let attachmentModal = `
         <div class="modal fade" id="attachmentsModal_${data.groupchat._id}" role="dialog">
         <div class="modal-dialog modal-lg">
             <div class="modal-content">
                 <div class="modal-header">
                     <button type="button" class="close" data-dismiss="modal">&times;</button>
                     <h4 class="modal-title">All Attachments in this conversation.</h4>
                 </div>
                 <div class="modal-body">
                     <ul class="list-attachments">
                     </ul>
                 </div>
             </div>
         </div>
     </div>
         `;
      $("body").append(attachmentModal);
      //step 7 : emit new group chat
      socket.emit("new-group-created", { groupChat: data.groupchat })
    })
  });
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-search-friend-to-add-group-chat").val();
    if (!keyword.length) {
      alertify.notify("Dữ liệu tìm kiếm không được rỗng", "error", 7);
      return;
    }
    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();
      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
      callCreateGroupChat()
    });
  }
}

$(document).ready(function () {
  $("#input-search-friend-to-add-group-chat").on("keyup", callSearchFriends);
  $("#btn-search-friend-to-add-group-chat").on("click", callSearchFriends);
  socket.on("response-new-group-created", function (data) {
    //step 1 : hide modal nothing to code
    //step 2 : them vao left side 
    let subGroupChatName = data.groupchat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 12)
    }
    let conversationGroup = `
                     <a href="#uid_${data.groupchat._id}" data-id="${data.groupchat._id}" class="room-chat"
                     data-target="#to_${data.groupchat._id}">
                     <li class="person group-chat" data-chat="${data.groupchat._id}">
                         <div class="left-avatar">
                             <img src="images/users/group-avatar-trungquandev.png" alt="">
                         </div>
                         <span class="name">
                             <span class="group-chat-name">Group:</span>
                           ${subGroupChatName}...
                         </span>
                         <span class="time">
                         </span>
                         <span class="preview">
                         </span>
                     </li>
                 </a>
         `;
    $("#all-chat").find("ul").prepend(conversationGroup);
    $("#group-chat").find("ul").prepend(conversationGroup);
    //step 3 : handle right side 
    let rightSideData = `  <div class="right tab-pane " data-chat="${data.groupchat._id}"
      id="to_${data.groupchat._id}">
      <div class="top">
        <span>To: <span class="name">
        ${data.groupchat.name}
          </span></span>
        <span class="chat-menu-right">
          <a href="#attachmentsModal_${data.groupchat._id}" class="show-attachments" data-toggle="modal">
            Tệp đính kèm
            <i class="fa fa-paperclip"></i>
          </a>
        </span>
        <span class="chat-menu-right">
          <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
          <a href="#imagesModal_${data.groupchat._id}" class="show-images" data-toggle="modal">
            Hình ảnh
            <i class="fa fa-photo"></i>
          </a>
        </span>
        <!-- ------- user amount vs so luong tin nhan trong group -->
        <span class="chat-menu-right">
          <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
          <a href="javascript:void(0)" class="number-member" data-toggle="modal">
            <span class="show-number-member">
              ${data.groupchat.userAmount}
            </span>
            <i class="fa fa-user"></i>
          </a>
        </span>
        <!-- dem so luong tin nhan -->
        <span class="chat-menu-right">
          <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
          <a href="javascript:void(0)" class="number-message" data-toggle="modal">
            <span class="show-number-message">
              ${data.groupchat.messageAmount}
            </span>
            Tin Nhắn
          </a>
        </span>
      </div>
      <div class="content-chat">
        <div class="chat chat-in-group" data-chat="${data.groupchat._id}">
        </div>
      </div>
      <div class="write" data-chat="${data.groupchat._id}">
        <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupchat._id}"
          data-chat="${data.groupchat._id}">
        <div class="icons">
          <a href="#" class="icon-chat" data-chat="${data.groupchat._id}"><i class="fa fa-smile-o"></i></a>
          <label for="image-chat-${data.groupchat._id}">
            <input type="file" id="image-chat-${data.groupchat._id}" name="my-image-chat "
              class="image-chat chat-in-group" data-chat="${data.groupchat._id}">
            <i class="fa fa-photo"></i>
          </label>
          <label for="attachment-chat-${data.groupchat._id}">
            <input type="file" id="attachment-chat-${data.groupchat._id}" name="my-attachment-chat"
              class="attachment-chat chat-in-group" data-chat="${data.groupchat._id}">
            <i class="fa fa-paperclip"></i>
          </label>
          <a href="javascript:void(0)" id="video-chat-group" data-toggle="modal">
            <i class="fa fa-video-camera"></i>
          </a>
          <!-- #streamModal -->
        </div>
      </div>
    </div>`;
    $("#screen-chat").prepend(rightSideData);
    //step 4 : 
    changeScreenChat()
    ///step 5 : handle Image Modal 
    let imageModalItem = `
               <div class="modal fade" id="imagesModal_${data.groupchat._id}" role="dialog">
               <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                     <div class="modal-header">
                           <button type="button" class="close" data-dismiss="modal">&times;</button>
                           <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện.
                           </h4>
                     </div>
                     <div class="modal-body">
                           <div class="all-images" style="visibility: hidden;">
                           </div>
                     </div>
                  </div>
               </div>
         </div>
         </div>
               `;
    $("body").append(imageModalItem);
    gridPhotos(5);
    //step 6 : attachment modal 
    let attachmentModal = `
      <div class="modal fade" id="attachmentsModal_${data.groupchat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">All Attachments in this conversation.</h4>
              </div>
              <div class="modal-body">
                  <ul class="list-attachments">
                  </ul>
              </div>
          </div>
      </div>
  </div>
      `;
    $("body").append(attachmentModal);
    //step 9 : 
    socket.emit("members-received-group-chat", { groupChatId: data.groupchat._id })
  });
});