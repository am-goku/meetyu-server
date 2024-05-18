import { accept_request, delete_request, get_friends, get_requests, get_suggesions, remove_friend, send_request } from "../helpers/user-helper.js"
import responseHandler from "../utils/responseHandler.js"



export const fetch_suggestions = async (req, res) => {
    try {
        const data = await get_suggesions(req.user._id)
        responseHandler(res, data)
    } catch (err) {
        responseHandler(res, err)
    }
}


export const send_request_controller = async (req, res) => {
    try {
        const data = await send_request(req?.user?._id, req?.params?.id)
        responseHandler(res, data)
    } catch (err) {
        responseHandler(res, err)
    }
}


export const delete_request_controller = async (req, res) => {
    try {
        const data = await delete_request(req?.user?._id, req?.params?.id)
        responseHandler(res, data)
    } catch (err) {
        responseHandler(res, err)
    }
}


export const accept_request_controller = async (req, res) => {
    try {
        const data = await accept_request(req?.user?._id, req?.params?.id)
        responseHandler(res, data)
    } catch (err) {
        responseHandler(res, err)
    }
}


export const remove_friend_controller = async (req, res) => {
    try {
        const data = await remove_friend(req?.user?._id, req?.params?.id)
        responseHandler(res, data)
    } catch (err) {
        responseHandler(res, err)
    }
}


export const get_requests_controller = async (req, res) => {
    try {
        const data = await get_requests(req?.user?._id)
        responseHandler(res, data)
    } catch (err) {
        responseHandler(res, err)
    }
}


export const get_friends_controller = async (req, res) => {
    try {
        const data = await get_friends(req?.user?._id);
        responseHandler(res, data)
    } catch (error) {
        responseHandler(res, error)
    }
}