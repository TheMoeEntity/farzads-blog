import { Helpers } from "./helpers.js"
const contactForm = document.querySelector('#contactForm')
const errorMsgs = document.querySelector("#errorMsgs")

const submitForm = (e) => {
    e.preventDefault()
    const [isError] = Helpers.validateContactFormFields(e, errorMsgs)
    if (!isError) {
        const recapchaResponse = grecaptcha.getResponse()
        if (!recapchaResponse || recapchaResponse == '') {
            errorMsgs = "Please complete the reCAPTCHA."
            return false
        } else {
            console.log(recapchaResponse)
        }
    }
}
contactForm.addEventListener('submit', submitForm)

window.handleRecaptchaCallback = function () {
    submitForm();
}