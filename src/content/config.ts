import { defineCollection, z } from "astro:content";
import { db } from "../db";
import { imovel_repository } from "../api/imoveis";

import Slugify from "slugify";
const slugify = (str: string): string => {
    return Slugify(str, {
        lower: true,
        trim: true,
    });
};

const condominioImagemCollection = defineCollection({
    type: "content_layer",
    schema: z.object({
        id: z.string(),
        condominio_id: z.number(),
        titulo: z.string(),
        size: z.number(),
        path: z.string(),
        destaque: z.boolean(),
        ext: z.string(),
        galeria: z.string(),
        legenda: z.string(),
        ordenamento: z.number(),
        orientacao: z.string().optional().nullable(),
    }),
    loader: {
        name: "condominio-imagem-loader",
        load: async ({ store, meta, parseData, generateDigest }) => {
            try {
                const last_updated = meta.get("last_updated") || "";
                const records = (
                    await db
                        .selectFrom("condominiogrupoarquivo")
                        .selectAll()
                        .where("modified", ">", last_updated)
                        .execute()
                ).map((row) => {
                    return {
                        ...row,
                        id: `${row.id}`,
                        condominio_id: Number(row.condominiogrupo_id),
                        size: Number(row.size),
                        destaque: `${row.deleted}` === "1",
                        ordenamento: Number(row.ordenamento),
                        deleted: `${row.deleted}` === "1",
                        path: `https://www.roccaimob.com.br/_files/${row.path}`,
                    };
                });

                for (const record of records) {
                    if (record.deleted) {
                        store.delete(`${record.id}`);
                    }
                }

                for (let record of records) {
                    if (record.deleted) {
                        continue;
                    }

                    const data = await parseData({
                        id: `${record.id}`,
                        data: {
                            ...record,
                        },
                    });
                    const digest = generateDigest(data);
                    store.set({
                        id: `${record.id}`,
                        data,
                        digest,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
});

const condominioCollection = defineCollection({
    type: "content_layer",
    schema: z.object({
        id: z.number(),
        slug: z.string(),
        titulo: z.string(),
        nome_condominio: z.string(),
        diferenciais: z.array(z.string()),
        descricao: z.string(),
        cep: z.string(),
        uf: z.string(),
        cidade: z.string(),
        bairro: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        apresentacao_dos_imoveis: z.string().optional(),
        footer: z.boolean(),
        meta_title: z.string(),
        meta_descriptions: z.string().optional(),
    }),
    loader: {
        name: "condominios-loader",
        load: async ({ store, meta, parseData, generateDigest }) => {
            const last_updated = meta.get("last_updated") || "";
            const condominios = (
                await db
                    .selectFrom("condominiogrupo")
                    .selectAll()
                    .where("modified", ">", last_updated)
                    .execute()
            ).map((row) => {
                return {
                    ...row,
                    id: Number(row.id),
                    ordenamento: Number(row.ordenamento),
                    latitude: Number(
                        (`${row.latitude}` || "").replace(/,/gim, ".") || "0",
                    ),
                    longitude: Number(
                        (`${row.longitude}` || "").replace(/,/gim, ".") || "0",
                    ),
                    footer: `${row.footer}` === "1",
                    deleted: `${row.deleted}` === "1",
                    diferenciais: row.diferenciais
                        .split("|")
                        .map((d) => d.trim())
                        .filter((d) => d != ""),
                    meta_title: row.meta_title || "",
                };
            });

            for (const condominio of condominios) {
                if (condominio.deleted) {
                    store.delete(`${condominio.id}`);
                }
            }

            for (let condominio of condominios) {
                const data = await parseData({
                    id: `${condominio.id}`,
                    data: condominio,
                });
                const digest = generateDigest(data);
                store.set({
                    id: `${condominio.id}`,
                    data,
                    digest,
                });
            }
        },
    },
});

const imoveisCollection = defineCollection({
    type: "content_layer",
    schema: z.object({
        codigo: z.string(),
        categoria: z.string(),
        empreendimento: z.string().optional(),
        condominio: z.string().optional(),
        valor_venda: z.number(),
        valor_venda_de: z.number(),
        valor_venda_por: z.number(),
        valor_locacao: z.number(),
        valor_locacao_de: z.number(),
        valor_locacao_por: z.number(),
        valor_venda_padrao: z.number(),
        valor_m2: z.number(),
        valor_condominio: z.number(),
        valor_iptu: z.number(),
        uf: z.string(),
        cidade: z.string(),
        bairro: z.string(),
        bairro_comercial: z.string().optional(),
        endereco: z.string().optional(),
        numero: z.string().optional(),
        complemento: z.string().optional(),
        area_total: z.number(),
        area_privativa: z.number(),
        dormitorios: z.number(),
        suites: z.number(),
        vagas: z.number(),
        banheiros: z.number(),
        foto_destaque: z.string(),
        foto_destaque_pequena: z.string(),
        e_empreendimento: z.boolean(),
        status: z.string(),
        mobiliado: z.boolean(),
        semi_mobiliado: z.boolean(),
        situacao: z.string(),
        destaque: z.boolean(),
        super_destaque: z.boolean(),
        descricao: z.string(),
        venda: z.boolean(),
        locacao: z.boolean(),
        slug: z.string(),
        slug_status: z.string(),
    }),
    loader: {
        name: "imoveis-loader",
        load: async ({ store, parseData, generateDigest }) => {
            const records = (await imovel_repository.getAll()).map((row) => {
                return {
                    codigo: row.Codigo,
                    categoria: row.Categoria,
                    empreendimento: row.Empreendimento,
                    condominio: row.Condominio,
                    valor_venda: Number(row.ValorVenda || "0"),
                    valor_venda_de: Number(row.ValorVendaDe || "0"),
                    valor_venda_por: Number(row.ValorVendaPor || "0"),
                    valor_locacao: Number(row.ValorLocacao || "0"),
                    valor_locacao_de: Number(row.ValorLocacaoDe || "0"),
                    valor_locacao_por: Number(row.ValorLocacaoPor || "0"),
                    valor_venda_padrao: Number(row.ValorVendaPadrao || "0"),
                    valor_m2: Number(row.ValorM2 || "0"),
                    valor_condominio: Number(row.ValorCondominio || "0"),
                    valor_iptu: Number(row.ValorIptu || "0"),
                    uf: row.UF,
                    cidade: row.Cidade,
                    bairro: row.Bairro,
                    bairro_comecial: row.BairroComercial,
                    endereco: row.Endereco,
                    numero: row.Numero,
                    complemento: row.Complemento,
                    area_total: Number(row.AreaTotal || "0"),
                    area_privativa: Number(row.AreaPrivativa || "0"),
                    dormitorios: Number(row.Dormitorios || "0"),
                    suites: Number(row.Suites || "0"),
                    vagas: Number(row.Vagas || "0"),
                    banheiros: Number(row.BanheiroSocialQtd || "0"),
                    foto_destaque: row.FotoDestaque,
                    foto_destaque_pequena: row.FotoDestaquePequena,
                    e_empreendimento: row.EEmpreendimento === "Sim",
                    status: row.Status,
                    slug_status: slugify(row.Status),
                    mobiliado: row.Mobiliaddo === "Sim",
                    semi_mobiliado: row.SemiMobiliado === "Sim",
                    situacao: row.Situacao,
                    destaque: row.DestaqueWeb === "Sim",
                    super_destaque: row.SuperDestaqueWeb === "Sim",
                    descricao: row.DescricaoWeb,
                    venda:
                        row.Status == "Venda" ||
                        row.Status == "Venda e Aluguel",
                    locacao:
                        row.Status == "Aluguel" ||
                        row.Status == "Venda e Aluguel",
                    slug: slugify(
                        `${row.Categoria} ${row.Bairro} ${row.Cidade} ${row.UF}`,
                    ),
                };
            });

            store.clear();

            for (let record of records) {
                const data = await parseData({
                    id: `${record.codigo}`,
                    data: record,
                });
                const digest = generateDigest(data);
                store.set({
                    id: `${record.codigo}`,
                    data,
                    digest,
                });
            }
        },
    },
});

export const collections = {
    condominios: condominioCollection,
    condominio_imagens: condominioImagemCollection,
    imoveis: imoveisCollection,
};
