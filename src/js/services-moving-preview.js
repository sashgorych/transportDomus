let listOfItemsMaxLength = 150;
let addressTo = [];
let maxDestinationAddress = 4;
var chosenItemsToMove = [];
var chosenItemsToMoveCount = 0;
var wornItems = true;
var formData = new FormData()
var dataForm;
var storedFiles = [];
var imgWrap = "";
var imgArray = [];


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

function insertUploadImgPreview(data) {
    if (!data["obj[data][upload_images]"]) return;
    let str = ``;
    let imgArr = JSON.parse(data["obj[data][upload_images]"]) || []
    imgArr.forEach(img => {
        console.log(img)
        str += `
        <div class="upload__img-box"><div style="background: url('${img}')" data-number="0" data-file="" class="img-bg"></div></div>
        `
    })
    $('#photos-preview').html(str)
}

function showBlock(blockId) {
    if (!document.getElementById(blockId)) return;
    document.getElementById(blockId).classList.remove('hide')
}

function hideBlock(blockId) {
    if (!document.getElementById(blockId)) return;

    document.getElementById(blockId).classList.add('hide')
}

function showFinishedInfo(data) {
    if (!data["obj[data][finalize]"]) return;
    let finalData = JSON.parse(data["obj[data][finalize]"])
    setHtmlById("order-duration", finalData["obj[data][duration_hours]"] + "h: " + finalData["obj[data][duration_minutes]"] + "m")
    setHtmlById("movers-number", finalData["obj[data][number_workers]"])
    setHtmlById("req_status", data["obj[data][order_status]"])
    if (finalData["obj[data][hour_cost]"].length > 0) {
        showBlock('z1')
        showBlock('z2')
        setHtmlById("hourly-rate", finalData["obj[data][hour_cost]"])
        setHtmlById("travel-rate", finalData["obj[data][transportation_cost]"])
    } else {
        setHtmlById("price-rate", finalData["obj[data][fixed_payment]"])
        showBlock('z3')
    }
    if (finalData["obj[data][extra_charges]"].length > 0) {
        showBlock("worker-comment")
        showBlock("z4")
        setHtmlById("extra-charges", finalData["obj[data][extra_charges]"])
        setHtmlById("worker-comment-text", finalData["obj[data][extra_charges_text]"])
    }
    setHtmlById("", finalData["obj[data][]"])
    setHtmlById("", finalData["obj[data][]"])
    setHtmlById("", finalData["obj[data][]"])
    if(data["obj[data][order_status]"] == "completed") {
        $(".finished-info").removeClass("hide");
    }
}

function setHtmlById(blockId, data) {
    if (document.getElementById(blockId)) {
        document.getElementById(blockId).innerHTML = data;
    }
}

function preparePreview(data) {
    if (data["obj[data][service_type]"] == "moving") {
        templatePreviewMovingToMoving(JSON.parse(data["obj[data][address_to]"]))
        templatePreviewMovingFromMoving(data)
        insertItemsToMovePreview(getItemsToMoved(data))
        insertTruckInfo(data)
    }
    if (data["obj[data][service_type]"] == "delivery") {
        templatePreviewMovingToDelivery(JSON.parse(data["obj[data][address_to]"]))
        templatePreviewMovingFromDelivery(data)
        insertItemsToMovePreview(getItemsToMoved(data))
        insertTruckInfo(data)
    }
    if(data["obj[data][service_type]"] == "waste-cleaning"){
        templatePreviewMovingToWaste(JSON.parse(data["obj[data][address_to]"]), data["obj[data][clearing_type]"])
    }
    if(data["obj[data][service_type]"] == "waste-struck"){
        templatePreviewMovingToWaste(JSON.parse(data["obj[data][address_to]"]))
    }
    if(data["obj[data][service_type]"] == "waste-container"){
        templatePreviewMovingToWaste(JSON.parse(data["obj[data][address_to]"]))
    }

    setHtmlById("req_id", data["obj[data][order_id]"])
    showFinishedInfo(data)


    insertCustomerNotePreview(data)
    insertPersonalInfoPreview(data)
    insertContactInfoPreview(data)
    insertDateInfo(data)
    insertUploadImgPreview(data)
    let departureLatLng = data["obj[data][departure_latlng]"];

    if (!data["obj[data][is_need_storage]"]) {
        if (data["obj[data][address_from]"].length == 0) {
            let destinationPoint = JSON.parse(JSON.parse(data["obj[data][address_to]"]).pop()["latlng"])
            setMarker(destinationPoint)
        } else {
        calcRoute(JSON.parse(departureLatLng), JSON.parse(data["obj[data][address_to]"]), false)
    }
    } else {
        calcRoute(JSON.parse(departureLatLng), [{"latlng": "" + departureLatLng + ""}], true)

    }
}

$('#sendForm').click(function (e) {
    e.preventDefault()
    console.log([...formData])
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
    $("#truck-type-b").removeClass('hide')
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

function templatePreviewMovingFromDelivery(data = []) {
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
function templatePreviewMovingToWaste(data = [],clearing_type) {
    $(".addr-text-item").addClass('hide')
    let str = ``;
    for (let i = 0; i < data.length; i++) {
        str += `
              <div class="addr-text-item">
                                    <div class="addr-text-item-info">
                                        <p><strong>${addressText}: </strong>${data[i]["address"]}</p>
                                        <p><strong>${postalCodeText}: </strong>${data[i]["postal"]}</p>
                                        <p><strong>Service: </strong>${cleaningText}</p>
                                        <p><strong>${clearingTypeText}: </strong>${clearing_type}</p>
                                    </div>
                                </div>`


    }
    document.getElementById("moving_to_preview").innerHTML = str;

}
function templatePreviewMovingFromMoving(data = []) {
    let str = ``;
    if (data["obj[data][isNeedBoxing]"] == "true") {
        str = `<p><strong>${boxingServiceText}</strong>`
    }
    str += `
          <p><strong>${addressText}: </strong>${data["obj[data][address_from]"]}</p>
          <p><strong>${postalCodeText}: </strong>${data["obj[data][postal_from]"]}</p>
          <p><strong>${accommodationTypeText}: </strong>${data["obj[data][accommodation_type_from]"]}</p>
          <p><strong>${bedroomText}: </strong>${data["obj[data][bedrooms_from]"]}</p>
          <p><strong>${floorText}: </strong>${data["obj[data][floor_from]"]}</p>
          <p><strong>${elevatorText}: </strong>${data["obj[data][elevator_from]"] == "false" ? 'no' : "yes"}</p>
    `;
    document.getElementById("moving_from_preview").innerHTML = str;


}

function templatePreviewMovingToDelivery(data = []) {
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

function templatePreviewMovingToMoving(data = []) {
    let str = ``;
    for (let i = 0; i < data.length; i++) {
        str += `
              <div class="addr-text-item addr-text-item-to">
                                    <p class="h5">${destinationPointText} ${i + 1} / ${data.length}</p>

                                    <div class="addr-text-item-info">
                                        <p><strong>${addressText}: </strong>${data[i]["address"]}</p>
                                        <p><strong>${postalCodeText}: </strong>${data[i]["postal"]}</p>
                                          <p><strong>${accommodationTypeText}: </strong>${data[i]["accommodationType"]}</p>
                                            <p><strong>${bedroomText}: </strong>${data[i]["bedrooms"]}</p>
                                             <p><strong>${floorText}: </strong>${data[i]["floor"]}</p>
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
    let int = setInterval(function () {
        if (googleMapInit) {
            preparePreview(ordersArray[0])
            clearInterval(int)
        }
    }, 1000)
}
