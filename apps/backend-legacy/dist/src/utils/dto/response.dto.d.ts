export declare enum ErrorCode {
    GENERIC_ERROR = "GENERIC_ERROR",
    NOT_FOUND = "NOT_FOUND",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    CONFLICT_ERROR = "CONFLICT_ERROR",
    BAD_REQUEST = "BAD_REQUEST"
}
export declare class ResponseDTO {
    message?: string;
    errorCode?: ErrorCode | string;
    errors?: object;
}
export declare class HTTPResponseDTO extends ResponseDTO {
    statusCode: number;
}
export declare class WSResponseDTO extends ResponseDTO {
    status: 'success' | 'error' | 'failed' | 'forbidden';
    responseChannel?: string;
    data?: object;
}
