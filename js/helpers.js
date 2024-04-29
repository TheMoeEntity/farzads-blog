export class Helpers {
    static formatDate = (date) => {
        const format = date.split('-')
        let month = format[1]
        switch (month) {
            case '01':
                month = "January"
                break;
            case '02':
                month = "February"
                break;
            case '03':
                month = "March"
                break;
            case '04':
                month = "April"
                break;
            case '05':
                month = "May"
                break;
            case '06':
                month = "June"
                break;
            case '07':
                month = "July"
                break;
            case '08':
                month = "August"
                break;
            case '09':
                month = "September"
                break;
            case '10':
                month = "October"
                break;
            case '11':
                month = "November"
                break;
            case '12':
                month = "Decemeber"
                break;

            default:
                break;
        }
        return `${month} ${format[2]}, ${format[0]}`
    }
    static validateEmail = (email) => {

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        }
        return false
    }
    static validatePhone = (phone) => {
        if (/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
            return true
        }
        return false
    }
    static getDate = (date_addeds) => {
        const postDate = date_addeds.split(' ')
        return postDate[0]
    }
    static filterTableRows(searchTerm, tableRows) {
        searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search
        tableRows.forEach(row => {
            const rowData = row.textContent.toLowerCase(); // Convert row content to lowercase for comparison
            if (rowData.includes(searchTerm)) {
                row.style.display = ''; // Show the row if it contains the search term
            } else {
                row.style.display = 'none'; // Hide the row if it doesn't contain the search term
            }
        });
    }
    static commentsNumber = (count) => {
        switch (count) {
            case "0":
                return "No comments yet";
            case "1":
                return "1 comment";
            default:
                return count + " comments";
        }
    }
    static setTableRow = (posts, getDate, tableContainer, produceInnerHTML) => {
        // Clear existing table rows before appending new ones
        tableContainer.innerHTML = '';
        posts.forEach(post => {
            const randomComments = Math.floor(Math.random(0, 1) * 4)
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <th>${post.id}</th>
            <td style="min-width:220px; white-space:no-wrap;"><a class="text-dark noUnderline" href="/admin/posts/?id=${post.id}"><b>${post.title.length >= 70 ? post.title.slice(0, 70) + '...' : post.title}</b><a></td>
            <td style="width:60px;">
                <div class="progress" style="min-width:60px;">
                    <div class="progress-bar ${post.status == 0 ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: 100%"
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </td>
            <td style="min-width:130px;">${this.formatDate(getDate(post.date_added))}</td>
            <td style="min-width:150px;">
                ${this.commentsNumber(post.comments)}
            </td>
            <td>
                <div class="nav-item dropdown me-1">
                    <span class="nav-link count-indicator text-dark noUnderline dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" data-bs-toggle="dropdown"></span>
                    <div class="dropdown-menu dropdown-menu-right py-0 navbar-dropdown" aria-labelledby="messageDropdown" style="width:150px; height: auto; min-height: fit-contents; z-index: 99999;">
                        <ul class="list-group">
                            ${produceInnerHTML(post.status, post)}
                        </ul>
                    </div>
                </div>
            </td>
        `;
            // Append each table row to the table container
            tableContainer.appendChild(tableRow);
        });
        if (posts.length <= 0) {
            tableContainer.innerHTML = '<td colspan="4">No posts to show.</td>';
        }
    };
    static setcommentsTableRow = (comments, getDate, tableContainer) => {
        tableContainer.innerHTML = '';
        comments.forEach(post => {
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <td><b>${post.id}</b></td>
            <th style="min-width:350px; white-space:no-wrap;"><p style="font-weight:lighter !important;">${post.comment.split(" ").slice(0, 20).join(" ")}</p></th>
            <td style="min-width:220px; white-space:no-wrap;"><a class="text-dark noUnderline" href="/admin/posts/?id=${post.pid}#postComments"><b>${post.post_title.length >= 70 ? post.post_title.slice(0, 70) + '...' : post.post_title}</b><a></td>
            <td style="min-width:220px; white-space:no-wrap;">${post.name}</td>
            <td>${post.email}</td>
            <td style="width:60px;">
                <div class="progress" style="min-width:60px;">
                    <div class="progress-bar ${post.status == 0 ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: 100%"
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </td>
            <td style="min-width:130px;">${this.formatDate(getDate(post.date_added))}</td>
            <td>
                <div class="nav-item dropdown me-1">
                    <span class="nav-link count-indicator text-dark noUnderline dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" data-bs-toggle="dropdown"></span>
                    <div class="dropdown-menu dropdown-menu-right py-0 navbar-dropdown" aria-labelledby="messageDropdown" style="width:150px; height: auto; min-height: fit-contents; z-index: 99999;">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <a data-bs-toggle="modal" data-bs-target="#deletePostModal" class="text-center noUnderline text-success publishPend" data-type="comments" data-btnID="${post.id}">Publish</a>
                            </li>
                            <li class="list-group-item">
                                <a class="text-center noUnderline text-danger adminDelete" data-btnID="${post.id}"  data-bs-toggle="modal"
                                    data-bs-target="#deletePostModal" data-type="comments">Delete</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>
        `;
            // Append each table row to the table container
            tableContainer.appendChild(tableRow);
        });
        if (comments.length <= 0) {
            tableContainer.innerHTML = '<td colspan="4">No comments to show.</td>';
        }
    };

    static getPosts = async () => {
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
    static validateFormFields = (event, errMessage) => {
        event.preventDefault()
        const name = event.target[0].value
        const email = event.target[1].value
        const comment = event.target[2].value
        let isError = false
        const validEmail = this.validateEmail(email)
        if (name.trim() === '') {
            errMessage.textContent = 'Name cannot be empty'
            errMessage.setAttribute('class', 'error')
            isError = true
        } else if (!validEmail) {
            errMessage.textContent = 'Enter a valid email'
            errMessage.setAttribute('class', 'error')
            isError = true
        } else if (comment.trim() === '' || comment.length < 10) {
            errMessage.textContent = 'Comment cannot be empty or less than 10 characters'
            errMessage.setAttribute('class', 'error')
            isError = true
        }
        const formFields = { name, email, comment }
        return [isError, formFields]

    }
    static validateContactFormFields = (event, errMessage) => {
        event.preventDefault()
        const name = event.target[0].value
        const email = event.target[1].value
        const phone = event.target[2].value
        const message = event.target[3].value
        let isError = false
        const validEmail = this.validateEmail(email)
        if (name.trim() === '') {
            errMessage.textContent = 'Name cannot be empty'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        } else if (!validEmail) {
            errMessage.textContent = 'Enter a valid email'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        } else if (phone.trim() === '') {
            errMessage.textContent = 'Enter a valid phone number'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        } else if (message.trim() === '' || message.length < 10) {
            errMessage.textContent = 'Message cannot be empty or less than 10 characters'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        }
        const contactFormFields = { name, email, phone, message }
        return [isError, contactFormFields]

    }
    static validateBlogPostFields = (event, errMessage) => {
        event.preventDefault()
        const title = event.target[1].value
        const sub_title = event.target[2].value
        const content = event.target[3].value
        let isError = false
        if (title.trim() === '') {
            errMessage.textContent = 'Title cannot be empty'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        } else if (sub_title.trim() === '') {
            errMessage.textContent = 'Sub title cannot be empty'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        }  else if (content.trim() === '' || content.length < 10) {
            errMessage.textContent = 'Blog post cannot be empty or too short'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        }
        const blogFields = { title, sub_title, content, content }
        return [isError, blogFields]

    }
}