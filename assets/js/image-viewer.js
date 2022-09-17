function openPhoto () {
    const img = this.querySelector('img')
    bigImg.setAttribute('src', img.dataset.bigSrc)
    photoDetail.classList.remove('hidden')
}
let photoDetail
let photoContainer
let bigImg
export default function init () {
    photoDetail = document.getElementById('photo-detail')
    photoDetail.addEventListener('click', (e) => {
        console.log(e)
        photoDetail.classList.add('hidden')
    })
    document.addEventListener('keydown', (evt) => {
        let isEscape;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            photoDetail.classList.add('hidden')
        }
    })
    photoContainer = photoDetail.querySelector('photo-container')
    bigImg = photoDetail.querySelector('img')
    bigImg.addEventListener('click', function (e) {
        e.stopPropagation()
    })
    const photoContainers = document.querySelectorAll('.photo-list > li')
    photoContainers.forEach(photoContainer => {
        photoContainer.addEventListener('click', openPhoto)
    })
    console.log(photoContainers.length)
}