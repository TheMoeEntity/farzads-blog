const modal = document.getElementById('modal-background')
const scrollBtn = document.getElementById('scrollBtn')
// const getPosts = async () => {
//     const formData = new FormData()
//     formData.append('getPosts', '')
//     await fetch(('https://ikennaibe.com/farzad/posts'), {
//         method: 'POST',
//         body: formData,
//     })
//         .then(async response => {
//             const data = await response.json()
//             // console.log(data.posts)
//             return data.posts
//         })
//         .catch(err => {
//             console.log(err)
//             return []
//         })
// }
const message = () => {
    modal.style.display = 'flex'
}
const closeModal = () => {
    modal.style.display = 'none'
}
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
const animateIn = () => {

    if (
        document.body.scrollTop > 120 ||
        document.documentElement.scrollTop > 120
    ) {
        scrollBtn.style.bottom = "30px";
        scrollBtn.style.opacity = "1";
    } else {
        scrollBtn.style.bottom = "-20px";
        scrollBtn.style.opacity = "0";
    }
};
window.addEventListener("scroll", animateIn);
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;

    window.addEventListener('scroll', function () {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
})
