const asyncFuntion = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Hello world!");
        }, 2000)
    })
}



const abc =  () => {
    try {
         Promise.all([asyncFuntion()]);

        return {status: 200, message: "Done"}
    } catch (error) {
        return {status: 500, error}
    }
}

