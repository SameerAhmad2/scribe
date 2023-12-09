import APIInteractor from "./common"

interface StandardSuccessResponse {
    status: true;
    content: string;
}

interface StandardFailureResponse {
    status: false;
    error_msg: string;
}

type StandardReturnType = StandardSuccessResponse | StandardFailureResponse;


export const fetchExplanation = async (inputCode: string, complexity: number, language?: string, responseLanguage?: string): Promise<StandardReturnType> => {
    try {
        const explainAPI = new APIInteractor('generation/explain/')
        const explainResponse: any = await explainAPI.post({
            body: JSON.stringify({
                language_model: "openai",
                response_language: responseLanguage,
                code_extension: language || "typescript",
                code_block_to_generate_from: inputCode,
                explanation_complexity: complexity * 10,
            } as any)
        })

        return explainResponse.status
            ? { status: true, content: explainResponse.data.explained_output }
            : { status: false, error_msg: explainResponse.error + '\n' + (JSON.stringify(explainResponse.data) ?? 'NO ADDTIONAL DATA') }
    } catch (e) { return { status: false, error_msg: e as string } }
}


export const fetchDefinition = async (inputCode: string, language?: string, documentationFramework?: string): Promise<StandardReturnType> => {
    try {

        const defineAPI = new APIInteractor('generation/define/')
        const defineResponse: any = await defineAPI.post({
            body: JSON.stringify({
                language_model: "openai",
                code_extension: language || "typescript",
                code_block_to_generate_from: inputCode,
                ...(documentationFramework ? { alternative_framework: documentationFramework } : {})
            } as any)
        })

        return defineResponse.status
            ? { status: true, content: defineResponse.data.defined_output }
            : { status: false, error_msg: defineResponse.error + '\n' + (JSON.stringify(defineResponse.data) ?? 'NO ADDTIONAL DATA') }
    } catch (e) { return { status: false, error_msg: e as string } }
}

export const fetchRevision = async (inputCode: string, language?: string, caseType?: string): Promise<StandardReturnType> => {
    try {
        const reviseAPI = new APIInteractor('generation/revise/')
        const reviseResponse: any = await reviseAPI.post({
            body: JSON.stringify({
                language_model: "openai",
                code_extension: language || "typescript",
                code_block_to_generate_from: inputCode,
                ...(caseType ? { variable_naming_scheme: caseType } : {})
            } as any)
        })

        return reviseResponse.status
            ? { status: true, content: reviseResponse.data.revised_output }
            : { status: false, error_msg: reviseResponse.error + '\n' + (JSON.stringify(reviseResponse.data) ?? 'NO ADDTIONAL DATA') }
    } catch (e) { return { status: false, error_msg: e as string } }
}


export const fetchAnnotation = async (inputCode: string, language?: string): Promise<StandardReturnType> => {
    try {
        const annotateAPI = new APIInteractor('generation/annotate/')
        const annotateResponse: any = await annotateAPI.post({
            body: JSON.stringify({
                language_model: "openai",
                code_extension: language || "typescript",
                code_block_to_generate_from: inputCode,
            } as any)
        })
        return annotateResponse.status
            ? { status: true, content: annotateResponse.data.annotated_output }
            : { status: false, error_msg: annotateResponse.error + '\n' + (JSON.stringify(annotateResponse.data) ?? 'NO ADDTIONAL DATA') }
    } catch (e) { return { status: false, error_msg: e as string } }
}

interface SuccessAnalysis {
    status: true;
    complexity: { [functionName: string]: { space: string, runtime: string } }
}

interface FailureAnalysis {
    status: false;
    error_msg: string;
}

type AnalysisReturnType = SuccessAnalysis | FailureAnalysis;

export const fetchAnalysis = async (inputCode: string, language?: string): Promise<AnalysisReturnType> => {
    try {
        const analyseAPI = new APIInteractor('generation/analyse/')
        const analyseResponse: any = await analyseAPI.post({
            body: JSON.stringify({
                language_model: "openai",
                code_extension: language || "typescript",
                code_block_to_generate_from: inputCode,
            } as any)
        })

        return analyseResponse.status
            ? { status: true, complexity: analyseResponse.data.complexity_breakdown }
            : { status: false, error_msg: analyseResponse.error + '\n' + (JSON.stringify(analyseResponse.data) ?? 'NO ADDTIONAL DATA') }

    } catch (e) { return { status: false, error_msg: e as string } }
}


export const fetchPDFMetaData = async (fileInfo: string, language?: string): Promise<StandardReturnType> => {
    try {
        const annotateAPI = new APIInteractor('generation/create-pdf/')
        const annotateResponse: any = await annotateAPI.post({
            body: JSON.stringify({
                code_file_to_generate_from: fileInfo,
                language_model: 'openai',
                code_extension: language || 'typescript'
            } as any)
        })
        return annotateResponse.status
            ? { status: true, content: annotateResponse.data }
            : { status: false, error_msg: annotateResponse.error + '\n' + (JSON.stringify(annotateResponse.data) ?? 'NO ADDTIONAL DATA') }
    } catch (e) { return { status: false, error_msg: e as string } }
}
