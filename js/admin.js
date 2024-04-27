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
        console.log(response.statusText)
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error(error);
        return [];
    } finally {

    }


};
const getAllComments = async ()=> {
    const formData = new FormData()
    formData.append('getAllComments', 1234567890)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/comments', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.error("data",data);
        return data.posts;
    } catch (error) {
        console.log(error)
        return [];
    } finally {

    }
}
await getAllComments().then((x)=> {
    console.log(x)
})
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
        Helpers.setTableRow(publishedPosts, getDate, tableContainer,producePostsInnerHTML)
    }
    pendingPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        allPostsBtn.setAttribute('class', 'btn')
        publishedPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(pendingPosts, getDate, tableContainer, producePostsInnerHTML)
    }
    allPostsBtn.onclick = (e) => {
        e.target.setAttribute('class', 'btn active-tab')
        publishedPostsBtn.setAttribute('class', 'btn')
        pendingPostsBtn.setAttribute('class', 'btn')
        Helpers.setTableRow(x, getDate, tableContainer, producePostsInnerHTML)
    }
    return x
});

if (posts.length > 0) {
    Helpers.setTableRow(posts, getDate, tableContainer, producePostsInnerHTML)
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
