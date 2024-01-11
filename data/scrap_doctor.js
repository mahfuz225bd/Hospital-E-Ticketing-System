// Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPhoneNumber() {
    const prefixes = ['017', '019', '015', '014', '013', '018'];
    const selectedPrefix = prefixes[getRandomInt(0, prefixes.length - 1)];

    // Generate the remaining 8 digits
    const remainingDigits = getRandomInt(1e8, 9e8 - 1);

    // Concatenate the prefix and remaining digits
    const phoneNumber = selectedPrefix + remainingDigits;

    return phoneNumber;
}

function generateRandomDOB(minAge, maxAge) {
    const currentYear = new Date().getFullYear();

    const randomAge = getRandomInt(minAge, maxAge);
    const birthYear = currentYear - randomAge;

    // Random month and day
    const birthMonth = getRandomInt(1, 12);
    const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
    const birthDay = getRandomInt(1, daysInMonth);

    // Format the date of birth
    const formattedDOB = `${birthYear}-${(birthMonth < 10 ? '0' : '') + birthMonth}-${(birthDay < 10 ? '0' : '') + birthDay}`;

    return formattedDOB;
}
function doesDoctorExist(doctorsArray, targetDoctor) {
    if (doctorsArray && Array.isArray(doctorsArray)) {
        return doctorsArray.some(function (doctor) {
            const name_enMatch = doctor.name_en === targetDoctor.name_en;
            const name_bnMatch = doctor.name_bn === targetDoctor.name_bn;
            const degreeMatch = doctor.degree === targetDoctor.degree;
            const specialityMatch = doctor.speciality === targetDoctor.speciality;
            const designationMatch = doctor.designation === targetDoctor.designation;

            // Check if any of the individual properties match
            return (
                name_enMatch &&
                name_bnMatch &&
                degreeMatch &&
                specialityMatch &&
                designationMatch
            );
        });
    } else {
        console.error("Invalid array input");
        return false;
    }
}

doctors = []

// Scrap and push to doctors
document.querySelectorAll('ul.doctors>li').forEach(e => {
    const doctor = {
        name_en: e.querySelector('h3.title a').innerText,
        name_bn: '',
        degree: e.querySelectorAll('ul li')[0].innerText,
        speciality: e.querySelectorAll('ul li')[1].innerText,
        designation: e.querySelectorAll('ul li')[2].innerText,
        dob: generateRandomDOB(30, 75),
        phone_number_1: generateRandomPhoneNumber(),
        phone_number_2: [generateRandomPhoneNumber(), ''][Math.round(Math.random())]
    }

    if (!doesDoctorExist(doctors, doctor)) {
        doctors.push(doctor)
    }
})

// Scrap and push to doctors, if table table.doctors exists
if (document.querySelector('table.doctors')) {
    document.querySelectorAll('table.doctors tbody>tr').forEach(e => {
        const doctor = {
            name_en: e.querySelector('strong').innerText,
            name_bn: '',
            degree: '',
            speciality: e.querySelectorAll('td')[1].innerText,
            designation: '',
            dob: generateRandomDOB(30, 75),
            phone_number_1: generateRandomPhoneNumber(),
            phone_number_2: [generateRandomPhoneNumber(), ''][Math.round(Math.random())]
        }

        if (!doesDoctorExist(doctors, doctor)) {
            doctors.push(doctor)
        }
    })
}

// Copying doctors
copy(doctors)