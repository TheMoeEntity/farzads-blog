import { Helpers } from "./helpers.js";

const form = document.querySelector('#create-post-form')
const submitButtons = form.querySelectorAll('button[type="submit"]');
const publishError = document.querySelector('#publish-error')
const postErr = document.querySelector('#postErrs')
let clickedButton
if (submitButtons) {
    submitButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            clickedButton = event.target.textContent;
        });
    });
}
const createAdminPost = async (uid, title, sub_title, publish, content) => {
    const formData = new FormData()
    formData.append('addPost', uid)
    formData.append('title', title)
    formData.append('sub_title', sub_title)
    formData.append('content', content)
    formData.append('publish', publish === true ? 1 : 0)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured updating comment"
        return errorMessage;
    }
};
const mountTinyMCE = () => {
    return tinymce.init({
        selector: 'textarea',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        setup: function (editor) {
            editor.on('init', function () {
                const content = "<h1>Create a blog post</h1>";
                editor.setContent(content);
            });
        },
        mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
    });
}
window.addEventListener('load', () => {
    mountTinyMCE()
})
form.addEventListener('submit', async (e) => {
    const [isError] = Helpers.validateBlogPostFields(e, postErr)
    let shouldPublish = true
    const editorContent = tinymce.activeEditor.getContent();
    if (clickedButton === 'Drafts') {
        shouldPublish = false
    }
    if (!isError) {        
        const response = await createAdminPost(1234567890, form[1].value, form[2].value, shouldPublish, editorContent).then((x) => x)
        if (response.status && response.status === 'success') {
            publishError.setAttribute('class', 'py-3 text-success')
            publishError.textContent = `Your post has been added successfully and ${shouldPublish ? 'published' : 'put on pending'}`
            location.href = '/admin'
        } else if (response.status && response.status !== 'success') {
            publishError.setAttribute('class', 'py-3 text-danger')
            publishError.textContent = `Something went wrong. Let's give it another shot`
        }
        setTimeout(() => {
            publishError.textContent = ""
        }, 4500);
    }

})