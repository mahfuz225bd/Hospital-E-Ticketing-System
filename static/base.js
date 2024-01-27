class Validator {
    constructor(value) {
        this.value = value
    }

    isNotEmpty() {
        return !(this.value === undefined || this.value === null || this.value.length === 0)
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

    isToday() {
        let today = new Date();
        let d = new Date(this.value);
        return today.getFullYear() === d.getFullYear() &&
            today.getMonth() + 1 === d.getMonth() &&
            today.getDate() === d.getDate();
    }

    isWithinThirtyDaysFromToday() {
        var dateOne = new Date(this.value);
        var dateTwo = new Date();
        var Difference_In_Time = dateTwo - dateOne;

        // convert time into days
        var Difference_In_Days = Difference_In_Time / (1 *
            (1000 * 60 * 60 * 24));

        return Difference_In_Days <= 30;
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

const isNumeric = (value) => {
    return !isNaN(value)
}

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

export { Validator, DateValueForHTML, preventDatesToInput, isNumeric, CompareParagraphs };