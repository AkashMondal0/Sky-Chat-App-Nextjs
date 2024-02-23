
const node = process.env.NODE_ENV === "production"
const localhost = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:4000"
const localhostStorage = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:4001"

export {
    localhost,
    localhostStorage
}