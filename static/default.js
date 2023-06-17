document.addEventListener('DOMContentLoaded', () => {
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

    document.querySelector('#problem_known').addEventListener('click', (e) => {
        const problemOption = document.querySelector('#problem');
        problemOption.disabled = false
    })

    document.querySelector('#problem_unknown').addEventListener('click', (e) => {
        const symptomOption = document.querySelector('#symptoms');
        symptomOption.disabled = false;
    })
})