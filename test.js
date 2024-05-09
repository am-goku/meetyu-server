const dob = new Date('June 26, 2001')

console.log(dob)


const current = new Date();

const diff = current.get() - dob.getFullYear();

console.log(diff)