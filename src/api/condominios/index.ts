import { CondominioArquivoRepository } from './condominio-arquivo-repository'
import { CondominioRepository } from './condominio-repository'

export * from './condominio'
export * from './condominio-repository'

export * from './condominio-arquivo'
export * from './condominio-arquivo-repository'

export const condominio_repository = new CondominioRepository()
export const condominio_arquivo_repository = new CondominioArquivoRepository()