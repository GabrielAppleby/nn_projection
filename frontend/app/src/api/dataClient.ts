import {API_URL} from "./common";
import {DataSize} from "../types/data";

async function dataClient<T>(path: string, dataSize: DataSize, config: RequestInit): Promise<T> {
    const url = new URL(`${API_URL}${path}`);
    url.search = new URLSearchParams([['size', dataSize.toString()]]).toString();
    const request = new Request(url.toString(), config);
    const response = await fetch(request);

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json().then((res) => res['data']).catch(() => ({}));
}

export async function getData<T>(path: string, dataSize: DataSize, config?: RequestInit): Promise<T> {
    const init = {method: 'get', ...config};

    return await dataClient<T>(path, dataSize, init);
}
