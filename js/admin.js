import { getPosts } from "./index.js";
import { Helpers } from "./helpers.js";
import { getDate } from "./index.js";
import { getPost } from "./index.js";
import { setComments } from "./index.js";

const tableContainer = document.querySelector('#posts-table')
const commentsContainer = document.querySelector('#comments-table')
const commentsTab = document.querySelector('#comments-tab')
const singleComment = document.querySelector('#single-comment')
const commenter = document.querySelector('#commenter')
const deleteBtn = document.querySelector('#deleteBtn')
const queryString = window.location.search;
let currentCommentID = ''
const urlParams = new URLSearchParams(queryString);
const titleForComment = document.querySelector('#comment-title')
const id = urlParams.get('id')
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
let posts = await getAdminPosts();
let singlePost
const produceInnerHTML = (status, comment) => {
    switch (status) {
        case "0":
            return `
                    <li class="list-group-item">
                     <span class="text-center btn w-100 text-success update-button approveBtn" data-btnID="${comment.id}">Publish</span>
                     </li>
                    <li class="list-group-item delete-button text-danger">
                     <span class="btn text-center w-100 text-danger delete-button" data-bs-toggle="modal" data-bs-target="#deletePostModal">Delete</span>
                     </li>
                `

        case "1":
            return `
                     <li class="list-group-item delete-button text-warning">
                     <span class="text-center btn w-100 text-warning update-button approveBtn" data-btnID="${comment.id}">Pend</span>
                     </li>
                     <li class="list-group-item delete-button text-danger">
                     <span class="btn text-center w-100 text-danger delete-button" data-bs-toggle="modal" data-bs-target="#deletePostModal" data-btnID="${comment.id}">Delete</span>
                     </li>
                     `
    }
}
const deleteComment = async (uid, commentid,) => {
    const response = await deletePost(uid, commentid).then((x) => x)
    if (response.status && response.status === 'success') {
        const comment = singlePost.comments.find(x => x.id == commentid)
        commenter.textContent = `${comment.name}'s comments have been deleted successfully.`
        setTimeout(() => {
            window.location.reload()
        }, 3500);
    }
}
const deletePost = async (uid, id) => {
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
const updatePost = async (uid, id, publish) => {
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
const approveComment = async (uid, id, text) => {
    const commentStatus = singlePost.comments.find(x => x.id === currentCommentID)
    let shouldPublish = true
    if (text === 'Publish') {
        if (commentStatus.status === "1") {
            commenter.textContent = "Comment is already published"
            return
        }
    }
    if (text === "Pend") {
        shouldPublish = false
    }
    const response = await updatePost(uid, id, shouldPublish).then((x) => x)
    if (response.status && response.status === 'success') {
        const comment = singlePost.comments.find(x => x.id == id)
        commenter.textContent = `${comment.name}'s comments have been ${shouldPublish ? 'published' : 'put on pending'}`
        setTimeout(() => {
            window.location.reload()
        }, 3500);
    }

}
const getSinglePost = async () => {
    const post = await getPost(id).then((x) => x)
    singlePost = post
}
const setCommentsTab = () => {
    if (posts.length > 0) {
        posts.forEach(post => {
            const listItem = document.createElement('li')
            listItem.setAttribute('class', 'nav-item')
            listItem.innerHTML = `<a class="nav-link" href="/admin/comments/?id=${post.id}">Post ID: ${post.id} </a>`
            commentsTab.appendChild(listItem)
        })

    }
}
if (commentsTab) {
    setCommentsTab()
}
await getSinglePost()
if (posts.length > 0) {
    posts.forEach(post => {
        const tableRow = document.createElement('tr')
        tableRow.innerHTML = `
            <th>${post.id}</th>
            <td style="min-width:180px;">${post.title.slice(0, 70)}...</td>
            <td>${Helpers.formatDate(getDate(post.date_added))}</td>
            <td><a href="/admin/comments/?id=${post.id}"><u>Comments</u></a></td>
            <td>
            <div class="nav-item dropdown me-1">
                <span
                    class="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center"
                    id="messageDropdown" data-bs-toggle="dropdown">
                </span>
                <div class="dropdown-menu dropdown-menu-right py-0 navbar-dropdown"
                    aria-labelledby="messageDropdown"
                    style="width:150px; height: auto; min-height: fit-content; z-index: 99999;">
                  <ul class="list-group">
                     <li class="list-group-item">
                     <span class='update-button'>
                        Update
                     </span>
                     </li>
                     <li class="list-group-item">
                       <span class='delete-button'>
                            Delete
                        </span>  
                     </li>
                    </ul>
                </div>
            </div>
            </td>
        `
        if (tableContainer) {
            tableContainer.appendChild(tableRow)
        }
    })
} else {
    const noPostsRow = document.createElement('tr');
    noPostsRow.innerHTML = '<td colspan="4">No posts to show.</td>';
    if (tableContainer) {
        tableContainer.appendChild(noPostsRow);
    }
}

if (titleForComment) {
    titleForComment.textContent += singlePost.title
}
if (singlePost.comments && singlePost.comments.length > 0) {
    singlePost.comments.forEach(comment => {
        const tableRow = document.createElement('tr')
        tableRow.innerHTML = `
            <td style="background-color:transparent;" class="author-bubble d-flex align-items-center justify-content-center">
                <i class="mdi mdi-account-circle text-dark"></i>
            </td>
            <td>
            ${comment.name}
            </td>
            <td>
            <div class="progress">
                <div class="progress-bar ${comment.status == 0 ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: 100%"
                aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </td>
            <td>
             ${comment.email}
            </td>
            <td>
            ${Helpers.formatDate(getDate(comment.date_added))}
            </td>
            <td>
            <ul>
               <button class="update-button viewBtn" data-btnID="${comment.id}">
                  View
               </button>  
            </td>
            <td>
            <div class="nav-item dropdown me-1">
                <span
                    class="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center"
                    id="messageDropdown" data-bs-toggle="dropdown">
                </span>
                <div class="dropdown-menu dropdown-menu-right py-0 navbar-dropdown"
                    aria-labelledby="messageDropdown"
                    style="width:150px; height: auto; min-height: fit-content; z-index: 99999;">
                  <ul class="list-group">
                        ${produceInnerHTML(comment.status, comment)}
                    </ul>
                </div>
            </div>
            </td>

    `

        if (commentsContainer) {
            commentsContainer.appendChild(tableRow)
        }
    })
} else {
    const noPostsRow = document.createElement('tr');
    noPostsRow.innerHTML = '<td colspan="4">This post has no comments yet</td>';
    if (commentsContainer) {
        commentsContainer.appendChild(noPostsRow);
    }
}

const viewBtns = document.querySelectorAll('.viewBtn')
const approveBtns = document.querySelectorAll('.approveBtn')
const commentDeleteBtns = document.querySelectorAll('.delete-button')
if (commentDeleteBtns) {
    for (const button of commentDeleteBtns) {
        button.addEventListener('click', async (e) => {
            currentCommentID = e.target.getAttribute('data-btnID')
        })
    }
}
if (approveBtns) {
    for (const button of approveBtns) {
        button.addEventListener('click', async (e) => {
            currentCommentID = e.target.getAttribute('data-btnID')
            await approveComment(1234567890, currentCommentID, e.target.textContent)

        })
    }
}
if (viewBtns) {
    for (const button of viewBtns) {
        button.addEventListener('click', (e) => {
            const comment = singlePost.comments.find(x => x.id == e.target.getAttribute('data-btnID'))
            commenter.textContent = `${comment.name}'s comments`
            currentCommentID = e.target.getAttribute('data-btnID')
            setComments(comment, singleComment, true)
        })
    }
}
if (deleteBtn) {
    deleteBtn.addEventListener('click', async()=> {
        await deleteComment(1234567890,currentCommentID)
    })
}