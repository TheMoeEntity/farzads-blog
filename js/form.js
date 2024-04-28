import { Helpers } from "./helpers.js"
const contactForm = document.querySelector('#contactForm')
const errorMsgs = document.querySelector("#errorMsgs")

const submitForm = (e) => {
    e.preventDefault()
    console.log("Submitting")
    const [isError] = Helpers.validateContactFormFields(e, errorMsgs)
    if (!isError) {
        alert('form submitted')
    }
}
contactForm.addEventListener('submit', submitForm)