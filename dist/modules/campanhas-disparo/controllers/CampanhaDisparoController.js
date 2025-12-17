"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaDisparoController = exports.CampanhaDisparoController = void 0;
const AppError_1 = require("../../../core/errors/AppError");
const repositories_1 = require("../repositories");
const ListCampanhasDisparoUseCase_1 = require("../useCases/listCampanhasDisparo/ListCampanhasDisparoUseCase");
const GetCampanhaDisparoUseCase_1 = require("../useCases/getCampanhaDisparo/GetCampanhaDisparoUseCase");
const CreateCampanhaDisparoUseCase_1 = require("../useCases/createCampanhaDisparo/CreateCampanhaDisparoUseCase");
const UpdateCampanhaDisparoUseCase_1 = require("../useCases/updateCampanhaDisparo/UpdateCampanhaDisparoUseCase");
const DeleteCampanhaDisparoUseCase_1 = require("../useCases/deleteCampanhaDisparo/DeleteCampanhaDisparoUseCase");
const EnviarCampanhaDisparoUseCase_1 = require("../useCases/enviarCampanhaDisparo/EnviarCampanhaDisparoUseCase");
const campanhaDisparo_schema_1 = require("../validators/campanhaDisparo.schema");
const enviarCampanhaDisparo_schema_1 = require("../validators/enviarCampanhaDisparo.schema");
const repositories_2 = require("../../remetentes-smtp/repositories");
class CampanhaDisparoController {
    constructor() {
        this.index = async (req, res, next) => {
            try {
                const schema = req.schema;
                const campanhas = await this.listCampanhasDisparo.execute(schema);
                return res.json(campanhas);
            }
            catch (error) {
                return next(error);
            }
        };
        this.show = async (req, res, next) => {
            try {
                const schema = req.schema;
                const { id } = req.params;
                if (!id) {
                    throw new AppError_1.AppError('ID é obrigatório', 400);
                }
                const campanha = await this.getCampanhaDisparo.execute(schema, id);
                return res.json(campanha);
            }
            catch (error) {
                return next(error);
            }
        };
        this.store = async (req, res, next) => {
            try {
                const schema = req.schema;
                const parseResult = campanhaDisparo_schema_1.createCampanhaDisparoSchema.safeParse(req.body);
                if (!parseResult.success) {
                    throw new AppError_1.AppError('Dados inválidos', 400, parseResult.error.issues);
                }
                const campanha = await this.createCampanhaDisparo.execute(schema, parseResult.data);
                return res.status(201).json(campanha);
            }
            catch (error) {
                return next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const schema = req.schema;
                const { id } = req.params;
                if (!id) {
                    throw new AppError_1.AppError('ID é obrigatório', 400);
                }
                const parseResult = campanhaDisparo_schema_1.updateCampanhaDisparoSchema.safeParse(req.body);
                if (!parseResult.success) {
                    throw new AppError_1.AppError('Dados inválidos', 400, parseResult.error.issues);
                }
                const campanha = await this.updateCampanhaDisparo.execute(schema, id, parseResult.data);
                return res.json(campanha);
            }
            catch (error) {
                return next(error);
            }
        };
        this.destroy = async (req, res, next) => {
            try {
                const schema = req.schema;
                const { id } = req.params;
                if (!id) {
                    throw new AppError_1.AppError('ID é obrigatório', 400);
                }
                await this.deleteCampanhaDisparo.execute(schema, id);
                return res.status(204).send();
            }
            catch (error) {
                return next(error);
            }
        };
        this.enviar = async (req, res, next) => {
            try {
                const schema = req.schema;
                const { id } = req.params;
                if (!id) {
                    throw new AppError_1.AppError('ID é obrigatório', 400);
                }
                const parseResult = enviarCampanhaDisparo_schema_1.enviarCampanhaDisparoSchema.safeParse(req.body);
                if (!parseResult.success) {
                    throw new AppError_1.AppError('Dados inválidos', 400, parseResult.error.issues);
                }
                // Obter token de autenticação do header para passar para a API de clientes
                const authHeader = req.headers.authorization;
                const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
                const enviarData = {};
                if (parseResult.data.anexos !== undefined) {
                    enviarData.anexos = parseResult.data.anexos;
                }
                const result = await this.enviarCampanhaDisparo.execute(schema, id, enviarData, accessToken);
                return res.json(result);
            }
            catch (error) {
                return next(error);
            }
        };
        this.listCampanhasDisparo = new ListCampanhasDisparoUseCase_1.ListCampanhasDisparoUseCase(repositories_1.campanhaDisparoRepository);
        this.getCampanhaDisparo = new GetCampanhaDisparoUseCase_1.GetCampanhaDisparoUseCase(repositories_1.campanhaDisparoRepository);
        this.createCampanhaDisparo = new CreateCampanhaDisparoUseCase_1.CreateCampanhaDisparoUseCase(repositories_1.campanhaDisparoRepository);
        this.updateCampanhaDisparo = new UpdateCampanhaDisparoUseCase_1.UpdateCampanhaDisparoUseCase(repositories_1.campanhaDisparoRepository);
        this.deleteCampanhaDisparo = new DeleteCampanhaDisparoUseCase_1.DeleteCampanhaDisparoUseCase(repositories_1.campanhaDisparoRepository);
        this.enviarCampanhaDisparo = new EnviarCampanhaDisparoUseCase_1.EnviarCampanhaDisparoUseCase(repositories_1.campanhaDisparoRepository, repositories_2.remetenteSmtpRepository);
    }
}
exports.CampanhaDisparoController = CampanhaDisparoController;
exports.campanhaDisparoController = new CampanhaDisparoController();
//# sourceMappingURL=CampanhaDisparoController.js.map