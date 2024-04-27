import { Helpers } from "./helpers.js";
let currentCommentID = ''
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
const deleteActionBtn = document.querySelector('#deletePostBtn')
const saveToDrafts = document.querySelector('#saveToDrafts')
const publishError = document.querySelector('#publishError')
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
const closBtn = document.querySelector('#closeBtn')
const postErrorDiv = document.querySelector('#post-error')
const openEditor = document.querySelector('#openEditor')

const updateComment = async (uid, id, publish) => {
    const formData = new FormData()
    formData.append('updateComment', id)
    formData.append('uid', uid)
    formData.append('publish', publish === true ? 1 : 0)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/comments', {
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
const approveComment = async (uid, text, commentid) => {
    loadingOverlay.style.display = 'flex';
    const commentStatus = post.comments.find(x => x.id === commentid)
    let willPublish = true
    if (text === 'Publish') {
        if (commentStatus.status === "1") {
            commenter.textContent = "Comment is already published"
            return
        }
    }
    if (text === "Save to drafts") {
        willPublish = false
    }
    const postUpdateStatusBtns = [...(document.querySelectorAll('.postUpdateStatus'))]
    const postUpdateStatus = postUpdateStatusBtns.find(x => x.getAttribute('data-btnID') == commentid)
    const response = await updateComment(uid, commentid, willPublish).then((x) => x)
    if (response.status && response.status === 'success') {
        loadingOverlay.style.display = 'none';
        postUpdateStatus.textContent = `${willPublish ? 'Comment published' : 'Saved to drafts.'}`
        postUpdateStatus.setAttribute('class', willPublish ? 'text-success' : 'text-warning')
        setTimeout(() => {
            window.location.reload()
        }, 3500);
    } else {
        loadingOverlay.style.display = 'none';
        postUpdateStatus.textContent = `Something went wrong.`
        postUpdateStatus.setAttribute('class', 'text-danger')
    }

}
const deleteCommentAction = async (uid, id) => {
    const formData = new FormData()
    formData.append('deleteComment', id)
    formData.append('uid', uid)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/comments', {
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
const deleteComment = async (uid, commentid,) => {
    const response = await deleteCommentAction(uid, commentid).then((x) => x)
    const comment = post.comments.find(x => x.id == commentid)
    if (response.status && response.status === 'success') {
        postErrorDiv.textContent = `${comment.name}'s comments have been deleted successfully.`
        setTimeout(() => {
            window.location.reload()
        }, 750);
    } else if (response.status && response.status !== 'success') {
        postErrorDiv.textContent = `An error occured while trying to delete comments. Try again.`
    }
}
const deleteAdminPost = async (uid, commentid,) => {
    loadingOverlay.style.display = 'flex';
    if (postErrorDiv.textContent == " Are you sure you want to delete this post?") {
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
    } else {
        if (currentCommentID !== '') {
            await deleteComment(1234567890, currentCommentID)
        }
        loadingOverlay.style.display = 'flex';
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
        file_picker_types: 'file image media',
        tinycomments_author: 'Author name',
        images_file_types: 'jpg,svg,webp',
        file_picker_callback: (callback, value, meta) => {
            // Provide file and text for the link dialog
            // if (meta.filetype == 'file') {
            //     callback('mypage.html', { text: 'My text' });
            // }

            // Provide image and alt text for the image dialog
            if (meta.filetype == 'image') {
                const imageInput = document.createElement('input')
                imageInput.type = 'file'
                imageInput.click();
                imageInput.onchange = () => {
                    const file = imageInput.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        callback(e.target.result, { alt: 'My alt text' });
                    }
                    reader.readAsDataURL(file);
                }
                // callback('myimage.jpg', { alt: 'My alt text' });
            }

            // Provide alternative source and posted for the media dialog
            // if (meta.filetype == 'media') {
            //     callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
            // }
        },
        setup: function (editor) {
            // var redoButton = editor.buttons.redo;
            // redoButton.on('click', function () {
            //     content.innerHTML = currentContent
            // });
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
                        <span class="mx-1 ${res.status == 0 ? 'pending' : res.status !== 0 ? 'published' : ''}" id="post-status">${res.status == 0 ? 'Pending' : 'Published'}</span> <br/> </br>
                        <button data-btnID="${res.id}" class="publishbtn" class="mt-3"><b>${res.status == 0 ? 'Publish' : 'Save to drafts'}</b></button>
                         <button data-btnID="${res.id}" class="text-danger commentDelBtn" data-bs-toggle="modal" data-bs-target="#deletePostModal"><b>Delete</b></button>
                         <span data-btnID="${res.id}" class="text-success postUpdateStatus"></span>
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
    const commentDelBtns = document.querySelectorAll('.commentDelBtn')
    commentDelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCommentID = e.target.parentElement.getAttribute('data-btnID')
            postErrorDiv.textContent = "Are you sure you want to delete comment?"
        })
    })
    let shouldPublish = false
    const publishBtn = document.querySelectorAll('.publishbtn')
    publishBtn.forEach(btn => {
        btn.addEventListener('click', async () => {
            const postID = btn.getAttribute('data-btnID')
            await approveComment(1234567890, btn.textContent, postID)
        })
    })
    saveToDrafts.addEventListener('click', async (e) => {
        const textContent = e.target.innerText
        shouldPublish = textContent === 'Save to drafts' ? false : true
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

deleteActionBtn.addEventListener('click', () => {
    postErrorDiv.textContent = "Are you sure you want to delete this post?"
})
deletePostBtn.addEventListener('click', () => {
    deleteAdminPost(1234567890, id)
})
openEditor.addEventListener('click', openTinyEditor)
closBtn.addEventListener('click', closeEditor)
