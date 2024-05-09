import { Helpers } from "./helpers.js";
const loadingOverlay = document.getElementById('loadingOverlay');
const postsContainer = document.querySelector('#blogList2')
const footerBlog = document.querySelector('#footer-blogs2')
const data = await Helpers.getPosts().then(x => {
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 400);
    }
    return x.filter(post => post.status == 1)
})
const postsArray = data
if (postsContainer) {
    if (postsArray.length > 0) {
        postsArray.forEach((post) => {
            const postElement = document.createElement('div')
            postElement.setAttribute('class', 'col-xl-4 col-lg-6 col-md-6 blog-card')
            postElement.innerHTML = `
                    <article class="shadow-sm">
                        <h2 class="title">
                            <a href="/post.html?id=${post.id}">${post.title}</a>
                        </h2>

                        <div class="d-flex align-items-center">
                            <div class="post-meta gap-2 d-flex flex-column">
                                <p class="post-date">
                                    <time datetime="2022-01-01">${Helpers.formatDate(Helpers.getDate(post.date_added))}</time>
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