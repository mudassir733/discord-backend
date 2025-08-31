
export interface ISocketRepository {
    emitToClient(clientId: string, event: string, data: any): void;
    onClientEvent(event: string, handler: (clientId: string, data: any) => void): void;
    start(): void;
    setUserSocket(userId: number, clientId: string): void;
    getClientId(userId: number): string | undefined;
}
