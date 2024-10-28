import type { Driver, DatabaseConnection, TransactionSettings } from "kysely";
import { RemoteConnection } from "./remote-connection";

export class RemoteDriver implements Driver {
    public constructor(private endpoint: string) {}
    async init(): Promise<void> {
        ///throw new Error('Method not implemented.')
        return;
    }
    async acquireConnection(): Promise<DatabaseConnection> {
        return new RemoteConnection(this.endpoint);
    }
    beginTransaction(
        _connection: DatabaseConnection,
        _settings: TransactionSettings,
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    commitTransaction(_connection: DatabaseConnection): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rollbackTransaction(_connection: DatabaseConnection): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async releaseConnection(_connection: DatabaseConnection): Promise<void> {
        //throw new Error('Method not implemented.')
        return;
    }
    async destroy(): Promise<void> {
        //throw new Error('Method not implemented.')
        return;
    }
}
