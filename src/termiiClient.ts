import axios, { AxiosResponse } from 'axios';

export default class NodeTermii {
    private key: string;

    constructor(api_key: string) {
        this.key = api_key;
    }

    private base(url: string): string {
        return `https://api.ng.termii.com/api/${url}`;
    }

    private checkStatus(status: number): { success: boolean, message: string } {
        const responseMessages: { [key: number]: string } = {
            200: 'OK: Request was successful.',
            400: 'Bad Request: Indicates that the server cannot process the request due to a client error.',
            401: 'Unauthorized: No valid API key provided.',
            403: 'Forbidden: The API key doesn\'t have permissions to perform the request.',
            404: 'Not Found: The requested resource doesn\'t exist.',
            405: 'Method Not Allowed: The selected HTTP method is not allowed.',
            422: 'Unprocessable Entity: Server understands the content but couldn\'t process the request.',
            429: 'Too Many Requests: User has sent too many requests in a given amount of time.',
        };

        return status in responseMessages
            ? { success: status === 200, message: responseMessages[status] }
            : { success: false, message: 'Server Errors: Something went wrong on Termii\'s end OR status was not returned' };
    }

    public async balance(): Promise<string> {
        const url = this.base(`get-balance?api_key=${this.key}`);
        try {
            const response = await axios.get(url);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async history(): Promise<string> {
        const url = this.base(`sms/inbox?api_key=${this.key}`);
        try {
            const response = await axios.get(url);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async status(phone_number: number, country_code: string): Promise<string> {
        const url = this.base(`insight/number/query?api_key=${this.key}&phone_number=${phone_number}&country_code=${country_code}`);
        try {
            const response = await axios.get(url);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async search(phone_number: number): Promise<string> {
        const url = this.base(`check/dnd?api_key=${this.key}&phone_number=${phone_number}`);
        try {
            const response = await axios.get(url);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async allSenderId(): Promise<string> {
        const url = this.base(`sender-id?api_key=${this.key}`);
        try {
            const response = await axios.get(url);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async submitSenderId(sender_id: string, use_case: string, company: string): Promise<string> {
        const url = this.base(`sender-id/request`);
        try {
            const response = await axios.post(url, {
                api_key: this.key,
                sender_id,
                usecase: use_case,
                company
            });
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async sendMessage(
        to: number, from: string, sms: string, channel: string = 'generic',
        media: boolean = false, media_url?: string, media_caption?: string
    ): Promise<string> {
        const type = media && channel === 'whatsapp' ? 'whatsapp' : 'plain';
        const data: any = {
            api_key: this.key,
            to,
            from,
            type,
            channel,
            sms,
            ...(media && media_url && { 'media': JSON.stringify({ 'media.url': media_url, 'media.caption': media_caption }) })
        };

        try {
            const response = await axios.post(this.base('sms/send'), data);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async sendOTP(
        to: number, from: string, message_type: string, pin_attempts: number,
        pin_time_to_live: number, pin_length: number, pin_placeholder: string, message_text: string,
        channel: string = 'generic'
    ): Promise<string> {
        const data = {
            api_key: this.key,
            to,
            from,
            message_type,
            channel,
            pin_attempts,
            pin_time_to_live,
            pin_length,
            pin_placeholder,
            message_text
        };

        try {
            const response = await axios.post(this.base('sms/otp/send'), data);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async sendVoiceOTP(to: number, pin_attempts: number, pin_time_to_live: number, pin_length: number): Promise<string> {
        const data = {
            api_key: this.key,
            phone_number: to,
            pin_attempts,
            pin_time_to_live,
            pin_length
        };

        try {
            const response = await axios.post(this.base('sms/otp/send/voice'), data);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async sendVoiceCall(to: number, code: number): Promise<string> {
        const data = {
            api_key: this.key,
            phone_number: to,
            code
        };

        try {
            const response = await axios.post(this.base('sms/otp/call'), data);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async verifyOTP(pinId: string, pin: string): Promise<string> {
        const data = {
            api_key: this.key,
            pin_id: pinId,
            pin
        };

        try {
            const response = await axios.post(this.base('sms/otp/verify'), data);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }

    public async sendInAppOTP(to: number, pin_attempts: number, pin_time_to_live: number, pin_length: number, pin_type: string): Promise<string> {
        const data = {
            api_key: this.key,
            phone_number: to,
            pin_type,
            pin_attempts,
            pin_time_to_live,
            pin_length
        };

        try {
            const response = await axios.post(this.base('sms/otp/generate'), data);
            const statusCheck = this.checkStatus(response.status);
            return statusCheck.success ? response.data : statusCheck.message;
        } catch (error: any) {
            return this.checkStatus(error.response?.status || 500).message;
        }
    }
}