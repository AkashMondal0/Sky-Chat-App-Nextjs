
const node = process.env.NODE_ENV === "production"
const localhost = process.env.NEXT_PUBLIC_HOST_URL
const localhostStorage = process.env.NEXT_PUBLIC_STORAGE_URL

// const localhostStorage = 'http://13.127.232.152:4001'
// const localhost = 'http://13.127.232.152:4000';
export {
    localhost,
    localhostStorage
}