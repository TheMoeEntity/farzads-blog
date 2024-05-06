import { Helpers } from "./helpers.js";
const loadingOverlay = document.getElementById('loadingOverlay');
const tableContainer = document.querySelector('#posts-table')
const commentsTableContainer = document.querySelector('#commentsTableContainer')
const allPostsBtn = document.querySelector('#allPosts')
const pendingPostsBtn = document.querySelector('#PendingPosts')
const publishedPostsBtn = document.querySelector('#PublishedPosts')
const searchInput = document.getElementById('searchInput');
const modalBody = document.querySelector('#post-error')
const adminDeleteAction = document.querySelector('#adminDeleteAction')
const pendingComments = document.querySelector('#pendingComments')
const updateActionBtn = document.querySelector('#updateActionBtn')
const pendingPostsDashboard = document.querySelector('#pendingPostsDashboard')
const pendingCommentsDashboard = document.querySelector('#pendingCommentsDashboard')
const publishedPostsDashboard = document.querySelector('#publishedPostsDashboard')
const publishedCommentsDashboard = document.querySelector('#publishedCommentsDashboard')
const activity = document.querySelector('#activity')
let dataTable;
let deleteType = ''
let currentButtonID = 0
let publishPend = ''
let pendingPosts = []
let publishedPosts = []
let allAdminPosts = []
let currTable = document.querySelector('#posts-table')
function handleButtonClick(event) {
    const target = event.target;
    if (target.classList.contains('adminDelete')) {
        adminDeleteAction.setAttribute("class", "btn btn-danger d-block text-white")
        updateActionBtn.setAttribute("class", "btn btn-warning d-none text-white")
        const type = target.getAttribute('data-type')
        const btnID = target.getAttribute('data-btnID')
        currentButtonID = btnID
        console.log(type)
        deleteType = type
        modalBody.textContent = `Are you sure you want to delete this ${type == "comments" ? 'comment' : 'post'}?`
        console.log('Admin Delete button clicked');
    } else if (target.classList.contains('publishPend')) {
        const type = target.textContent
        console.log(type)
        const action = target.getAttribute('data-type') === 'posts' ? 'post' : 'comment'
        const btnID = target.getAttribute('data-btnID')
        currentButtonID = btnID
        deleteType = action
        const publishText = "Do you want to publish this " + action + "?"
        const pendingText = "Do you want to mark this " + action + " as pending?"
        modalBody.textContent = `${type === "Publish" ? publishText : pendingText}`
        adminDeleteAction.setAttribute("class", "btn btn-danger d-none text-white")
        updateActionBtn.setAttribute("class", `btn ${type === "Publish" ? "btn-success" : "btn-warning"} d-block text-white`)
        updateActionBtn.textContent = type == "Publish" ? "Publish" : "Pend"
        console.log(type)
        publishPend = type
    }
}
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('posts-table').addEventListener('click', handleButtonClick);
    document.getElementById('commentsTableContainer').addEventListener('click', handleButtonClick);
});
const updateAdminPost = async (uid, title, sub_title, publish, content, postid) => {
    const formData = new FormData()
    formData.append('editPost', postid)
    formData.append('uid', uid)
    formData.append('title', title)
    formData.append('sub_title', sub_title)
    formData.append('content', content)
    formData.append('publish', publish === true ? 1 : 0)
    try {
        const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        const errorMessage = error.message || "An error occured updating Post"
        return errorMessage;
    }
};
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
const deleteCommentAction = async (uid, id) => {
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
const updateAdminPostOrComment = async (uid, commentid) => {
    loadingOverlay.style.display = 'flex';
    console.log(deleteType)
    if (deleteType == "comment") {
        const response = await updateComment(uid, commentid, true).then((x) => x)
        if (response.status && response.status === 'success') {
            loadingOverlay.style.display = 'none';
            modalBody.textContent = `Comment published`
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } else {
            loadingOverlay.style.display = 'none';
            modalBody.textContent = `Something went wrong.`
        }
    }

    if (deleteType === "post") {
        const postToSubmit = allAdminPosts.find(post => post.id === currentButtonID)
        const shouldPublish = publishPend === "Publish" ? true : false
        const response = await updateAdminPost(1234567890, postToSubmit.title, postToSubmit.sub_title, shouldPublish, postToSubmit.content, currentButtonID)
        if (response.status && response.status === 'success') {
            loadingOverlay.style.display = 'none';
            modalBody.textContent = `Post has been ${shouldPublish ? 'published' : 'put on pending'}`
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } else {
            loadingOverlay.style.display = 'none';
            modalBody.textContent = `Something went wrong.`
        }
    }



}
const deleteAdminPostOrComment = async (uid, commentid,) => {
    loadingOverlay.style.display = 'flex';
    if (deleteType == "posts") {
        const response = await delAdminPost(uid, commentid).then((x) => x)
        if (response.status && response.status === 'success') {
            loadingOverlay.style.display = 'none';
            modalBody.textContent = `Post has been deleted successfully`
            setTimeout(() => {
                window.location.reload()
            }, 750);
        } else if (response.status && response.status !== 'success') {
            loadingOverlay.style.display = 'none';
            modalBody.textContent = `An error occured while trying to delete post. Try again.`
        }
    } else {
        const response = await deleteCommentAction(uid, commentid).then((x) => x)
        if (response.status && response.status === 'success') {
            modalBody.textContent = `Comment has been deleted successfully.`
            setTimeout(() => {
                window.location.reload()
            }, 750);
        } else if (response.status && response.status !== 'success') {
            postErrorDiv.textContent = `An error occured while trying to delete comment. Try again.`
        }


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
const initializeDataTable = () => {
    dataTable = $('#posts-table-main').DataTable({
        paging: true, // Enable pagination
        lengthChange: false, // Hide page length options
        searching: false, // Disable searching
        info: false, // Hide table information
        pageLength: 10,
    });
}
const producePostsInnerHTML = (status, comment) => {
    switch (status) {
        case "0":
            return `
                    <li class="list-group-item">
                     <a data-bs-toggle="modal" data-bs-target="#deletePostModal" class="text-center noUnderline text-success publishPend" data-type="posts" data-btnID="${comment.id}">Publish</a>
                     </li>
                    <li class="list-group-item delete-button text-danger">
                     <a class="text-center text-danger adminDelete noUnderline " data-btnID="${comment.id}" data-bs-toggle="modal" data-type="posts" data-bs-target="#deletePostModal">Delete</a>
                     </li>
                `
        case "1":
            return `
                     <li class="list-group-item delete-button text-warning">
                      <a data-bs-toggle="modal" data-bs-target="#deletePostModal" class="text-center noUnderline publishPend text-warning" data-type="posts" data-btnID="${comment.id}">Pend</a>
                     </li>
                     <li class="list-group-item delete-button text-danger">
                     <a class="text-center noUnderline text-danger adminDelete" data-bs-toggle="modal" data-type="posts"  data-bs-target="#deletePostModal" data-btnID="${comment.id}">Delete</a>
                     </li>
                     `
    }

}
let posts = await getAdminPosts().then(x => {
    loadingOverlay.style.display = 'none'
    Helpers.setTableRow(x, Helpers.getDate, tableContainer, producePostsInnerHTML)
    document.getElementById('posts-table').addEventListener('click', handleButtonClick);
    searchInput.addEventListener('input', () => {
        const table = document.querySelector('#posts-table')
        const tableRows = table.querySelectorAll('tr');
        Helpers.filterTableRows(searchInput.value, tableRows);
    });
    publishedPosts = x.filter(xx => xx.status == "1")
    if (publishedPosts) {
        publishedPostsDashboard.textContent = publishedPosts.length
    }
    pendingPosts = x.filter(xx => xx.status == "0")
    if (pendingPosts) {
        pendingPostsDashboard.textContent = pendingPosts.length
    }
    let adminInterval
    setTimeout(() => {
        Helpers.incrementTotalPosts(x.length, 'totalPostsCount', adminInterval)
    }, 750);
    allAdminPosts = x
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
    initializeDataTable()
    return x
});

if (posts.length > 0) {

    await getAllComments().then(x => {
        let commentsInterval
        let pendingInterval
        const filteredComments = x.comments.filter(comment => comment.status == '0')
        const approvedComments = x.comments.filter(comment => comment.status == "1")
        publishedCommentsDashboard.textContent = approvedComments.length
        pendingCommentsDashboard.textContent = filteredComments.length
        const pending = filteredComments.length + pendingPosts.length
        setTimeout(() => {
            Helpers.incrementTotalPosts(x.comments.length, 'totalCommentsCount', commentsInterval)
            Helpers.incrementTotalPosts(pending, 'totalPending', pendingInterval)
        }, 750);
        if (x.status == 'success') {
            if (filteredComments && filteredComments.length > 0) {
                pendingComments.setAttribute('class', 'row d-block bg-light mt-5 pt-3 d-flex flex-column gap-2')
                Helpers.setcommentsTableRow(filteredComments, Helpers.getDate, commentsTableContainer)
                document.getElementById('commentsTableContainer').addEventListener('click', handleButtonClick);
            }

            return
        }
        return []
    }).catch(() => [])

} else {
    const noPostsRow = document.createElement('tr');
    noPostsRow.innerHTML = '<td colspan="5">No posts to show.</td>';
    if (tableContainer) {
        tableContainer.appendChild(noPostsRow);
    }
}

adminDeleteAction.addEventListener('click', async () => {
    await deleteAdminPostOrComment(1234567890, currentButtonID)
})
updateActionBtn.addEventListener('click', async () => {
    await updateAdminPostOrComment(1234567890, currentButtonID)
})


const LatestActivities = await Helpers.getActivity(1, 10, false).then(x => {
    if (x.status == 'success') {
        const { log } = x
        const activities = log.slice(0, 10)
        return activities
    } else {
        return []
    }
})

if (LatestActivities && LatestActivities.length > 0) {
    Helpers.setActivities(LatestActivities, activity)
}