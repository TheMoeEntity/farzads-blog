import { Helpers } from "./helpers.js";
const loadingOverlay = document.getElementById('loadingOverlay');
const postsContainer = document.querySelector('#blogList')
const footerBlog = document.querySelector('#footer-blogs')
const commentsForm = document.querySelector('#contact-form')
const errContainer = document.querySelector('#errors')
const commentsContainer = document.querySelector('#get-comments')
const commentNum = document.querySelector('#comment-num')
const updatePostForm = document.querySelector('#update-post-form')
const title = document.querySelector('#post-title')
const sub_title = document.querySelector('#post-sub')
const author = document.querySelector('#post-author')
const content = document.querySelector('#post-content')
const postImage = document.querySelector('#blog-image')
const publishError = document.querySelector('#publish-error')
let sessionActive = false
const othersContainer = document.querySelector('#others')
let singlePost
function getCookie(name) {
    let cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        let parts = cookie.split("=");
        let cookieName = parts[0].trim();
        let cookieValue = decodeURIComponent(parts[1]);

        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
}
function isAdminLoggedIn() {
    let adminCookie = getCookie("admin");
    return adminCookie !== null && adminCookie === "true";
}
sessionActive = isAdminLoggedIn()
const getOtherPosts = () => {
    const others = postsArray.filter(post => post.id !== id)
    if (others) {
        otherPosts = others
        otherPosts.forEach(post => {
            const postElement = document.createElement('div')
            postElement.setAttribute('class', 'py-3 d-flex flex-column')
            postElement.innerHTML = `
                <span class="text-secondary small mb-2">
                    ${Helpers.formatDate(getDate(post.date_added))}
                </span>
                <h5 class="decoration-underline">
                <u><a href="post.html?id=${post.id}">${post.title}</a></u>
                </h5>
            `

            othersContainer.appendChild(postElement)
        });
    }
}
async function addComment(event) {
    const [isError, formFields] = Helpers.validateFormFields(event, errContainer)
    if (!isError) {
        errContainer.textContent = 'Submitting comment..'
        errContainer.setAttribute('class', 'success')
        const getZeroComments = document.querySelector('#zeroComments')
        await submitPost(formFields.name, formFields.email, formFields.comment, id).then(res => {
            errContainer.textContent = 'Comment submitted successfully'
            setComments(res, commentsContainer, false)
            errContainer.textContent = 'Your comment has been created and will be reviewed by the admin.'
            if (getZeroComments) {
                getZeroComments.textContent = ''
            }
            commentNum.textContent = `${singlePost.comments.length + 1} comment${(singlePost.comments.length + 1) === 1 ? '' : 's'}`
        }).catch(error => {
            errContainer.setAttribute('class', 'error')
            errContainer.textContent = error || 'Something went wrong'
        }).finally(
            setTimeout(() => {
                event.target.reset()
                errContainer.textContent = ''
            }, 3000)
        )
    }
}
export const setComments = (res, container, isAdmin) => {
    const comment = document.createElement('div')
    comment.setAttribute('class', "d-flex flex-column")
    comment.innerHTML = `                               
             <div class="d-flex align-items-center gap-2">
                    <div class="author-bubble">
                        <i class="fas fa-user users"></i>
                    </div>

                    <div class="d-flex flex-column gap-1">
                        <span class="post-author">${res.name}</span>
                        <span class="post-added">
                            ${Helpers.formatDate(getDate(res.date_added))}
                        <span class="mx-1 ${sessionActive && res.status == 0 ? 'pending' : sessionActive && res.status !== 0 ? 'published' : ''}" id="post-status">${res.status == 0 ? 'Pending' : 'Published'}</span>
                        </span>
                    </div>
                </div>
                <p class="post-comment">
                    ${res.comment}
                </p>
                `
    if (!isAdmin) {
        container.appendChild(comment)
    } else if (isAdmin) {
        if (container.firstChild) {
            container.replaceChild(comment, container.firstChild);
        } else {
            container.appendChild(comment);
        }
    }

}
const getSinglePost = async () => {
    const post = await getPost(id).then((x) => x)
    singlePost = post
    if (updatePostForm) {
        let clickedButton = '';
        const submitButtons = updatePostForm.querySelectorAll('button[type="submit"]');
        if (submitButtons) {
            submitButtons.forEach(button => {
                button.addEventListener('click', function (event) {
                    clickedButton = event.target.textContent;
                });
            });
        }
        updatePostForm[0].value = singlePost.author
        updatePostForm[1].value = singlePost.title
        updatePostForm[2].value = post.sub_title
        tinymce.init({
            selector: 'textarea',
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            setup: function (editor) {
                editor.on('init', function () {
                    const content = post.content;
                    editor.setContent(content);
                });
            },
            mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
            ],
            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
        });

        updatePostForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            let shouldPublish = true
            const editorContent = tinymce.activeEditor.getContent();
            console.log(clickedButton)
            if (clickedButton === 'Drafts') {
                console.log(editorContent)
                shouldPublish = false
            }
            const response = await updateAdminPost(1234567890,post.title,post.sub_title,shouldPublish, editorContent).then((x) => x)
            if (response.status && response.status === 'success') {
                publishError.textContent = `Your post has been edited successfully and ${shouldPublish ? 'published' : 'put on pending'}`
                setTimeout(() => {
                    window.location.reload()
                }, 3500);
            } else if (response.status && response.status !== 'success') {
                publishError.textContent = `Something went wrong. Let's give it another shot`
                setTimeout(() => {
                    window.location.reload()
                }, 3500);
            }
        })
    }
}
export const getPosts = async () => {
    const formData = new FormData()
    formData.append('getPosts', '')
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (sessionActive) {
            return data.posts;
        }
        return data.posts.filter(x => x.status == "1")
    } catch (error) {
        console.error(error);
        return [];
    } finally {

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
        const errorMessage = error.message || "An error occured updating comment"
        return errorMessage;
    }
};
export const getPost = async (postid) => {
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
const submitPost = async (name, email, comment, id) => {
    const formData = new FormData()
    formData.append('addComment', id)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('comment', comment)
    formData.append('publish', 0)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/comments', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data)
        return data.comment;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured posting your comment"
        return errorMessage;
    }
};
const data = await getPosts().then(x => {
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 750);
    }
    return x
})
console.log(data)
export const getDate = (date_addeds) => {
    const postDate = date_addeds.split(' ')
    return postDate[0]
}
const postsArray = data
if (postsContainer) {
    if (postsArray.length > 0) {

        postsArray.slice(0, 6).forEach((post) => {
            const postElement = document.createElement('div')
            postElement.setAttribute('class', 'col-xl-4 col-lg-6 col-md-6 blog-card')
            postElement.innerHTML = `
                    <article class="shadow-sm">
                        <h2 class="title">
                            <a href="post.html?id=${post.id}">${post.title}</a>
                        </h2>

                        <div class="d-flex align-items-center">
                            <div class="post-meta gap-2 d-flex flex-column">
                                <div style="font-size:small;" class="text-white p-2 ${sessionActive && post.status == 0 ? 'bg-warning' : sessionActive && post.status !== 0 ? 'bg-success' : 'd-none'}">
                                    <b>${post.status == "0" ? "PENDING" : "PUBLISHED"}</b>
                                </div>
                                <p class="post-date">
                                    <time datetime="2022-01-01">${Helpers.formatDate(getDate(post.date_added))}</time>
                                </p>
                            </div>
                        </div>
                    </article>
    `
            postsContainer.prepend(postElement)
        })
    } else {
        const noPostsElement = document.createElement('div');
        noPostsElement.textContent = 'No posts to show.';
        noPostsElement.setAttribute('class', 'alert alert-info w-75 mx-auto');
        postsContainer.appendChild(noPostsElement);
    }
}
postsArray.slice(0, 3).forEach(post => {
    const list = document.createElement('li')
    list.innerHTML = `
    <strong>
    <a href="/post.html?id=${post.id}">${post.title}</a>
    </strong>
    `
    if (footerBlog) {
        footerBlog.appendChild(list)
    }
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')


await getSinglePost()


const setPost = () => {
    title.textContent = singlePost.title
    sub_title.textContent = singlePost.sub_title
    date_added.textContent = Helpers.formatDate(getDate(singlePost.date_added))
    author.textContent = `By ${singlePost.author}`
    content.innerHTML = singlePost.content
    const firstChiild = content.firstChild
    firstChiild.setAttribute('class', 'article-content px-3 py-2')
    if (singlePost.image) {
        const image = document.createElement('img')
        image.setAttribute('src', singlePost.image)
        image.setAttribute('class', 'img-fluid')
        image.setAttribute('alt', singlePost.title)
        postImage.appendChild(image)
    }
    if (sessionActive) {
        singlePost.comments.forEach(post => {
            setComments(post, commentsContainer, false)
        })
    } else {
        const filteredComments = singlePost.comments.filter(x => x.status == 1)
        if (filteredComments) {
            filteredComments.forEach(post => {
                setComments(post, commentsContainer, false)
            })
        }
    }
    if (singlePost.comments.length === 0) {
        const noComment = `<h3 id='zeroComments'>No comments yet</h3>`
        commentsContainer.innerHTML = noComment;
    }
    document.title = 'Farzad Nosrati | Posts | ' + singlePost.title
    commentNum.textContent = `${singlePost.comments.length} comment${singlePost.comments.length === 1 ? '' : 's'}`


}
if (title) {
    setPost()
}
let otherPosts


if (othersContainer) {
    commentsForm.addEventListener('submit', addComment)
    getOtherPosts()
}
