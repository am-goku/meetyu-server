import bcrypt from "bcrypt";

const saltRounds = 10;

// @desc   Hash password
// @access Private
export const hash_password = async (password) => {
    try {
        return await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err){
                    reject(err)
                } else {
                    resolve(hash);
                }
            })
        })
    } catch (err) {
        return await Promise.reject(err)
    }
}


// @desc   Compare password
// @access Private
export const compare_password = async ({password, hashedPassword}) => {
    try {
        return await new Promise( async (resolve, reject) => {
            const flag = await bcrypt.compare(password, hashedPassword)
            resolve(flag)
        })
    } catch (err) {
        return await Promise.reject(err)
    }
}