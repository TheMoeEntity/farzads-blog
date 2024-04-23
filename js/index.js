import { Helpers } from "./helpers.js";
const postsContainer = document.querySelector('#blogList')
const footerBlog = document.querySelector('#footer-blogs')
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
    }
};
const data = await getPosts()
console.log(data)
const getDate = (date_addeds) => {
    const postDate = date_addeds.split(' ')
    return postDate[0]
}
const postsArray = data
if (postsContainer) {
    if (postsArray.length > 0) {

        postsArray.forEach((post) => {
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
postsArray.slice(0,3).forEach(post => {
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
const getSinglePost = () => {
    const post = postsArray.find(post => post.id == id)
    singlePost = post
}
getSinglePost()
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
if (othersContainer) {
    getOtherPosts()
}