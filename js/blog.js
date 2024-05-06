import { Helpers } from "./helpers.js";
const loadingOverlay = document.getElementById('loadingOverlay');
const postsContainer = document.querySelector('#blogList')
const data = await Helpers.getPosts().then(x => {
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 900);
    }
    return x
})
const postsArray = data
console.log(data)
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
                            <div class="post-meta gap-2 d-flex flex-column">
                                <p class="post-date">
                                    <time datetime="2022-01-01">${Helpers.formatDate(getDate(post.date_added))}</time>
                                </p>
                            </div>
                        </div>
                    </article>
    `
            postsContainer.append(postElement)
            loadingOverlay.style.display = 'none'
        })
    } else {
        const noPostsElement = document.createElement('div');
        noPostsElement.textContent = 'No blog posts to show.';
        noPostsElement.setAttribute('class', 'alert alert-info w-75 mx-auto');
        postsContainer.appendChild(noPostsElement);
    }
}