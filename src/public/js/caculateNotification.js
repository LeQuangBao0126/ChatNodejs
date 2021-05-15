function increaseNumberNotification(className) {
    let currentValue = +$(`.${className}`).text();
    currentValue += 1;
    if (currentValue == 0) {
        $(`.${className}`).css("display", "none").html(0);
    } else {

        $(`.${className}`).css("display", "block").html(`${currentValue}`);
    }
}
function decreaseNumberNotification(className) {
    let currentValue = +$(`.${className}`).text();
    currentValue -= 1;
    if (currentValue <= 0) {
        $(`.${className}`).css("display", "none").html(0);
    } else {

        $(`.${className}`).css("display", "block").html(`${currentValue}`);
    }
}
function decreaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;
    if (currentValue <= 0) {
        $(`.${className}`).html(0);
    } else {
        $(`.${className}`).html(`<em>${currentValue}</em>`);
    }
}
function increaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue += 1;
    if (currentValue == 0) {
        $(`.${className}`).html(0);
    } else {

        $(`.${className}`).html(`<em>${currentValue}</em>`);
    }
}