import { ref } from "vue";
import { CategoriaRepository } from "./categoria-repository";
import type { Categoria } from "./categoria";

export * from "./categoria";
export * from "./categoria-repository";

export const categoria_repository = new CategoriaRepository();
