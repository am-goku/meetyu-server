const prom = (num) => {
    return new Promise((resolve, reject) => {
        if(num > 10) resolve("true")
        else throw new Error("Invalid number")
    }).catch((err) => {
        return Promise.reject(err)
    })
}


prom(1).then((result) => {
    console.log('====================================');
    console.log(result, 123);
    console.log('====================================');
}).catch((err) => {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
})