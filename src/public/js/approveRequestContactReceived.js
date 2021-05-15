function approveRequestContactReceived() {
   $(".user-approve-request-contact-received").on("click", function () {
      let targetId = $(this).data("uid");
      let targetName = $(this).parent().find("div.user-name>p").text().trim();
      let targetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");

      $.ajax({
         url: '/contact/approve-request-contact-received',
         type: 'post',
         data: { uid: targetId },
         success: function (data) {
            //console.log(data);
            if (data.success == true) {
               //
               let userInfo = $("#request-contact-received").find(`ul li[data-uid="${targetId}"]`);
               $(userInfo).find("div.user-approve-request-contact-received").remove();
               $(userInfo).find("div.user-remove-request-contact-received").remove();
               $(userInfo).find(".contactPanel").append(`<div class="user-talk" data-uid="${targetId}">
                                                        Trò chuyện
                                                    </div>`);
               $(userInfo).find(".contactPanel").append(`<div class="user-remove-contact action-danger" 
                                                    data-uid="${targetId}">
                                                    Xóa liên hệ
                                                </div>`);
               $("#contacts").find("ul").prepend(userInfo);
               decreaseNumberNotification("count-request-contact-received");
               increaseNumberNotifContact("count-contacts");
               removeContact()
               //emit
               socket.emit("approve-request-contact-received", { contactId: targetId });
               //All step handle chat after approve contact;
               //Step 01 : 
               $("#contactsModal").modal("hide");
               //step 2 : them vao left side 
               let subUserName = targetName;
               if (subUserName.length > 15) {
                  subUserName = subUserName.substr(0, 12)
               }
               let letsideData = `
                     <a href="#uid_${targetId}" data-id="${targetId}" class="room-chat">
                           <li class="person" data-chat="${targetId}">
                              <div class="left-avatar">
                                 <div class="dot"></div>
                                 <img src="${targetAvatar}" alt="">
                              </div>
                              <span class="name">
                                 ${subUserName}
                              </span>
                              <span class="time"> </span>
                              <span class="preview"> </span>
                           </li>
                     </a>
                      `;
               $("#all-chat").find("ul").prepend(letsideData);
               $("#user-chat").find("ul").prepend(letsideData);
               //step 3 : handle right side 
               let rightSideData = `  
               <div class="right tab-pane  " data-chat="${targetId}"
               id="to_${targetId}">
               <div class="top">
                 <span>To: <span class="name">
                  ${targetName}
                   </span></span>
                 <span class="chat-menu-right">
                   <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
                     Tệp đính kèm
                     <i class="fa fa-paperclip"></i>
                   </a>
                 </span>
                 <span class="chat-menu-right">
                   <a href="javascript:void(0)">&nbsp;</a>
                 </span>
                 <span class="chat-menu-right">
                   <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                     Hình ảnh
                     <i class="fa fa-photo"></i>
                   </a>
                 </span>
               </div>
               <div class="content-chat">
                 <div class="chat" data-chat="${targetId}">
                 </div>
               </div>
               <div class="write" data-chat="${targetId}">
                 <input type="text" class="write-chat" id="write-chat-${targetId}"
                   data-chat="${targetId}">
                 <div class="icons">
                   <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                   <label for="image-chat-${targetId}">
                     <input type="file" id="image-chat-${targetId}" name="my-image-chat" class="image-chat"
                       data-chat="${targetId}">
                     <i class="fa fa-photo"></i>
                   </label>
                   <label for="attachment-chat-${targetId}">
                     <input type="file" id="attachment-chat-${targetId}" name="my-attachment-chat"
                       class="attachment-chat" data-chat="${targetId}">
                     <i class="fa fa-paperclip"></i>
                   </label>
                   <a href="javascript:void(0)" id="video-chat-${targetId}" data-chat="${targetId}">
                     <i class="fa fa-video-camera"></i>
                   </a>
                 </div>
               </div>
             </div>`;
               $("#screen-chat").prepend(rightSideData);
               changeScreenChat();
               ///step 5 : handle Image Modal 
               let imageModalItem = `
                           <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
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
                  <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
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

            }
         }
      })
   })
}
socket.on("response-approve-request-contact-received", function (user) {
   let notif = `  <div data-uid="${user.id}">
                    <img class="avatar-small" src="images/users/${user.avatar}"
                        alt="">
                    <strong>${user.name}</strong> đã chấp nhận lời mời kết bạn!
                </div>`;
   $(".noti_content").prepend(notif);
   increaseNumberNotification("noti_counter");
   //bỏ 1 thằng vào contact khi dc ngta chap nhận
   let userInfoHtml = `
                    <li class="_contactList" data-uid="${user.id}">
                    <div class="contactPanel">
                    <div class="user-avatar">
                        <img src="images/users/${user.avatar}" alt="">
                    </div>
                    <div class="user-name">
                        <p>
                        ${user.name}
                        </p>
                    </div>
                    <br>
                    <div class="user-address">
                        <span>Địa Chỉ : ${user.address}</span>
                    </div>
                    <div class="user-talk" data-uid="${user.id}">
                    Trò chuyện
                    </div>
                    <div class="user-remove-contact action-danger" data-uid="${user.id}">
                    Xóa liên hệ
                    </div>
                    </div>
                </li>
                `;
   $("#contacts").find("ul").prepend(userInfoHtml);
   $("#request-contact-sent").find(`ul li[data-uid="${user.id}"]`).remove();
   decreaseNumberNotifContact("count-request-contact-sent");
   increaseNumberNotifContact("count-contacts");
   removeContact();
   /// socket trả lại cho thằng gửi ... 
   //All step handle chat after approve contact;
   //Step 01 : 
   // $("#contactsModal").modal("hide");
   //step 2 : them vao left side 
   let subUserName = user.name;
   if (subUserName.length > 15) {
      subUserName = subUserName.substr(0, 12)
   }
   let letsideData = `
                     <a href="#uid_${user.id}" data-id="${user.id}" class="room-chat">
                           <li class="person" data-chat="${user.id}">
                              <div class="left-avatar">
                                 <div class="dot"></div>
                                 <img src="images/users/${user.avatar}" alt="">
                              </div>
                              <span class="name">
                                 ${subUserName}
                              </span>
                              <span class="time"> </span>
                              <span class="preview"> </span>
                           </li>
                     </a>
                      `;
   $("#all-chat").find("ul").prepend(letsideData);
   $("#user-chat").find("ul").prepend(letsideData);
   //step 3 : handle right side 
   let rightSideData = `  
               <div class="right tab-pane  " data-chat="${user.id}"
               id="to_${user.id}">
               <div class="top">
                 <span>To: <span class="name">
                  ${user.name}
                   </span></span>
                 <span class="chat-menu-right">
                   <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                     Tệp đính kèm
                     <i class="fa fa-paperclip"></i>
                   </a>
                 </span>
                 <span class="chat-menu-right">
                   <a href="javascript:void(0)">&nbsp;</a>
                 </span>
                 <span class="chat-menu-right">
                   <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                     Hình ảnh
                     <i class="fa fa-photo"></i>
                   </a>
                 </span>
               </div>
               <div class="content-chat">
                 <div class="chat" data-chat="${user.id}">
                 </div>
               </div>
               <div class="write" data-chat="${user.id}">
                 <input type="text" class="write-chat" id="write-chat-${user.id}"
                   data-chat="${user.id}">
                 <div class="icons">
                   <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                   <label for="image-chat-${user.id}">
                     <input type="file" id="image-chat-${user.id}" name="my-image-chat" class="image-chat"
                       data-chat="${user.id}">
                     <i class="fa fa-photo"></i>
                   </label>
                   <label for="attachment-chat-${user.id}">
                     <input type="file" id="attachment-chat-${user.id}" name="my-attachment-chat"
                       class="attachment-chat" data-chat="${user.id}">
                     <i class="fa fa-paperclip"></i>
                   </label>
                   <a href="javascript:void(0)" id="video-chat-${user.id}" data-chat="${user.id}">
                     <i class="fa fa-video-camera"></i>
                   </a>
                 </div>
               </div>
             </div>`;
   $("#screen-chat").prepend(rightSideData);
   changeScreenChat();
   ///step 5 : handle Image Modal 
   let imageModalItem = `
                           <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
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
                  <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
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
})

$(document).ready(function () {
   approveRequestContactReceived();
})