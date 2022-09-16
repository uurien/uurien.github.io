function openPhoto () {
    const img = this.querySelector('img')
    const bigImgSrc = img.dataset.bigSrc
    console.log('camera', img.dataset.camera)
    console.log('iso', img.dataset.iso)
    console.log('focal', img.dataset.focal)
    console.log('aperture', img.dataset.aperture)
    console.log('shutterSpeed', img.dataset.shutterSpeed)
    console.log('bigSrc', img.dataset.bigSrc)
    console.log('bigSrc', img.dataset.bigSrc)
    bigImg.setAttribute('src', img.dataset.bigSrc)
    photoDetail.classList.remove('hidden')
//    photoDetail.innerHTML = `<img src="${img.dataset.bigSrc}" />`
}
let photoDetail
let photoContainer
let bigImg
export default function init () {
    // photo-list
    // photo-list > li
    photoDetail = document.getElementById('photo-detail')
    photoDetail.addEventListener('click', (e) => {
        console.log(e)
        photoDetail.classList.add('hidden')
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