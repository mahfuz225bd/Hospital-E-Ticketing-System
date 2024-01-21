import { Validator, DateValueForHTML, preventDatesToInput, isNumeric } from "./base.js"

document.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.querySelector('#mainForm')
    const problemKnownOption = document.querySelector('#problem_known')
    const problemUnknownOption = document.querySelector('#problem_unknown')
    const selectProblem = document.querySelector('#problem');
    const inputCustomProblem = document.querySelector('#inputCustomProblem')
    const allProblemValues = document.querySelectorAll('output.problemValue');
    const symptoms = document.querySelector('#symptoms');
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

    // Setting attributes value, min, max properties of #appointmentDate
    const todayForHTML = DateValueForHTML.getToday()
    inputAppointmentDate.setAttribute('value', todayForHTML)
    inputAppointmentDate.setAttribute('min', todayForHTML)
    inputAppointmentDate.setAttribute('max', DateValueForHTML.getDateAfterThirtyDays())

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
                    optionElements += `<option value="${problem.id}">${problem.value}</option>`
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

    // To change value to selectProblem from #inputCustomProblem (with replacing _other)
    inputCustomProblem.addEventListener('input', event => {
        selectProblem.selectedOptions[0].value = "Other: " + event.target.value

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

    // To load districts on input #division
    selectDivision.addEventListener('input', event => {
        const divisionId = event.target.selectedOptions[0].getAttribute('value')

        fetch(`/api/districts?divisionId=${divisionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectDistrict.disabled = false
                    selectDistrict.innerHTML = '<option>(নির্বাচন করুন)</option>'
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

        fetch(`/api/hospitals?subdistrictOrThanaId=${subdistrictOrThanaId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectHospital.disabled = false
                    selectHospital.innerHTML = '<option>(নির্বাচন করুন)</option>'
                    data.forEach(each => selectHospital.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                } else {
                    // Get subdistrictOrThanaName with removing count
                    const _subdistrictOrThanaName = subdistrictOrThanaName.split(" ")
                    _subdistrictOrThanaName.pop()

                    alert(`${_subdistrictOrThanaName.join(" ")}-তে কোন হাসপাতাল পাওয়া যায় নি`)
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
                    data.forEach(each => selectDoctor.innerHTML += `<option value=${each.id} data-per-visit-time=${each.perVisitTime}>${each.name}, ${each.speciality}</option>`)
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

    // To configure to show alert if doctor is not available according to specific weeks (iso weeks)
    inputAppointmentDate.addEventListener('input', event => {
        const availableISOWeeks = event.target.dataset.availableIsoWeeks.split(',').map(item => Number(item.trim()));
        const unavailableISOWeeks = Array.from({ length: 7 }, (_, index) => index + 1).filter(num => !availableISOWeeks.includes(num));

        const targetElement = event.target
        preventDatesToInput(targetElement, unavailableISOWeeks)
    })

    // If form#mainForm is submitted
    mainForm.addEventListener('submit', event => {
        event.preventDefault()

        const formData = new FormData(event.target)
        const formEntries = Object.fromEntries(formData.entries())

        const isCustomProblem = selectProblem.value.startsWith("Other: ")

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
                    problemId: isNumeric(data.problemId) ? data.problemId : "",
                    customProblemId: isNumeric(data.customProblemId) ? data.customProblemId : "",
                    symptoms: data.symptoms
                }).toString()
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    // remove session
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
                        .catch(error => {
                            alert("Error: ", error)
                        })
                })
                .catch(error => {
                    alert("Error: ", error);
                });
        }

        // const makeAnAppointment = () => {
        //     fetch('/api/add_patient', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         },
        //         body: new URLSearchParams({
        //             name: formEntries['name'],
        //             age: formEntries['age'],
        //             gender: formEntries['gender'],
        //             phone: formEntries['phone'],
        //             email: formEntries['email'],
        //             problemId: isNumeric(formEntries['problem']) ? formEntries['problem'] : "",
        //             customProblemId: isNumeric(customProblemId) ? customProblemId : "",
        //             symptoms: formEntries['symptoms']
        //         }).toString()
        //     }).then(response => response.json())
        //         .then(data => {
        //             // remove session
        //             if (customProblemId) {
        //                 sessionStorage.removeItem("customProblemId");
        //             }

        //             // fetch to insert appointment with patientId
        //             fetch('/api/make_appointment', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/x-www-form-urlencoded',
        //                 },
        //                 body: new URLSearchParams({
        //                     patientId: data['lastInsertedId'],
        //                     doctorByHospitalId: formEntries['doctor'],
        //                     date: formEntries['appointmentDate']
        //                 }).toString()
        //             }).then(response => response.json())
        //                 .catch(error => {
        //                     alert("Error: ", error)
        //                 })
        //         })
        //         .catch(error => {
        //             alert("Error: ", error);
        //         });
        // }

        event.target.reset()
    })

    // Temporary
    document.querySelectorAll("*").forEach(el => {
        el.classList.remove('hide')
        el.disabled = false
    })
})