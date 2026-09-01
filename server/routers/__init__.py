from server.routers.visitor import router as visitor_router
from server.routers.inmate import router as inmate_router
from server.routers.appointment import router as appointment_router
from server.routers.verification import router as verification_router
from server.routers.entry_exit_log import router as entry_exit_log_router

__all__ = [
    "visitor_router",
    "inmate_router",
    "appointment_router",
    "verification_router",
    "entry_exit_log_router",
]
