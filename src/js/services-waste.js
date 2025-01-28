let listOfItemsMaxLength = 150;
let addressTo = [];
var chosenItemsToMove = [];
var chosenItemsToMoveCount = 0;
var wornItems = true;
initDatePicker()
initRangePicker()
$('input[type=number]').change(function(e) {
    if ($(this).val().length > + $(this).attr("maxLength"))
        $(this).val($(this).val().slice(0, $(this).attr("maxLength")));
});

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
        disableAddressToInputs()
        addressTo = [];
        clearInput('#destinationAddr')
        clearInput('#postalTo')
        clearInput('#bedroomsTo')
        clearInput('#floorTo')
        clearInput('#accommodationTypeTo')
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
$('#goPreviewWaste').click(function (e) {
    e.preventDefault()
    checkWasteForm()
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
                obj[item.name] = item.value;
            }
            return obj;
        }, {});

        console.log(dataForm);

        preparePreview(dataForm)
        showPreviewBlock()
    } else {
        makeErrorVehicle()
    }
})

function showPreviewBlock() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    $('.waste-step1').addClass('hide')
    $('.preview-services').removeClass('hide')
}
$("#destinationAddr").change(function (e) {
    let d = document.querySelector('#destination_latlng');
    d.value = ""
})
function hidePreviewBlock() {
    $('.preview-services').addClass('hide')
    $('.waste-step1').removeClass('hide')
}

$('#goDeliveryStep1').click(function (e) {
    e.preventDefault()
    goStep1Delivery()
})
if (document.querySelector('input[name="data[obj][vehicleType]"]')) {
    document.querySelectorAll('input[name="data[obj][vehicleType]"]').forEach(el => {
        el.addEventListener('change', function () {
            clearErrorVehicle()
        })
    })
}
ImgUpload()
var storedFiles = [];
var imgWrap = "";
var imgArray = [];

function ImgUpload() {


    $('.upload__inputfile').each(function () {
        $(this).on('change', function (e) {
            imgWrap = $(this).parents('.images-uploader-block').find('.photo-preview');
            var maxLength = $(this).attr('data-max_length');

            var files = e.target.files;
            var filesArr = Array.prototype.slice.call(files);
            var iterator = 0;
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
            });
        });
    });

    $('body').on('click', ".upload__img-close", function (e) {
        var file = $(this).parent().data("file");
        for (var i = 0; i < imgArray.length; i++) {
            if (imgArray[i].name === file) {
                imgArray.splice(i, 1);
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
    return !!document.querySelector('input[name="data[obj][vehicleType]"]:checked')
}

function getVehicleType() {
    return document.querySelector('input[name="data[obj][vehicleType]"]:checked').value
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

function goStep2Delivery() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    $('.delivery-order-step1').addClass('hide')
    $('.delivery-order-step2').removeClass('hide')
    hidePreviewBlock()
}

function goStep1Delivery() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    $('.delivery-order-step1').removeClass('hide')
    $('.delivery-order-step2').addClass('hide')
    hidePreviewBlock()
}

function hideListOfItemsBlock() {
    $('.items-to-move').addClass('hide')
}

function initRangePicker() {
    const elem = document.getElementById('date-range');
    const rangepicker = new DateRangePicker(elem, {
        autohide: true,
        format: 'yyyy-mm-dd'

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
            format: 'yyyy-mm-dd'

        });
        elem.addEventListener('changeDate', (e) => {
            $('.dateS-form-row').addClass('active')
        })
    }
}

function disableAddressToInputs() {
    $('.card-moving-to .error').removeClass('error')
    document.querySelector('#destinationAddr').setAttribute('disabled', 'disabled');
    document.querySelector('#postalTo').setAttribute('disabled', "disabled");
    document.querySelector('#bedroomsTo').setAttribute('disabled', "disabled");
    document.querySelector('#floorTo').setAttribute('disabled', "disabled");

    document.querySelector('#isElevatorTo').setAttribute('disabled', 'disabled');
    document.querySelector('#accommodationTypeTo').setAttribute('disabled', 'disabled');
    document.querySelector('.add_more_destination').classList.add('hide');
}

function undisableAddressToInputs() {
    document.querySelector('#destinationAddr').removeAttribute('disabled');
    document.querySelector('#floorTo').removeAttribute('disabled');
    document.querySelector('#accommodationTypeTo').removeAttribute('disabled');
    document.querySelector('#bedroomsTo').removeAttribute('disabled');
    document.querySelector('#postalTo').removeAttribute('disabled');
    document.querySelector('#isElevatorTo').removeAttribute('disabled');
    document.querySelector('.add_more_destination').classList.remove('hide');
}

function getDestinationAddress() {
    let a = document.querySelector('#destinationAddr');
    let b = document.querySelector('#postalTo');
    let c = document.querySelector('#isElevatorTo');
    let d = document.getElementById('destination_latlng');

    let e = document.getElementById('accommodationTypeTo');
    let f = document.getElementById('bedroomsTo');
    let g = document.getElementById('floorTo');
    let addrObj = {
        "latlng": d.value,
        "address": a.value,
        "postal": b.value,
        "is_elevator": c.value,
        "accommodationType": e.value,
        "bedrooms": f.value,
        "floor": g.value,
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
          <p><strong>Address ${i + 1}: </strong>${el["address"]}, ${el["postal"]} ${el["is_elevator"] == 'true' ? ",elevator" : ""}, ${floorText}:${el["floor"]},  ${bedroomText}:${el["bedrooms"]}, ${el["accommodationType"]}</p>
           <div class="clear-address" data-addr="${i}"><button type="button"><img src="./images/close.svg" alt="delete"></button></div>
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
    $('.address-to-list').html(str)
}

function addAnotherAddressTo(withEvent = false) {
    addressTo = [];
    if (!checkAddressToInputValid()) return;
    let a = document.querySelector('#destinationAddr');
    let b = document.querySelector('#postalTo');
    let d = document.getElementById('destination_latlng');

    let addrObj = {
        "latlng": d.value,
        "address": a.value,
        "postal": b.value,
    }

    addressTo.push(addrObj)
    showAddressToInHtml(createAddrTemplate())
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
        scrollTop: $($('.form-row.error')[0]).offset().top - 280
    }, 1000);
}

function clearDestinationInputs() {
    let a = document.querySelector('#destinationAddr');
    let b = document.querySelector('#postalTo');
    let c = document.querySelector('#isElevatorTo');
    let d = document.querySelector('#destination_latlng');
    let e = document.getElementById('accommodationTypeTo');
    let f = document.getElementById('bedroomsTo');
    let g = document.getElementById('floorTo');
    a.value = "";
    b.value = "";
    c.value = "false";
    d.value = "";
    e.value = "apartment";
    f.value = "";
    g.value = "";
    $('.card-moving-to .active').removeClass('active')
    c.parentNode.classList.add('active')
    e.parentNode.classList.add('active')
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
    checkInputLength("#floorFrom")
    checkInputLength("#bedroomsFrom")
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

function checkDeliveryOrderWornItemsStep1() {
    checkDates()
    checkAddressFrom()
    checkAddressTo();
    checkContactInfo()
    if ($('.form-row.error').length) {
        scrollToErrorInput()
    } else {
        goStep2Delivery()
    }
}

function checkWasteForm() {
    checkDates()
    checkAddressTo();
    checkContactInfo()
    checkInputLength(('#additionalInfoInp'));
    if ($('.form-row.error').length) {
        scrollToErrorInput()
    } else {
        goPreviewWaste()
    }
}
function goPreviewWaste() {
    let obj;
    dataForm = $('#waste-order-form').serializeArray().reduce(function (obj, item) {
        if (item.name.includes("[data]")) {
            if (item.value == "on") {
                item.value = "true"
            }
            obj[item.name] = item.value;
        }
        return obj;
    }, {});

    console.log(dataForm);

    preparePreview(dataForm)
    showPreviewBlock()

}
function getDeliveryData() {

}



function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
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

function insertUploadImgPreview(){
    $("#photos-preview").empty()
    $('.images-uploader-block .photo-preview').clone().appendTo( "#photos-preview" );
}

function setVehicleData(data) {
    data["obj[data][vehicleType]"] = getVehicleType();

}

function setImgData(data) {
    data["obj[data][upload_images]"] = imgArray;


}

function preparePreview(data) {
    setImgData(data)
    templatePreviewMovingTo(JSON.parse(data["obj[data][address_to]"]), data["obj[data][clearing_type]"])
    insertCustomerNotePreview(data)
    insertPersonalInfoPreview(data)
    insertContactInfoPreview(data)
    insertDateInfo(data)
    insertUploadImgPreview()

}

$('#sendForm').click(function (e) {
    e.preventDefault()
    console.log(dataForm)
})
$('#print').click(function (e) {
    e.preventDefault()
    window.print();
})

function hidelistItemsTitle() {
    document.getElementById("listItemsTitle").classList.add('hide')
}

function insertDateInfo(data) {
    if (data["obj[data][date_type]"] == "range") {
        document.getElementById('datePreview').innerHTML = data["obj[data][date_from]"] + " - " + data["obj[data][date_to]"]
    } else {
        document.getElementById('datePreview').innerHTML = data["obj[data][date]"]
    }
    document.getElementById('timePreview').innerHTML = data["obj[data][time]"]
}

function insertTruckInfo(data) {
    document.getElementById('truckTypePreview').innerHTML = data["obj[data][vehicleType]"] + " feet";
    if (!!data["obj[data][needHelper]"]) {
        document.getElementById('needHelperPreview').classList.remove('hide')

    }
}

function insertPersonalInfoPreview(data) {
    document.getElementById('fullnamePreview').innerHTML = data["obj[data][name]"]
    document.getElementById('phoneNumberPreview').innerHTML = data["obj[data][phone]"]
    document.getElementById('emailPreview').innerHTML = data["obj[data][email]"]
}

function insertContactInfoPreview(data) {
    document.getElementById('contactInfoPhonePreview').innerHTML = data["obj[data][phone]"]
    document.getElementById('contactInfoEmailPreview').innerHTML = data["obj[data][email]"]
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
    }

function templatePreviewMovingTo(data = [],clearing_type) {
    let str = ``;
    for (let i = 0; i < data.length; i++) {
        str += `
              <div class="addr-text-item">
                                    <div class="addr-text-item-info">
                                        <p><strong>${addressText}: </strong>${data[i]["address"]}</p>
                                        <p><strong>${postalCodeText}: </strong>${data[i]["postal"]}</p>
                                        <p><strong>Service: </strong>${cleaningText}</p>
                                        <p><strong>${serviceTypeText}: </strong>${clearing_type}</p>
                                    </div>
                                </div>`


    }
    document.getElementById("moving_to_preview").innerHTML = str;

}