import axios, { AxiosRequestConfig } from 'axios'
import {httpRequest} from "./request";
import cloneDeep from 'lodash.clonedeep'

type AxiosDecorator = (path?: string) => ClassDecorator

const Axios: AxiosDecorator = (path?: string) => {
    return (constructor) => {
        constructor.prototype.path = path || ''
        return constructor
    }
}

const Http = (config: AxiosRequestConfig) => {
    return function (target: any, propertyKey: string): any {
        const isStatic = typeof target === 'function'

        if (isStatic) {
            target[propertyKey] = (data: any, _conf = {}) => {

                const httpConfig = cloneDeep({ ...config, ..._conf })
                const module = target.prototype.path
                httpConfig.url = module + httpConfig.url
                return axios(data, httpConfig)
            }
        } else {
            Object.defineProperty(target, propertyKey, {
                get() {
                    return (data: any, _conf = {}) => {
                        const httpConfig = cloneDeep({ ...config, ..._conf })
                        const module = target.constructor.prototype.path + (this.modelPath || '')
                        httpConfig.url = module + httpConfig.url
                        return httpRequest(data, httpConfig)
                    }
                },
                set(v: any) {
                    this[propertyKey] = v
                }
            })
        }
    }
}

const Get = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'GET'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

const Post = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'POST'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

const Put = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'PUT'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

const Delete = (url = '', config: AxiosRequestConfig = {}) => {
    const httpConfig = Object.assign(config, {
        url,
        method: 'DELETE'
    } as AxiosRequestConfig)
    return Http(httpConfig)
}

export { Axios, Http, Get, Post, Put, Delete }
