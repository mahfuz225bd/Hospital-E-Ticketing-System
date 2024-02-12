import { Validator, DateValueForHTML, preventDatesToInput, SlideForm, messageTemplate } from "./base.js"

document.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.querySelector('#mainForm')
    const problemKnownOption = document.querySelector('#problem_known')
    const problemUnknownOption = document.querySelector('#problem_unknown')
    const selectProblem = document.querySelector('#problem');
    const inputCustomProblem = document.querySelector('#inputCustomProblem')
    const allProblemValues = document.querySelectorAll('output.problemValue');
    const symptoms = document.querySelector('textarea#symptoms');
    const symptomsWordCount = document.querySelector('#symptomsWordCount')
    const selectDivision = document.querySelector('#division')
    const selectDistrict = document.querySelector('#district')
    const btnShowSubdistrictOrThanaInput = document.querySelector('#btnShowSubdistrictOrThanaInput')
    const selectSubdistrictOrThana = document.querySelector('#subdistrictOrThana')
    const selectHospital = document.querySelector('#hospital')
    const hospitalSelectionRow = document.querySelector('#hospitalSelectionRow')
    const allHospitalValues = document.querySelectorAll('output.hospitalNameValue')
    const selectDoctor = document.querySelector('#doctor')
    const allDoctorNameValues = document.querySelectorAll('output.doctorNameValue')
    const appointmentDateRow = document.querySelector('#appointmentDateRow')
    const inputAppointmentDate = document.querySelector('#appointmentDate')
    const tableConfirmationDetails = document.querySelector('table#confirmationDetails')
    const btnGoToFirstSlide = document.querySelector('#goToFirstSlide')

    const formSlider = new SlideForm('form-slide', 'step-indicator');

    // Showing form
    formSlider.show()


    const checkInputs = {
        checkName: () => {
            const nameValue = document.querySelector('input#name').value
            const nameValueValidator = new Validator(nameValue)

            return nameValueValidator.isNotEmpty()
        },
        checkAge: () => {
            const fieldValue = document.querySelector('input#age').value
            const fieldValueValidator = new Validator(fieldValue)

            return fieldValueValidator.isNotEmpty() && fieldValueValidator.isAge()
        },
        checkGender: () => {
            const fieldValue = document.querySelector('select#gender').value
            const fieldValueValidator = new Validator(fieldValue)

            return fieldValueValidator.isOneOf(['M', 'F', 'O'])
        },
        checkPhoneNumber: () => {
            const fieldValue = document.querySelector('input#phone').value
            const fieldValueValidator = new Validator(fieldValue)

            return fieldValueValidator.isNotEmpty() && fieldValueValidator.isBDMobileNumberWithoutCountryCode()
        },
        checkEmail: () => {
            const fieldValue = document.querySelector('input#email').value
            const fieldValueValidator = new Validator(fieldValue)

            // Field can be empty, so we need to add the email rule only if it's not empty
            return fieldValueValidator.isEmail() || fieldValueValidator.isEmpty()
        },
        checkProblemSelection: () => {
            const fieldValue = selectProblem.selectedOptions[0].getAttribute('value')
            const fieldValueValidator = new Validator(fieldValue)

            const filledUp = fieldValueValidator.isNot(null) && fieldValueValidator.isNot('')

            return filledUp
        },
        checkCustomProblemInput: () => {
            if (selectProblem.selectedOptions[0].getAttribute('value') === '_other') {
                const fieldValue = inputCustomProblem.value
                const fieldValueValidator = new Validator(fieldValue)

                return fieldValueValidator.isNotEmpty()
            }

            return true
        },
        checkDivisionSelection: () => {
            const fieldValue = selectDivision.selectedOptions[0].getAttribute('value')
            const fieldValueValidator = new Validator(fieldValue)

            const filledUp = fieldValueValidator.isNot(null) && fieldValueValidator.isNot('')

            return filledUp
        },
        checkDistrictSelection: () => {
            if (selectDistrict.selectedOptions[0]) {
                const fieldValue = selectDistrict.selectedOptions[0].getAttribute('value')
                const fieldValueValidator = new Validator(fieldValue)

                const filledUp = fieldValueValidator.isNot(null) && fieldValueValidator.isNot('')

                return filledUp
            }

            return false
        },
        checkHospitalSelection: () => {
            const fieldValue = selectHospital.selectedOptions[0].getAttribute('value')
            const fieldValueValidator = new Validator(fieldValue)

            const filledUp = fieldValueValidator.isNot(null) && fieldValueValidator.isNot('')

            return filledUp
        },
        checkDoctorSelection: () => {
            const fieldValue = selectDoctor.selectedOptions[0].getAttribute('value')
            const fieldValueValidator = new Validator(fieldValue)

            const filledUp = fieldValueValidator.isNot(null) && fieldValueValidator.isNot('')

            return filledUp
        },
        checkAppointmentDate: () => {
            const fieldValue = appointmentDate.value
            const fieldValueValidator = new Validator(fieldValue)

            const filledUp = fieldValueValidator.isNot(null) && fieldValueValidator.isNot('')

            return filledUp && fieldValueValidator.isHTMLDate()
        }
    }


    const activeFunctionalities = (slideNo) => {
        if (slideNo === 1) {
            // To enable selectProblem and inputCustomProblem
            problemKnownOption.addEventListener('click', () => {
                selectProblem.disabled = false
                inputCustomProblem.disabled = false
            })

            // To disable selectProblem and inputCustomProblem
            problemUnknownOption.addEventListener('click', () => {
                selectProblem.disabled = true
                inputCustomProblem.disabled = true
            })

            // Loading problems to #selectProblems, then loading divisions to #division
            fetch('/api/problems')
                .then(response => response.json())
                .then(problems => {
                    const categories = Object.keys(problems)
                    categories.forEach(category => {
                        let optionElements = ''
                        problems[category].forEach(problem => {
                            optionElements += `<option value="${problem.id}" data-value-alt=${problem.valueAlt}>${problem.value}</option>`
                        })

                        selectProblem.innerHTML += `<optgroup label="${category}">${optionElements}</optgroup>`
                    })
                    selectProblem.innerHTML += '<option value="_other">অন্য রোগ/সমস্যা</option>';
                }).then(() => {
                    // Loading divisions to #division
                    fetch('/api/divisions')
                        .then(response => response.json())
                        .then(data => {
                            data.forEach(each => selectDivision.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                        })
                        .catch(err => console.error(err))
                })
                .catch(err => console.error(err))

            // To change values of all output.problemValue + show/hide #inputCustomProblem
            selectProblem.addEventListener('input', event => {
                // Changing values of all output.problemValue
                const selectedProblemValue = event.target.selectedOptions[0].innerText
                allProblemValues.forEach(each => {
                    each.innerText = selectedProblemValue
                })

                // Showing or hiding #inputCustomProblem + changing filter values for hospitals and doctors
                if (event.target.value === '_other') {
                    inputCustomProblem.style.display = 'block'
                    inputCustomProblem.value = ''
                    inputCustomProblem.setAttribute('required', true)
                    inputCustomProblem.setAttribute('placeholder', "রোগীর রোগ/সমস্যার নাম লিখুন *")

                    document.getElementById('filter_hospital').value = 'filter_outdoor'
                    document.getElementById('filter_doctor').value = 'filter_outdoor'
                } else {
                    inputCustomProblem.style.display = 'none'
                    inputCustomProblem.value = ''
                    inputCustomProblem.removeAttribute('required', false)
                    inputCustomProblem.setAttribute('placeholder', "রোগীর রোগ/সমস্যার নাম লিখুন")
                }
            })

            // To change value to selectProblem from #inputCustomProblem
            inputCustomProblem.addEventListener('input', event => {
                // selectProblem.selectedOptions[0].value = "Other: " + event.target.value

                // Changing text of filter labels
                document.querySelector('label[for="filter_hospital"]').innerHTML = `${inputCustomProblem.value} এর জন্য বহির্বিভাগ রয়েছে এমন হাসপাতালসমূহ`
                document.querySelector('label[for="filter_doctor"]').innerHTML = `${inputCustomProblem.value} এর জন্য বহির্বিভাগের ডাক্তারগণ`
            })

            // To show word count and limit for preventing input for more characters
            symptoms.addEventListener('input', event => {
                const countWord = event.target.value.trim().length
                if (countWord <= 255) {
                    symptomsWordCount.innerText = countWord
                } else {
                    alert("রোগের লক্ষণসমূহ ২৫৫ অক্ষরের বেশি লিখা যাবে না।")
                    symptomsWordCount.innerText = "255"
                    event.target.value = event.target.value.slice(0, 255)
                }
            })
        }

        if (slideNo === 2) {
            // To load districts on input #division
            selectDivision.addEventListener('input', event => {
                const divisionId = event.target.selectedOptions[0].getAttribute('value')

                fetch(`/api/districts?divisionId=${divisionId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            selectDistrict.disabled = false
                            selectDistrict.innerHTML = '<option  disabled selected>(নির্বাচন করুন)</option>'
                            data.forEach(each => selectDistrict.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                        }
                    })
                    .catch(err => console.error(err))
            })

            // To load hospitals \w showing hidden #hospitalSelectionRow + subdistrict/thanas on input #district
            selectDistrict.addEventListener('input', event => {
                const districtId = event.target.selectedOptions[0].getAttribute('value')

                // Loading hospitals + subdistrict/thanas with enabling select input
                fetch(`/api/hospitals?districtId=${districtId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            hospitalSelectionRow.classList.remove('hide')
                            selectHospital.disabled = false
                            selectHospital.innerHTML = '<option>(নির্বাচন করুন)</option>'
                            data.forEach(each => selectHospital.innerHTML += `<option value="${each.id}">${each.value}</option>`)
                        }
                    }).then(() => {
                        // Loading subdistrict/thanas with enabling select input
                        fetch(`/api/subdistrictAndThanas?districtId=${districtId}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.length > 0) {
                                    btnShowSubdistrictOrThanaInput.disabled = false
                                    selectSubdistrictOrThana.disabled = false
                                    selectSubdistrictOrThana.innerHTML = '<option value="all">-- সকল --</option>'
                                    data.forEach(each => selectSubdistrictOrThana.innerHTML += `<option value="${each.id}">${each.value} (${each.count})</option>`);
                                }
                            })
                            .catch(err => console.error(err))
                    })
                    .catch(err => console.error(err))
            })

            // To load hospitals on input #subdistrictOrThana
            selectSubdistrictOrThana.addEventListener('input', event => {
                const subdistrictOrThanaId = event.target.selectedOptions[0].getAttribute('value')
                const subdistrictOrThanaName = event.target.selectedOptions[0].innerText

                const subdistrictOrThanaAll = subdistrictOrThanaId === 'all'
                const selectedDistrictId = selectDistrict.selectedOptions[0].getAttribute('value')

                if (subdistrictOrThanaAll) {
                    fetch(`/api/hospitals?districtId=${selectedDistrictId}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.length > 0) {
                                hospitalSelectionRow.classList.remove('hide')
                                selectHospital.disabled = false
                                selectHospital.innerHTML = '<option>(নির্বাচন করুন)</option>'
                                data.forEach(each => selectHospital.innerHTML += `<option value="${each.id}">${each.value}</option>`)
                            }
                        })
                }

                fetch(`/api/hospitals?subdistrictOrThanaId=${subdistrictOrThanaId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            selectHospital.disabled = false
                            selectHospital.innerHTML = '<option>(নির্বাচন করুন)</option>'
                            data.forEach(each => selectHospital.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                        } else {
                            // Get words of subdistrictOrThanaName as array
                            const subdistrictOrThanaNameWords = subdistrictOrThanaName.split(" ")

                            // Removing count  from the last word in subdistrictOrThanaName
                            subdistrictOrThanaNameWords.pop()

                            const subdistrictOrThanaNameWithoutCount = subdistrictOrThanaNameWords.join(" ")

                            if (subdistrictOrThanaNameWithoutCount) {
                                alert(`${subdistrictOrThanaNameWithoutCount}-তে কোন হাসপাতাল পাওয়া যায় নি`)
                            }
                        }
                    })
                    .catch(err => console.error(err))
            })

            // To load doctors on input #hospital + change values of all output.hospitalValues
            selectHospital.addEventListener('input', event => {
                const hospitalId = event.target.selectedOptions[0].getAttribute('value')

                fetch(`/api/doctors?hospitalId=${hospitalId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            selectDoctor.disabled = false
                            selectDoctor.innerHTML = '<option>(নির্বাচন করুন)</option>'
                            data.forEach(each => selectDoctor.innerHTML += `<option value=${each.id} data-per-visit-time=${each.perVisitTime} data-treatment-for="${each.treatmentFor}">${each.name}, ${each.speciality}</option>`)
                        }
                    }).then(() => {
                        // Changing values of all output.hospitalValues
                        const selectedHospitalValue = event.target.selectedOptions[0].innerText
                        allHospitalValues.forEach(each => {
                            each.innerText = selectedHospitalValue
                        })
                    })
                    .catch(err => console.error(err))
            })

            // To show #selectSubdistrictOrThana and hide button itself
            btnShowSubdistrictOrThanaInput.addEventListener('click', event => {
                event.target.hidden = true;
                selectSubdistrictOrThana.hidden = false;
            })
        }

        if (slideNo === 3) {
            // To show #appointmentDateRow + change all output.allDoctorNameValues
            selectDoctor.addEventListener('input', event => {
                // Hide #appointmentDateRow
                if (appointmentDateRow.classList.contains('hide')) {
                    appointmentDateRow.classList.remove('hide')
                }

                const doctorName = event.target.selectedOptions[0].innerText.split(",")[0].trim(0)

                // Changing values to all output.doctorNameValue
                allDoctorNameValues.forEach(each => each.innerText = doctorName)
            })

            // Setting attributes value, min, max properties of #appointmentDate
            const todayForHTML = DateValueForHTML.getToday()
            inputAppointmentDate.setAttribute('value', todayForHTML)
            inputAppointmentDate.setAttribute('min', todayForHTML)
            inputAppointmentDate.setAttribute('max', DateValueForHTML.getDateAfterThirtyDays())

            // To configure to show alert if doctor is not available according to specific weeks (iso weeks)
            inputAppointmentDate.addEventListener('input', event => {
                const availableISOWeeks = event.target.dataset.availableIsoWeeks.split(',').map(item => Number(item.trim()));
                const unavailableISOWeeks = Array.from({ length: 7 }, (_, index) => index + 1).filter(num => !availableISOWeeks.includes(num));

                const targetElement = event.target
                preventDatesToInput(targetElement, unavailableISOWeeks)
            })
        }
    }


    activeFunctionalities(formSlider.getSlideNo())


    // Onclick action nav buttons of form slide: Patient and Disease Information
    document.querySelector('#patientDiseaseInformation_btnNext').addEventListener('click', () => {
        if (checkInputs.checkName() &&
            checkInputs.checkAge() &&
            checkInputs.checkGender() &&
            checkInputs.checkPhoneNumber() &&
            checkInputs.checkEmail()
            // && checkInputs.checkProblemSelection() &&
            // checkInputs.checkCustomProblemInput()
        ) {
            formSlider.next()
            activeFunctionalities(formSlider.getSlideNo())
        } else {
            if (!checkInputs.checkName()) {
                alert("Must provide patient name.")
            }

            if (!checkInputs.checkAge()) {
                alert("Provide valid age.")
            }

            if (!checkInputs.checkGender()) {
                alert("Gender must be (M, F or O) where M=Male, F=Female and O=Other.")
            }

            if (!checkInputs.checkPhoneNumber()) {
                alert("Provide valid Phone Number of Bangladesh.")
            }

            if (!checkInputs.checkEmail()) {
                alert("Invalid Email Address.")
            }

            // if (!checkInputs.checkProblemSelection()) {
            //     alert("Must provide patient's disease/problem.")
            // }

            // if (!checkInputs.checkCustomProblemInput()) {
            //     alert("You must input patient's disease/problem.")
            // }
        }
    })


    // Onclick action nav buttons of form slide: Hospital Selection Slide
    document.querySelector('#hospitalSlide_prevBtn').addEventListener('click', () => {
        formSlider.prev()
    })

    document.querySelector('#hospitalSlide_nextBtn').addEventListener('click', () => {
        if (checkInputs.checkDivisionSelection() &&
            checkInputs.checkDistrictSelection() &&
            checkInputs.checkHospitalSelection()) {
            formSlider.next()
            activeFunctionalities(formSlider.getSlideNo())
        } else {
            if (!checkInputs.checkDivisionSelection()) {
                alert("Division is not selected.")
            }

            if (!checkInputs.checkDistrictSelection()) {
                alert("District is not selected.")
            }

            if (checkInputs.checkDistrictSelection() && !checkInputs.checkHospitalSelection()) {
                alert("Hospital is not selected.")
            }
        }
    })


    // Onclick action nav buttons of form slide: Doctor Appointment Slide
    document.querySelector('#doctorAppointment_btnPrev').addEventListener('click', () => {
        formSlider.prev()
    })

    // Onclick action nav buttons of form slide: Confirmation
    document.querySelector("#confirmation_btnPrev").addEventListener('click', () => {
        formSlider.prev()
    })


    document.querySelector('#doctorAppointment_btnNext').addEventListener('click', () => {
        if (checkInputs.checkDoctorSelection() && checkInputs.checkAppointmentDate()) {
            formSlider.next()

            const innerHtmlPrevState = tableConfirmationDetails.innerHTML
            const innerHtmlNewState = innerHtmlPrevState
                .replace('{patient_name}', document.querySelector('#name').value)
                .replace('{gender}', document.querySelector('#gender').value)
                .replace('{age}', document.querySelector('#age').value)
                .replace('{contact_no}', document.querySelector('#phone').value)
                .replace('{contact_email}', document.querySelector('#email').value)
                .replace('{disease}', selectProblem.selectedOptions[0].innerText)
                .replace('{symptoms}', symptoms.value)
                .replace('{hospital_name}', selectHospital.selectedOptions[0].innerText)
                .replace('{division}', selectDivision.selectedOptions[0].innerText)
                .replace('{district}', selectDistrict.selectedOptions[0].innerText)
                .replace('{doctor}', selectDoctor.selectedOptions[0].innerText)
                .replace('{appointment_date}', document.querySelector('#appointmentDate').value)

            tableConfirmationDetails.innerHTML = innerHtmlNewState

            if (selectProblem.selectedOptions[0].getAttribute('value') === '_other') {
                tableConfirmationDetails.querySelector('#isOther').classList.remove('hide')

                // Set innerHTML (again) with replacing 'অন্য রোগ/সমস্যা'
                tableConfirmationDetails.innerHTML = tableConfirmationDetails.innerHTML.replace('অন্য রোগ/সমস্যা', inputCustomProblem.value)
            }
        } else {
            if (!checkInputs.checkDoctorSelection()) {
                alert("Doctor is not selected.")
            }

            if (!checkInputs.checkAppointmentDate()) {
                alert("Invalid date input. Please enter a valid date in the format 'YYYY-MM-DD'.")
            }
        }
    })


    btnGoToFirstSlide.addEventListener('click', () => {
        formSlider.setSlideNo(1)
        formSlider.show()
    })


    // If form#mainForm is submitted
    mainForm.addEventListener('submit', event => {
        event.preventDefault()

        const formData = new FormData(event.target)
        const formEntries = Object.fromEntries(formData.entries())

        const customProblemId = sessionStorage.getItem('customProblemId')

        const makeAnAppointment = (data) => {
            fetch('/api/add_patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    name: data.name,
                    age: data.age,
                    gender: data.gender,
                    phone: data.phone,
                    email: data.email,
                    problemId: new Validator(data.problemId).isNumeric() ? data.problemId : "",
                    customProblemId: new Validator(data.customProblemId).isNumeric() ? data.customProblemId : "",
                    symptoms: data.symptoms
                }).toString()
            }).then(response => response.json())
                .then(data => {
                    // Remove customProblemId from session
                    if (customProblemId) {
                        sessionStorage.removeItem("customProblemId");
                    }

                    // fetch to insert appointment with patientId
                    fetch('/api/make_appointment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            patientId: data['lastInsertedId'],
                            doctorByHospitalId: formEntries['doctor'],
                            appointmentDate: formEntries['appointmentDate']
                        }).toString()
                    }).then(response => response.json())
                        .then(data => {
                            const appointmentId = data['appointmentId']

                            // const message = messageTemplate.replace('{hospital_name}', selectHospital.selectedOptions[0].innerText)
                            //     .replace('{district}', selectDistrict.selectedOptions[0].innerText)
                            //     .replace('{doctor_name}', selectDoctor.selectedOptions[0].innerText)
                            //     .replace('{serial_no}', '{}')
                            //     .replace('{appointment_date}', '{}')
                            //     .replace('{appointment_time}', '{}')
                            //     .replace('{room_location}', '{}');

                            // // Send SMS
                            // fetch('/send_sms?' + new URLSearchParams({
                            //     message: message,
                            //     to: formEntries['phone']
                            // }).toString())
                            //     .then(() => {
                            //         window.location.href = `/successful?appointmentId=${appointmentId}`
                            //     }).catch(error => {
                            //         alert(`Error sending sms:\n${error}`);
                            //     })

                            window.location.href = `/successful?appointmentId=${appointmentId}`
                        })
                        .catch(error => {
                            alert("Error: ", error)
                        })
                })
                .catch(error => {
                    alert("Error: ", error);
                });
        }

        const isCustomProblem = selectProblem.selectedOptions[0].value === '_other'

        if (isCustomProblem) {
            // add problem as draft to database
            fetch('/api/add_problem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'customProblem': inputCustomProblem.value,
                }).toString(),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        sessionStorage.setItem('customProblemId', data.lastInsertedId)
                    } else {
                        alert('Error: ' + data.message);
                    }
                }).then(() => {
                    makeAnAppointment({
                        name: formEntries['name'],
                        age: formEntries['age'],
                        gender: formEntries['gender'],
                        phone: formEntries['phone'],
                        email: formEntries['email'],
                        customProblemId: sessionStorage.getItem('customProblemId'),
                        symptoms: formEntries['symptoms']
                    })

                    // remove customProblemId from session storage
                    if (sessionStorage.getItem('customProblemId')) {
                        sessionStorage.removeItem('customProblemId')
                    }
                })
                .catch(error => {
                    alert('Error: ', error);
                });
        } else {
            makeAnAppointment({
                name: formEntries['name'],
                age: formEntries['age'],
                gender: formEntries['gender'],
                phone: formEntries['phone'],
                email: formEntries['email'],
                problemId: formEntries['problem'],
                symptoms: formEntries['symptoms'],
                doctorByHospitalId: formEntries['doctor'],
                appointmentDate: formEntries['appointmentDate']
            })
        }

        event.target.reset()
    })

    // // Temporary
    // document.querySelectorAll("*").forEach(el => {
    //     el.classList.remove('hide')
    //     el.disabled = false
    // })
})