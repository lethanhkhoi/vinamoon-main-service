const {getAddress} = require('./googleAPI')
const lat = 10.763364350002918
const lng = 106.68241159853464

const test = async () => {
    const result = await getAddress(lat, lng)
    console.log(result)
}
test()