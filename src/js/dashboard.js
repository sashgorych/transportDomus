var paymentType = "hourly";
var curentOrderView;
let maxBids =3;
var datesToBid = [];
if (screen.width < 770) {
    $('.d-menu').removeClass('active')
    $('.dashboard').addClass('full')
}

$('#makeBidBtn').click(function (e) {
    e.preventDefault()
    makeBid()
})

// renderOrdersList()

function insertInfoInBidPopup(data) {
    document.querySelector("#bid_order_id").value = data["obj[data][order_id]"];
    document.querySelector("#time_bid").value = data["obj[data][time]"];
    document.querySelector("#expert_id").value = expertData["obj[data][user_id]"];
    setHtmlById("bid-text-order_id", data["obj[data][order_id]"])
    setHtmlById("bid-service_type", data["obj[data][service_type]"])
    setDateInBidPopup(data)
    // setTimeInBidPopup(data)
    setTimeInBidPopupSimple(data)
}
function setTimeInBidPopupSimple(data){
    let timeRange = data["obj[data][time]"];
    setHtmlById("customer_time", timeRange)
}
function setTimeInBidPopup(data){
    let timeRange = data["obj[data][time]"];
    setHtmlById("customer_time", timeRange)
    let timeArray = timeRange.split("-") || [];
    let selectOption = ``;
    let selectTime = document.getElementById("expert_time")
    if(!selectTime){return;}
    let timeStart = timeArray[0].split(":")[0];
    let timeEnd = timeArray[1].split(":")[0];
    console.log(+timeStart);
    console.log(+timeEnd);
    let allTimeNumber  = [];
    for (let i=+timeStart; i<+timeEnd; i++){
        allTimeNumber.push(i+":00")
    }
    allTimeNumber.forEach((time, ind)=>{
        let option = document.createElement( 'option' );
        option.value = option.text = time;
        selectTime.add( option );
        if(!(allTimeNumber.length-1 - ind == 0)){
            option = document.createElement( 'option' );
            let t = time.split(':')[0]
            option.value = option.text = t + ":30";
            selectTime.add( option );
        }
    })
}
function makeInputReadOnly(input){
    if (!document.querySelector(input)) return
    document.querySelector(input).setAttribute("readonly", "readonly");
}
function makeInputNotReadOnly(input){
    if (!document.querySelector(input)) return
    document.querySelector(input).removeAttribute("readonly");
}
function setDateInBidPopup(data) {
    console.log(data);
    let dateType = data["obj[data][date_type]"];
    if (dateType == 'date') {
        setHtmlById("customer_date", data["obj[data][date]"])
        setValue("#expert_date",data["obj[data][date]"] )
        makeInputReadOnly("#expert_date")
        hideBlock("customer-date-time")
    }
    if(dateType == "range"){
        setHtmlById("customer_date", data["obj[data][date_from]"] + " - "+ data["obj[data][date_to]"])
        initBidPopupDatepicker("#expert_date", data)
        showBlock("customer-date-time")

    }
}
function renderAnotherOneDate(){

}
var datepickerBid;
function initBidPopupDatepicker(input, data){
    let minDateText = data["obj[data][date_from]"].split("-")
    let maxDateText = data["obj[data][date_to]"].split("-")
    let minDate = new Date(minDateText[0],+minDateText[1]-1,minDateText[2])
    let maxDate = new Date(maxDateText[0],+maxDateText[1]-1,maxDateText[2])
    if (!document.querySelector(input)) {return}

        const elem = document.querySelector(input);
    datepickerBid = new Datepicker(elem, {
        format: 'yyyy-mm-dd',
        minDate: minDate,
            maxDate: maxDate,
            autohide: true,
        });
        elem.addEventListener('changeDate', (e) => {
            $("#dates_title").removeClass("hide")
            addNewDate(e.target.value)
            $('.expert_date-form-row').addClass('active')
        })

}
function addNewDate(date){
    datesToBid.push(date)
    renderDateInHtml()
}
function renderDateInHtml(){
    let cont = $(".dates-list");
    let time = $("#customer_time").html()
    let str = ``
    datesToBid.forEach((el,ind)=>{
        str+=`
         <div class="date-item">
           <p>${el} <span>${time}</span></p>
           <button type="button" class="remove-date-bid" onclick="removeDateBid(event)" data-c="${ind}"><img src="/images/close.svg" data-c="${ind}" alt="delete" title="delete"></button>
         </div>
        `
    })
    cont.html(str)

}
function removeDateBid(e){
    let i = e.target.dataset.c
    console.log(i)
    datesToBid.splice(i, 1);
    renderDateInHtml()

}
$("#make-bid .popup_close2").click(function (e) {
    clearBidPopup()
})

function clearBidPopup() {
    if(!!datepickerBid){
        datepickerBid.destroy()
    }
    datesToBid = [];
    $(".dates-list").empty();

    document.querySelector("#bid_order_id").value = "";
    document.querySelector("#expert_id").value ="";
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
    setValue("#expert_date","")
    // setValue("#expert_time","")
    // clearSelectOption("#expert_time")
    makeInputNotReadOnly("#expert_date")
}

function clearSelectOption(select){
    if (!document.querySelector(select)) return
    $(select).find('option').remove()
}
function scrollToErrorInput() {
    $('html,body').animate({
        scrollTop: $($('.form-row.error')[0]).offset().top - 280
    }, 1000);
}

function showMoreInfoOrder(data,isBidDisable) {
    insertOrderDataInHtml(data)
    if(isBidDisable){
        $('.makeBidBtn-open').attr("disabled","disabled");
    }
    showMoreInfoPopup()
}

function showMoreInfoPopup() {
    $('#order-info').addClass('active')
}

function insertOrderDataInHtmlSpecialyForMoving(data) {
    // document.getElementById("o-i-accommodationType").innerHTML = data["obj[data][accommodation_type_from]"]
    // document.getElementById("o-i-bedroomFrom").innerHTML = data["obj[data][bedrooms_from]"]
    // document.getElementById("o-i-floorFrom").innerHTML = data["obj[data][floor_from]"]
    document.getElementById("o-i-addressToList").innerHTML = createAddressToTemplateMoving(JSON.parse(data["obj[data][address_to]"]))
    setHtmlById("o-i-accommodationType", data["obj[data][accommodation_type_from]"])
    setHtmlById("o-i-bedroomFrom", data["obj[data][bedrooms_from]"])
    setHtmlById("o-i-floorFrom", data["obj[data][floor_from]"])

}

function insertOrderDataInHtmlSpecialyForDelivery(data) {
    document.getElementById("o-i-addressToList").innerHTML = createAddressToTemplateDelivery(JSON.parse(data["obj[data][address_to]"]))

}

function setHtmlById(blockId, data) {
    if (document.getElementById(blockId)) {
        document.getElementById(blockId).innerHTML = data;
    }
}

function showBlock(blockId) {
    if (!document.getElementById(blockId)) return;
    document.getElementById(blockId).classList.remove('hide')
}

function hideBlock(blockId) {
    if (!document.getElementById(blockId)) return;

    document.getElementById(blockId).classList.add('hide')
}

function showPackingServiceBlock() {
    showBlock("o-i-packingService")
}

function hidePackingServiceBlock() {
    hideBlock("o-i-packingService")
}

function insertOrderDataInHtml(data) {

    $('.makeBidBtn-open').removeAttr("disabled");
    if (data["obj[data][service_type]"] == "moving" || data["obj[data][service_type]"] == "delivery") {
        if (data["obj[data][service_type]"] == "moving") {
            showMovingRows()
            insertOrderDataInHtmlSpecialyForMoving(data)
        }
        if (data["obj[data][service_type]"] == "delivery") {
            hideMovingRows()
            insertOrderDataInHtmlSpecialyForDelivery(data)
        }
        setHtmlById("o-i-serviceType", data["obj[data][service_type]"])
        setHtmlById("o-i-postalFrom", data["obj[data][postal_from]"])
        setHtmlById("o-i-postalFrom2", data["obj[data][postal_from]"])
        setHtmlById("o-i-elevatorFrom", data["obj[data][elevator_from]"] == "false" ? noText : yesText);
        data["obj[data][isNeedBoxing]"] == "false" ? hidePackingServiceBlock() : showPackingServiceBlock()
        insertItemsToMovePreview(getItemsToMoved(data))
    } else {
        if (data["obj[data][service_type]"] == "waste-truck") {
            setHtmlById("o-i-serviceType", truckServiceText)
        }
        if (data["obj[data][service_type]"] == "waste-container") {
            setHtmlById("o-i-serviceType", containerServiceText)

        }
        if (data["obj[data][service_type]"] == "waste-cleaning") {
            showClearingInfo(data)
            setHtmlById("o-i-serviceType", clearingServiceText)

        }

        hideBlock("p-i-postalFrom")
        hideBlock("p-i-addressFrom")
        hideBlock("p-i-2")
        hideBlock("listItemsTitle")
        document.getElementById("o-i-addressToList").innerHTML = createAddressToTemplateClear(JSON.parse(data["obj[data][address_to]"]))

    }
    let postalToString = getPostalToString(JSON.parse(data["obj[data][address_to]"]))
    setHtmlById("o-i-postalTo", postalToString)
    setHtmlById("o-i-number", data["obj[data][order_id]"])
    setHtmlById("o-i-date", data["obj[data][date]"] + data["obj[data][date_from]"] + " - " + data["obj[data][date_to]"])
    setHtmlById("o-i-time", data["obj[data][time]"])
    setHtmlById("o-i-addInfo", data["obj[data][additionalInfo]"])

}

function hideMovingRows() {
    $('.moving-row').addClass('hide')
}

function showMovingRows() {
    $('.moving-row').removeClass('hide')

}

function showClearingInfo(data) {
    document.getElementById('p-i-3').classList.remove('hide')
    document.getElementById('p-i-clearType').innerHTML = data['obj[data][clearing_type]']
}

function clearMoreInfoPopup() {
    setHtmlById("o-i-postalTo", "");
    setHtmlById("o-i-number", "")
    setHtmlById("o-i-date", "")
    setHtmlById("o-i-time", "")
    setHtmlById("o-i-addInfo", "")
    setHtmlById("o-i-serviceType", "")
    setHtmlById("o-i-postalFrom", "")
    setHtmlById("o-i-postalFrom2", "")
    setHtmlById("p-i-clearType", "")
    showBlock("listItemsTitle")
    hideBlock("o-i-packingService")
    hideBlock("p-i-3")
    $('.items-list.non-edit .items-list-cont-out-2').empty()
    $('#o-i-addressToList').empty()
    showBlock("p-i-postalFrom")
    showBlock("p-i-addressFrom")
    showBlock("p-i-2")
    showBlock("listItemsTitle")
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

function hidelistItemsTitle() {
    document.getElementById("listItemsTitle").classList.add('hide')
}

function insertItemsToMovePreview(arrayObj = []) {
    if (arrayObj.length == 0) {
        hidelistItemsTitle()
    }
    let a = ``;
    arrayObj.forEach(el => {
        a += `
        <div class="items-category-wrapper">
                                    <div class="mb-4">
                                       ${el['icon_src']}
                                    </div>`
        let str2 = ``;
        el["items"].forEach(el2 => {
            str2 += `
              <div class="move-item-row">
                                        <div class="flex-fill">
                                            ${el2["name"]}
                                        </div>
                                        <div>
                                            <div role="group" class="input-group"><!---->
                                                <div class="input-group-prepend">
                                                    <button type="button" class="">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-minus">
                                                            <path fill="currentColor" d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z" class=""></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <input type="number" data-id="${el2["uniq_id"]}" min="0" value="${el2['count']}" readonly class="plus-minus-inp">
                                                <div class="input-group-append">
                                                    <button type="button" class="">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-plus">
                                                            <path fill="currentColor" d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z" class=""></path>
                                                        </svg>
                                                    </button>
                                                </div><!---->
                                                </div>
                                        </div>
                                    </div>`
        })


        a += str2 + `</div>`
    })
    document.querySelector('.items-list.non-edit .items-list-cont-out-2').innerHTML = a;
}

function getItemsToMoved(data) {
    if (!data["obj[data][items_to_move]"]) {
        return
    }
    let selectedItems = JSON.parse(data["obj[data][items_to_move]"]);
    let categoryChosen = selectedItems.map(a => a["item_category"]).filter(onlyUnique);
    let filteredCategories = itemList["items_category"].filter(el => {
        return categoryChosen.includes(el["category_name"]);
    })
    filteredCategories.forEach(el => {
        el["items"] = el["items"].filter(el2 => {
            let itm;
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i]['item_id'] == el2['uniq_id']) {
                    itm = el2;
                }
            }
            return !!itm;
        })
    })
    filteredCategories.forEach(el => {
        el["items"].map(el2 => {
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i]['item_id'] == el2['uniq_id']) {
                    el2['count'] = selectedItems[i]['count']
                }
            }
        })
    })

    return filteredCategories;

}

function createAddressToTemplateMoving(addressArray) {
    let str = ``
    let clasHide = addressArray.length == 1 ? "hide" : 'b';
    addressArray.forEach((address, i) => {
        let s1 = address['is_elevator'] == 'true' ? yesText : noText;
        str += `
         <div class="pd-l15">
                        <p class="${clasHide}">${addressText} 1</p>
                        <div class="mb-40 pd-l15 border-left">
                            <div class="row-i"><p><strong>${postalCodeText}: </strong><span>${address['postal']}</span></p></div>
                            <div class="row-i"><p><strong>${accommodationTypeText}: </strong><span>${address['accommodationType']}</span></p></div>
                            <div class="row-i"><p><strong>${bedroomText}: </strong><span>${address['bedrooms']}</span></p></div>
                            <div class="row-i"><p><strong>${floorText}: </strong><span>${address['floor']}</span></p></div>
                            <div class="row-i"><p><strong>${elevatorText}: </strong><span>${s1}</span></p></div>
                        </div>
                    </div>
`
    })
    if (addressArray.length == 0) {
        str = ` <div class="pd-l15">
   <div class="mb-40 pd-l15 border-left">
                               <div class="row-i"><p class="check-left"><strong>${moverText}</strong></p></div>

</div>
</div>`
    }
    return str;
}

function createAddressToTemplateDelivery(addressArray) {
    let str = ``
    let clasHide = addressArray.length == 1 ? "hide" : 'b';
    addressArray.forEach((address, i) => {
        let s1 = address['is_elevator'] == 'true' ? yesText : noText;
        str += `
         <div class="pd-l15">
                        <p class="${clasHide}">${addressText} 1</p>
                        <div class="mb-40 pd-l15 border-left">
                            <div class="row-i"><p><strong>${postalCodeText}: </strong><span>${address['postal']}</span></p></div>
                            <div class="row-i"><p><strong>${elevatorText}: </strong><span>${s1}</span></p></div>
                        </div>
                    </div>
`
    })
    if (addressArray.length == 0) {
        str = ` <div class="pd-l15">
   <div class="mb-40 pd-l15 border-left">
                               <div class="row-i"><p class="check-left"><strong>${moverText}</strong></p></div>

</div>
</div>`
    }
    return str;
}

function createAddressToTemplateClear(addressArray) {
    let str = ``
    let clasHide = addressArray.length == 1 ? "hide" : 'b';
    addressArray.forEach((address, i) => {
        let s1 = address['is_elevator'] == 'true' ? yesText : noText;
        str += `
         <div class="pd-l15">
                        <p class="${clasHide}">${addressText} 1</p>
                        <div class="mb-40 pd-l15 border-left">
                            <div class="row-i"><p><strong>${postalCodeText}: </strong><span>${address['postal']}</span></p></div>
                        </div>
                    </div>
`
    })
    if (addressArray.length == 0) {
        str = ` <div class="pd-l15">
   <div class="mb-40 pd-l15 border-left">
                               <div class="row-i"><p class="check-left"><strong>${moverText}</strong></p></div>

</div>
</div>`
    }
    return str;
}

function getPostalToString(addressArray) {
    console.log(addressArray);
    let str = ""
    addressArray.forEach(el => {
        str += el["postal"] + "; "
    })
    if(addressArray.length == 0){
        str = moverText;
    }
    return str;
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

function changePaymentType(el) {
    let pType = $(el).attr('value');
    if (pType == "hourly") {
        paymentType = "hourly"
        showBlockPaymentTypeHorly()
        setValue('#fixed_cost', "")
        setValue('#minimum_hours', "1")

        clearErrorInput('#fixed_cost')
    } else {
        paymentType = "price";
        showBlockPaymentTypeFixed()
        setValue('#hourly_cost', "")
        setValue('#minimum_hours', "")
        setValue('#transportation_cost', "")
        clearErrorInput('#hourly_cost')
        clearErrorInput('#transportation_cost')

    }
}

function checkInputLength(input) {
    if ($(input).hasClass('custom-select')) {
        if ($(input).find(":selected").val() != "") {
            return true
        } else {
            makeErrorInput(input)

        }
    } else {
        if ($(input).val().length == 0) {
            makeErrorInput(input)
            return false;
        }
    }
    return true;
}

function makeErrorInput(input) {
    $(input).attr('aria-invalid', 'true');
    $(input).parents('.form-row').addClass('error')
}

function clearErrorInput(input) {
    $(input).removeAttr('aria-invalid');
    $(input).parents('.form-row').removeClass('error')
}

function checkBidInputs() {
    if (paymentType == "hourly") {
        checkInputLength("#hourly_cost")
        checkInputLength("#transportation_cost")
    } else {
        checkInputLength("#fixed_cost")
    }
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
    if(datesToBid.length > 1) {
        datesToBid.forEach((date, ind)=>{
            let copyObj = JSON.parse(JSON.stringify(data))

            if(ind > 0){
                // add duplicate except first
                copyObj["obj[data][duplicate]"] = "duplicate";
            }
            copyObj["obj[data][expert_date]"] = date;
            dataArray.push(copyObj)
        })
        return dataArray;
    }else{
        return data;
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
    console.log('asd')
    el.addEventListener('change', function () {
        changePaymentType(el)
        console.log('dasdasd')
    })
})
document.querySelectorAll('.form-row').forEach(el => {
    if (!el.querySelector('input')) {
        if (el.querySelector('select')) {
            el.querySelector('select').addEventListener('focus', function (e) {
                e.target.parentElement.classList.remove('error')
                e.target.parentElement.classList.add('active')
                e.target.removeAttribute('aria-invalid');
            })
        }
        if (el.querySelector('.textarea')) {
            el.querySelector('.textarea').addEventListener('focus', function (e) {
                e.target.parentElement.classList.remove('error')
                e.target.removeAttribute('aria-invalid');

            })
        }
        return

    }

    el.querySelector('input').addEventListener('focus', function (e) {
        e.target.parentElement.classList.add('active')
        e.target.parentElement.classList.remove('error')
        e.target.removeAttribute('aria-invalid');

    })
    el.querySelector('input').addEventListener('blur', function (e) {
        if (e.target.value == 0) {
            e.target.parentElement.classList.remove('active')
        }
    })
})
function getExpertBidsCount(bids){
    if(!bids){return}
    let bids_count = 0;
    let expert_id = expertData["obj[data][user_id]"];
    let bidsArray = JSON.parse(bids);
    bidsArray.forEach(bid=>{
        if(bid["obj[data][expert_id]"] == expert_id){
            if(!(bid["obj[data][duplicate]"] == "duplicate")){
                bids_count++;

            }
        }
    })

return bids_count;
}
function renderOrdersList(){
   let str=``;
    ordersArray.forEach((order,index)=>{
        let postalToString = getPostalToString(JSON.parse(order["obj[data][address_to]"]))
        let expertBids = getExpertBidsCount(order["obj[data][bids]"])
        str+=`
                                <div class="order-row-container" data-info='${index}' data-bid="${expertBids}">
                            <div class="order-row">
                                <div><p class="mobile">#</p>
                                    <p>${order["obj[data][order_id]"]}</p></div>
                                <div>
                                    <button class="more_info">More info</button>
                                </div>
                                <div><p class="mobile">From</p>
                                    <p>${order["obj[data][postal_from]"]}</p></div>
                                <div><p class="mobile">To</p>
                                    <p>${postalToString.split(";").length > 2 ? postalToString.split(";")[0] + " ...": postalToString}</p></div>
                                <div><p class="mobile">Date</p>
                                    <p>${order["obj[data][date_type]"] == 'date' ? order["obj[data][date]"] : order["obj[data][date_from]"] + " - "+ order["obj[data][date_to]"]}</p></div>
                                <div><p class="mobile">Time</p>
                                    <p>${order["obj[data][time]"]}</p></div>
                                <div><p class="mobile">Created At</p>
                                    <p>${processVal(order["obj[data][created_at]"])}</p></div>
                                <div>
                                    <button ${expertBids == maxBids ? "disabled" :'data-x'} class="makeBidBtn-open">Make a bid (${expertBids}/3)</button>
                                </div>
                            </div>

                        </div>

        `
    })
    document.querySelector("#orders-list").innerHTML = str;
    initOrderBtnsListener()
}
function processVal(val){
    if(!val){return "-"}
    return val;
}
function setBidCreateDate(){
    let date = new Date()
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1 < 10 ? "0"+ (date.getMonth() + 1):  date.getMonth() + 1;
    let dd = date.getDate() < 10 ? "0"+ date.getDate() :  date.getDate();
    let minutes = date.getMinutes() < 10 ? "0"+ date.getMinutes() :  date.getMinutes();
    let hour = date.getHours() < 10 ? "0"+ date.getHours() :  date.getHours();;
    let dateStr = yy + "-"+mm+"-"+ dd + ";" + hour + ":" + minutes;

    setValue("#created_date",dateStr )

}
function makeBid() {
    checkBidInputs()
    if (isValidForm("make-bid-form")) {
        setBidCreateDate()
        let obj = getBidsData("make-bid-form");
        console.log(obj)
        //add in `order` record in field obj[data][bids] obj
        //     obj type:{
        //     "obj[data][bid_id]":"", generate by php
        //     "obj[data][fixed_payment]": "",
        //     "obj[data][hour_cost]": "",
        //     "obj[data][status]": "", debt, completed,expect, accept
        //     "obj[data][min_hours]": "",
        //     "obj[data][order_id]": "",
        //     "obj[data][time]": "",
        //     "obj[data][payment_type]": "",
        //     "obj[data][expert_date]": "",
        //     ""obj[data][duplicate]"": "duplicate",
        //     "obj[data][expert_id]": "",
        //     "obj[data][created]": "",
        //     "obj[data][transportation_cost]": ""
        // }

        //after success:
        closeBidPopup()

    }

}
function initOrderBtnsListener() {
    $('.makeBidBtn-open').click(function (e) {
        e.preventDefault()
        let data1;
        let index = +($(this).parents(".order-row-container").attr("data-info"));
        let data0 = ordersArray[index];
        console.log(data0);
        if (!!data0) {
            data1 = data0;
        } else {
            data1 = curentOrderView;
        }
        insertInfoInBidPopup(data1)
        openBidPopup()
    })

    $('.more_info').click(function (e) {
        // showMoreInfoOrder( $(this).parents('.order-row-container').attr('data-info'))
        let index = +($(this).parents(".order-row-container").attr("data-info"));
        let isBidDisabled= (+($(this).parents(".order-row-container").attr("data-bid")) == maxBids)
        console.log(isBidDisabled);
        let orderData = ordersArray[index];
        curentOrderView = orderData;
        showMoreInfoOrder(orderData,isBidDisabled)
    })
}
var objJson = [
    { adName: "AdName 1"},
    { adName: "AdName 2"},
    { adName: "AdName 3"},
    { adName: "AdName 4"},
    { adName: "AdName 5"},
    { adName: "AdName 6"},
    { adName: "AdName 7"},
    { adName: "AdName 8"},
    { adName: "AdName 9"},
    { adName: "AdName 10"}
]; // Can be obtained from another source, such as your objJson variable
window.onload = function (){
    initPerPage()
}
function initPerPage(){
   let x = +localStorage.getItem('perpage') || 10;
    document.querySelector('.choose-per-page .dropdown-title span span').innerHTML = x;

}
$('.choose-per-page .dropdown-list a').click(function (e){
    e.preventDefault()
    let x = $(this).html()
    $(this).parents('.dropdown-block').removeClass("open")
    document.querySelector('.choose-per-page .dropdown-title span span').innerHTML = x;
    changePerPage()
})
function changePerPage(){

    let perPage = +document.querySelector('.choose-per-page .dropdown-title span span').innerHTML || 10;
    localStorage.setItem("perpage", perPage)
}
function getStartEndPagination(arrayObj){
    let url = new URL(window.location);
    let c = url.searchParams.get("page");
    let records_per_page = +localStorage.getItem('perpage') || 10;
    let page = c || 1;
   let filteredArray = getPagesPoints(+page,arrayObj, records_per_page);
    console.log(filteredArray);
    return filteredArray;
}

var current_page = 1;
var records_per_page = 3;

$("#nav_btn_prev").click(function (e){
    e.preventDefault()
    prevPage()
})
$("#nav_btn_next").click(function (e){
    e.preventDefault()

    nextPage()
})
function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page, objJson);
    }
}
function getPagesPoints(page, arrayObj,per_page){
    let indexStart =  (page-1) * per_page;
    let end = indexStart;

    for (var i = (page-1) * per_page; i < (page * per_page) && i < arrayObj.length; i++) {
        end++;
    }
    return [indexStart, end]
}
function changePage(page, arrayObj)
{
    let filteredArray = [];
    var btn_next = document.getElementById("nav_btn_next");
    var btn_prev = document.getElementById("nav_btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page_num");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    let indexStart =  (page-1) * records_per_page;
    let indexEnd = (page * records_per_page < arrayObj.length) ? (page * records_per_page) : arrayObj.length;
    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < arrayObj.length; i++) {
        filteredArray.push(arrayObj[i]);
    }
    page_span.innerHTML = page;

    if (page == 1) {
        btn_prev.classList.add("hide");
    } else {
        btn_prev.classList.remove ("hide");
    }

    if (page == numPages(arrayObj)) {
        btn_next.classList.add("hide");
    } else {
        btn_next.classList.remove("hide");
    }
    return [indexStart, indexEnd];
}

function numPages()
{
    return Math.ceil(objJson.length / records_per_page);
}

