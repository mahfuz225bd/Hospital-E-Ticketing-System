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

                setTimeout(() => {
                    console.log(newData);
                });
            }
        })
        .catch(err => console.error(err))

    const problemOption = document.querySelector('#problem');
    const symptomOption = document.querySelector('#symptoms');
    const problemKnown = document.querySelector('#problem_known')
    const problemUnknown = document.querySelector('#problem_unknown')

    problemKnown.addEventListener('click', () => {
        problemOption.disabled = false
        symptomOption.disabled = true
    })

    problemUnknown.addEventListener('click', () => {
        problemOption.disabled = true
        symptomOption.disabled = false;
    })
})