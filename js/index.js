import { Helpers } from "./helpers.js";
const loadingOverlay = document.getElementById('loadingOverlay');
const postsContainer = document.querySelector('#blogList')
const footerBlog = document.querySelector('#footer-blogs')
const commentsForm = document.querySelector('#contact-form')
const errContainer = document.querySelector('#errors')
const commentsContainer = document.querySelector('#get-comments')
const commentNum = document.querySelector('#comment-num')
const setComments = (res) => {
    const comment = document.createElement('div')
    comment.setAttribute('class', "d-flex flex-column")
    comment.innerHTML = `                               
             <div class="d-flex align-items-center gap-2">
                    <div class="author-bubble">
                        <i class="fas fa-user users"></i>
                    </div>

                    <div class="d-flex flex-column gap-1">
                        <span class="post-author">${res.name}</span>
                        <span class="post-added text-dark">${res.email}</span>
                        <span class="post-added">
                            ${Helpers.formatDate(getDate(res.date_added))}
                            <span class="mx-1 ${res.status == 0 ? 'pending' : 'published'}" id="post-status">${res.status == 0 ? 'Pending' : 'Published'}</span>
                        </span>
                    </div>
                </div>
                <p class="post-comment">
                    ${res.comment}
                </p>
                `
    commentsContainer.appendChild(
        comment
    )
}
const getPosts = async () => {
    const formData = new FormData()
    formData.append('getPosts', '')
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error(error);
        return [];
    } finally {

    }


};
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
const getDate = (date_addeds) => {
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
                            <div class="post-meta">
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
    footerBlog.appendChild(list)
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
let singlePost
const getSinglePost = async () => {
    const post = await getPost(id).then((x) => x)
    singlePost = post
}
await getSinglePost()
const title = document.querySelector('#post-title')
const sub_title = document.querySelector('#post-sub')
const author = document.querySelector('#post-author')
const content = document.querySelector('#post-content')
const postImage = document.querySelector('#blog-image')

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
    singlePost.comments.forEach(post => {
        setComments(post)
    })
    if (singlePost.comments.length === 0) {
        const noComment = `<h3 id='zeroComments'>No comments yet</h3>`
        commentsContainer.innerHTML = noComment;
    }
    commentNum.textContent = `${singlePost.comments.length} comment${singlePost.comments.length === 1 ? '' : 's'}`


}
if (title) {
    setPost()
}
let otherPosts
const othersContainer = document.querySelector('#others')
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
            setComments(res)
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

if (othersContainer) {
    commentsForm.addEventListener('submit', addComment)
    getOtherPosts()
}
