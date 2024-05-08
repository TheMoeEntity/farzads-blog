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
    static convertToWAT = (date) => {
        // Parse the timestamp string into a Date object
        const estTimestamp = new Date(date);

        // Calculate the time difference between EST (UTC-5) and WAT (UTC+1) in milliseconds
        const timeDifference = 6 * 60 * 60 * 1000; // 6 hours difference

        // Adjust the timestamp for the time difference
        const watTimestamp = new Date(estTimestamp.getTime() + timeDifference);


        // Format the result (optional)
        // const formattedWatTimestamp = watTimestamp.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
        return watTimestamp
    }
    static getPosts = async () => {
        const formData = new FormData()
        formData.append('getPosts', '')
        try {
            const response = await fetch('https://api.ikennaibe.com/farzad/posts', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (sessionActive) {
                return data.posts;
            }
            return data.posts.filter(x => x.status == "1")
        } catch (error) {
            console.error(error);
            return [];
        } finally {

        }


    };
    static produceActivityTitle = (status, content) => {
        const data = {
            text: "",
            icon: '',
            body: '',
            color: ''
        }
        switch (status) {
            case '0':
                data.text = "Admin login"
                data.body = "You logged in successfully as admin"
                data.icon = 'fas fa-user-shield'
                break
            case '1':
                data.text = "Admin logout"
                data.body = "You logged out successfully as admin"
                data.icon = 'fas fa-sign-out'
                break
            case '2':
                if (content.details) {
                    const status = JSON.parse(content.details)
                    if (status.status == '0') {
                        data.text = "New pending post"
                        data.icon = 'far fa-clock'
                        data.color = 'pend'
                        data.body = "You created and saved a new post titled <b>" + content.title + "</b> to drafts."
                    } else if (status.status == '1') {
                        data.text = "New post"
                        data.icon = 'far fa-plus-square'
                        data.color = 'publish'
                        data.body = "You created and published a new post titled <b>" + content.title + '</b>'
                    }
                }
                break
            case '3':
                if (content.details) {
                    const { status: status1 } = JSON.parse(content.details)
                    if (status1 == '1') {
                        data.text = "Published post"
                        data.color = 'publish'
                        data.body = `You published a post titled "<b>${content.title}</b>"`
                        data.icon = 'far fa-check-square'

                    }
                    if (status1 == "2") {
                        data.text = "Updated post content"
                        data.color = ''
                        data.body = `You updated the content of a post titled <b>${content.title}</b>`
                        data.icon = 'far fa-edit'

                    }
                    if (status1 == '0') {
                        data.text = "Pending post"
                        data.color = 'pend'
                        data.body = `You marked a post titled <b>${content.title}</b> as pending`
                        data.icon = 'far fa-clock'

                    }
                }
                break
            case '4':
                data.text = "Deleted post"
                data.color = 'del'
                data.icon = 'fas fa-trash-alt'
                data.body = "You deleted a post titled <b>" + content.title + '</b>'
                break
            case '5':
                const { commenter } = JSON.parse(content.details)
                data.text = "New comment"
                data.color = 'publish'
                data.icon = 'far fa-comment'
                data.body = `New comment from <b>${commenter}</b> on post titled <b>${content.title}</b>`
                break
            case '6':
                if (content.details) {
                    const status = JSON.parse(content.details)
                    if (status.status == '0') {
                        data.text = "Pending comment"
                        data.icon = "far fa-clock"
                        data.color = 'pend'
                        data.body = `You marked the comment from <b>${status.commenter}</b> on post <b>${content.title}</b> as pending.`
                    } else if (status.status == '1') {
                        data.text = "Published comment"
                        data.color = 'publish'
                        data.icon = "far fa-check-square"
                        data.body = `You published the comment from <b>${status.commenter}</b> on post <b>${content.title}</b>`
                    }
                }
                break
            case '7':
                if (content.details) {
                    const status = JSON.parse(content.details)
                    data.text = "Deleted comment"
                    data.color = 'del'
                    data.icon = 'fas fa-trash-alt'
                    data.body = `You deleted the comment from <b>${status.commenter}</b> on post <b>${content.title}</b>`

                }
                break
            case '8':
                if (content.details) {
                    const { email, name } = JSON.parse(content.details)
                    data.text = "New form submission"
                    data.color = ''
                    data.icon = 'far fa-file-alt'
                    data.body = `You have a new submission from <b>${name}</b>, with email: <b>${email}</b> on the contact form. Please review the details provided by the user.`
                }
                break
        }
        return data
    }
    static incrementTotalPosts(totalPosts, id, interval) {
        let count = 0;
        const totalPostsCountElement = document.getElementById(id);
        if (totalPosts !== 0) {
            interval = setInterval(() => {
                count++;
                if (totalPostsCountElement) {
                    totalPostsCountElement.textContent = count;
                    totalPostsCountElement.style.opacity = 1;
                }

                if (count >= totalPosts) {
                    clearInterval(interval);
                }
            }, 100);


            if (totalPostsCountElement) {
                totalPostsCountElement.style.opacity = 0;
            }
        }
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
    static setActivities = (posts, activity) => {
        activity.innerHTML = '';
        posts.forEach(post => {
            const { text, icon, body, color } = Helpers.produceActivityTitle(post.type, post)
            const actvityRow = document.createElement('li');
            actvityRow.setAttribute('class', 'd-flex gap-4 p-2 w-100')
            actvityRow.innerHTML = `
         <div
            class="d-flex flex-column justify-content-center align-items-center">
            <div
                class="rounded ${color} rounded-circle activity-bubble d-flex align-items-center justify-content-center">
                <i class="${icon} text-white"></i>
            </div>
            <div class="activity-line my-3">
            </div>
        </div>
        <div class="d-flex flex-column gap-2 w-100">
            <div
                class="d-flex flex-column flex-md-row w-100 justify-content-md-between align-items-md-center py-3">
                <h4><b>${text}</b></h4>
                <h5 class="text-gray pr-5">${this.formatTimestamp(this.convertToWAT(post.date_added))}</h5>
            </div>
            <p class="w-100 w-md-75">
                ${body}
            </p>
        </div>
        `;

            activity.appendChild(actvityRow);
        });
        if (posts.length <= 0) {
            activity.innerHTML = '<h3 class="text-center">No activity to show.<h3>';
        }
    };
    static filterTableRows(searchTerm, tableRows) {
        searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search
        tableRows.forEach(row => {
            const secondCellText = row.querySelector('td:nth-child(2)').textContent.toLowerCase()
            if (secondCellText.includes(searchTerm)) {
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
    static formatIncomingData = (arr) => {
        return arr.map(post => {
            const data = {
                "ID": post.id,
                "Title": post.title,
                "Status": post.status,
                "Date": post.date_added,
                "Comments": post.comments,
                "Actions": ""
            }
            return data
        })
    }
    static setTableRow = (posts, getDate, tableContainer, produceInnerHTML) => {
        // Clear existing table rows before appending new ones
        
        tableContainer.innerHTML = '';
        posts.forEach(post => {
            const randomComments = Math.floor(Math.random(0, 1) * 4)
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <th  style="min-width:50px;">${post.id}</th>
            <td style="min-width:220px; white-space:no-wrap;"><a class="text-dark noUnderline" href="/admin/posts/?id=${post.id}"><b>${post.title.length >= 70 ? post.title.slice(0, 70) + '...' : post.title}</b><a></td>
            <td style="min-width:70px;">
                <div class="progress" style="min-width:60px;">
                    <div class="progress-bar ${post.status == 0 ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: 100%"
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </td>
            <td style="min-width:130px;">${this.formatTimestamp(this.convertToWAT(post.date_added))}</td>
            <td style="min-width:150px;">
                ${this.commentsNumber(post.comments)}
            </td>
            <td style="min-width:90px;">
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
            tableContainer.append(tableRow);
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
            <td style="min-width:130px;">${this.formatTimestamp(this.convertToWAT(post.date_added))}</td>
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
        } else if (content.trim() === '' || content.length < 10) {
            errMessage.textContent = 'Blog post cannot be empty or too short'
            errMessage.setAttribute('class', 'error text-danger')
            isError = true
        }
        const blogFields = { title, sub_title, content }
        return [isError, blogFields]

    }
    static formatTimestamp(timestamp) {
        const currentDate = new Date();
        const postDate = new Date(timestamp);

        const timeDiff = currentDate.getTime() - postDate.getTime();
        const secondsDiff = Math.floor(timeDiff / 1000);
        const minutesDiff = Math.floor(secondsDiff / 60);
        const hoursDiff = Math.floor(minutesDiff / 60);
        const daysDiff = Math.floor(hoursDiff / 24);
        const monthsDiff = Math.floor(daysDiff / 30);

        if (monthsDiff >= 1) {
            // If more than a month ago, return the date in "23rd May, 2024" format
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return postDate.toLocaleDateString('en-GB', options);
        } else if (daysDiff >= 1) {
            // If more than a day ago, return 'x days ago'
            return daysDiff === 1 ? 'yesterday' : `${daysDiff} days ago`;
        } else if (hoursDiff >= 1) {
            // If more than an hour ago, return 'x hours ago'
            return hoursDiff === 1 ? 'an hour ago' : `${hoursDiff} hours ago`;
        } else if (minutesDiff >= 1) {
            // If more than a minute ago, return 'x minutes ago'
            return minutesDiff === 1 ? 'a minute ago' : `${minutesDiff} minutes ago`;
        } else {
            // If less than a minute ago, return 'just now'
            return 'just now';
        }
    }
    static getActivity = async (page, limit, noActivity) => {
        const formData = new FormData()
        formData.append('getLog', 1234567890)
        formData.append('limit', limit)
        formData.append('page', page)
        try {
            const response = await fetch('https://api.ikennaibe.com/farzad/activity', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.log.length === 0) noActivity = true
            return data;
        } catch (error) {
            console.error(error);
            return [];
        } finally {

        }

    };
}