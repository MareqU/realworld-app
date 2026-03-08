import { APIRequestContext, APIResponse } from "@playwright/test";

export class NotificationsApi {
    private readonly request: APIRequestContext;
    public readonly notifications = '/notifications';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getNotifications(): Promise<APIResponse> {
        return this.request.get(this.notifications);
    }

    async createBulkNotifications(items: Record<string, string>[]): Promise<APIResponse> {
        return this.request.post(`${this.notifications}/bulk`, { data: { items } });
    }

    async updateNotification(notificationId: string, body: Record<string, string | boolean>): Promise<APIResponse> {
        return this.request.patch(`${this.notifications}/${notificationId}`, { data: body });
    }
}
