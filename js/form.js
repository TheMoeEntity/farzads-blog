import { Helpers } from "./helpers.js"
const contactForm = document.querySelector('#contactForm')
const reserveForm = document.querySelector('#reserveForm')
const errorMsgs = document.querySelector("#errorMsgs")
const modalBackground = document.querySelector('#modal-background')

const submitMessage = async (contactFormFields) => {
    const formData = new FormData()
    const to = 'sykik09@gmail.com'
    formData.append('sendTo', to)
    formData.append('name', contactFormFields.name)
    formData.append('email', contactFormFields.email)
    formData.append('phone', contactFormFields.phone)
    formData.append('message', contactFormFields.message)

    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/send', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured while sending message. Try again."
        return errorMessage;
    }
};
const reserveCopy = async (contactFormFields) => {
    const formData = new FormData()
    const to = 'sykik09@gmail.com'
    formData.append('sendTo', to)
    formData.append('name', contactFormFields.name)
    formData.append('reserve', contactFormFields.email)
    formData.append('phone', contactFormFields.phone)
    formData.append('address', contactFormFields.address)
    formData.append('message', contactFormFields.message)

    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/send', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured while sending message. Try again."
        return errorMessage;
    }
}
const submitForm = async (e) => {
    const [isError, contactFormFields] = Helpers.validateContactFormFields(e, errorMsgs)
    if (!isError) {
        const recapchaResponse = grecaptcha.getResponse()
        if (!recapchaResponse || recapchaResponse == '') {
            errorMsgs = "Please complete the reCAPTCHA."
            return false
        } else {
            const response = await submitMessage(contactFormFields).then(x => x)
            if (response.status == 'success') {
                errorMsgs.textContent = "Your message has been sent successfully"
                errorMsgs.setAttribute('class', 'text-success py-2')
                setTimeout(() => {
                    errorMsgs.textContent = ""
                    errorMsgs.setAttribute('class', 'py-2')
                    e.target.reset()
                    modalBackground.style.display = 'none'
                }, 3000)
            } else if (response.status !== 'success') {
                errorMsgs.textContent = "Something went wrong while sending message"
                errorMsgs.setAttribute('class', 'text-danger py-2')
            } else {
                const errMessage = response.catch(x => x)
                errorMsgs.setAttribute('class', 'text-danger py-2')
                errorMsgs.textContent = errMessage || "Something went wrong while sending message"

            }
        }
    }
}
contactForm.addEventListener('submit', submitForm)
reserveForm.addEventListener('submit', submitForm)

window.handleRecaptchaCallback = () => {
    submitForm();
}