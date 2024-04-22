const postsContainer = document.querySelector('#blogList')
const getPosts = async () => {
    const formData = new FormData()
    formData.append('getPosts', '')
    try {
        const response = await fetch('https://ikennaibe.com/farzad/posts', {
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
const postsArray = data
if (postsArray.length > 0) {

    postsArray.forEach(post => {
        const postElement = document.createElement('div')
        const postDate = post.date_added.split(' ')
        postElement.setAttribute('class', 'col-xl-4 col-lg-6 col-md-6 blog-card')
        postElement.innerHTML = `
                    <article class="shadow-sm">
                        <h2 class="title">
                            <a href="post.html?id=${post.id}">${post.title}</a>
                        </h2>

                        <div class="d-flex align-items-center">
                            <div class="post-meta">
                                <p class="post-date">
                                    <time datetime="2022-01-01">${postDate[0]}</time>
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

