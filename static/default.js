document.addEventListener('DOMContentLoaded', () => {
    const selectProblem = document.querySelector('#problem');
    const symptoms = document.querySelector('#symptoms');
    const problemKnownOption = document.querySelector('#problem_known')
    const problemUnknownOption = document.querySelector('#problem_unknown')
    const otherProblemInput = document.querySelector('#otherProblemInput')
    const selectDivision = document.querySelector('#division')
    const selectDistrict = document.querySelector('#district')

    // set focus while loaded the page
    const nameField = document.getElementById("name")
    nameField.focus()

    // Loading divisions to #division
    fetch('/api/divisions')
        .then(res => res.json())
        .then(data => {
            data.forEach(each => selectDivision.innerHTML += `<option value=${each.index}>${each.value} ({Count})</option>`);
        })
        .catch(err => console.error(err))

    problemKnownOption.addEventListener('click', () => {
        selectProblem.style.display = 'block'
        symptoms.style.display = 'none'
    })

    problemUnknownOption.addEventListener('click', () => {
        selectProblem.style.display = 'none'
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

    // Changing value of `problem` while #otherProblemInput is not hidden
    // if (condition) {

    // }

    // Loading districts on input #division
    selectDivision.addEventListener('input', event => {
        let divisionIndex = event.target.selectedOptions[0].getAttribute('value')
        fetch(`/api/districts?divisionIndex=${divisionIndex}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectDistrict.disabled = false
                    selectDistrict.innerHTML = '<option>-- সকল --</option>'
                    data.forEach(each => selectDistrict.innerHTML += `<option value=${each.index}>${each.value} ({Count})</option>`);
                }
            })
    })

})