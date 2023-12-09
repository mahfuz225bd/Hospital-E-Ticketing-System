document.addEventListener('DOMContentLoaded', () => {
    const nameField = document.querySelector("#name")
    const selectProblem = document.querySelector('#problem');
    const symptoms = document.querySelector('#symptoms');
    const problemKnownOption = document.querySelector('#problem_known')
    const problemUnknownOption = document.querySelector('#problem_unknown')
    const otherProblemInput = document.querySelector('#otherProblemInput')
    const selectDivision = document.querySelector('#division')
    const selectDistrict = document.querySelector('#district')
    const selectSubdistrictOrThana = document.querySelector('#subdistrictOrThana')
    const selectHospital = document.querySelector('#hospital')
    const selectDoctor = document.querySelector('#doctor')

    // /* For TODO: changing text for output.hospitalNameValue + output.problemValue
    //    Remarks: Not Working */

    // const setAllHospitalNameValues = (value) => {
    //     const hospitalNameValueAll = document.querySelectorAll('output.hospitalNameValue')
    //     for (let i = 0; i < hospitalNameValueAll.length; i++) {
    //         hospitalNameValue[i] = value
    //     }
    // }
    // const setAllProblemValues = (value) => {
    //     const problemValueAll = document.querySelectorAll('output.problemValue')
    //     setTimeout(() => {
    //         for (let i = 0; i < problemValueAll.length; i++) {
    //             problemValueAll[i] = value
    //         }
    //     });
    // }

    // set focus while loaded the page
    setTimeout(() => {
        problemKnownOption.click()
    });
    nameField.focus()

    problemKnownOption.addEventListener('click', () => {
        selectProblem.style.display = 'block'
        symptoms.style.display = 'none'

        if (selectProblem.value === '_other') {
            otherProblemInput.style.display = 'block'
        }
    })

    problemUnknownOption.addEventListener('click', () => {
        selectProblem.style.display = 'none'
        otherProblemInput.style.display = 'none'
        symptoms.style.display = 'block'
    })

    // For other option input
    selectProblem.addEventListener('input', (e) => {
        if (e.target.value === '_other') {
            otherProblemInput.style.display = 'block'
        } else {
            otherProblemInput.style.display = 'none'
        }
    })

    // Loading divisions to #division
    fetch('/api/divisions')
        .then(res => res.json())
        .then(data => {
            data.forEach(each => selectDivision.innerHTML += `<option value=${each.id}>${each.value}</option>`);
        })
        .catch(err => console.error(err))

    // Loading districts on input #division
    selectDivision.addEventListener('input', event => {
        const divisionId = event.target.selectedOptions[0].getAttribute('value')

        fetch(`/api/districts?divisionId=${divisionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectDistrict.disabled = false
                    selectDistrict.innerHTML = '<option>-- সকল --</option>'
                    data.forEach(each => selectDistrict.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                }
            })
            .catch(err => console.error(err))
    })

    // Loading sub-district and thanas on input #district
    selectDistrict.addEventListener('input', event => {
        const districtId = event.target.selectedOptions[0].getAttribute('value')

        fetch(`/api/subdistrictAndThanas?districtId=${districtId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectSubdistrictOrThana.disabled = false
                    selectSubdistrictOrThana.innerHTML = '<option>-- সকল --</option>'
                    data.forEach(each => selectSubdistrictOrThana.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                }
            })
            .catch(err => console.error(err))
    })

    // Loading hospitals on input #subdistrictOrThana
    selectSubdistrictOrThana.addEventListener('input', event => {
        const subdistrictOrThanaId = event.target.selectedOptions[0].getAttribute('value')
        const subdistrictOrThanaName = event.target.selectedOptions[0].innerText

        fetch(`/api/hospitals?subdistrictOrThanaId=${subdistrictOrThanaId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectHospital.disabled = false
                    selectHospital.innerHTML = '<option>-- নির্বাচন করুন --</option>'
                    data.forEach(each => selectHospital.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                } else {
                    alert(`${subdistrictOrThanaName}-তে কোন হাসপাতাল পাওয়া যায় নি`)
                }
            })
            .catch(err => console.error(err))
    })

    // Loading doctors on input #hospital
    selectHospital.addEventListener('input', event => {
        const hospitalId = event.target.selectedOptions[0].getAttribute('value')

        fetch(`/api/doctors?hospitalId=${hospitalId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectDoctor.disabled = false
                    selectDoctor.innerHTML = '<option>-- নির্বাচন করুন --</option>'
                    data.forEach(each => selectDoctor.innerHTML += `<option value=${each.id}>${each.name}, ${each.speciality}</option>`)
                }
            })
            .catch(err => console.error(err))
    })

    // Change values of all output.problemValue
    selectProblem.addEventListener('input', event => {
        const selectedProblemValue = event.target.selectedOptions[0].innerText
        document.querySelectorAll('output.problemValue').forEach(each => {
            each.innerText = selectedProblemValue
        })
    })

    // Change values of all output.problemValue
    selectHospital.addEventListener('input', event => {
        const selectedHospitalValue = event.target.selectedOptions[0].innerText
        document.querySelectorAll('output.hospitalNameValue').forEach(each => {
            each.innerText = selectedHospitalValue
        })
    })

})