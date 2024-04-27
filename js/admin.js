import { Helpers } from "./helpers.js";
import { getDate } from "./index.js";
const tableContainer = document.querySelector('#posts-table')
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
        Helpers.setTableRow(publishedPosts, getDate, tableContainer)
    }
    pendingPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        allPostsBtn.setAttribute('class', 'btn')
        publishedPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(pendingPosts, getDate, tableContainer)
    }
    allPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        publishedPostsBtn.setAttribute('class', 'btn')
        pendingPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(x, getDate, tableContainer)
    }
    return x
});

if (posts.length > 0) {
    Helpers.setTableRow(posts, getDate, tableContainer)
    const tableRows = document.querySelectorAll('table tr');
    searchInput.addEventListener('input', () => {
        Helpers.filterTableRows(searchInput.value, tableRows);
    });

} else {
    const noPostsRow = document.createElement('tr');
    noPostsRow.innerHTML = '<td colspan="4">No posts to show.</td>';
    if (tableContainer) {
        tableContainer.appendChild(noPostsRow);
    }
}
