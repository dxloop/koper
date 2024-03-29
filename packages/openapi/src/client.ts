import axios from "axios"

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { ServiceError } from "./generated/swagger-ts/ServiceError.js"

export type RequestConfig<TVariables = unknown> = {
	method: "get" | "put" | "patch" | "post" | "delete"
	url: string
	params?: unknown
	data?: TVariables
	responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream"
	signal?: AbortSignal
	headers?: AxiosRequestConfig["headers"]
}

export type ResponseConfig<TData = unknown> = {
	data: TData
	status: number
	statusText: string
	headers?: AxiosResponse["headers"]
}

export const axiosInstance = axios.create({
	baseURL: "http://localhost:3000",
	headers: "{}" ? JSON.parse("{}") : {}
})

export const axiosClient = async <TData, TError = ServiceError, TVariables = unknown>(config: RequestConfig<TVariables>): Promise<ResponseConfig<TData>> => {
	// Set token, if on browser
	if (typeof window !== "undefined" && typeof window.document !== "undefined") {
		const token = localStorage.getItem("token")
		if (token) {
			if (!config.headers) config.headers = {}
			config.headers["Authorization"] = `Bearer ${token}`
		}
	}

	const promise = axiosInstance.request<TData, ResponseConfig<TData>>(config).catch((e: AxiosError<TError>) => {
		throw (e.response?.data as TError) ?? (e as AxiosError<TError>)
	})

	return promise
}

export default axiosClient
