import { Helpers } from "./helpers.js";
const loadingOverlay = document.getElementById('loadingOverlay');
const tableContainer = document.querySelector('#posts-table')
const commentsTableContainer = document.querySelector('#commentsTableContainer')
const allPostsBtn = document.querySelector('#allPosts')
const pendingPostsBtn = document.querySelector('#PendingPosts')
const publishedPostsBtn = document.querySelector('#PublishedPosts')
const searchInput = document.getElementById('searchInput');

let pendingPosts = []
let publishedPosts = []
export const getAdminPosts = async () => {
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
const getAllComments = async () => {
    const formData = new FormData()
    formData.append('getAllComments', 1234567890)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/comments', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null
    }
}
await getAllComments().then(x => {
    if (x.status == 'success') {
        const filteredComments = x.comments.filter(comment => comment.status == '0')
        Helpers.setcommentsTableRow(filteredComments, Helpers.getDate, commentsTableContainer)
        return
    }
    return []
}).catch(() => [])
const producePostsInnerHTML = (status, comment) => {
    switch (status) {
        case "0":
            return `
                    <li class="list-group-item">
                     <a href="/admin/update/?id=${comment.id}&publish=true"" class="text-center noUnderline text-success postEditDrop" data-btnID="${comment.id}">Publish</a>
                     </li>
                    <li class="list-group-item delete-button text-danger">
                     <a class="text-center  text-danger delete-button noUnderline " data-btnID="${comment.id}" data-bs-toggle="modal" data-bs-target="#deletePostModal">Delete</a>
                     </li>
                `

        case "1":
            return `
                     <li class="list-group-item delete-button text-warning">
                     <a class="text-center noUnderline postEditDrop text-warning" href="/admin/update/?id=${comment.id}&publish=true" data-btnID="${comment.id}">Pend</a>
                     </li>
                     <li class="list-group-item delete-button text-danger">
                     <a class="text-center noUnderline text-danger delete-button" data-bs-toggle="modal"  data-bs-target="#deletePostModal" data-btnID="${comment.id}">Delete</a>
                     </li>
                     `
    }
}
let posts = await getAdminPosts().then(x => {
    publishedPosts = x.filter(xx => xx.status == "1")
    pendingPosts = x.filter(xx => xx.status == "0")
    publishedPostsBtn.textContent = "Published (" + publishedPosts.length + ")"
    pendingPostsBtn.textContent = 'Pending (' + pendingPosts.length + ')'
    allPostsBtn.textContent = 'All Posts (' + x.length + ')'
    publishedPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        allPostsBtn.setAttribute('class', 'btn')
        pendingPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(publishedPosts, Helpers.getDate, tableContainer, producePostsInnerHTML)
    }
    pendingPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        allPostsBtn.setAttribute('class', 'btn')
        publishedPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(pendingPosts, Helpers.getDate, tableContainer, producePostsInnerHTML)
    }
    allPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        publishedPostsBtn.setAttribute('class', 'btn')
        pendingPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(x, Helpers.getDate, tableContainer, producePostsInnerHTML)
    }
    return x
});

if (posts.length > 0) {
    setTimeout(() => {
        loadingOverlay.style.display = 'none'
    }, 550);
    Helpers.setTableRow(posts, Helpers.getDate, tableContainer, producePostsInnerHTML)
    const tableRows = document.querySelectorAll('table tr');
    searchInput.addEventListener('input', () => {
        Helpers.filterTableRows(searchInput.value, tableRows);
    });

} else {
    const noPostsRow = document.createElement('tr');
    noPostsRow.innerHTML = '<td colspan="5">No posts to show.</td>';
    if (tableContainer) {
        tableContainer.appendChild(noPostsRow);
    }
}
