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
    static setTableRow = (posts, getDate, tableContainer) => {
        // Clear existing table rows before appending new ones
        tableContainer.innerHTML = '';
        posts.forEach(post => {
            const randomComments = Math.floor(Math.random(0, 1) * 4)
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <th>${post.id}</th>
            <td style="min-width:220px; white-space:no-wrap;"><a class="text-dark noUnderline" href="/admin/posts/?id=${post.id}"><b>${post.title.length >= 70 ? post.title.slice(0, 70) + '...' : post.title}</b><a></td>
            <td>
                <div class="progress">
                    <div class="progress-bar ${post.status == 0 ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: 100%"
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </td>
            <td style="min-width:130px;">${this.formatDate(getDate(post.date_added))}</td>
            <td style="min-width:130px;">
              ${(post.comments ? post.comments : randomComments) + " comment(s)"}   
            </td>
        `;
            // Append each table row to the table container
            tableContainer.appendChild(tableRow);
        });
        if (posts.length <= 0) {
            tableContainer.innerHTML = '<td colspan="4">No posts to show.</td>';
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
}