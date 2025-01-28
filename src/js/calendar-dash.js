var serviceTypeFinalizePopup = ""
var priceTypeFinalizePopup = ""
const daysContainer = document.querySelector(".calendar .days"),
    nextBtn = document.querySelector(".calendar .next-btn"),
    prevBtn = document.querySelector(".calendar .prev-btn"),
    month = document.querySelector(".calendar .month"),
    todayBtn = document.querySelector(".calendar .today-btn");
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// get current date
const date = new Date();
// get current month
let currentMonth = date.getMonth();
// get current year
let currentYear = date.getFullYear();
// function to render days
function renderCalendar() {
    // get prev month current month and next month days
    date.setDate(1);
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;
    let prevMounth = prevLastDay.getMonth()
    let nextMounth = new Date(currentYear, currentMonth + 1,1).getMonth()
    console.log(prevMounth)
    console.log(nextMounth)
    console.log(currentYear)
    // update current year and month in header
    if (month) {
        month.innerHTML = `${months[currentMonth]} ${currentYear}`;
    }
    // update days html
    let calendarDays = "";
    // prev days html
    for (let x = firstDay.getDay(); x > 0; x--) {
        calendarDays += `<div class="day prev" data-date=""><span class="day-num">${prevLastDayDate - x + 1}</span></div>`;
    }
    // current month days
    for (let i = 1; i <= lastDayDate; i++) {
        // check if it's today then add today class
        let dat = new Date(currentYear, currentMonth, i)
        let mm = dat.getMonth() + 1 < 10 ? "0"+ (dat.getMonth() + 1):  dat.getMonth() + 1;
        let yy = dat.getFullYear();
        let dd = dat.getDate() < 10 ? "0"+ dat.getDate() :  dat.getDate();
        let str = yy + "-"+mm+'-'+ dd;
        if (i === new Date().getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()) {
            // if date month year matches add today
            calendarDays += `<div class="day today" data-date="${str}" d="${dat}">
<span class="day-num">${i}</span>
<div class="d-order-item must-pay"><p>Order #33567</p></div>
<div class="d-order-item"><p>Order #33567</p></div>
<div class="d-order-item completed"><p>Order #33567</p></div>
<div class="d-order-item completed"><p>Order #33567</p></div>
<div class="d-order-item completed"><p>Order #33567</p></div>
<div class="d-order-item completed"><p>Order #33567</p></div>
</div>`;
        }
        else {
            // else don't add today
            calendarDays += `<div class="day " data-date="${str}"><span class="day-num">${i}</span></div>`;
        }
    }
    // next Month days
    for (let j = 1; j <= nextDays; j++) {
        calendarDays += `<div class="day next"><span class="day-num">${j}</span></div>`;
    }
    // run this function with every calendar render
    hideTodayBtn();
    if (daysContainer) {
        daysContainer.innerHTML = calendarDays;
    }
}
renderCalendar();
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        // increase current month by one
        currentMonth++;
        if (currentMonth > 11) {
            // if month gets greater than 11 make it 0 and increase year by one
            currentMonth = 0;
            currentYear++;
        }
        // re-render calendar
        renderCalendar();
    });
}
// prev month btn
if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        // decrease by one
        currentMonth--;
        // check if less than 0 then make it 11 and decrease year
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
}
// go to today
if (todayBtn) {
    todayBtn.addEventListener("click", () => {
        // set month and year to current
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        // re-render calendar
        renderCalendar();
    });
}
// let's hide today btn if it's already the current month and vice versa
function hideTodayBtn() {
    if (currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()) {
        if (todayBtn) {
            todayBtn.style.display = "none";
        }
    }
    else {
        if (todayBtn) {
            todayBtn.style.display = "flex";
        }
    }
}
$("#goMonthCalendar").click(function (e){
    e.preventDefault()
    showMonthCalendar()
})
$("#goWeekCalendar").click(function (e){
    e.preventDefault()
    showWeekCalendar()
})
function showMonthCalendar(){
    $("#goMonthCalendar").addClass('active')
    $("#goWeekCalendar").removeClass('active')
    $("#month-calendar").removeClass('hide')
    $("#week-calendar").addClass('hide')
}
function showWeekCalendar(){
    $("#goMonthCalendar").removeClass('active')

    $("#goWeekCalendar").addClass('active')
    $("#month-calendar").addClass('hide')
    $("#week-calendar").removeClass('hide')
}




//week calendar
var dayBlock = $('#week-calendar .days')
var prevWeekBtn = $('#week-calendar .prev-btn')
var nextWeekBtn = $('#week-calendar .next-btn')

var currentDate_w = new Date();
var currentDayOfWeek_w = currentDate_w.getDay();
var firstDayOfWeekDate_w = new Date();
firstDayOfWeekDate_w.setDate(firstDayOfWeekDate_w.getDate() - currentDayOfWeek_w + 1);
initCalendarWeek()
function initCalendarWeek(){
    updateCalendarView()
    initCurrentDayDisplay()
}

nextWeekBtn.click(function (e){
    e.preventDefault();
    goNextWeek()
})
prevWeekBtn.click(function (e){
    e.preventDefault();
    goPrevWeek()
})
function initCurrentDayDisplay(){
    let date = new Date();
    let day = date.getDay()
    let cl = ""
    let currentTimeHour = date.getHours() < 10 ? "0" +date.getHours(): date.getHours()
    let currentTimeMinutes = date.getMinutes()
    if(currentTimeMinutes < 30 && currentTimeMinutes > 15){
        cl = "per25"
    }
    if(currentTimeMinutes < 45 && currentTimeMinutes > 30){
        cl = "per50"
    }
    if(currentTimeMinutes > 45){
        cl = "per75"
    }
    $(`.weekdays li[data-weekday="${day}"]`).addClass('active')
    $(`.bt-calendar.weekly-layout .calendar-table ul.days li[data-weekday="${day}"]`).addClass('active')

    $(`.bt-calendar.weekly-layout .calendar-table .days > li > ul > li[data-time="${currentTimeHour}:00"]`).addClass('active').addClass(cl)

}
function goNextWeek(){
    firstDayOfWeekDate_w.setDate(firstDayOfWeekDate_w.getDate() + 7)
    console.log(firstDayOfWeekDate_w);
    updateCalendarView()
}
function goPrevWeek(){
    firstDayOfWeekDate_w.setDate(firstDayOfWeekDate_w.getDate() - 7)
    console.log(firstDayOfWeekDate_w);
    updateCalendarView()
}
function updateCalendarView(orders = []){
    insertDayOfWeeks()
    if(orders.length){
        renderOrdersWeekCalendar(orders)
    }else{
        renderOrdersWeekCalendar(ordersArray)

    }

}
function insertDayOfWeeks(){
    $(dayBlock).html(generateDayOfWeek())
}
function renderOrdersWeekCalendar(orderArray){
    orderArray.forEach(order=>{
     let dateOfWork = order["obj[data][date]"];
     let timeOfWork = order["obj[data][time]"].split("-")[0].split(' ').join('');
     if(!dateOfWork){
         let bids = JSON.parse(order["obj[data][bids]"]);
            bids.forEach(bid=>{
                if (bid["obj[data][status]"] == "accept"){
                    dateOfWork = bid["obj[data][expert_date]"]
                }
            })

         }
       let itemHtml =  getOrderCalendarItemTemplate(order)
        let calendarCell = $(`.bt-calendar ul.days li[data-date='${dateOfWork}'][data-time='${timeOfWork}'] .li-in`);
     if(calendarCell.length){
         calendarCell.append(itemHtml)
     }

    })
    // console.log($(".bt-calendar ul.days li[data-date='2024-06-03'][data-time='8:00']"));
}
function getOrderCalendarItemTemplate(order){
    let cl = order['obj[data][order_status]'];
    return `
     <div class="single-event ${cl}">
        <span class="event-title">${orderText} #${order["obj[data][order_id]"]}</span>
        <span>${statusText}: XXXX</span>
        <span class="event-time">${timeText}: ${order["obj[data][time]"]}</span>
        <span class="event-repetition"></span>
        <span class="event-recurrence"></span>
        <div class="btns-row">
                <button class="btn-more-info">${moreInfoText}</button>

        <a href="/finalize/orderid" class="btn-more-fin">${finalizeText}</a>
     </div>
     </div>
    `
}
function setInHtmlDatesByDay_week(dayOfWeek, data) {
    $('.weekdays li[data-weekday="'+ dayOfWeek+'"] .day-item').html(data)
}
function generateDayOfWeek() {
    let str= ``;
    let d = new Date(firstDayOfWeekDate_w.getFullYear(),firstDayOfWeekDate_w.getMonth(),firstDayOfWeekDate_w.getDate())
    for (let i = 0; i < 7; i++) {
        console.log(d)
        let yy = d.getFullYear();
        let mm = d.getMonth() + 1 < 10 ? "0"+ (d.getMonth() + 1):  d.getMonth() + 1;
        let dd = d.getDate() < 10 ? "0"+ d.getDate() :  d.getDate();
        setInHtmlDatesByDay_week(d.getDay(), `${yy}-${mm}-${dd}`)
        str += `
    <li data-weekday="${i + 1}" data-date="${yy}-${mm}-${dd}">
         <ul>
              <li data-time="08:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="09:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="10:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="11:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="12:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="13:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="14:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="15:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="16:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="17:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="18:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="19:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="20:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="21:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="22:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
              <li data-time="23:00" data-date="${yy}-${mm}-${dd}"><div class="li-in"></div></li>
          </ul>
    </li>`
        d.setDate(d.getDate() + 1)

    }
    return str;
}
function getCurrentDatesFromCalendarWeek(){

}
function renderOrdersInCalendarWeek(){

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
$("#go-finalize-order").click(function (e){
    e.preventDefault();
    let order = {};
    prepareFinalizePopup(order)
    openFinalizePopup()
})
function openFinalizePopup(){
    $('#finalize-order').addClass('active')
}
function getActiveBid(order){
   let arr = JSON.parse(order["obj[data][bids]"])
      let filtered =  arr.filter(el=>{
          return  el["obj[data][status]"] == "accept";
       })
    return filtered;
}
function setValue(input, val) {
    if (!document.querySelector(input)) return
    document.querySelector(input).value = val;
}
function hideBlock(block) {
    if (!document.querySelector(block)) return;

    document.querySelector(block).classList.add('hide')
}
function showBlock(block) {
    if (!document.querySelector(block)) return;
    document.querySelector(block).classList.remove('hide')
}
function showRowOfInput(inputId) {
    if (!document.getElementById(inputId).parentNode) return;
    document.getElementById(inputId).parentNode.classList.remove('hide')
}
function hideRowOfInput(inputId) {
    if (!document.getElementById(inputId).parentNode) return;
    document.getElementById(inputId).parentNode.classList.add('hide')
}
prepareFinalizePopup(ordersArray[0])
function prepareFinalizePopup(order){
    console.log(order)
    serviceTypeFinalizePopup = order["obj[data][service_type]"];
    priceTypeFinalizePopup = order["obj[data][payment_type]"];
    setHtmlById("finalize-text-order_id",order["obj[data][order_id]"])
    setHtmlById("finalize-service_type",order["obj[data][service_type]"])
    setValue('#customer_name', order["obj[data][name]"])
    setValue('#customer_id', order["obj[data][name]"])
    setValue('#order_id', order["obj[data][order_id]"])
    setValue('#service_type', order["obj[data][service_type]"])
    let bid = getActiveBid(order)[0]
    console.log(bid);
    if(bid["obj[data][payment_type]"] == "price"){
        showBlock(".fixed_payment-form-row")
        setValue("#fixed_cost", bid["obj[data][fixed_payment]"])
    }
    if(bid["obj[data][payment_type]"] == "hourly"){
        showBlock(".hour_cost-form-row")
        showBlock(".transportation_cost-form-row")
        setValue("#hourly_cost", bid["obj[data][hour_cost]"])
        setValue("#transportation_cost", bid["obj[data][transportation_cost]"])
    }

    if(order["obj[data][service_type]"] == "moving"){
            prepareFinalizePopupMoving(order)
        }
        if(order["obj[data][service_type]"] == "delivery"){
            prepareFinalizePopupDelivery(order)
        }
        if(
            order["obj[data][service_type]"] == "waste-truck" ||
            order["obj[data][service_type]"] == "waste-cleaning" ||
            order["obj[data][service_type]"] == "waste-container"
        ){
            prepareFinalizePopupClearing(order);
        }
}
function prepareFinalizePopupDelivery(order){
    $('.row-delivery').removeClass('hide')

}
function prepareFinalizePopupMoving(order){
    $('.row-moving').removeClass('hide')
}
function prepareFinalizePopupClearing(order){
    $('.row-cleaning').removeClass('hide')

}
function setHtmlById(blockId, data) {
    if (document.getElementById(blockId)) {
        document.getElementById(blockId).innerHTML = data;
    }
}

function resetFinalizePopup(){
    serviceTypeFinalizePopup = "";
    priceTypeFinalizePopup = ""
    $('.row-moving').addClass('hide')
    $('.row-delivery').addClass('hide')
    $('.row-cleaning').addClass('hide')
    $('.hour_cost-form-row').addClass('hide')
    $('.transportation_cost-form-row').addClass('hide')
    $('.fixed_payment-form-row').addClass('hide')
    setHtmlById("finalize-text-order_id","")
    setHtmlById("finalize-service_type","")
    setValue("#fixed_cost", "")
    setValue("#hourly_cost", "")
    setValue("#transportation_cost", "")
    setValue('#customer_name', "")
    setValue('#customer_id',"")
    setValue('#order_id',"")
    setValue('#service_type',"")
    setValue('#number_movers',"")
    setValue('#number_helpers',"")
    setValue('#number_workers',"")
    setValue('#duration_hours',"")
    setValue('#extra_charges',"")
    setValue('#extra_charges_text',"")

}
$("#preview_finalize").click(function (e){
    e.preventDefault()
    if(isFinalizeFormValid()) {
        let data = getFinalizeData()
        showFinalizePreview(data)
    }
})
function makeErrorInput(input) {
    $(input).attr('aria-invalid', 'true');
    $(input).parents('.form-row').addClass('error')
}

function clearErrorInput(input) {
    $(input).removeAttr('aria-invalid');
    $(input).parents('.form-row').removeClass('error')
}
function checkInputLength(input) {
    if ($(input).hasClass('custom-select')) {
        if ($(input).find(":selected").val() != "") {
            return true
        } else {
            makeErrorInput(input)

            return false;

        }
    } else {
        if ($(input).val().length == 0) {
            makeErrorInput(input)
            return false;
        }
    }
    return true;
}

function isFinalizeFormValid(){
    checkInputLength("#duration_hours")
    if(serviceTypeFinalizePopup == "moving"){
        checkInputLength("#number_movers")
    }
    if(serviceTypeFinalizePopup == "delivery"){
        checkInputLength("#number_helpers")

    }
    if(
        serviceTypeFinalizePopup == "waste-truck" ||
        serviceTypeFinalizePopup == "waste-cleaning" ||
        serviceTypeFinalizePopup == "waste-container"
    ){
        checkInputLength("#number_workers")

    }
    if($("#finalize-form").find(".error").length > 0){
        return false
    }
    return true;
}
function getFinalizeData(){
    return getData("finalize-form")

}
function showFinalizePreview(data){


    console.log(data);
}
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

