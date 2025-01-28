var formError = false;

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
goToStep2()
function checkEmailField(inp) {
    if (!checkLength(inp)) {
        showError(inp, emailErrorLength)
    } else {
        if (!validateEmail(inp.value)) {
            showError(inp, emailErrorValid)
        }
    }
}
var cityRequiredText = "City is required field"
var cityCoordinateErrorText = "Chose city from suggestion list"
function checkCity(){
    let cityInp = document.querySelector("#city_name")
    let cityPostalInp = document.querySelector("#expert_postal")
    let cityCoordinateInp = document.querySelector("#city_latlng")
    if (!checkLength(cityInp)) {
        showError(cityInp, cityRequiredText)
    }
    if (!checkLength(cityCoordinateInp)) {
        showError(cityCoordinateInp, cityPostalRequiredText)
    }
}
function showError(inp, msg) {
    inp.parentElement.querySelector('.all-cback-inp-span').innerHTML = msg;
    inp.parentElement.classList.add('error')
    inp.setAttribute('aria-invalid', 'true');
}

function checkPasswordField(inp) {
    if (inp.value == 0) {
        showError(inp, passwordErrorValid)
    }
}

function checkPasswordCheckField(inp) {
    if (inp.value == 0) {
        showError(inp, passwordErrorValid)
    }
    if (inp.value != document.querySelector('#password').value) {
        showError(inp, passwordErrorEqual)
    }
}

function checkFirstNameField(inp) {
    if (!checkLength(inp)) {
        showError(inp, firstnameErrorLength)
    }
}

function checkLastNameField(inp) {
    if (!checkLength(inp)) {
        showError(inp, lastnameErrorLength)
    }
}

function checkPhoneField(inp) {
    if (!checkLength(inp)) {
        showError(inp, phoneErrorValid)
    }
}

function isPersonalInfoCorrect() {
    checkEmailField(document.querySelector('#email'))
    checkPasswordField(document.querySelector('#password'))
    checkPasswordCheckField(document.querySelector('#password-check'))
    checkPhoneField(document.querySelector('#phone'))
    checkFirstNameField(document.querySelector('#firstName'))
    checkLastNameField(document.querySelector('#lastName'))
    if (document.querySelector('#personalInfo .error')) {
        return false;
    }
    return true;
}

function checkLength(inp) {
    if (inp.value == 0) {
        return false;
    }
    return true;
}

function isVehicleChosen() {
    return !!(document.querySelector('input[name="obj[data][vehicleType]"]:checked'));
}

document.querySelectorAll('.form-row').forEach(el => {
    if (!el.querySelector('input')) {

        if (el.querySelector('select')) {
            el.querySelector('select').addEventListener('focus', function (e) {
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
        if (e.target.type == "email") {
            checkEmailField(e.target)
        }
        if (e.target.id == "password") {
            checkPasswordField(e.target)
        }
        if (e.target.id == "phone") {
            checkPhoneField(e.target)
        }
        if (e.target.id == "firstName") {
            checkFirstNameField(e.target)
        }
        if (e.target.id == "lastName") {
            checkLastNameField(e.target)
        }
        // if (e.target.id == "password-check") {
        //     checkPasswordCheckField(e)
        // }

        if (e.target.value == 0) {
            e.target.parentElement.classList.remove('active')
        }
    })
})

function getVehicleData(){
    let arr = []
    document.querySelectorAll('input[name="obj[data][vehicleType_hidden]"]:checked').forEach(el=>{
        arr.push(el.value)
    })
    return  arr;
}
//driver
if (document.querySelector('#userType')) {
    if (document.querySelector('#userType').value == 'driver') {
        document.querySelector('input#individual_inp').addEventListener('change', function () {
            document.querySelector('.company-fields').classList.remove('active')
            unRequiredCompanyFields()
        })
        document.querySelector('input#company_inp').addEventListener('change', function () {
            document.querySelector('.company-fields').classList.add('active')
            makeRequiredCompanyFields()
        })
        document.querySelectorAll('input[name="obj[data][vehicleType_hidden]"]').forEach(el => {
            el.addEventListener('change', function () {
                document.querySelector('input[name="obj[data][vehicleType]"]').value = JSON.stringify(getVehicleData())

                clearErrorVehicle()
            })
        })

        document.querySelector('#driver-next-step').addEventListener('click', function () {
            if (isPersonalInfoCorrect()) {
                goToStep2()
            }
        })
        document.querySelector('#go-step1-driver').addEventListener('click', function (e) {
            e.preventDefault()
            goToStep1()
        })
    }
}

function makeRequiredCompanyFields() {
    document.querySelectorAll('.requiredFill-company').forEach(el => {
        el.classList.add('requiredFill')
    })
}

function unRequiredCompanyFields() {
    document.querySelectorAll('.requiredFill-company').forEach(el => {
        el.classList.remove('requiredFill')
    })
}

// document.querySelector('button[type="submit"]').addEventListener('click',function (e){
//     e.preventDefault()
// })

function makeErrorVehicle() {
    document.querySelector(('#vehicle-row')).classList.add('error')
}

function clearErrorVehicle() {
    document.querySelector(('#vehicle-row')).classList.remove('error')
}

function checkRequiredField() {
    document.querySelector('.company-fields')
    document.querySelectorAll('select.requiredFill, input.requiredFill').forEach(el => {
        if (!el.value) {
            el.parentElement.classList.add('error')
        }
    })
}

function isCheckedVehicle() {
    return !!document.querySelector('input[name="obj[data][vehicleType_hidden]"]:checked')
}

function goToStep2() {
    document.querySelector('.step2').classList.add('active')
    document.querySelector('.step1').classList.add('hide')
}

function goToStep1() {
    document.querySelector('.step2').classList.remove('active')
    document.querySelector('.step1').classList.remove('hide')
}

const elemdate = document.querySelector('input.date');
if (elemdate) {
    const datepicker = new Datepicker(elemdate, {
        autohide:true
    });
}

$('#registerformDriver').on('submit', function (e) {
    e.preventDefault()
    e.stopPropagation();
    checkRequiredField()
    if (!isCheckedVehicle()) {makeErrorVehicle()}
    var $this = $(this);
    var data = $this.serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
        return obj;
    }, {});

    let isValidForm = ($this.find('.error').length == 0)
    if (isValidForm) {
        console.log(data)
        // registerUsers( data, $this );
    }
})
$('#registerformPerson').on('submit', function (e) {
    e.preventDefault()
    e.stopPropagation();
    isPersonalInfoCorrect()
    var $this = $(this);
    var data = $this.serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    let isValidForm = ($this.find('.error').length == 0)
    if (isValidForm) {
        registerUsers( data, $this );
    }
})
$('#resetPassForm').on('submit', function (e) {
    e.preventDefault()
    e.stopPropagation();
    var $this = $(this);
    checkEmailField(document.querySelector('#resetPassForm input#email'))

    var data = $this.serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    let isValidForm = ($this.find('.error').length == 0)
    if (isValidForm) {
        console.log(data)
    }
})

let reqerrors = false;
function registerUsers( data, fn ) {
    showLoadingGif();

    let busitype = $('input[name="obj[data][businessType]"]:checked').val();
    let usertype = $('#userType') == 'driver';
    let drivercompany  = ( usertype == 'driver' && busitype == 'company' );
    console.log(busitype, usertype, drivercompany);

    reqerrors = false;
    $.post( fn.attr('action'), data,  function( data ) {
        hideLoadingGif();
        if (data.status=='ok') {
            url = $('html').data('lang') + '/registration/complete';
            if ( $('#userType') == 'customer' ) url = url + '?type=finish';
            document.location.replace( url );
        } else {
            reqerrors = data.errors;
            // show errors ...
            $.each(data.errors, function(i, val) {
                if ( i == 'fileerror') {
                    showDefaultPopup( error_title, val, 4000 );
                } else if ( i == 'captcha') {
                    showDefaultPopup( error_title, recapError, 4000 );
                } else {
                    if ( val == 'emailexist' ) showDefaultPopup( error_title, emailinuseError, 4000 );
                    else elm = fn.find('.' + i + '-form-row').elm.addClass('error');
                }
            });

            if (typeof variable !== 'undefined' && variable !== null) data.errorstep = 1;
            console.log(data.errorstep);
            if ( data.errorstep == 1 || data.errorstep == 2 ) {
                //show
            }
        }
    }).always(function() { hideLoadingGif(); });
}

function CheckPhotos() {
    showLoadingGif();

    let  fd = new FormData();
    var files = $('#insurancefile')[0].files;
    if( !files.length ) { showDefaultPopup( warning_title, select_file_first ); return false; }
    if ( files[0].size > 5001000 ) { showDefaultPopup( warning_title, error_file_incorrect ); return false; }
    fd.append('file',files[0]);

    $.ajax({
        url: "/insurance-upload",
        type: "POST",
        data:  fd,
        contentType: false,
        cache: false,
        processData: false,
        dataType: 'json',
        success: function(data) {
            if( data == 'error' ) showDefaultPopup( warning_title, error_file_incorrect );
            else {
                $('#uploadedfile').val(data);
            }
        },
        error: function(e) {
            showDefaultPopup( warning_title, ajaxError );
        }
    });
    hideLoadingGif();
}
