export interface IBaseAPI {
    hostname: string;
}


class APIInteractor implements IBaseAPI {
    uri: string;
    hostname: string;

    // Private urls
    private response?: Response;
    private authenticated: boolean;

    constructor(uri: string, authenticated = false) {
        this.uri = uri;
        this.authenticated = authenticated;
        this.hostname = 'http://127.0.0.1:8000';

    }

    is_json_parseable = (response: Response) => {
        return response.headers.get('content-type')?.includes('application/json');
    }

    generate_endpoint_url = () => {
        return `${this.hostname}/${this.uri}`
    }

    compile_headers = (): Headers => {
        const headers = new Headers();
        if (this.authenticated) {
            const auth_token = ''
            headers.append('Authorization', `Bearer ${auth_token}}`)
        }

        return headers
    }

    get = async (get_options: Partial<RequestInit>): Promise<any> => {
        let response: any = { status: true }
        const headers = this.compile_headers();
        this.response = await fetch(this.generate_endpoint_url(), {
            headers, method: 'GET', ...get_options,
        })

        if (!this.response.ok) {
            response = {
                ...response,
                status: false,
                error: `Failed to get from ${this.uri} [${this.response.status}]`
            }
        }

        if (this.is_json_parseable(this.response)) {
            response = { ...response, data: await this.json() }
        }

        return response
    }

    post = async (post_options: Partial<RequestInit>): Promise<Object | boolean> => {
        let response: any = { status: true }
        const headers = this.compile_headers();
        headers.append('Content-Type', 'application/json')

        this.response = await fetch(this.generate_endpoint_url(), {
            headers, method: 'POST', ...post_options,
        })

        if (!this.response.ok) {
            response = {
                ...response,
                status: false,
                error: `Failed to post to ${this.uri} [${this.response.status}]`
            }
        }

        if (this.is_json_parseable(this.response)) {
            response = { ...response, data: await this.json() as Object }
        }

        return response
    }

    text = async () => (await this.response?.text())
    json = async () => (await this.response?.json())
}


export default APIInteractor;