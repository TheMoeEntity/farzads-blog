import { Helpers } from "./helpers.js"
const contactForm = document.querySelector('#contactForm')
const reserveForm = document.querySelector('#reserveForm')
const errorMsgs = document.querySelector("#errorMsgs")
const errorMsgs2 = document.querySelector("#errorMsgs2")
const modalBackground = document.querySelector('#modal-background')
const reserveCopyDiv = document.querySelector('#reserveCopy')
const callBack22 = async (recaptchaResponse) => {
    const name = reserveForm[0].value;
    const email = reserveForm[1].value;
    const phone = reserveForm[2].value;
    const address = reserveForm[3].value;
    const message = reserveForm[4].value;

    const formFields = { name, email, phone, address, message };
    await reserveCopy();
}
const widgetId2 = grecaptcha.render('recaptcha2', {
    'sitekey': '6Lffn8opAAAAAMv9AEWbiuPA6UVRaDILxLTPO3II',
    'callback': callBack22 // Ensure you pass the correct callback function
});
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
const postReserveCopy = async (contactFormFields) => {
    const formData = new FormData()
    const to = 'moseschukwudinwigberi@gmail.com'
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
            errorMsgs.text = "Please complete the reCAPTCHA."
            errorMsgs.setAttribute('class', 'error')
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
const reserveCopy = async (e) => {
    const [isError, contactFormFields] = Helpers.validateReserveFormFields(e, errorMsgs2)
    if (!isError) {
        const recapchaResponse = grecaptcha.getResponse(widgetId2)
        if (!recapchaResponse || recapchaResponse == '') {
            errorMsgs2.textContent = "Please complete the reCAPTCHA."
            errorMsgs2.setAttribute('class', 'text-danger py-2')
            return false
        } else {
            const response = await postReserveCopy(contactFormFields).then(x => x)
            if (response.status == 'success') {
                errorMsgs2.textContent = "Your reservation request has been successfully submitted. Thank you for your interest in our book! We will process your request shortly."
                errorMsgs2.setAttribute('class', 'text-success py-2')
                setTimeout(() => {
                    errorMsgs2.textContent = ""
                    errorMsgs2.setAttribute('class', 'py-2')
                    e.target.reset()
                    reserveCopyDiv.style.display = 'none'
                }, 3000)
            } else if (response.status !== 'success') {
                errorMsgs2.textContent = "Oops! Something went wrong while processing your reservation request. Please try again later or contact us for assistance."
                errorMsgs2.setAttribute('class', 'text-danger py-2')
            } else {
                const errMessage = response.catch(x => x)
                errorMsgs2.setAttribute('class', 'text-danger py-2')
                errorMsgs2.textContent = errMessage || "Something went wrong while making reservation request"

            }
        }
    }
}
contactForm.addEventListener('submit', submitForm)
reserveForm.addEventListener('submit', reserveCopy)

window.handleRecaptchaCallback = () => {
    submitForm();
}
