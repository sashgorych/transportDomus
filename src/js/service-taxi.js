let listOfItemsMaxLength = document.querySelector("#worn_item:checked") ? 5 : 1000;
let addressTo = [];
var chosenItemsToMove = [];
var chosenItemsToMoveCount = 0;
let maxDestinationAddress = 15;
var destinationActual = ""
var departueActual = ""
var wornItems = true;
initDatePicker()
initRangePicker()
insertItemsToMove()
initChoseExpertFeature()
document.querySelector('#dateType').addEventListener('change', function (e) {
    let val = document.querySelector('#dateType').value;
    if (val == "range") {
        showRangeDatePicker()
    } else {
        showOneDatePicker()
    }
})
$('.edit').click(function (e) {
    e.preventDefault()
    goStep1Delivery()
})
$('.edit-btn button').click(function (e) {
    e.preventDefault()
    goStep1Delivery()
})
$('.items-to-move').click(function (e) {
    if ($(e.target).parents('.input-group-append').length) {
        clickPlus($(e.target).parents('.input-group'))
        updateItemsMovedList()
    }
    if ($(e.target).parents('.input-group-prepend').length) {
        clickMinus($(e.target).parents('.input-group'))
        updateItemsMovedList()
    }
})
$('.plus-minus-inp').change(function (e) {
    let chosenItemsToMoveCountLocal = 0;
    let tarVal = +($(e.target).val());
    $('.items-list:not(.non-edit) .plus-minus-inp').each((i, el) => {
        chosenItemsToMoveCountLocal += +($(el).val());
    })
    if (chosenItemsToMoveCountLocal > listOfItemsMaxLength) {
        if ((listOfItemsMaxLength - chosenItemsToMoveCountLocal + tarVal) > 0) {
            $(e.target).val(listOfItemsMaxLength - chosenItemsToMoveCountLocal + tarVal)

        } else {
            $(e.target).val(0)
        }
        disablePlusBtn()
    } else {
        enablePlusBtn()
    }
    ;
    chosenItemsToMoveCount = 0;
    $('.items-list:not(.non-edit) .plus-minus-inp').each((i, el) => {
        chosenItemsToMoveCount += +($(el).val());
    })
})

function updateItemsMovedList() {
    chosenItemsToMove = [];
    chosenItemsToMoveCount = 0;
    $('.items-list:not(.non-edit) .plus-minus-inp').each((i, el) => {
        chosenItemsToMoveCount += +($(el).val());
        let obj;
        if ($(el).val() > 0) {
            obj = {
                "item_id": $(el).attr("data-id"),
                "item_category": $(el).attr("data-category"),
                "count": $(el).val()
            }
            chosenItemsToMove.push(obj)
        }
    })
    if (chosenItemsToMoveCount >= listOfItemsMaxLength) {
        disablePlusBtn()
    }
    $('#chosenItemsToMove').val(JSON.stringify(chosenItemsToMove))
}

function disablePlusBtn() {
    $('.input-group-append button').attr('disabled', "disabled")
}

function enablePlusBtn() {
    $('.input-group-append button').removeAttr('disabled')
}

function clickPlus(parent) {
    let inp = $(parent).find('.plus-minus-inp');
    let val = +$(inp).val();
    val++;
    $(inp).val(val)
}

function clickMinus(parent) {
    if (chosenItemsToMoveCount == 5) {
        enablePlusBtn()
    }
    let inp = $(parent).find('.plus-minus-inp');
    let val = +$(inp).val();
    if (val > 0) val--;
    $(inp).val(val)
}

function getServiceType() {
    return document.querySelector("#serviceType").value;
}

$('.add_more_destination').click(function (e) {
    e.preventDefault();
    addAnotherAddressTo()
})
$('#needStorage').change(function (e) {
    if (e.target.checked) {
        disableAddressToInputs(true)
        addressTo = [];
        clearInput('#destinationAddr')
        clearInput('#postalTo')
        showAddressToInHtml(createAddrTemplate())

    } else {
        undisableAddressToInputs()
    }
})
$('.address-to-list').click(function (e) {
    if ($(e.target).parents(".clear-address").length) {
        let ind = +($(e.target).parents(".clear-address").attr('data-addr'))
        addressTo.splice(ind, 1);
        showAddressToInHtml(createAddrTemplate())


    }
})
$('#deliveryStep2').click(function (e) {
    e.preventDefault()
    if (wornItems) {
        checkDeliveryOrderWornItemsStep1()
    } else {
        checkDeliveryOrderOtherCaseStep1()
    }
    // let obj;
    // var data = $('#delivery-order-form').serializeArray().reduce(function (obj, item) {
    //     if (item.name.includes("[data]")) {
    //         obj[item.name] = item.value;
    //     }
    //     return obj;
    // }, {});
    //
    // console.log(data);

})
function changeDataToServerStandart(dt){
    if(dt.length == 0){return "ignore"}
    let x = dt.split('-')
    console.log(x[0].length)
    if(x[0].length > 3){return dt}
    let yy = x[2]
    let mm = x[1]
    let dd = x[0]
    return `${yy}-${mm}-${dd}`
}
var dataForm;
$('#goDeliveryPreview').click(function (e) {
    e.preventDefault()
    if (isCheckedVehicle()) {
        let obj;
        dataForm = $('#delivery-order-form').serializeArray().reduce(function (obj, item) {
            if (item.name.includes("[data]")) {
                if (item.value == "on") {
                    item.value = "true"
                }
                if (item.value == "off") {
                    item.value = "false"
                }
                // if date
                if($(`input[name='${item.name}']`).hasClass('datepicker-input')){
                    obj[item.name] = changeDataToServerStandart(item.value);
                }else{
                    obj[item.name] = item.value;
                }
                formData.set(item.name, obj[item.name])

            }
            return obj;
        }, {});

        preparePreview(dataForm)
        showPreviewBlock()
    } else {
        makeErrorVehicle()
    }
})

function showPreviewBlock() {
    $('.delivery-order-step1').addClass('hide')
    $('.delivery-order-step2').addClass('hide')
    $('.preview-services').removeClass('hide')
}

function hidePreviewBlock() {
    $('.preview-services').addClass('hide')
}

$('#goDeliveryStep1').click(function (e) {
    e.preventDefault()
    goStep1Delivery()
})
$('.specify-delivery input').change(function (e) {
    $('.specify-delivery').removeClass("error")
    switch (e.target.value) {
        case "worn_items":
            showListOfItemsBlock()
            listOfItemsMaxLength = 5;
            wornItems = true;
            break;
        case "from_store":
            hideListOfItemsBlock()
            chosenItemsToMove = []
            wornItems = false;
            break
        case "entrepreneur":
            hideListOfItemsBlock()
            chosenItemsToMove = []

            wornItems = false;
            break
        case "other":
            hideListOfItemsBlock()
            chosenItemsToMove = []

            wornItems = false;

            break

    }
})
if (document.querySelector('input[name="data[obj][vehicleType]"]')) {
    document.querySelectorAll('input[name="data[obj][vehicleType]"]').forEach(el => {
        el.addEventListener('change', function () {
            clearErrorVehicle()
        })
    })
}
var formData = new FormData()
ImgUpload()
var storedFiles = [];
var imgWrap = "";
var imgArray = [];

function ImgUpload() {


    $('.upload__inputfile').each(function () {
        $(this).on('change', function (e) {
            formData.delete("userpic[1]")
            formData.delete("userpic[2]")
            formData.delete("userpic[3]")
            formData.delete("userpic[4]")
            formData.delete("userpic[0]")

            imgWrap = $(this).parents('.images-uploader-block').find('.photo-preview');
            imgWrap.empty();
            imgArray = []
            var maxLength = $(this).attr('data-max_length');

            var files = e.target.files;
            var filesArr = Array.prototype.slice.call(files);
            var iterator = 0;
            if (filesArr.length > maxLength) {
                showDefaultPopup("Notification", "max" + maxLength + " files")
                return
            }
            filesArr.forEach(function (f, index) {
                if (!f.type.match('image.*')) {
                    return;
                }
                if (imgArray.length > maxLength) {
                    return false
                } else {
                    var len = 0;
                    for (var i = 0; i < imgArray.length; i++) {
                        if (imgArray[i] !== undefined) {
                            len++;
                        }
                    }
                    if (len > maxLength) {
                        return false;
                    } else {
                        imgArray.push(f);

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var html = "<div class='upload__img-box'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                            imgWrap.append(html);
                            iterator++;
                        }
                        reader.readAsDataURL(f);
                    }
                }
                formData.set("userpic[" + index + "]", f, f.name)

            });

        });
    });

    $('body').on('click', ".upload__img-close", function (e) {
        var file = $(this).parent().data("file");
        for (var i = 0; i < imgArray.length; i++) {
            if (imgArray[i].name === file) {
                imgArray.splice(i, 1);
                formData.delete("userpic[" + i + "]")
                break;
            }
        }
        $(this).parent().parent().remove();
    });
}

function makeErrorVehicle() {
    document.querySelector(('#vehicle-row')).classList.add('error')
}

function isCheckedVehicle() {
    return !!document.querySelector('input[name="obj[data][vehicleType]"]:checked')
}

function getVehicleType() {
    return document.querySelector('input[name="obj[data][vehicleType]"]:checked').value
}

function hideTruckChoseBlock() {
    $('.truck-chose').addClass('hide')

}

function clearErrorVehicle() {
    document.querySelector(('#vehicle-row')).classList.remove('error')
}

function clearInput(input) {
    $(input).val("")
    $(input).parents('.form-row').removeClass('active')
}
var trF = false;
function fixTrucktitle(){
    if(trF){return}
    trF = true;
    //services truck
    window.onscroll = function() {
        let section = document.querySelector(".truck-chose.mb-40")
        if (!section) {
            return
        }
        let x;
        if(screen.width > 480){
            x = -1000
        }else{
            x = -720;
        }
        if (section.getBoundingClientRect().top < 25 && section.getBoundingClientRect().top > x) {
            document.querySelector('.truck-chose').classList.add("fixed");
        } else {
            document.querySelector('.truck-chose').classList.remove("fixed");
        }
    }
//services truck end
}
//chose expert start

function initExpertSelectBox(){
    let str = ``;
    previpuexpertlist.forEach(expert=>{
        if(expert['id'] != "0"){
            str+=`<option value="${expert['id']}">#${expert['id']} - ${expert["name"]}</option>`
        }else {
            str+=`<option selected disabled>${expert["name"]}</option>`

        }

    })
    document.querySelector('#select-prev-expert').insertAdjacentHTML('beforeend', str)
    $('#select-prev-expert').select2({
        width:"100%"
    })
}
function initChoseExpertFeature(){
    if(!previpuexpertlist.length){
        $('.optional_expert').addClass('hide')
    }else{
        initExpertSelectBox()
    }
}
$('#select-prev-expert').on('select2:select', function (e) {
    setPrefferedExpertId()
    clearErrorInput("#select-prev-expert")
});
function makeErrorInput(input) {
    $(input).attr('aria-invalid', 'true');
    $(input).parents('.form-row').addClass('error')
}
function clearErrorInput(input) {
    $(input).removeAttr('aria-invalid');
    $(input).parents('.form-row').removeClass('error')
}
function checkDirectExpertValidation(){
    if ($('#is_direct_expert').is(":checked")) {
        if(!($("#select-prev-expert").val())){
            makeErrorInput("#select-prev-expert")
            scrollToErrorInput()
            return false;
        }
    }
    return true;
}
function setPrefferedExpertId(){
    console.log('set exp')
    let preferedExpId = $("#select-prev-expert").val();
    console.log(preferedExpId)
    formData.set('prefferedexpert',preferedExpId)
    formData.set('obj[data][prefferedexpert]',preferedExpId)
}
function deletePrefferedExpert(){
    formData.delete('prefferedexpert');
    formData.delete('obj[data][prefferedexpert]');
}
$('#is_direct_expert').change(function (e){
    if ($('#is_direct_expert').is(":checked"))
    {
        $('.direct-expert').removeClass('hide')

    }else{
        clearErrorInput("#select-prev-expert")
        $('.direct-expert').addClass('hide')
        deletePrefferedExpert()
    }
})
//chose expert end
function goStep2Delivery() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    fixTrucktitle()
    $('.delivery-order-step1').addClass('hide')
    $('.delivery-order-step2').removeClass('hide')
    hidePreviewBlock()
    $('html,body').animate({
        scrollTop: 0
    }, 0);
}

function goStep1Delivery() {

    $('.delivery-order-step1').removeClass('hide')
    $('.delivery-order-step2').addClass('hide')
    hidePreviewBlock()
    checkAddressToLength()
    $('html,body').animate({
        scrollTop: 0
    }, 0);

}

function checkAddressToLength() {
    updateAddressHtmlCounter()
    if (addressTo.length == maxDestinationAddress) {
        disableAddressToInputs()
    } else {
        undisableAddressToInputs()

    }
}

function hideListOfItemsBlock() {
    $('.items-to-move').addClass('hide')
}

function showListOfItemsBlock() {
    $('.items-to-move').removeClass('hide')
}

function initRangePicker() {
    const elem = document.getElementById('date-range');
    const rangepicker = new DateRangePicker(elem, {
        autohide: true,
        minDate: new Date(),
        weekStart:1,
        // format: 'yyyy-mm-dd',
        format: 'dd-mm-yyyy',
    });

    const startElem = document.getElementById('date-start');
    const endElem = document.getElementById('date-end');

    startElem.addEventListener('changeDate', function (e) {
        endElem.parentNode.classList.add('active')
    });

    endElem.addEventListener('changeDate', function (e) {
        startElem.parentNode.classList.add('active')

    });
}

function showRangeDatePicker() {
    document.querySelector('#date-one').classList.add('hide');
    document.querySelector('#date-range').classList.remove('hide');
}

function showOneDatePicker() {
    document.querySelector('#date-one').classList.remove('hide');
    document.querySelector('#date-range').classList.add('hide');
}

function initDatePicker() {
    if (document.querySelector("#dateType").value == "date") {
        const elem = document.querySelector('#dateS');
        const datepicker = new Datepicker(elem, {
            minDate: new Date(),
            autohide: true,
            weekStart:1,
            format: 'dd-mm-yyyy',
            // format: 'yyyy-mm-dd'
        });
        elem.addEventListener('changeDate', (e) => {
            $('.dateS-form-row').addClass('active')
        })
    }
}

function disableAddressToInputs(isHide = false) {
    $('.card-moving-to .error').removeClass('error')
    document.querySelector('#destinationAddr').setAttribute('disabled', 'disabled');
    document.querySelector('#postalTo').setAttribute('disabled', "disabled");
    document.querySelector('#isElevatorTo').setAttribute('disabled', 'disabled');
    if (isHide) {
        document.querySelector('.add_more_destination').classList.add('hide');
        document.querySelector('#addrCount-a').classList.add('hide');
    }
    document.querySelector('.add_more_destination').setAttribute('disabled', 'disabled');
}

function undisableAddressToInputs() {
    document.querySelector('#destinationAddr').removeAttribute('disabled');
    document.querySelector('#postalTo').removeAttribute('disabled');
    document.querySelector('#isElevatorTo').removeAttribute('disabled');
    document.querySelector('.add_more_destination').classList.remove('hide');
    document.querySelector('.add_more_destination button').removeAttribute('disabled');

}

function getDestinationAddress() {
    let a = document.querySelector('#destinationAddr');
    let b = document.querySelector('#postalTo');
    let c = document.querySelector('#isElevatorTo');
    let d = document.getElementById('destination_latlng');
    let addrObj = {
        "latlng": d.value,
        "address": a.value,
        "postal": b.value,
        "is_elevator": c.value,
    }
    addressTo.push(addrObj)
}

function checkAddressToInputValid(noaction = false) {
    let is = true;
    $('.card-moving-to .requiredFill-js').each((i, el) => {
        if ((el).value == 0) {
            if (!noaction) {
                $(el).parents(".form-row").addClass('error')
            }
            is = false;
        }
    })
    return is;

}

function createAddrTemplate() {
    let str = ``;
    addressTo.forEach((el, i) => {
        str += `
        <div class="item-addr">
          <p><strong>Address ${i + 1}: </strong>${el["address"]}, ${el["postal"]} ${el["is_elevator"] == 'true' ? ",elevator" : ""}</p>
                                        <div class="clear-address" data-addr="${i}"><button type="button"><img src="/images/close.svg" alt="delete"></button></div>
                                    </div>
        `
    })
    return str;

}

function changeAddresToEvent() {
    $('#addressToinput').val(JSON.stringify(addressTo));
}

function showAddressToInHtml(str) {
    changeAddresToEvent()
    $('.address-to-list').removeClass('hide')
    $('.address-to-list').html(str)

    updateAddressHtmlCounter()
}

function disableAddDestinationBtn() {
    $('.add_more_destination button').attr('disabled', 'disabled')
}

function updateAddressHtmlCounter() {
    if (addressTo.length == 0) {
        $('#addrCount-a').addClass('hide')
    }
    if (addressTo.length < maxDestinationAddress && !($('#needStorage').is(':checked'))) {
        $("#addrCount-a").removeClass("hide")

    } else {
        $('.add_more_destination button').attr('disabled', "disabled")
        $("#addrCount-a").addClass("hide")
    }
    $("#addrCount-b").html(addressTo.length + 1)
    let x = (addressTo.length + 1 <= maxDestinationAddress) ? addressTo.length + 1 : maxDestinationAddress;
    x = " " + x;
    $("#destin_length span").html(x)
}

$("#destinationAddr").change(function (e) {
    if (destinationActual == $(this).val()) {
        return
    }
    console.log("xxxxxxx");
    let d = document.querySelector('#destination_latlng');
    let d1 = document.querySelector('#postalTo');
    let d2 = document.querySelector('#destination_latlng');
    d.value = ""
    d1.value = ""
    d2.value = ""
})
$("#departureAddr").change(function (e) {
    if (departueActual == $(this).val()) {
        return
    }

    console.log("xxxxxxx");
    let d = document.querySelector('#departure_latlng');
    let d1 = document.querySelector('#postalFrom');
    let d2 = document.querySelector('#departure_latlng');
    d.value = ""
    d1.value = ""
    d2.value = ""
})

function addAnotherAddressTo(withEvent = false) {
    if (!checkAddressToInputValid(withEvent)) return;
    let a = document.querySelector('#destinationAddr');
    let b = document.querySelector('#postalTo');
    let c = document.querySelector('#isElevatorTo');
    let d = document.querySelector('#destination_latlng');
    let addrObj = {
        "latlng": d.value,
        "address": a.value,
        "postal": b.value,
        "is_elevator": c.value,
    }
    if (d.value.length == 0) {
        showTempPopup({
            titleContent: `<p class="title">Notification</p>`,
            bodyContent: `<p>${googlemapAddressError}</p>`,
            popupSize: 'medium',
            displayTime: 2000,
            callbackAfterClose: function (e) {
                scrollToErrorInput("#destinationAddr")
            }
        })
        makeErrorInput("#destinationAddr")

        return;
    }
    if (addressTo.length < maxDestinationAddress) {
        addressTo.push(addrObj)
        clearDestinationInputs()
        showAddressToInHtml(createAddrTemplate())
    } else {
        disableAddDestinationBtn()
    }
    if (addressTo.length == maxDestinationAddress - 1) {
        disableAddDestinationBtn()
    }
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
    $(input).parents('.form-row').addClass('error')
}

function checkAdditionalInfoInput() {
    checkInputLength(".additional-info textarea")
}

function checkContactInfo() {
    checkInputLength("#firstName")
    checkInputLength("#phone")
    checkInputLength("#email")
}

function scrollToErrorInput() {
    $('html,body').animate({
        scrollTop: $($('.error')[0]).offset().top - 280
    }, 1000);
}

function clearDestinationInputs() {
    document.querySelector('#destinationAddr').value = "";
    document.querySelector('#postalTo').value = "";
    document.querySelector('#isElevatorTo').value = "false";
    document.querySelector('#destination_latlng').value = "";

    $('.card-moving-to .active').removeClass('active')
    document.querySelector('#isElevatorTo').parentNode.classList.add('active')
}

function checkAddressTo() {
    if (addressTo.length > 0) {
        addAnotherAddressTo(true)
        return true;
    } else {
        if ($('#needStorage').is(':checked')) {
            return true;
        } else {
            addAnotherAddressTo()
        }
    }
}

function checkAddressFrom() {
    checkInputLength("#departureAddr")
    checkInputLength("#postalFrom")
    checkInputLength("#isElevatorFrom")
    if (!checkInputLength("#departure_latlng")) {
        showTempPopup({
            titleContent: `<p class="title">Notification</p>`,
            bodyContent: `<p>${googlemapAddressError}</p>`,
            popupSize: 'medium',
            displayTime: 2000,
            callbackAfterClose: function (e) {
                scrollToErrorInput("#destinationAddr")
            }
        })
        makeErrorInput("#departureAddr")
    }
}

function checkDates() {
    let val = document.querySelector('#dateType').value;
    if (val == "range") {
        checkInputLength("#date-start")
        checkInputLength("#date-end")

    } else {
        checkInputLength("#dateS")

    }
    checkInputLength("#timeType")
}

function checkIsValidDeliveryForm() {
    checkAddressFrom()
    checkDates()
    checkAddressTo();
    checkContactInfo()
    if ($('.form-row.error').length) {
        scrollToErrorInput()
    }

}

function isFormValid() {
    checkIsValidDeliveryForm()
    if ($('.form-row.error').length) {
        return false;
    }
    return true;
}
function chekWhatDeliver() {
    let ischecked =  $("input[name='obj[data][delivery_type]']:checked").length;
    if(!ischecked){
        $('.specify-delivery').addClass('error')
    }else{
        $('.specify-delivery').removeClass('error')

    }

}
function checkDeliveryOrderWornItemsStep1() {
    checkDates()
    checkAddressFrom()
    checkAddressTo();
    checkContactInfo()
    chekWhatDeliver()
    if(!checkDirectExpertValidation()){return}
    if ($('#delivery-order-form .delivery-order-step1 .error').length) {
        scrollToErrorInput()
    } else {
        goStep2Delivery()
    }
}

function checkDeliveryOrderOtherCaseStep1() {
    checkDates()
    checkAddressFrom()
    checkAddressTo();
    checkContactInfo()
    checkInputLength(('#additionalInfoInp'));
    if ($('#delivery-order-form .form-row.error').length) {
        scrollToErrorInput()
    } else {
        goStep2Delivery()
    }
}

function getDeliveryData() {

}


function insertItemsToMove() {

    let a = ``;
    let hightlightClass = ``;
    let hightlightContent = ``;

    itemList["items_category"].forEach(el => {
        if(el["highlight"]){
            hightlightClass = 'highlight';
            hightlightContent = `<span class="label-highlight">${el["highlight"]}</span>`
        }else{
            hightlightClass = ""
            hightlightContent = ""
        }
        a += `
        <div class="items-category-wrapper ${hightlightClass}">
        ${hightlightContent}
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
                                                <input type="number" data-id="${el2["uniq_id"]}" data-category="${el["category_name"]}" min="0" value="0" class="plus-minus-inp">
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
    document.querySelector('.items-to-move .items-list-cont-out-2').innerHTML = a;
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

function insertItemsToMovePreview(arrayObj = []) {
    if (arrayObj.length == 0) {
        hidelistItemsTitle()
    }
    let hightlightClass = ``;
    let hightlightContent = ``;
    let a = ``;
    arrayObj.forEach(el => {
        if(el["highlight"]){
            hightlightClass = 'highlight';
            hightlightContent = `<span class="label-highlight">${el["highlight"]}</span>`
        }else{
            hightlightClass = ""
            hightlightContent = ""
        }
        a += `
        <div class="items-category-wrapper ${hightlightClass}">
        ${hightlightContent}
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

function insertUploadImgPreview() {
    $("#photos-preview").empty()
    $('.images-uploader-block .photo-preview').clone().appendTo("#photos-preview");
}

function setVehicleData(data) {
    data["obj[data][vehicleType]"] = getVehicleType();
}
function setHelperData(data) {
    data["obj[data][needHelper]"] = getHelperData();
}
function getHelperData(){
    let x = "";
    if( $('input[name="obj[data][needHelper]"]:checked').length) {
        x = $('input[name="obj[data][needHelper]"]:checked').val()
    }
    console.log(x)
    return x;
}
function setImgData(data) {
    data["obj[data][upload_images]"] = imgArray;


}


function preparePreview(data) {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    setVehicleData(data)
    setHelperData(data)
    setImgData(data)
    templatePreviewMovingTo(JSON.parse(data["obj[data][address_to]"]))
    templatePreviewMovingFrom(data)
    insertItemsToMovePreview(getItemsToMoved(data))
    insertCustomerNotePreview(data)
    insertPersonalInfoPreview(data)
    insertContactInfoPreview(data)
    insertTruckInfo(data)
    insertDateInfo(data)
    insertUploadImgPreview()
    let departureLatLng = document.getElementById("departure_latlng").value;
    if (!data["obj[data][is_need_storage]"]) {
        calcRoute(JSON.parse(departureLatLng), JSON.parse(data["obj[data][address_to]"]))

    }
}

$('#sendForm').click(function (e) {
    e.stopPropagation()
    e.preventDefault()
    setDistanceTime()
    //!!!!
    if (typeof SaveRequest === "function") SaveRequest(formData, '#delivery-order-form', 'delivery');
})
function setDistanceTime() {
    let disInp = document.querySelector('#distance_inp')
    let timeInp = document.querySelector('#drive_time_inp')
    if (disInp) {
        formData.set("obj[data][distance]", disInp.value)
    }
    if (timeInp) {
        formData.set("obj[data][drive_time]", timeInp.value)
    }
}

$(window).keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
    }
});
$('#print').click(function (e) {
    e.preventDefault()
    window.print();
})

function hidelistItemsTitle() {
    document.getElementById("listItemsTitle").classList.add('hide')
}

function dateViewer(dt) {
    if(!dt){return "";}

    let x = dt.split('-')
    let yy = x[0]
    let mm = x[1]
    let dd = x[2]
    return `${dd}-${mm}-${yy}`
}

function insertDateInfo(data) {
    if (data["obj[data][date_type]"] == "range") {
        document.getElementById('datePreview').innerHTML = dateViewer(data["obj[data][date_from]"]) + " - " + dateViewer(data["obj[data][date_to]"])
    } else {
        document.getElementById('datePreview').innerHTML =  dateViewer(data["obj[data][date]"])
    }
    document.getElementById('timePreview').innerHTML = data["obj[data][time]"]
}
function insertTruckInfo(data) {
    document.getElementById('truckTypePreview').innerHTML = vehicleDictionary[data["obj[data][vehicleType]"]];
    if (!!data["obj[data][needHelper]"]) {
        if (data["obj[data][needHelper]"] == "1"){
            document.getElementById('needHelperPreview').classList.remove('hide')
            $('#helper-count-preview').html('1')
        }
        if (data["obj[data][needHelper]"] == "2"){
            document.getElementById('needHelperPreview').classList.remove('hide')
            $('#helper-count-preview').html('2')
        }
    }else{
        document.getElementById('needHelperPreview').classList.add('hide')

    }
}

function insertPersonalInfoPreview(data) {
    document.getElementById('fullnamePreview').innerHTML = data["obj[data][name]"]
    document.getElementById('phoneNumberPreview').innerHTML = data["obj[data][phone]"]
    document.getElementById('emailPreview').innerHTML = data["obj[data][email]"]
}

function insertContactInfoPreview(data) {
    document.getElementById('contactInfoPhonePreview').innerHTML = data["obj[data][phone]"]
    document.getElementById('contactInfoEmailPreview').innerHTML = " " + data["obj[data][email]"]
}

function insertCustomerNotePreview(data) {
    let info = data["obj[data][additionalInfo]"];
    if (info) {
        document.getElementById('customer-note-preview').innerHTML = info;
    } else {
        $('#additionalDetailsBlock').hide();
    }
}

function templatePreviewMovingFrom(data = []) {
    let str = ``;
    if (data["obj[data][isNeedBoxing]"] == "true") {
        str = `<p><strong>${boxingServiceText}</strong>`
    }
    str += `
          <p><strong>${addressText}: </strong>${data["obj[data][address_from]"]}</p>
          <p><strong>${postalCodeText}: </strong>${data["obj[data][postal_from]"]}</p>
          <p><strong>${elevatorText}: </strong>${data["obj[data][elevator_from]"] == "false" ? 'no' : "yes"}</p>
    `;
    document.getElementById("moving_from_preview").innerHTML = str;


}

function templatePreviewMovingTo(data = []) {
    let str = ``;
    for (let i = 0; i < data.length; i++) {
        str += `
              <div class="addr-text-item addr-text-item-to">
                                    <p class="h5">${destinationPointText} ${i + 1} / ${data.length}</p>

                                    <div class="addr-text-item-info">
                                        <p><strong>${addressText}: </strong>${data[i]["address"]}</p>
                                        <p><strong>${postalCodeText}: </strong>${data[i]["postal"]}</p>
                                        <p><strong>${elevatorText}: </strong>${data[i]["is_elevator"] == "false" ? 'no' : "yes"}</p>
                                    </div>
                                </div>`


    }
    if (data.length == 0) {
        str += `
              <div class="addr-text-item addr-text-item-to">
              <div class="addr-text-item-info">
                                    <p class="h5">${moverText}</p>
                                </div></div>`

    }

    document.getElementById("moving_to_preview").innerHTML = str;

}

if (document.querySelector('.preview-page')) {
    preparePreview(orderDataPreview)
}
//replace phone from textarea
$('#additionalInfoInp').on('input', function () {
    var input = $(this);

    // Cancel any outstanding call (no-op if it's already happened)
    var handle = input.data("handle");
    if (handle) {
        clearTimeout(handle);
    }

    // Schedule the new one
    handle = setTimeout(function () {
        var value1 = input.val();
        const regex = new RegExp('((\\+?\\d{1,3}[\\d{2,}\\.\\- \\(\\)]{11,}))|(\\+?[\\d]{10,})', 'g')
        let x = value1.replace(regex, "")
        input.val(x)

        input.data("handle", 0);
    }, 2000);

    // Remember that handle on the element
    input.data("handle", handle);
});

//chose vehicle
$('input[name="obj[data][vehicleType]"]').change(function (e) {
    $('#vehicle-row').removeClass("error")
    $('#vehicle-row').find('input[name="obj[data][needHelper]"]').prop("checked", false);
    $(e.target).parents('.veh-row').find('input[name="obj[data][needHelper]"]').prop("checked", false);
})

$('.helper-col input[name="obj[data][needHelper]"]').change(function (e) {
    $('#vehicle-row').removeClass("error")
    let xClass = $(e.target).attr('id');
    $('.helper-col input[name="obj[data][needHelper]"]').each((indx,el)=>{
        if($(el).attr('id') == xClass){return}
        $(el).prop('checked', false)
    })
    $('input[name="obj[data][vehicleType]"]').prop('checked', false)
    // $('.helper-col input[name="obj[data][needHelper]"]').prop('checked', false)
    $(e.target).parents('.veh-row').find('input[name="obj[data][vehicleType]"]').prop('checked', true)
    if ($(e.target).val() == "1") {
        $('.helper-col input[name="obj[data][needHelper]"]').each((i, el) => {
            if ($(el).val() == '2') {
                $(el).prop('checked', false)
            }
        })
    }
    if ($(e.target).val() == "2") {
        $('.helper-col input[name="obj[data][needHelper]"]').each((i, el) => {
            if ($(el).val() == '1') {
                $(el).prop('checked', false)
            }
        })
    }
})
