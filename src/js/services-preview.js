let listOfItemsMaxLength = document.querySelector("#worn_item:checked") ? 5: 1000;
let addressTo = [];
var chosenItemsToMove = [];
var chosenItemsToMoveCount = 0;
let maxDestinationAddress = 2;
var wornItems = true;

if(document.querySelector('.preview-page')){
    let int = setInterval(function (){
        if(googleMapInit){
            preparePreview(ordersArray[0])
            clearInterval(int)
        }
    },1000)
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
    document.querySelector('.items-list.non-edit .items-list-cont-out-2').innerHTML =  a;
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

function insertUploadImgPreview(data){
    let str = `<div class = "photo-preview">`;
   let imgArr = JSON.parse(data["obj[data][upload_images]"]) || []
    imgArr.forEach(img=>{
        console.log(img)
        str+=`
        <div class="upload__img-box"><div style="background: url('${img}')" data-number="0" data-file="" class="img-bg"></div></div>
        `
    })
    str += `</div>`
    $('#photos-preview').html(str)
}
function setVehicleData(data){
    data["obj[data][vehicleType]"] = getVehicleType();

}

function preparePreview(data) {
    templatePreviewMovingTo(JSON.parse(data["obj[data][address_to]"]))
    templatePreviewMovingFrom(data)
    insertItemsToMovePreview(getItemsToMoved(data))
    insertCustomerNotePreview(data)
    insertPersonalInfoPreview(data)
    insertContactInfoPreview(data)
    insertTruckInfo(data)
    insertDateInfo(data)
    insertUploadImgPreview(data)
    let departureLatLng = data["obj[data][departure_latlng]"];
    if (!data["obj[data][is_need_storage]"]) {
        calcRoute(JSON.parse(departureLatLng), JSON.parse(data["obj[data][address_to]"]))
    }
}

$('#sendForm').click(function (e){
    e.preventDefault()
    console.log([...formData])
})
$('#print').click(function (e){
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
