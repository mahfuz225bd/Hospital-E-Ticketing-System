document.addEventListener('DOMContentLoaded', () => {
    // set focus while loaded the page
    const nameField = document.getElementById("name")
    nameField.focus()

    let hospitals = []

    fetch('/static/data/hospitals.json')
        .then(res => res.text())
        .then(data => {
            const json = JSON.parse(data)
            json.forEach(each => {
                hospitals.push(each)
            });
        }).then(() => {
            // select #division
            const divisionSelect = document.getElementById("division");
            if (divisionSelect) {
                // select #district
                const districtSelect = document.getElementById("district")
                const newData = []
                hospitals.forEach(each => {
                    if (each.division === divisionSelect.value) {
                        console.log(each);
                    }
                })

                // setTimeout(() => {
                //     console.log(newData);
                // });
            }
        })
        .catch(err => console.error(err))

    const selectProblem = document.querySelector('#problem');
    const symptoms = document.querySelector('#symptoms');
    const problemKnownOption = document.querySelector('#problem_known')
    const problemUnknownOption = document.querySelector('#problem_unknown')
    const otherProblemInput = document.querySelector('#otherProblemInput')

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
    if (condition) {
        
    }
})