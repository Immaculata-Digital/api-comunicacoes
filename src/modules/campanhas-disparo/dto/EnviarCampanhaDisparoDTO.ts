export interface EnviarCampanhaDisparoDTO {
  anexos?: Array<{
    nome: string
    conteudo: string // Base64
    tipo: string // MIME type (ex: application/pdf, image/png)
  }>
}

