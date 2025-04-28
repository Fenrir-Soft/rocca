import GeoHash from "ngeohash"

type Coords = {
    latitude: number
    longitude: number
}

export type Tag = {
    id: string,
    title: string
}

type PoiRaw = {
    id: number,
    lat: number,
    lng: number,
    name: string
    tags: string[]
}

export type Poi = {
    id: number
    lat: number
    lng: number
    name: string
    tags: Tag[]
}

let i18n = {
    "amenity:arts_centre": "Centro Artístico",
    "aeroway:aerodrome": "Aeroporto",
    "amenity:atm": "Caixa Eletrônico",
    "amenity:bank": "Banco",
    "amenity:bar": "Bar",
    "amenity:bus_station": "Estação de Ônibus",
    "amenity:cafe": 'Café',
    "amenity:car_wash": "Lavagem de Carro",
    "amenity:grave_yard": "Cemitério",
    "amenity:pharmacy": "Farmácia",
    "amenity:hospital": "Hospital",
    "amenity:library": "Biblioteca",
    "amenity:post_depot": "Depósito",
    "amenity:nightclub": "Clube Noturno",
    "amenity:parking": "Estacionamento",
    "amenity:police": "Polícia",
    "amenity:post_office": "Correios",
    "amenity:school": "Escola",
    "amenity:childcare": "Creche",
    "amenity:university": "Universidade",
    "amenity:restaurant": "Restaurante",
    "amenity:fuel": "Posto de Combustível",
    "craft:bakery": "Padaria",
    "shop:beauty": "Salão de Beleza",
    "shop:books": "Livraria",
    "shop:convenience": "Loja de Conveniência",
    "shop:chemist": "Farmácia",
    "shop:pet": "Pet Shop",
    "shop:mall": "Mercado",
    "shop:supermarket": "Supermercado",
    "landuse:cemetery": "Cemitério",
    "building:church": "Igreja",
    "building:stadium": "Estádio",
    "leisure:fitness_centre": "Academia",
    "leisure:sports_centre": "Centro Esportivo",
    "leisure:park": "Parque",
    "leisure:stadium": "Estádio",
    "tourism:museum": "Museu",
    "tourism:attraction": "Atração Turística",
    "public_transport:station": "Transporte Público"
};

let i18n_map: Map<string, string> = new Map()
let key: keyof typeof i18n
for (key in i18n) {    
    i18n_map.set(key, i18n[key])
}

export const search = async ({ latitude, longitude }: Coords, { neighbors = false, precision = 5, endpoint = "https://cdn.jsdelivr.net/gh/diasfs/osm-proximity@latest/poi-data" } = {}): Promise<Poi[]> => {
    let hashs = [GeoHash.encode(latitude, longitude, precision)]

    if (neighbors) {
        let [hash] = hashs
        hashs = [...hashs, ...GeoHash.neighbors(hash)]
    }

    let promises = hashs.map(async hash => {
        let url = `${endpoint}/${precision}/${hash}.json`
        return await fetch(url).then(resp => resp.json()).catch(() => { return [] })
    })

    
    let resp: PoiRaw[] = (await Promise.all(promises)).reduce((acc, pois) => ([...acc, ...pois])).map((poi: { id: string, lat: number, lng: number, name: string, tags: string}) => {
        return {
            ...poi,
            id: Number(poi.id),
            tags: poi.tags.split(',')
        }
    })

    let ids = [...new Set(resp.map(({ id }) => id))]

    let results =  ids.map(id => resp.find(poi => poi.id === id)).filter(poi => poi!==undefined).map(poi => {
        let tags = poi.tags.map(tag => {
            let translation = i18n_map.get(tag)
            if (!translation) {
                return null
            }
            return {
                id: tag,
                title: translation
            }
        }).filter(tag => tag !== null)
        return {
            ...poi,
            tags
        }
    })

    return results
}

export default search