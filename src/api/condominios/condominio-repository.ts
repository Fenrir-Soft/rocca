import type { Condominio } from "./condominio";

export class CondominioRepository {
    private records: Condominio[] = [];
    private footer: Condominio[] = [];

    private loading: Promise<void>;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        let request = await fetch(
            `https://www.roccaimob.com.br/_admin/js-api.php`,
            {
                method: "POST",
                body: new URLSearchParams({
                    method: "getAll",
                    "params[0]":
                        "select * from condominiogrupo where deleted = 0",
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );
        if (!request.ok) {
            throw new Error("Não foi possível carregar os condominios");
        }

        let response = await request.json();
        let rows = response.data;

        for (let row of rows) {
            let record: Condominio = {
                ...row,
                id: Number(row.id),
                diferenciais: row.diferenciais.split("|"),
                latitude: Number(row.latitude || "0"),
                longitude: Number(row.longitude || "0"),
                footer: row.footer && Number(row.footer) === 1,
            };
            if (record.meta_title === null) {
                record.meta_title = "";
            }
            if (record.meta_description === null) {
                record.meta_description = "";
            }

            if (!record.latitude) {
                record.latitude = 0;
            }
            if (!record.longitude) {
                record.longitude = 0;
            }

            this.records.push(record);
            if (record.footer) {
                this.footer.push(record);
            }
        }
    }

    async getAll(): Promise<Condominio[]> {
        await this.loading;
        return this.records;
    }

    async getFooter(): Promise<Condominio[]> {
        await this.loading;
        return this.footer;
    }
}
