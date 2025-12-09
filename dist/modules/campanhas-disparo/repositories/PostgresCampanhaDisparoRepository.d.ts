import type { CampanhaDisparo, CampanhaDisparoProps } from '../entities/CampanhaDisparo';
import type { ICampanhaDisparoRepository } from './ICampanhaDisparoRepository';
export declare class PostgresCampanhaDisparoRepository implements ICampanhaDisparoRepository {
    findAll(schema: string): Promise<CampanhaDisparoProps[]>;
    findById(schema: string, id: string): Promise<CampanhaDisparoProps | null>;
    findByChave(schema: string, chave: string): Promise<CampanhaDisparoProps | null>;
    findByRemetenteId(schema: string, remetenteId: string): Promise<CampanhaDisparoProps[]>;
    create(schema: string, campanha: CampanhaDisparo): Promise<CampanhaDisparoProps>;
    update(schema: string, campanha: CampanhaDisparo): Promise<CampanhaDisparoProps>;
    delete(schema: string, id: string): Promise<void>;
}
//# sourceMappingURL=PostgresCampanhaDisparoRepository.d.ts.map