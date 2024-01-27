import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

const http: AxiosInstance = axios.create({})


export type HttpRequest<T = any, P = any> =(data?: P, config?: AxiosRequestConfig<P>) => Promise<T>

type HttpRequestParam<T = any, P = any> = Parameters<HttpRequest<T, P>>

export function httpRequest<T = any, P = any>(...[data, config = {}]: HttpRequestParam<T, P>): ReturnType<HttpRequest<T, P>> {
  const method = config.method?.toUpperCase() || 'GET'
  config.method = method
  if (data) {
    config[['DELETE', 'GET'].some((key) => key === method) ? 'params' : 'data'] = data
    if(config.url){
      config.url = config.url.replace(/{\s*(.*?)\s*}/g, (_, objKey: keyof typeof data) => {
        const val = data[objKey]
        if (val === undefined) {
          throw new Error(`${config.url} 缺少参数: [${objKey.toString()}]`)
        }
        // 删除URL中匹配的参
        // 数
        delete data[objKey]
        return encodeURIComponent(val as any)
      })
    }
  }

  return http<P, T>(config || {})
}