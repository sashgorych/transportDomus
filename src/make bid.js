

let maxBids = 3;
var datesToBid = [];

$('#makeBidBtn').click(function (e) {
    e.preventDefault()
    makeBidFront()
})


function insertInfoInBidPopup(data) {
    clearBidPopup()
    console.log(data);
    document.querySelector("#bid_order_id").value = data["obj[data][recordid]"];
    document.querySelector("#time_bid").value = data["obj[data][time]"];
    // document.querySelector("#expert_id").value = expertData["obj[data][user_id]"];
    setHtmlById("bid-text-order_id", data["obj[data][recordid]"])
    setHtmlById("bid-service_type", service_typeText[data["obj[data][service_type]"]])
    setDateInBidPopup(data)
    // setTimeInBidPopup(data)
    setTimeInBidPopupSimple(data)
}

function setTimeInBidPopupSimple(data) {
    let timeRange = data["obj[data][time]"];
    setHtmlById("customer_time", timeRange)
}

function setTimeInBidPopup(data) {
    let timeRange = data["obj[data][time]"];
    setHtmlById("customer_time", timeRange)
    let timeArray = timeRange.split("-") || [];
    let selectOption = ``;
    let selectTime = document.getElementById("expert_time")
    if (!selectTime) {
        return;
    }
    let timeStart = timeArray[0].split(":")[0];
    let timeEnd = timeArray[1].split(":")[0];
    let allTimeNumber = [];
    for (let i = +timeStart; i < +timeEnd; i++) {
        allTimeNumber.push(i + ":00")
    }
    allTimeNumber.forEach((time, ind) => {
        let option = document.createElement('option');
        option.value = option.text = time;
        selectTime.add(option);
        if (!(allTimeNumber.length - 1 - ind == 0)) {
            option = document.createElement('option');
            let t = time.split(':')[0]
            option.value = option.text = t + ":30";
            selectTime.add(option);
        }
    })
}

function makeInputReadOnly(input) {
    if (!document.querySelector(input)) return
    document.querySelector(input).setAttribute("readonly", "readonly");
}

function makeInputNotReadOnly(input) {
    if (!document.querySelector(input)) return
    document.querySelector(input).removeAttribute("readonly");
}

function setDateInBidPopup(data) {
    let dateType = data["obj[data][date_type]"];
    if (dateType == 'date') {
        setHtmlById("customer_date", dateViewer(data["obj[data][date]"]))
        setValue("#expert_date", data["obj[data][date]"])
        makeInputReadOnly("#expert_date")
        hideBlock("customer-date-time")
    }
    if (dateType == "range") {
        setHtmlById("customer_date", dateViewer(data["obj[data][date_from]"]) + " - " + dateViewer(data["obj[data][date_to]"]))
        initBidPopupDatepicker("#expert_date", data)
        showBlock("customer-date-time")

    }
}

function renderAnotherOneDate() {

}

var datepickerBid;

function clearListener(element) {
    document.querySelector(element).removeEventListener("changeDate", changeDateFunc)
}

function initBidPopupDatepicker(input, data) {
    let minDateText = data["obj[data][date_from]"].split("-")
    let maxDateText = data["obj[data][date_to]"].split("-")
    let minDate = new Date(minDateText[0], +minDateText[1] - 1, minDateText[2])
    let maxDate = new Date(maxDateText[0], +maxDateText[1] - 1, maxDateText[2])
    if (!document.querySelector(input)) {
        return
    }

    const elem = document.querySelector(input);
    datepickerBid = new Datepicker(elem, {
        format: 'yyyy-mm-dd',
        minDate: minDate,
        maxDate: maxDate,
        autohide: true,
    });
    elem.addEventListener('changeDate', changeDateFunc)

}

function changeDateFunc(e) {
    $("#dates_title").removeClass("hide")
    addNewDate(e.target.value)
    $('.expert_date-form-row').addClass('active')
}

function addNewDate(date) {
    if (!datesToBid.includes(date)) {
        datesToBid.push(date)
        renderDateInHtml()
    }
}

function renderDateInHtml() {
    let cont = $(".dates-list");
    let time = $("#customer_time").html()
    let str = ``
    datesToBid.forEach((el, ind) => {
        str += `
         <div class="date-item">
           <p>${dateViewer(el)} <span>${time}</span></p>
           <button type="button" class="remove-date-bid" onclick="removeDateBid(event)" data-c="${ind}"><img src="/images/close.svg" data-c="${ind}" alt="delete" title="delete"></button>
         </div>
        `
    })
    cont.html(str)

}

function removeDateBid(e) {
    let i = e.target.dataset.c
    datesToBid.splice(i, 1);
    renderDateInHtml()

}

function getDateMyFormat(timeShtamp) {
    var date = new Date(timeShtamp * 1000);
    let mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let yy = date.getFullYear();
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let timeHour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    let timeMin = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()

    return `${dd}-${mm}-${yy};${timeHour}:${timeMin}`
}
function dateViewer(dt) {
    let x = dt.split('-')
    let yy = x[0]
    let mm = x[1]
    let dd = x[2]
    return `${dd}-${mm}-${yy}`
}

$("#make-bid .popup_close2").click(function (e) {
    clearBidPopup()
})

function clearBidPopup() {
    if (!!datepickerBid) {
        datepickerBid.destroy()
    }
    $('#make-bid-form input').parents('.form-row').removeClass('active')
    clearListener("#expert_date");
    datesToBid = [];
    $(".dates-list").empty();
    document.querySelector("#bid_order_id").value = "";
    hideBlock("dates_title")
    setHtmlById("bid-text-order_id", "")
    setHtmlById("bid-service_type", "")
    setValue('#hourly_cost', "")
    setValue('#transportation_cost', "")
    setValue('#fixed_cost', "")
    setValue('#time_bid', "")
    clearErrorInput("#hourly_cost")
    clearErrorInput("#transportation_cost")
    clearErrorInput("#fixed_cost")
    clearErrorInput("#expert_date")
    // clearErrorInput("#expert_time")
    $("#hourly_rate").prop('checked', true);
    $("#fixed_price").prop('checked', false);
    showBlockPaymentTypeHorly()
    setValue("#expert_date", "")
    // setValue("#expert_time","")
    // clearSelectOption("#expert_time")
    makeInputNotReadOnly("#expert_date")
}


function showBlockPaymentTypeHorly() {
    $("#hourly_rate_block_id").removeClass("hide")
    $("#fixed_rate_block_id").addClass("hide")
}

function showBlockPaymentTypeFixed() {
    $("#hourly_rate_block_id").addClass("hide")
    $("#fixed_rate_block_id").removeClass("hide")
}

function setValue(input, val) {
    if (!document.querySelector(input)) return
    document.querySelector(input).value = val;
}

function initPaymentType() {
    paymentType = "hourly"
    showBlockPaymentTypeHorly()
    setValue('#fixed_cost', "ignore")
    setValue('#minimum_hours', "1")
}

function changePaymentType(el) {
    let pType = $(el).attr('value');
    if (pType == "hourly") {
        paymentType = "hourly"
        showBlockPaymentTypeHorly()
        setValue('#fixed_cost', "ignore")
        setValue('#minimum_hours', "1")

        clearErrorInput('#fixed_cost')
    } else {
        paymentType = "price";
        showBlockPaymentTypeFixed()
        setValue('#hourly_cost', "ignore")
        setValue('#minimum_hours', "ignore")
        setValue('#transportation_cost', "ignore")
        clearErrorInput('#hourly_cost')
        clearErrorInput('#transportation_cost')
    }
}


function checkBidInputs() {
    if (paymentType == "hourly") {
        checkInputLength("#hourly_cost")
        checkInputLength("#transportation_cost")
    } else {
        checkInputLength("#fixed_cost")
    }

    checkInputLength("#est_duration_hours")
    checkInputLength("#estimated_helpers")
    checkInputLength("#expert_date")
    // checkInputLength("#expert_time")
}

function isValidForm(formId) {
    if ($("#" + formId).find('.form-row.error').length) {
        scrollToErrorInput()
        return false;
    }
    return true;

}

function getData(formId) {
    let obj;
    var data = $("#" + formId).serializeArray().reduce(function (obj, item) {
        if (item.name.includes("[data]")) {
            obj[item.name] = item.value;
        }
        return obj;
    }, {});
    return data;
}

function getBidsData(formId) {
    let obj;
    var dataArray = [];
    var data = $("#" + formId).serializeArray().reduce(function (obj, item) {
        if (item.name.includes("[data]")) {
            obj[item.name] = item.value;
        }
        return obj;
    }, {});
    if (datesToBid.length > 1) {
        datesToBid.forEach((date, ind) => {
            let copyObj = JSON.parse(JSON.stringify(data))

            if (ind > 0) {
                // add duplicate except first
                copyObj["obj[data][duplicate]"] = "duplicate";
            }
            copyObj["obj[data][expert_date]"] = date;
            dataArray.push(copyObj)
        })
        return dataArray;
    } else {
        dataArray.push(data)
        return dataArray;
    }
}

function openBidPopup() {
    $('#make-bid').addClass("active")
    lockBg()
}

function closeBidPopup() {
    clearBidPopup()
    $('#make-bid').removeClass("active")
    unlockBg()
}


document.querySelectorAll('input[name="obj[data][payment_type]"]').forEach(el => {
    el.addEventListener('change', function () {
        changePaymentType(el)
    })
})


function setOrderTypeTitle(order){
    if(!order){
        $('#date-of-exp').parents('p').html(dateText)
        return}
    let type = order["obj[data][service_type]"]
    $('#date-of-exp').html(service_typeShortText[type])
}
function setBidCreateDate() {
    let date = new Date()
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    ;
    let dateStr = yy + "-" + mm + "-" + dd + ";" + hour + ":" + minutes;

    setValue("#created_date", dateStr)

}

function increaseBidsCountInBtn(id) {
    let btn = document.querySelector("#orders-list").querySelector(`button[data-bidid="${id}"]`)
    let curr = +btn.dataset.bids;
    if (curr < maxBids) {
        curr++;
        btn.dataset.bids = curr;
        btn.innerHTML = `${makeBidText} (${curr}/3)`
    }
    if(curr == maxBids){
        btn.setAttribute("disabled", "disabled");
    }
}

function makeBidFront() {
    checkBidInputs()
    if (isValidForm("make-bid-form")) {
        setBidCreateDate()
        let objArray = getBidsData("make-bid-form");
        console.log(objArray);
        let promise = makeBids(objArray)
        promise.done(function (data) {
            console.log(data);
            if (!data) {
                showInfo("Error")
            }
            if (data['status'] == 'ok') {
                closeBidPopup()
                showInfo(successText, bidMakeText)

            } else {
                if (data['status'] == "error") {
                    showInfo(data['status'], data['errmsg'])
                }
            }
            closeBidPopup()

        });


    }

}

function showInfo(headerI, text) {
    showTempPopup({
        popupSize: "medium",
        titleContent: "<h2>" + headerI + "</h2>",
        bodyContent: "<p>" + text + "</p>",
        displayTime: 3000
    })
}
function initBidClick() {
    $('.makeBidBtn-open').click(function (e) {
        e.preventDefault()
        insertInfoInBidPopup(orderData)
        initPaymentType()
        openBidPopup()
    })


}



var bidTimevalFrom = 0;
var bidTimevalTo = 0;
function setBidEstimatedTimeFrom(vl){
    console.log(vl);
    let opt = $(`#est_duration_hours option[value="${vl}"]`);
    if(opt.length){
        opt.prop('selected', true)
        bidTimevalFrom = vl;
    }else{
        $(`#est_duration_hours option:first-child`).prop('selected',true);
        bidTimevalFrom = +($(`#est_duration_minutes option:first-child`).val())

    }
}
function setBidEstimatedTimeTo(vl){
    console.log(vl);

    let opt = $(`#est_duration_minutes option[value="${vl}"]`);
    if(opt.length){
        bidTimevalTo = vl;
        opt.prop('selected', true)
    }else{
        $(`#est_duration_minutes option:last-child`).prop('selected',true);
        bidTimevalTo = +($(`#est_duration_minutes option:last-child`).val())

    }
}
$('#est_duration_hours').change(function (e){
    bidTimevalFrom = +($('#est_duration_hours').val());
    if(bidTimevalFrom >= bidTimevalTo){
        setBidEstimatedTimeTo(bidTimevalFrom + 1)
    }
})
$('#est_duration_minutes').change(function (e){
    bidTimevalTo = +($('#est_duration_minutes').val());
    if(bidTimevalTo <= bidTimevalFrom){
        setBidEstimatedTimeFrom(bidTimevalTo - 1)
    }
})