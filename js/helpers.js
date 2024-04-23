export class Helpers {
    static formatDate = (date) => {
        const format = date.split('-')
        let month = format[1]
        switch (month) {
            case '01':
                month = "January"
                break;
            case '02':
                month = "February"
                break;
            case '03':
                month = "March"
                break;
            case '04':
                month = "April"
                break;
            case '05':
                month = "May"
                break;
            case '06':
                month = "June"
                break;
            case '07':
                month = "July"
                break;
            case '08':
                month = "August"
                break;
            case '09':
                month = "September"
                break;
            case '10':
                month = "October"
                break;
            case '11':
                month = "November"
                break;
            case '12':
                month = "Decemeber"
                break;

            default:
                break;
        }
        return `${month} ${format[2]}, ${format[0]}`
    }
    static validateEmail = (email) => {

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        }
        return false
    }
    static validateFormFields = (event, errMessage) => {
        event.preventDefault()
        const name = event.target[0].value
        const email = event.target[1].value
        const comment = event.target[2].value
        let isError = false
        const validEmail = this.validateEmail(email)
        if (name.trim() === '') {
            errMessage.textContent = 'Name cannot be empty'
            errMessage.setAttribute('class', 'error')
            isError = true
        } else if (!validEmail) {
            errMessage.textContent = 'Enter a valid email'
            errMessage.setAttribute('class', 'error')
            isError = true
        } else if (comment.trim() === '' || comment.length < 10) {
            errMessage.textContent = 'Comment cannot be empty or less than 10 characters'
            errMessage.setAttribute('class', 'error')
            isError = true
        }
        const formFields = { name, email, comment }
        return [isError, formFields]

    }
}