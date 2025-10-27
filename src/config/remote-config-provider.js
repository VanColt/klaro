const DEFAULT_ENDPOINT = '/api/cmp/config'

function resolveURL(endpoint) {
    if (endpoint === undefined || endpoint === null || endpoint === '')
        endpoint = DEFAULT_ENDPOINT
    const hasProtocol = /^https?:\/\//i.test(endpoint)
    if (hasProtocol)
        return new URL(endpoint)
    const base = typeof window !== 'undefined' && window.location ? window.location.origin : undefined
    if (base !== undefined)
        return new URL(endpoint, base)
    return new URL(endpoint, 'http://localhost')
}

function mergeSearchParams(url, params){
    const combined = new URLSearchParams(url.search)
    for (const [key, value] of params.entries()){
        if (value === undefined || value === null)
            continue
        combined.set(key, value)
    }
    url.search = combined.toString()
    return url
}

function normalizePayload(payload){
    if (payload === undefined || payload === null)
        throw new Error('Remote configuration response was empty.')
    if (payload.config !== undefined)
        return payload.config
    if (payload.data !== undefined && payload.data.config !== undefined)
        return payload.data.config
    return payload
}

function fetchWithXHR(url, headers, credentials){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            if (xhr.status < 200 || xhr.status >= 300){
                reject(new Error(`Unable to load remote configuration (status ${xhr.status}).`))
                return
            }
            try {
                const data = JSON.parse(xhr.responseText)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
        xhr.addEventListener('error', () => {
            reject(new Error('Network error while loading remote configuration.'))
        })
        xhr.open('GET', url.toString())
        if (credentials === 'include')
            xhr.withCredentials = true
        else if (credentials === 'omit')
            xhr.withCredentials = false
        for (const [name, value] of Object.entries(headers)){
            xhr.setRequestHeader(name, value)
        }
        xhr.send()
    })
}

export default class RemoteConfigProvider {
    constructor(endpoint, options){
        this.endpoint = endpoint || DEFAULT_ENDPOINT
        this.options = {...options}
        this.lastConfig = undefined
    }

    buildUrl(configName){
        const url = resolveURL(this.endpoint)
        const params = new URLSearchParams()
        if (configName !== undefined && configName !== null && configName !== '')
            params.set('name', configName)
        const defaultParams = this.options.params || {}
        for (const [key, value] of Object.entries(defaultParams)){
            if (value === undefined || value === null)
                continue
            params.set(key, value)
        }
        return mergeSearchParams(url, params)
    }

    async load(configName, requestOptions){
        const url = this.buildUrl(configName)
        const headers = {
            'Accept': 'application/json',
            ...(this.options.headers || {}),
        }
        const fetchOptions = {
            method: 'GET',
            credentials: this.options.credentials || 'same-origin',
            ...(requestOptions || {}),
            headers: headers,
        }
        let payload
        if (typeof window !== 'undefined' && window.fetch !== undefined){
            const response = await window.fetch(url.toString(), fetchOptions)
            if (!response.ok)
                throw new Error(`Unable to load remote configuration (status ${response.status}).`)
            payload = await response.json()
        } else {
            payload = await fetchWithXHR(url, headers, fetchOptions.credentials)
        }
        const config = normalizePayload(payload)
        this.lastConfig = config
        return config
    }
}

export {DEFAULT_ENDPOINT as defaultRemoteConfigEndpoint}
