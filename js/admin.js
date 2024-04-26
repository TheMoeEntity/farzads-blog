import { getPosts } from "./index.js";
import { Helpers } from "./helpers.js";
import { getDate } from "./index.js";
import { getPost } from "./index.js";
import { setComments } from "./index.js";
const tableContainer = document.querySelector('#posts-table')
const commentsContainer = document.querySelector('#comments-table')
const commentsTab = document.querySelectorAll('.comments-tab')
const singleComment = document.querySelector('#single-comment')
const commenter = document.querySelector('#commenter')
const deleteBtn = document.querySelector('#deleteBtn')
const postDeleteBtn = document.querySelector('#post-deleteBtn')
const postErrorDiv = document.querySelector('#postErrorMessage');
const queryString = window.location.search;
const editDrop = document.querySelectorAll('.editDrop')
let currentCommentID = ''
const urlParams = new URLSearchParams(queryString);
const titleForComment = document.querySelector('#comment-title')
const id = urlParams.get('id')
const getPublish = ()=> {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shouldPublish = urlParams.get('publish')
    return shouldPublish === 'true'
}
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
                     <a class="text-center text-success update-button approveBtn" data-btnID="${comment.id}">Publish</a>
                     </li>
                    <li class="list-group-item delete-button text-danger">
                     <a class="text-center text-danger delete-button" data-bs-toggle="modal" data-bs-target="#deletePostModal">Delete</a>
                     </li>
                `

        case "1":
            return `
                     <li class="list-group-item delete-button text-warning">
                     <a class="text-center noUnderline text-warning update-button approveBtn" data-btnID="${comment.id}">Pend</a>
                     </li>
                     <li class="list-group-item delete-button text-danger">
                     <a class="text-center noUnderline text-danger delete-button" data-bs-toggle="modal" data-bs-target="#deletePostModal" data-btnID="${comment.id}">Delete</a>
                     </li>
                     `
    }
}
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
const deleteAdminPost = async (uid, commentid,) => {
    const response = await delAdminPost(uid, commentid).then((x) => x)
    if (response.status && response.status === 'success') {
        postErrorDiv.setAttribute('class', 'text-success p-3')
        postErrorDiv.textContent = `Post has been deleted successfully`
        setTimeout(() => {
            window.location.reload()
        }, 4500);
    } else if (response.status && response.status !== 'success') {
        postErrorDiv.setAttribute('class', 'text-danger p-3')
        postErrorDiv.textContent = `An error occured while trying to delete Post. Try again.`
        setTimeout(() => {
            window.location.reload()
        }, 4500);
    }
}
const deleteComment = async (uid, commentid,) => {
    const response = await deletePost(uid, commentid).then((x) => x)
    const comment = singlePost.comments.find(x => x.id == commentid)
    if (response.status && response.status === 'success') {
        commenter.textContent = `${comment.name}'s comments have been deleted successfully.`
        setTimeout(() => {
            window.location.reload()
        }, 4500);
    } else if (response.status && response.status !== 'success') {
        commenter.textContent = `An error occured while trying to delete comments. Try again.`
        setTimeout(() => {
            window.location.reload()
        }, 4500);
    }
}
const delAdminPost = async (uid, id) => {
    const formData = new FormData()
    formData.append('deletePost', id)
    formData.append('uid', uid)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured while deleting post"
        return errorMessage;
    }
};
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
const updateComment = async (uid, id, publish) => {
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
    const response = await updateComment(uid, id, shouldPublish).then((x) => x)
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
        commentsTab.forEach(x => {
            posts.forEach(post => {
                const listItem = document.createElement('li')
                listItem.setAttribute('class', 'nav-item')
                listItem.innerHTML = `<a class="nav-link post-links" data-postID="${post.id}">Post ID: ${post.id} </a>`
                x.appendChild(listItem)
            })
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
            <td style="min-width:180px;"><a class="text-dark" href="/admin/posts/?id=${post.id}">${post.title.lenght >= 70 ? post.title.slice(0, 70) + '...' : post.title}<a></td>
            <td>
            <div class="progress">
                <div class="progress-bar ${post.status == 0 ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: 100%"
                aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </td>
            <td>${Helpers.formatDate(getDate(post.date_added))}</td>
            <td>
            <div class="nav-item dropdown me-1">
                <span
                    class="nav-link count-indicator text-dark noUnderline dropdown-toggle d-flex justify-content-center align-items-center"
                    id="messageDropdown" data-bs-toggle="dropdown">
                </span>
                <div class="dropdown-menu dropdown-menu-right py-0 navbar-dropdown"
                    aria-labelledby="messageDropdown"
                    style="width:150px; height: auto; min-height: fit-contents; z-index: 99999;">
                  <ul class="list-group">
                        ${producePostsInnerHTML(post.status, post)}
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
const postLinks = document.querySelectorAll('.post-links')
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
if (editDrop) {
    editDrop.forEach(x => {
        x.addEventListener('click', (e) => {
            const dataEvent = x.getAttribute('data-event')
            if (postLinks) {
                postLinks.forEach(x => {
                    const postid = x.getAttribute('data-postID')
                    x.setAttribute('href', '/admin/' + dataEvent + '/?id=' + postid)
                })
            }

        })
    })

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
    deleteBtn.addEventListener('click', async () => {
        await deleteComment(1234567890, currentCommentID)
    })
}
if (postDeleteBtn) {
    postDeleteBtn.addEventListener('click', async () => {
        await deleteAdminPost(1234567890, currentCommentID)
    })
}