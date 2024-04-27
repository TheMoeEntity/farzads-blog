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
let adminDelBtns = ''
let deleteType = ''
let currentButtonID = 0

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
const quickActions = () => {

}
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

const producePostsInnerHTML = (status, comment) => {
    switch (status) {
        case "0":
            return `
                    <li class="list-group-item">
                     <a href="/admin/update/?id=${comment.id}&publish=true"" class="text-center noUnderline text-success postEditDrop" data-btnID="${comment.id}">Publish</a>
                     </li>
                    <li class="list-group-item delete-button text-danger">
                     <a class="text-center text-danger adminDelete noUnderline " data-btnID="${comment.id}" data-bs-toggle="modal" data-type="posts" data-bs-target="#deletePostModal">Delete</a>
                     </li>
                `

        case "1":
            return `
                     <li class="list-group-item delete-button text-warning">
                     <a class="text-center noUnderline postEditDrop text-warning" href="/admin/update/?id=${comment.id}&publish=true" data-btnID="${comment.id}">Pend</a>
                     </li>
                     <li class="list-group-item delete-button text-danger">
                     <a class="text-center noUnderline text-danger adminDelete" data-bs-toggle="modal" data-type="posts" data-bs-toggle="modal"  data-bs-target="#deletePostModal" data-btnID="${comment.id}">Delete</a>
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
    await getAllComments().then(x => {
        if (x.status == 'success') {
            const filteredComments = x.comments.filter(comment => comment.status == '0')
            Helpers.setcommentsTableRow(filteredComments, Helpers.getDate, commentsTableContainer)
            adminDelBtns = [...document.querySelectorAll('.adminDelete')]
            adminDelBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.getAttribute('data-type')
                    const btnID = btn.getAttribute('data-btnID')
                    currentButtonID = btnID
                    console.log(type)
                    deleteType = type
                    modalBody.textContent = `Are you sure you want to delete this ${type == "comments" ? 'comment' : 'post'}?`
                })
            })
            return
        }
        return []
    }).catch(() => [])
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

adminDeleteAction.addEventListener('click', async () => {
    await deleteAdminPostOrComment(1234567890, currentButtonID)
})