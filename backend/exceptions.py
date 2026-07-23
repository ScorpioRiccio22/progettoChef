from datetime import datetime, timezone

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class NotFoundException(Exception):
    def __init__(self, message: str):
        self.message = message


class ConflictException(Exception):
    def __init__(self, message: str):
        self.message = message


class InvalidCredentialsException(Exception):
    def __init__(self, message: str):
        self.message = message


class BadRequestException(Exception):
    """Equivalente di IllegalArgumentException lato Java."""

    def __init__(self, message: str):
        self.message = message


def _error_body(status_code: int, error: str, message: str, field_errors: dict | None = None) -> dict:
    body = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": status_code,
        "error": error,
        "message": message,
    }
    if field_errors:
        body["fieldErrors"] = field_errors
    return body


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotFoundException)
    async def handle_not_found(request: Request, exc: NotFoundException):
        return JSONResponse(_error_body(404, "Not Found", exc.message), status_code=status.HTTP_404_NOT_FOUND)

    @app.exception_handler(ConflictException)
    async def handle_conflict(request: Request, exc: ConflictException):
        return JSONResponse(_error_body(409, "Conflict", exc.message), status_code=status.HTTP_409_CONFLICT)

    @app.exception_handler(InvalidCredentialsException)
    async def handle_invalid_credentials(request: Request, exc: InvalidCredentialsException):
        return JSONResponse(_error_body(401, "Unauthorized", exc.message), status_code=status.HTTP_401_UNAUTHORIZED)

    @app.exception_handler(BadRequestException)
    async def handle_bad_request(request: Request, exc: BadRequestException):
        return JSONResponse(_error_body(400, "Bad Request", exc.message), status_code=status.HTTP_400_BAD_REQUEST)

    @app.exception_handler(RequestValidationError)
    async def handle_validation(request: Request, exc: RequestValidationError):
        field_errors = {}
        for err in exc.errors():
            loc = err.get("loc", ())
            field = loc[-1] if loc else "unknown"
            field_errors[str(field)] = err.get("msg", "Valore non valido")
        return JSONResponse(
            _error_body(400, "Bad Request", "Dati non validi", field_errors),
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    @app.exception_handler(Exception)
    async def handle_generic(request: Request, exc: Exception):
        return JSONResponse(
            _error_body(500, "Internal Server Error", "Si è verificato un errore inatteso"),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
