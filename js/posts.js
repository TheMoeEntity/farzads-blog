import { Helpers } from "./helpers.js";
const commentsContainer = document.querySelector('#get-comments')
const commentNum = document.querySelector('#comment-num')
const title = document.querySelector('#post-title')
const loadingOverlay = document.getElementById('loadingOverlay');
const sub_title = document.querySelector('#post-sub')
const author = document.querySelector('#post-author')
const content = document.querySelector('#post-content')
const postImage = document.querySelector('#blog-image')
const editorForm = document.querySelector("#wysiwyg-form")
const queryString = window.location.search;
const editor = document.querySelector('#editor')
const othersContainer = document.querySelector('#others')
const deletePostBtn = document.querySelector('#deleteBtn')
const saveToDrafts = document.querySelector('#saveToDrafts')
const publishError = document.querySelector('#publishError')
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
const closBtn = document.querySelector('#closeBtn')
const postErrorDiv = document.querySelector('#post-error')
const openEditor = document.querySelector('#openEditor')

const deleteAdminPost = async (uid, commentid,) => {
    loadingOverlay.style.display = 'flex';
    const response = await delAdminPost(uid, commentid).then((x) => x)
    if (response.status && response.status === 'success') {
        loadingOverlay.style.display = 'none';
        postErrorDiv.setAttribute('class', 'modal-body text-success')
        postErrorDiv.textContent = `Post has been deleted successfully`
        setTimeout(() => {
            window.location = '/admin'
        }, 4500);
    } else if (response.status && response.status !== 'success') {
        loadingOverlay.style.display = 'none';
        postErrorDiv.setAttribute('class', 'modal-body text-danger')
        postErrorDiv.textContent = `An error occured while trying to delete Post. Try again.`
    }
}
const delAdminPost = async (uid, id) => {
    const formData = new FormData()
    formData.append('deletePost', id)
    formData.append('uid', uid)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured while deleting post"
        return errorMessage;
    }
};
const updateAdminPost = async (uid, title, sub_title, publish, content) => {
    const formData = new FormData()
    formData.append('editPost', id)
    formData.append('uid', uid)
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
        const errorMessage = error.message || "An error occured updating Post"
        return errorMessage;
    }
};
const mountTinyMCE = (contentToSet) => {
    return tinymce.init({
        selector: '#editWysiwyg',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        setup: function (editor) {
            editor.on('init', function () {

                editor.setContent(contentToSet);
            });
            editor.on('input', () => {
                const currentContent = editor.getContent();
                content.innerHTML = currentContent
            })
            editor.on('change', () => {
                const currentContent = editor.getContent();
                content.innerHTML = currentContent
            })
        },
        mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
    });
}

export const setComments = (res, container) => {
    const comment = document.createElement('div')
    comment.setAttribute('class', "d-flex flex-column")
    comment.innerHTML = `                               
             <div class="d-flex align-items-center gap-2">
                    <div class="author-bubble">
                        <i class="fas fa-user users"></i>
                    </div>

                    <div class="d-flex flex-column gap-3 gap-md-1">
                        <span class="post-author">${res.name}</span>
                        <span class="post-added">
                            ${Helpers.formatDate(getDate(res.date_added))}
                        <span class="mx-1 ${res.status == 0 ? 'pending' : res.status !== 0 ? 'published' : ''}" id="post-status">${res.status == 0 ? 'Pending' : 'Published'}</span> <br/>
                        <button  class="publishbtn mt-3"><b>${res.status == 0 ? 'Publish' : 'Save to drafts'}</b></button>
                         <button class="publishbtn text-danger"><b>Delete</b></button>
                        </span>
                        <span>
                        </span>
                    </div>
                </div>
                <p class="post-comment">
                    ${res.comment}
                </p>
                `
    container.appendChild(comment)


}

export const getDate = (date_addeds) => {
    const postDate = date_addeds.split(' ')
    return postDate[0]
}
const getOtherPosts = async () => {
    const postsArray = await Helpers.getPosts().then(x => x).catch(() => [])
    const others = postsArray.filter(post => post.id !== id)
    if (others) {
        others.forEach(post => {
            const postElement = document.createElement('div')
            postElement.setAttribute('class', 'py-3 d-flex flex-column')
            postElement.innerHTML = `
                <span class="text-secondary small mb-2">
                    ${Helpers.formatDate(getDate(post.date_added))}
                </span>
                <h5 class="decoration-underline">
                <b>
                <u><a class="text-dark" href="post.html?id=${post.id}">${post.title}</a></u>
                <b>
                </h5>
            `
            othersContainer.appendChild(postElement)
        });
    }
}

const getPost = async (postid) => {
    const formData = new FormData()
    formData.append('getPost', postid)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data.post;
    } catch (error) {
        console.error(error);
        return [];
    }
};
const post = await getPost(id).then(x => {
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 800);
    return x
})
const closeEditor = () => {
    editor.style.bottom = '-100%'
}
const setPost = () => {
    title.textContent = post.title
    sub_title.textContent = post.sub_title
    date_added.textContent = Helpers.formatDate(getDate(post.date_added))
    author.textContent = `By ${post.author}`
    content.innerHTML = post.content
    mountTinyMCE(post.content)
    saveToDrafts.textContent = post.status == 0 ? 'Publish' : 'Save to drafts'
    saveToDrafts.setAttribute('class', post.status == 1 ? 'actionbtn text-warning' : 'actionbtn text-success')
    editorForm[0].value = post.title
    editorForm[1].value = post.sub_title
    const firstChiild = content.firstChild
    firstChiild.setAttribute('class', 'article-content px-3 py-2')
    if (post.image) {
        const image = document.createElement('img')
        image.setAttribute('src', post.image)
        image.setAttribute('class', 'img-fluid')
        image.setAttribute('alt', post.title)
        postImage.appendChild(image)
    }
    if (post.comments.length === 0) {
        const noComment = `<h3 id='zeroComments'>No comments yet</h3>`
        commentsContainer.innerHTML = noComment;
    }
    document.title = 'Farzad Nosrati | Posts | ' + post.title
    commentNum.textContent = `${post.comments.length} comment${post.comments.length === 1 ? '' : 's'}`
    post.comments.forEach(x => {
        setComments(x, commentsContainer)
    })
    let shouldPublish = false
    saveToDrafts.addEventListener('click', async (e) => {
        const textContent = e.target.innerText
        shouldPublish = textContent === 'Save to drafts' ? false : true
        console.log(shouldPublish)
        loadingOverlay.style.display = 'flex';
        const response = await updateAdminPost(1234567890, post.title, post.sub_title, shouldPublish, post.content).then((x) => x)
        if (response.status && response.status === 'success') {
            loadingOverlay.style.display = 'none';
            publishError.textContent = `${shouldPublish ? 'Post published.' : 'Saved to drafts.'}`
            publishError.setAttribute('class', post.status == 1 ? 'actionbtn text-warning' : 'actionbtn text-success')
        } else if (response.status && response.status !== 'success') {
            publishError.setAttribute('class', post.status == 1 ? 'actionbtn text-warning' : 'actionbtn text-success')
            publishError.textContent = `Something went wrong. Let's give it another shot`
            loadingOverlay.style.display = 'none';
        }
        setTimeout(() => {
            publishError.textContent = ""
            window.location.reload()
        }, 4500);
    })
}
const openTinyEditor = () => {
    editor.style.bottom = '0'
}
if (post) {
    getOtherPosts()
    setPost()
}
deletePostBtn.addEventListener('click', () => {
    deleteAdminPost(1234567890, id)
})
openEditor.addEventListener('click', openTinyEditor)
closBtn.addEventListener('click', closeEditor)
