/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}
// function nineScrollRight(divId) {
//   $('.right .chat').niceScroll({
//     smoothscroll: true,
//     horizrailenabled: false,
//     cursorcolor: '#ECECEC',
//     cursorwidth: '7px',
//     scrollspeed: 50
//   });
//   $('.right .chat').scrollTop($('.right .chat')[0].scrollHeight);
// }
function nineScrollRight(divId) {
  $(`.right .chat[data-chat="${divId}"]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat="${divId}"]`).scrollTop($(`.right .chat[data-chat="${divId}"]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $('.write-chat[data-chat="' + divId + '"]').emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function () {
        textAndEmojiChat(divId);
        TypingOn(divId);
      },
      blur: function () {
        TypingOff(divId)
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  //   $(document)
  //     .ajaxStart(function () {
  //       spinLoading();
  //     })
  //     .ajaxStop(function () {
  //       spinLoaded();
  //     });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(document).click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function () {
    let href = $(this).attr("href");
    let imageModalId = href.substr(1);

    let originalDataImage = $(`#${imageModalId}`).find(".modal-body").html();


    let countRows = Math.ceil($(`#${imageModalId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${imageModalId}`).find('div.all-images').photosetGrid({
      highresLinks: true,
      rel: 'withhearts-gallery',
      gutter: '2px',
      layout: layoutStr,
      onComplete: function () {
        $(`#${imageModalId}`).find('.all-images').css({
          'visibility': 'visible'
        });
        $(`#${imageModalId}`).find('.all-images a').colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '90%',
          maxWidth: '90%'
        });
      }
    });
    //bat su kien dong modal
    $(`#${imageModalId}`).on("hide.bs.modal", function () {
      $(this).find(".modal-body").html(originalDataImage)
    });
  })

}

function showButtonGroupChat() {
  $('#select-type-chat').bind('change', function () {
    if ($(this).val() === 'group-chat') {
      $('.create-group-chat').show();
      // Do something...
    } else {
      $('.create-group-chat').hide();
    }
  });
}


function changeTypeChat() {
  $("#select-type-chat").on("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");
  })
}
function changeScreenChat() {
  $(".room-chat").on("click", function () {
    //thuc hien theo cac li của các conversation 
    let divId = $(this).data("id");
    $(".person").removeClass("active")
    $(`.person[data-chat=${divId}]`).addClass("active");
    //thuc hien theo man hinh pane 

    $(".rightside").find("div.tab-pane").removeClass("active");
    $(".rightside").find(`div.tab-pane[id="to_${divId}"]`).addClass("active");

    //cấu hình thanh cuộn xuống tin nhắn mới .
    nineScrollRight(divId);
    //bat emoji 
    enableEmojioneArea(divId);
    imageChat(divId);
    attachmentChat(divId);
    videoChat(divId);
  })
}

function BufferToBase64(arrayBuffer) {
  return btoa(
    new Uint8Array(arrayBuffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}
$(document).ready(function () {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();
  //nineScrollRight();

  // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn


  // Icon loading khi chạy ajax
  //ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện
  showButtonGroupChat();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
  //addFriendsToGroup();

  // Action hủy việc tạo nhóm trò chuyện
  //cancelCreateGroup();
  //thay doi kieu tro chuyen 
  changeTypeChat();
  //thay doi màn hình chat.
  changeScreenChat();
  //đầu tien phải có thằng active 
  if ($("ul.people").find("a")[0].length) {
    $("ul.people").find("a")[0].click();
  }


  $("#video-chat-group").on("click", function () {
    alertify.notify("Không khả dụng tính năng này với nhóm trò chuyện.Vui lòng thử lại với trò chuỵen cá nhân", "error", 8);
  })
});
