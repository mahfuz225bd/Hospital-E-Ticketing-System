class Validator {
    constructor(value) {
        this.value = value
    }

    isNotEmpty() {
        return !(this.value === undefined || this.value === null || this.value.length === 0)
    }

    isAge() {
        const ageRegExp = /^[1-9][0-9]{0,2}$/
        return ageRegExp.test(this.value)
    }

    isBDMobileNumberWithoutCountryCode() {
        const bdNumberRegExp = /(013|014|015|016|017|018|019)[0-9]{8}/;
        return bdNumberRegExp.test(this.value);
    }

    isEmail() {
        const emailRegExp = /\S+@\S+\.\S{2,3}/
        return emailRegExp.test(this.value)
    }
}

const DateForHTML = {
    getToday: () => {
        const dateObj = new Date();
        const month = dateObj.getMonth() + 1,
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        const dateString = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`

        return dateString;
    },
    getDateAfterThirtyDays: () => {
        const today = new Date();
        const future_date = new Date();
        future_date.setDate(today.getDate() + 30);

        const month = future_date.getMonth() + 1,
            day = future_date.getDate(),
            year = future_date.getFullYear();

        const dateString = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`

        return dateString;
    }
}

export { Validator, DateForHTML };