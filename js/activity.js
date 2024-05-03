import { Helpers } from "./helpers.js";
const activity = document.querySelector('#activity')
const overlay = document.querySelector('#loadingOverlay')

const setActivities = (posts, activity) => {
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
                <h5 class="text-gray pr-5">${Helpers.formatTimestamp(post.date_added)}</h5>
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
export const activities = await Helpers.getActivity().then(response => {
    if (response.status === 'success') {
        setTimeout(() => {
            overlay.classList.toggle('d-none')
        }, 750);
        const activityResponse = response.log
        setActivities(activityResponse, activity)
        return activityResponse
    } else {
        return []
    }
})

