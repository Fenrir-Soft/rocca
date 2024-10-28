import {
    CompiledQuery,
    type DatabaseConnection,
    type QueryResult,
} from "kysely";

export class RemoteConnection implements DatabaseConnection {
    public constructor(private endpoint: string) {}
    async executeQuery<R>(
        compiledQuery: CompiledQuery,
    ): Promise<QueryResult<R>> {
        try {
            const body = new URLSearchParams({
                method: "getAll",
                "params[0]": compiledQuery.sql,
            });
            for (let param of compiledQuery.parameters) {
                body.append("params[1][]", `${param}`);
            }
            const request = await fetch(this.endpoint, {
                method: "POST",
                body,
            });

            if (!request.ok) {
                console.error(body);
                throw new Error(compiledQuery.sql);
            }

            const data = await request.json();

            return {
                rows: data.data,
            };
        } catch (error) {
            console.error(error);

            throw error;
        }
    }
    async *streamQuery<R>(
        compiledQuery: CompiledQuery,
        _chunkSize?: number,
    ): AsyncIterableIterator<QueryResult<R>> {
        const data = await this.executeQuery<R>(compiledQuery);
        for (let row of data.rows) {
            yield {
                rows: [row],
            };
        }
    }
}
