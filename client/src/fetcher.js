import config from './config.json'

const getAllStates = async (date) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/domestic?date=${date}`, {
        method: 'GET',
    })
    return res.json()
}

const getFacilitiesSearch = async (state, county, keyword, lat_low, lat_high, lon_low, lon_high, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/findfacilities/?State=${state}&County=${county}&Keyword=${keyword}&LatLow=${lat_low}&LatHigh=${lat_high}&LonLow=${lon_low}&LonHigh=${lon_high}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getFacility = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/facility/?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getProviderDetail = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/provider?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getProviderInStock = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/providerinstock?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getFacilityAllStates = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/facilitystate`, {
        method: 'GET',
    })
    return res.json()
}

const getFacilityCounties = async (state) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/facilitycounty?state=${state}`, {
        method: 'GET',
    })
    return res.json()
}

const getProvidersSearch = async (zip, medicine, instock) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/findproviders?zip=${zip}&medicine=${medicine}&instock=${instock}`, {
        method: 'GET',
    })
    return res.json()
}

const getState = async (date, state, fullname) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/state?date=${date}&state=${state}&fullname=${fullname}`, {
        method: 'GET',
    })
    return res.json()
}

// Get International map data
const getCountryOverview = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/countryoverview`, {
        method: 'GET',
    })
    return res.json()
}

const getCountryDetail = async (ISO_Code) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/countrydetail?Country=${ISO_Code}`, {
        method: 'GET',
    })
    return res.json()
}

const getCountryStats = async (ISO_Code) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/countrystats?Country=${ISO_Code}`, {
        method: 'GET',
    })
    return res.json()
}

const getTop5countries = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/top5countries`, {
        method: 'GET',
    })
    return res.json()
}

const getCumulativeCases = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/cumulativecases`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getAllStates,
    getFacilitiesSearch,
    getFacility,
    getProviderDetail,
    getProviderInStock,
    getFacilityAllStates,
    getFacilityCounties,
    getProvidersSearch,
    getCountryOverview,
    getCountryDetail,
    getCountryStats,
    getCumulativeCases,
    getTop5countries,
    getState,
}
