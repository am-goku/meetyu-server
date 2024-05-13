import { accept_request, delete_request, get_requests, get_suggesions, remove_friend, send_request } from "../helpers/user-helper.js"
import responseHandler from "../utils/responseHandler.js"



export const fetch_suggestions = (req, res) => {
    get_suggesions(req?.user?._id).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}


export const send_request_controller = (req, res) => {
    send_request(req?.user?._id, req?.params?.id).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}


export const delete_request_controller = (req, res) => {
    delete_request(req?.user?._id, req?.params?.id).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}


export const accept_request_controller = (req, res) => {
    accept_request(req?.user?._id, req?.params?.id).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}


export const remove_friend_controller = (req, res) => {
    remove_friend(req?.user?._id, req?.params?.id).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}


export const get_requests_controller = (req, res) => {
    get_requests(req?.user?._id).then((data) => {
        responseHandler(res, data)
    }).catch((err) => {
        responseHandler(res, err)
    })
}