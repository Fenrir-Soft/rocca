import { ref } from "vue";
import { BairroRepository } from "./bairro-repository";
import type { Bairro } from "./bairro";

export * from "./bairro";
export * from "./bairro-repository";

export const bairro_repository = new BairroRepository();