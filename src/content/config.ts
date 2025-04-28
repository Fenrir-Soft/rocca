import { defineCollection, getCollection, z } from "astro:content";
import { db } from "../db";
import { imovel_repository } from "../api/imoveis";

import Slugify from "slugify";
import { foto_repository, type Foto } from "../api/fotos";
import { cdn_service, type CdnImage } from "../api/cdn";
import { v7 } from "uuid";
import { zona_repository } from "../api/zonas";
const slugify = (str: string): string => {
    return Slugify(str.replace(/\//igm,' '), {
        lower: true,
        trim: true,
    });
};

const imovelSchema = z.object({
    id: z.string(),
    codigo: z.string(),
    cidade_slug: z.string(),
    bairro_slug: z.string(),
    rua_slug: z.string(),
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
    bairro_comercial: z.string(),
    endereco: z.string(),
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
    latitude: z.string(),
    longitude: z.string()
})

const ruasSchema = z.object({
    id: z.string(),
    slug: z.string(),
    cidade_slug: z.string(),
    bairro_slug: z.string(),
    titulo: z.string(),
    cidade: z.string(),
    bairro: z.string(),
    uf: z.string(),
    imoveis: z.array(
        imovelSchema
    )
})

const bairroSchema = z.object({
    id: z.string(),
    slug: z.string(),
    cidade_slug: z.string(),
    uf: z.string(),
    cidade: z.string(),
    titulo: z.string(),
    ruas: z.array(ruasSchema)
})

const zonaSchema = z.object({
    id: z.string(),
    slug: z.string(),
    cidade_slug: z.string(),
    uf: z.string(),
    cidade: z.string(),
    titulo: z.string(),
    ordenamento: z.number(),
    bairros: z.array(bairroSchema)
})

const cidadeSchema = z.object({
    id: z.string(),
    slug: z.string(),
    uf: z.string(),
    titulo: z.string(),
    bairros: z.array(bairroSchema),
    zonas: z.array(zonaSchema),
    ruas: z.array(ruasSchema)
})

type Rua = z.infer<typeof ruasSchema>
type Bairro = z.infer<typeof bairroSchema>
type Zona = z.infer<typeof zonaSchema>
type Cidade = z.infer<typeof cidadeSchema>
type Imovel = z.infer<typeof imovelSchema>

const getImoveis = async (): Promise<Imovel[]> => {
    const records: Imovel[] = (await imovel_repository.getAll()).map((row) => {
        const cidade_slug = slugify(`${row.Cidade} ${row.UF}`)
        const bairro = row.BairroComercial != '' ? row.BairroComercial : row.Bairro
        const bairro_slug = slugify(`${bairro} ${row.Cidade} ${row.UF}`)
        const rua_slug = slugify(`${row.Endereco} ${bairro} ${row.Cidade} ${row.UF}`)
        
        const imovel: Imovel = {
            id: row.Codigo,
            codigo: row.Codigo,
            cidade_slug,
            bairro_slug,
            rua_slug,
            categoria: row.Categoria,
            empreendimento: row.Empreendimento,
            condominio: row.Condominio || row.NomeCondominio,
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
            bairro: row.Bairro||'',
            bairro_comercial: row.BairroComercial||'',
            endereco: row.Endereco||'',
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
            latitude: row.Latitude,
            longitude: row.Longitude
        };

        return imovel
    });

    return records
}

const getRuas = async (): Promise<Rua[]> => {
    const imoveis = await getImoveis()


    let ruas: Map<string, Rua> = new Map()
    for (let imovel of imoveis) {
        let bairro = imovel.bairro_comercial !== '' ? imovel.bairro_comercial : imovel.bairro

        let rua_slug = imovel.rua_slug
        let cidade_slug = imovel.cidade_slug
        let bairro_slug = imovel.bairro_slug

        let rua = ruas.get(rua_slug)
        if (!rua) {

            rua = {
                id: rua_slug,
                slug: rua_slug,
                cidade_slug,
                bairro_slug,
                titulo: imovel.endereco,
                cidade: imovel.cidade,
                bairro: bairro,
                uf: imovel.uf,
                imoveis: []
            }
            ruas.set(rua_slug, rua)
        }
        rua.imoveis.push(imovel)
    }
    
    return Array.from(ruas.values())
}

const getBairros = async (): Promise<Bairro[]> => {
    const ruas = await getRuas()
    const bairros: Map<string, Bairro> = new Map()
    for (let rua of ruas) {
        const bairro_slug = rua.bairro_slug
        let bairro = bairros.get(bairro_slug)
        if (!bairro) {
            bairro = {
                id: bairro_slug,
                slug: rua.bairro_slug,
                cidade_slug: rua.cidade_slug,
                uf: rua.uf,
                cidade: rua.cidade,
                titulo: rua.bairro,
                ruas: []
            }
            bairros.set(bairro.slug, bairro)
        }
        bairro.ruas.push(rua)
    }

    return Array.from(bairros.values())
}

const getCidades = async (): Promise<Cidade[]> => {
    const cidades: Map<string, Cidade> = new Map()
    
    
    const ruas = await getRuas()
    for (let rua of ruas) {
        let cidade = cidades.get(rua.cidade_slug)
        if (!cidade) {
            cidade = {
                id: rua.cidade_slug,
                slug: rua.cidade_slug,
                uf: rua.uf,
                titulo: rua.cidade,
                bairros: [],
                ruas: [],
                zonas: []
            }
            cidades.set(cidade.id, cidade)
        }
        cidade.ruas.push(rua)
    }

    const bairros = await getBairros()
    
    const bairros_map: Map<string, Bairro> = new Map()
    for (let bairro of bairros) {
        bairros_map.set(bairro.slug, bairro)
        let cidade = cidades.get(bairro.cidade_slug)
        if (!cidade) {
            cidade = {
                id: bairro.cidade_slug,
                slug: bairro.cidade_slug,
                uf: bairro.uf,
                titulo: bairro.cidade,
                bairros: [],
                ruas: [],
                zonas: []
            }
            cidades.set(cidade.id, cidade)
        }
        cidade.bairros.push(bairro)
    }

    const zonas = await zona_repository.getAll()
    for (let row of zonas) {
        let cidade = cidades.get(row.cidade_slug)
        if (!cidade) {
            continue
        }        
        let zona: Zona = {
            id: `${row.id}`,
            cidade_slug: row.cidade_slug,
            slug: row.slug,
            uf: cidade.uf,
            cidade: cidade.titulo,
            titulo: row.titulo,
            ordenamento: row.ordenamento,
            bairros: []
        }
        cidade.zonas.push(zona)

        for (let b of row.bairros) {
            let bairro = bairros_map.get(b.slug)
            if (bairro) {
                zona.bairros.push(bairro)
            }
        }
    }

    
    return Array.from(cidades.values())
}

const getZonas = async (): Promise<Zona[]> => {
    const cidades = await getCidades()
    const zonas: Map<string, Zona> = new Map()

    for (let cidade of cidades) {
        for (let zona of cidade.zonas) {
            if (!zonas.has(zona.id)) {
                zonas.set(zona.id, zona)
            }
        }
    }

    return Array.from(zonas.values())
}


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
        reel: z.coerce.string().optional()
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
    schema: imovelSchema,
    loader: getImoveis,
});



const fotosCollection = defineCollection({
    type: 'content_layer',
    loader: async () => {
        const fotos = await foto_repository.getAll();
        let records: (Foto & { id: string, titulo: string, image_cdn: CdnImage })[] = []
        for (let record of fotos) {
            const image_cdn = await cdn_service.save({
                id: `${v7()}`,
                bucket: `imovel`,
                hash: `${record.Codigo}`,
                caption: record.Descricao,
                type: "image/jpg",
                url: record.Foto,
                height: 0,
                width: 0,
                size: 0,
            });
            records.push({
                ...record,
                id: image_cdn.id,
                titulo: record.Descricao,
                image_cdn,
                
            });
        }
        return records
    },
    schema: z.object({
        id: z.string(),
        titulo: z.string(),
        Codigo: z.string(),
        Ordem: z.number(),
        ImagemCodigo: z.string(),
        Data: z.string(),
        Descricao: z.string(),
        Destaque: z.enum(["Sim", "Nao"]),
        ExibirNoSite: z.enum(["Sim", "Nao"]),
        Foto: z.string(),
        FotoPequena: z.string(),
        Tipo: z.string(),
        image_cdn: z.object({
            id: z.string(),
            bucket: z.string(),
            hash: z.string(),
            url: z.string(),
            caption: z.string(),
            width: z.number(),
            height: z.number(),
            size: z.number(),
            type: z.string()
        })
    })
})

const ruasCollection = defineCollection({
    type: 'content_layer',
    loader: getRuas,
    schema: ruasSchema
})

const bairrosCollection = defineCollection({
    type: 'content_layer',
    loader: getBairros,
    schema: bairroSchema
})

const cidadesCollection = defineCollection({
    type: 'content_layer',
    loader: getCidades,
    schema: cidadeSchema
})

const zonasCollection = defineCollection({
    type: 'content_layer',
    loader: getZonas,
    schema: zonaSchema
})

export const collections = {
    condominios: condominioCollection,
    condominio_imagens: condominioImagemCollection,
    imoveis: imoveisCollection,
    fotos: fotosCollection,
    ruas: ruasCollection,
    bairros: bairrosCollection,
    zonas: zonasCollection,
    cidades: cidadesCollection
};
