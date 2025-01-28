$('.language').click(function (e) {
    e.preventDefault();
    showDrop($('.language'))
})

function showDrop(block) {

    $(block).toggleClass('open');
    setTimeout(function () {
        hideOnClickOutsideSizeDrop($(block), $(block));

    }, 500)
}

var lastScrollTop ;

$(document).ready(function (){
// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
    document.addEventListener("scroll", function () { // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if(st > 400) {
            headerStateDown()
        }else{
            if(st < 300) {
                headerStateUp()
            }
        }

        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    });
})
function headerStateDown(){
    if(document.querySelector('.locked')){return}
    $('header').addClass('scrl')

}
function headerStateUp(){
    if(document.querySelector('.locked')){return}

    $('header').removeClass('scrl')
}
$('.td-auth').click(function (e){
    e.preventDefault()
    openAuth()
})
function openAuth(){
    lockBg()

    $('#auth_popup').addClass('active')
}
if (screen.width < 850) {
    $('.open-page-menu').click(function (e) {
        $(this).find('.menu-mob').toggleClass('act')
        $(".nav").toggleClass('act')
    })
} else {
    $('.toggleMenuBtn').click(function (e) {
        e.preventDefault()
    })
}
if ($('.review-container').length && screen.width < 1380) {
    $('.review-container').slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        responsive: [
            {
                breakpoint: 1180,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    })
}

$('.tabs-title label').click(function (e) {
    $(this).parents('.tabs-block').find('.tabs-container').toggleClass('active')
})

//dashboard
$('.toggle-d-menu').click(function () {
    $('.d-menu').toggleClass('active')
    $('.dashboard').toggleClass('full')

})


// default popup start
var globalAllPopupTimeOut = [];
var globalPopupTimeOut;
let obj2 = {
    id: '',
    titleContent: '',
    bodyContent: '',
    bottomContent: '',
    displayTime: '',
    popupSize: '',
    popupClasses: '',
    callbackAfterOpen: function () {
    },
    callbackAfterClose: function () {
    },
}

function removePopup(popId) {
    console.log(popId)
    clearObjFromArray(popId, globalAllPopupTimeOut)
    $(popId + '+ .side-menu__bg_popup2').remove();
    $(popId).remove();
    if (!checkExistActivePopup()) {
        unlockBg()
    }
}

function checkExistActivePopup() {
    let actPop = $('.default_popup2.active');
    if (actPop.length > 0) {
        return true;
    }
    return false;
}

function showTempPopup(opt) {
    if (!opt.popupSize) {
        opt.popupSize = ''
    }
    if (!opt.titleContent) {
        opt.titleContent = ''
    }
    if (!opt.bodyContent) {
        opt.bodyContent = ''
    }
    if (!opt.bottomContent) {
        opt.bottomContent = ''
    }
    if (!opt.popupSize) {
        opt.popupSize = ''
    }

    let popup = createTempPopupHtml(opt);
    let popupHtml = popup[0];
    let popupId = "#" + popup[1];
    console.log(popupId)
    document.querySelector('.layout ').insertAdjacentHTML('beforeend', popupHtml);
    lockBg()
    calculatePopupHeight(popupId)
    $(popupId).addClass('active')
    if (!!opt.displayTime) {
        let timeout1 = setTimeout(function () {
            removePopup(popupId)
            if (!($('.default_popup2').hasClass('active'))) {
                unlockBg()
            }
            if (opt.callbackAfterClose) {
                opt.callbackAfterClose();
            }
        }, opt.displayTime)
        globalAllPopupTimeOut.push({
            'popup': popupId,
            'timer': timeout1
        })
    }
    if (opt.callbackAfterOpen) {
        opt.callbackAfterOpen();
    }
    $(popupId + ':not(.no-temp) + .side-menu__bg_popup2').click(function (e) {
        removePopup(popupId)
    })
    $(popupId + ':not(.no-temp)').find('.popup_close2').click(function (e) {
        removePopup(popupId)
    })
    $(popupId + ":not(.no-temp)").find('.hide_temp_popup').click(function (e) {
        removePopup(popupId)
    })
    return popupId;
}

if (document.querySelector(".default_popup2.no-temp")) {
    $(".default_popup2.no-temp").each((id, el) => {
        let popId = $(el).attr('id');
        $("#" + popId + '+ .side-menu__bg_popup2').click(function (e) {
            hidePopup(popId)
        })
        $("#" + popId).find('.popup_close2').click(function (e) {
            hidePopup(popId)
        })
        $("#" + popId).find('.hide_temp_popup').click(function (e) {
            hidePopup(popId)
        })
    })
}

function clearObjFromArray(id, arr = []) {
    arr.forEach((el, index) => {
        if (el['popup'] == id) {
            console.log('claer')
            clearTimeout(el['timer'])
            arr.splice(index, 1);
        }
    })
}

function createTempPopupHtml(opt) {
    let counterPopup = document.querySelectorAll('.temp_popups').length;
    let popupClasses = "";
    let popId = "temp_popup" + counterPopup;
    if (!!opt.popupClasses) {
        popupClasses = opt.popupClasses.split(',').join(' ');
    }
    let zIndex1 = 42 + counterPopup;
    let zIndex2 = 41 + counterPopup;
    let htmtBlock = `
    <div class="default_popup2 temp_popups ${opt.popupSize} ${popupClasses}" id="${popId}"  style="z-index: ${zIndex1}">
    <div class="popup_close2">
        <div class="icon-close2"><span></span></div>
    </div>
    <div class="popup_body2 default-text">
        <div class="popup_title2">
        ${opt.titleContent}
     </div>
        <div class="popup_content2">
            ${opt.bodyContent}
        </div>
        <div class="popup_bottom2">
                ${opt.bottomContent}
        </div>
    </div>
</div>
<div class="side-menu__bg_popup2" style="z-index: ${zIndex2}"></div>
`
    return [htmtBlock, popId];
}

function calculatePopupHeight(popupId) {
    let titleHeight = $(popupId).find('.popup_title').height();
    let bottomHeight = $(popupId).find('.popup_bottom').height();
    let commonHeight = 145 + titleHeight + bottomHeight;
    $(popupId).find('.popup_content').css('max-height', 'calc(90vh - ' + commonHeight + 'px');
    // 85
}

function openPopup(id, content, time) {
    let popupId = '#' + id;
    if (!document.querySelector(popupId)) {
        return
    }
    if (!!content) {
        $(popupId).find('.popup_content2').html(content)
    }
    lockBg()
    showDarkMenuBg()
    calculatePopupHeight(popupId)
    $(popupId).addClass('active')
    if (!!time) {
        globalPopupTimeOut = setTimeout(function () {
            $(popupId).removeClass('active')
            unlockBg()
            hideDarkMenuBg()
        }, time)
    }

}

function openPopupObj(obj) {

    if (!obj.id) {
        return;
    }
    let popupId = '#' + obj.id;
    if (!document.querySelector(popupId)) {
        return
    }

    if (!!obj.titleContent) {
        $(popupId).find('.popup_title2').html(obj.titleContent)
    }
    if (!!obj.bodyContent) {
        $(popupId).find('.popup_content2').html(obj.bodyContent)
    }
    if (!!obj.bottomContent) {
        $(popupId).find('.popup_bottom2').html(obj.bottomContent)
    }
    if (!!obj.popupClasses) {
        let cls = obj.popupClasses.split(',')
        cls.forEach(popupClassName => {
            document.querySelector(popupId).classList.add(popupClassName);
        })
    }
    if (!!obj.popupSize) {
        switch (obj.popupSize) {
            case 'mini':
                document.querySelector(popupId).classList.add('mini');
                break;
            case  'medium':
                document.querySelector(popupId).classList.add('medium')
                break;
            case  'maxi':
                document.querySelector(popupId).classList.add('maxi')
                break;
        }
    }
    lockBg()
    showDarkMenuBg()
    calculatePopupHeight(popupId)
    $(popupId).addClass('active')
    if (!!obj.displayTime) {
        globalPopupTimeOut = setTimeout(function () {
            hidePopup()
            unlockBg()
            hideDarkMenuBg()
            if (obj.callbackAfterClose) {
                obj.callbackAfterClose();
            }
        }, obj.displayTime)
    }

}

function hidePopup(id = "") {
    if (id.length > 0) {
        $("#" + id).removeClass("active");
    } else {
        if (!!globalPopupTimeOut) {
            clearTimeout(globalPopupTimeOut)
        }

        $('.default_popup2.active').find('.popup_title2').html('')
        $('.default_popup2.active').find('.popup_content2').html('')
        $('.default_popup2.active').find('.popup_bottom2').html('')
        $('.default_popup2.active').removeClass().addClass('default_popup2');
    }
}

$('.popup_close2').click(function () {
    let id = $(this).parents(".default_popup2").attr("id");
    hidePopup(id);
    unlockBg();
})
// $('.close_popup_event').click(function (e) {
//     e.preventDefault()
//     hidePopup();
//     unlockBg();
// })
// $('.side-menu__bg_popup2').click(function () {
//     hidePopup()
// })
//default popup end
//locked bg and other...
function unlockBg() {

    clearMarginInsteadScrollBody();
    $("body").removeClass('locked');
    $(window).scrollTop($('body').attr('data-pos'));
}

function lockBg() {
    if ($('body').hasClass('locked')) {
        return
    }
    makeMarginInsteadScrollBody()
    // when popup opens
    $('body').attr('data-pos', $(window).scrollTop()); // get actual scrollpos
    $('body').addClass('locked'); // add class to body
    $('.layout').scrollTop($('body').attr('data-pos')); // let wrapper scroll to scrollpos

}

function showLoadingGif() {
    let isExist = document.querySelector('.loadingEffect');
    if (!isExist) {
        lockBg()
        document.querySelector('body').insertAdjacentHTML('beforeEnd', `<div class="loadingEffect"><div class="loading-wrapper"><div class="loader"></div></div></div>`)
    } else {

    }
}

function hideLoadingGif() {
    setTimeout(function (e){
        let isExist = $('.loadingEffect');
        if (isExist.length) {
            unlockBg()
            isExist.remove()
        }
    },500)

}

function insertLoading() {
    let isExist = document.querySelector('.side-menu__bg').querySelector('.load_bg');
    if (!isExist) {
        document.querySelector('.side-menu__bg').insertAdjacentHTML('beforeEnd', `<img src="/images/loading.gif" width="40px" height="40px" class="load_bg" alt="load">`)
    }
}

function showDarkMenuBg(showLoad = false) {
    if (showLoad) {
        insertLoading()
        $('.side-menu__bg').addClass('active-load')
    }
    $('.side-menu__bg').addClass('active')

}

function hideDarkMenuBg() {
    $('.side-menu__bg').removeClass('active')

}

function showMainMenu() {
    lockBg();
    showDarkMenuBg()
    $('.menu-toggle').addClass('open')

    $('.menu-container').addClass('active')
}

function makeMarginInsteadScrollBody() {
    $('.layout ').css('margin-right', (window.innerWidth - $('body').width()) + 'px');
}

function clearMarginInsteadScrollBody() {
    $('.layout').css('margin-right', 0 + 'px');
}

function hideMainMenu() {
    unlockBg()
    hideDarkMenuBg()
    $('.menu-toggle').removeClass('open')
    $('.menu-container').removeClass('active')

}

//main menu.close menu when click in background
$('.side-menu__bg').click(function (e) {
    hideDarkMenuBg();
    unlockBg();
    hidePopup();

})
//locked bg and other end
// default popup start
function showDefaultPopup(titleText = "", textHtml = "", time = 2000) {
    showTempPopup({
        titleContent: `<p class="title">${titleText}</p>`,
        bodyContent: `<p>${textHtml}</p>`,
        popupSize: 'medium',
        displayTime: time
    })
}

function hideDefaultPopup() {
    hideDarkMenuBg()
    unlockBg()
    document.querySelector('.content_popup').classList.remove('active')

}

$('.popup_close').click(function () {
    hidePopupX();
    unlockBg();
    hideDarkMenuBg()
})

function hidePopupX() {
    $('.default_popup').removeClass('active')
}

//default popup end
$('.dropdown-title').click(function (e) {
    e.preventDefault();
    showDrop($(e.target).parents(".dropdown-block"))
})

function showDrop(block) {

    $(block).toggleClass('open');
    setTimeout(function () {
        hideOnClickOutsideSizeDrop($(block), $(block));

    }, 500)
}

function hideOnClickOutsideSizeDrop(selector, hideSelector, callback) {
    const outsideClickListener = (event) => {
        const $target = $(event.target);
        if (!$target.closest(selector).length && $(selector).is(':visible')) {
            $(hideSelector).removeClass('open');
            if (!!callback) {
                callback()
            }

            removeClickListener();
        }
    }
    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    }
    removeClickListener();


    document.addEventListener('click', outsideClickListener);
}

//open-close block start
$('.open_close_block .o_p_ttl').click(function (e) {
    $(this).parent().toggleClass('open')
})
//open-close block end
//advices start
if (document.querySelector(".advices")) {
    initAdvices()
}

function initAdvices() {
    let x = $(".open_close_block");
    if (x.length) {
        x.removeClass('hide')
        $('.no-advices').addClass('hide')

    }
}

$('.advices--categories button').click(function (e) {
    e.preventDefault()
    $('.advices--categories button').removeClass('active')
    $(this).addClass('active')
    let cat = $(this).attr("data-show")
    let x = $(`div[data-category="${cat}"]`);
    $('.advices-list .open_close_block').addClass('hide')
    if (x.length) {
        x.removeClass('hide')
        $('.no-advices').addClass('hide')
    } else {
        $('.no-advices').removeClass('hide')
    }

})

//advices end
function getDateMyFormat(date) {
    let mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let yy = date.getFullYear();
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let timeHour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    let timeMin = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()

    return `${yy}-${mm}-${dd};${timeHour}:${timeMin}`
}

//rating set
var userRating;
// Check Radio-box
$(".rating-leave input:radio").attr("checked", false);

$('.rating-leave input').click(function () {
    $(".rating-leave span").removeClass('checked');
    $(this).parent().addClass('checked');
});

$('.rating-leave input:radio').change(
    function () {
        $('.js-rating-input').val(this.value)
        userRating = this.value;
    });

function getReviewRating() {
    return userRating;
}


function showFeedback(title, content, status) {
    if(status == "ok"){
        document.querySelector('.layout').insertAdjacentHTML("beforeend",
            `
        <div class="popup-feedback_overlay">
<div id="popup-feedback" class="p-success"><div class="popup_title">${title}!</div><div class="popup_text">${content}</div>
<div class="popup_buttons"><a href="#" class="btn_ok">x</a></div>
</div>
</div>
</div>
        `
        )
    }
    if(status == 'error') {
        document.querySelector('.layout').insertAdjacentHTML("beforeend",
            `
        <div class="popup-feedback_overlay">
<div id="popup-feedback" class="p-error"><div class="popup_title">${title}!</div><div class="popup_text">${content}</div>
<div class="popup_buttons"><a href="#" class="btn_ok">x</a></div>
</div>
</div>
</div>
        `
        )
    }
    let popupOverlay = document.querySelector('.popup-feedback_overlay')
    let popup = document.querySelector('#popup-feedback')
    popupOverlay.classList.add('show')
    setTimeout(function (e){
        popup.classList.add('show')
    },140)
    let closeBtn = document.querySelector('#popup-feedback .btn_ok');
    closeBtn.addEventListener("click", function (e) {
        e.preventDefault()
        closeFeedbackPopup()
    })
    popupOverlay.addEventListener("click", function (e) {
        if(e.target.classList.contains("popup-feedback_overlay")) {
            e.preventDefault()
            closeFeedbackPopup()
        }
    })
}

function closeFeedbackPopup() {
    let popupOverlay = document.querySelector('.popup-feedback_overlay')
    if (popupOverlay) {
        let popup = document.querySelector('#popup-feedback')
        popup.classList.remove('show')
        setTimeout(function (e){
            popupOverlay.classList.remove('show')
            popupOverlay.remove()

        },300)
    }
}

/*feedback popup2 start*/
var feedbackTimeout2;
function showFeedback2(title, content, status = 'error') {
    if(status == "ok"){
        document.querySelector('.layout').insertAdjacentHTML("beforeend",
            `
        <div class="popup-feedback_overlay2">
<div id="popup-feedback2" class="p-success"><div class="popup_title">${title}!</div><div class="popup_text">${content}</div>
<div class="popup_buttons"><a href="#" class="btn_ok">x</a></div>
</div>
</div>
</div>
        `
        )
    }
    if(status == 'error') {
        document.querySelector('.layout').insertAdjacentHTML("beforeend",
            `
        <div class="popup-feedback_overlay2">
<div id="popup-feedback2" class="p-error"><div class="popup_title">${title}!</div><div class="popup_text">${content}</div>
<div class="popup_buttons"><a href="#" class="btn_ok">x</a></div>
</div>
</div>
</div>
        `
        )
    }
    let popupOverlay = document.querySelector('.popup-feedback_overlay2')
    let popup = document.querySelector('#popup-feedback2')
    popupOverlay.classList.add('show')
    setTimeout(function (e){
        popup.classList.add('show')
    },140)
    let closeBtn = document.querySelector('#popup-feedback2 .btn_ok');
    closeBtn.addEventListener("click", function (e) {
        e.preventDefault()
        closeFeedbackPopup2()
    })
    popupOverlay.addEventListener("click", function (e) {
        if(e.target.classList.contains("popup-feedback_overlay2")) {
            e.preventDefault()
            closeFeedbackPopup2()
        }
    })
    feedbackTimeout2 = setTimeout(function (){
        closeFeedbackPopup2()
    },30000)
}
customer_date
customer_time
function closeFeedbackPopup2() {
    clearTimeout(feedbackTimeout2)
    let popupOverlay = document.querySelector('.popup-feedback_overlay2')
    if (popupOverlay) {
        let popup = document.querySelector('#popup-feedback2')
        popup.classList.remove('show')
        setTimeout(function (e){
            popupOverlay.classList.remove('show')
            popupOverlay.remove()

        },300)
    }
}
/*feedback popup 2 end*/



<!-- If you are logged in, automatically get your name and email adress, your public profile information -->
FB.login(function(response) {
    if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', {fields: 'name, email'}, function(response) {
            document.getElementById("profile").innerHTML = "Good to see you, " + response.name + ". i see your email address is " + response.email
        });
    } else {
        <!-- If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email -->
        console.log('User cancelled login or did not fully authorize.'); }
});

{

}