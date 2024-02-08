class Validator {
    constructor(value) {
        this.value = value
    }

    isEmpty() {
        return this.value === undefined || this.value === null || this.value.length === 0
    }

    isNotEmpty() {
        return !this.isEmpty()
    }

    isNumeric() {
        return !isNaN(this.value)
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

    isHTMLDate() {
        const htmlDateRegExp = /\b\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b/
        return htmlDateRegExp.test(this.value)
    }

    isToday() {
        const today = new Date();
        const d = new Date(this.value);
        return today.getFullYear() === d.getFullYear() &&
            today.getMonth() + 1 === d.getMonth() &&
            today.getDate() === d.getDate();
    }

    isWithinThirtyDaysFromToday() {
        const dateOne = new Date(this.value);
        const dateTwo = new Date();
        const Difference_In_Time = dateTwo - dateOne;

        // convert time into days
        const Difference_In_Days = Difference_In_Time / (1 * (1000 * 60 * 60 * 24));

        return Difference_In_Days <= 30;
    }

    isOneOf(valuesToCheck) {
        if (!Array.isArray(valuesToCheck)) throw Error('Argument should be an array');
        return valuesToCheck.includes(this.value)
    }

    isNot(newValue) {
        return this.value !== newValue
    }
}

const DateValueForHTML = {
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

const preventDatesToInput = (inputElement, ISODaysNosToPrevent) => {
    const UTCDay = new Date(inputElement.value).getUTCDay();

    // Convert 0 (Sunday) to 7 for adjustment with ISO days
    const ISODay = UTCDay === 0 ? 7 : UTCDay;

    const ISOWeekdays = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday'
    };

    if (ISODaysNosToPrevent.includes(ISODay)) {
        alert(ISOWeekdays[ISODay] + ' is not available.');
        inputElement.value = ''
    }
};

class CompareParagraphs {
    constructor(inputParagraph, targetToCompare) {
        this.inputParagraph = inputParagraph
        this.targetToCompare = targetToCompare
    }

    getCountObject() {
        const removePunctuations = (myStr) => {
            const punctuations = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
            return myStr
                .split('')
                .filter(char => !punctuations.includes(char))
                .join('');
        };

        const myInputKeywords = removePunctuations(myInput.toLowerCase()).split(' ');
        const targetStrKeywords = removePunctuations(targetStr.toLowerCase()).split(' ');

        const matches = {};

        targetStrKeywords.forEach((keyword) => {
            if (myInputKeywords.includes(keyword)) {
                matches[keyword] = targetStrKeywords.filter(kw => kw === keyword).length;
            }
        });

        return matches;
    }

    countMatchedWords() {
        const countObj = this.getCountObject()
        return countObj.length
    }

    countTotalWords() {
        const countObj = this.getCountObject()
        let total = 0;

        for (let key in countObj) {
            total += countObj[key];
        }

        return total
    }
}

class SlideForm {
    #elements;
    #indicatorLi;
    #currentSlideNo;

    constructor(slideElementsClassName, indicatorUlElementClassName) {
        this.#elements = document.getElementsByClassName(slideElementsClassName);
        this.#indicatorLi = document.querySelectorAll(`ul.${indicatorUlElementClassName} li`);
        this.#currentSlideNo = 1;
    }

    count() {
        return this.#elements.length
    }

    getSlideNo() {
        return this.#currentSlideNo;
    }

    setSlideNo(n) {
        this.#currentSlideNo = n;
    }

    show() {
        const currentSlideNo = this.getSlideNo()
        
        const slides = this.#elements
        const indicatorLi = this.#indicatorLi

        let i;
        if (currentSlideNo > this.count()) { this.setSlideNo(1) }
        if (currentSlideNo < 1) { this.setSlideNo(currentSlideNo) }

        for (i = 0; i < this.count(); i++) {
            slides[i].style.display = "none";
            indicatorLi[i].style.color = "initial";
        }

        slides[currentSlideNo - 1].style.display = "block";
        indicatorLi[currentSlideNo - 1].style.color = '#04AA6D';
    }

    next() {
        const currentSlideNo = this.getSlideNo()

        if (currentSlideNo < this.count()) {
            this.setSlideNo(currentSlideNo + 1)
            this.show(currentSlideNo)
        } else {
            alert("Not available")
        }
    }

    prev() {
        const currentSlideNo = this.getSlideNo()

        if (currentSlideNo > 1) {
            this.setSlideNo(currentSlideNo - 1)
            this.show(currentSlideNo)
        } else {
            alert("Not available")
        }
    }
}

export { Validator, DateValueForHTML, preventDatesToInput, CompareParagraphs, SlideForm };