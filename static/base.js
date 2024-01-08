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

export { Validator };