"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remetenteSmtpController = exports.RemetenteSmtpController = void 0;
const AppError_1 = require("../../../core/errors/AppError");
const repositories_1 = require("../repositories");
const ListRemetentesSmtpUseCase_1 = require("../useCases/listRemetentesSmtp/ListRemetentesSmtpUseCase");
const GetRemetenteSmtpUseCase_1 = require("../useCases/getRemetenteSmtp/GetRemetenteSmtpUseCase");
const CreateRemetenteSmtpUseCase_1 = require("../useCases/createRemetenteSmtp/CreateRemetenteSmtpUseCase");
const UpdateRemetenteSmtpUseCase_1 = require("../useCases/updateRemetenteSmtp/UpdateRemetenteSmtpUseCase");
const DeleteRemetenteSmtpUseCase_1 = require("../useCases/deleteRemetenteSmtp/DeleteRemetenteSmtpUseCase");
const remetenteSmtp_schema_1 = require("../validators/remetenteSmtp.schema");
class RemetenteSmtpController {
    constructor() {
        this.index = async (req, res, next) => {
            try {
                const schema = req.schema;
                const remetentes = await this.listRemetentesSmtp.execute(schema);
                return res.json(remetentes);
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
                const remetente = await this.getRemetenteSmtp.execute(schema, id);
                return res.json(remetente);
            }
            catch (error) {
                return next(error);
            }
        };
        this.store = async (req, res, next) => {
            try {
                const schema = req.schema;
                const parseResult = remetenteSmtp_schema_1.createRemetenteSmtpSchema.safeParse(req.body);
                if (!parseResult.success) {
                    throw new AppError_1.AppError('Dados inválidos', 400, parseResult.error.issues);
                }
                const remetente = await this.createRemetenteSmtp.execute(schema, parseResult.data);
                return res.status(201).json(remetente);
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
                const parseResult = remetenteSmtp_schema_1.updateRemetenteSmtpSchema.safeParse(req.body);
                if (!parseResult.success) {
                    throw new AppError_1.AppError('Dados inválidos', 400, parseResult.error.issues);
                }
                const remetente = await this.updateRemetenteSmtp.execute(schema, id, parseResult.data);
                return res.json(remetente);
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
                await this.deleteRemetenteSmtp.execute(schema, id);
                return res.status(204).send();
            }
            catch (error) {
                return next(error);
            }
        };
        this.listRemetentesSmtp = new ListRemetentesSmtpUseCase_1.ListRemetentesSmtpUseCase(repositories_1.remetenteSmtpRepository);
        this.getRemetenteSmtp = new GetRemetenteSmtpUseCase_1.GetRemetenteSmtpUseCase(repositories_1.remetenteSmtpRepository);
        this.createRemetenteSmtp = new CreateRemetenteSmtpUseCase_1.CreateRemetenteSmtpUseCase(repositories_1.remetenteSmtpRepository);
        this.updateRemetenteSmtp = new UpdateRemetenteSmtpUseCase_1.UpdateRemetenteSmtpUseCase(repositories_1.remetenteSmtpRepository);
        this.deleteRemetenteSmtp = new DeleteRemetenteSmtpUseCase_1.DeleteRemetenteSmtpUseCase(repositories_1.remetenteSmtpRepository);
    }
}
exports.RemetenteSmtpController = RemetenteSmtpController;
exports.remetenteSmtpController = new RemetenteSmtpController();
//# sourceMappingURL=RemetenteSmtpController.js.map