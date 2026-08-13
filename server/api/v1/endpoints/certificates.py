import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from server.services.certificate_service import generate_certificate_pdf

router = APIRouter()


@router.get(
    "/certificates/verify/{verification_uuid}",
    response_model=schemas.CertificateVerificationResponse,
)
def verify_certificate_endpoint(
    verification_uuid: uuid.UUID,
    db: Session = Depends(get_db),
):
    cert = crud.get_certificate_by_uuid(db, verification_uuid)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate invalid or authentic record not found",
        )

    player = crud.get_player(db, cert.player_id)
    tournament = crud.get_tournament(db, cert.tournament_id)

    player_name = player.full_name if player else "Unknown Player"
    tournament_name = tournament.name if tournament else "Unknown Tournament"

    return schemas.CertificateVerificationResponse(
        verification_uuid=cert.verification_uuid,
        valid=True,
        player_name=player_name,
        tournament_name=tournament_name,
        rank=cert.rank,
        total_points=cert.total_points,
        issued_at=cert.issued_at,
        qr_code_url=cert.qr_code_url,
    )


@router.get(
    "/certificates/{verification_uuid}/pdf",
)
def download_certificate_pdf_endpoint(
    verification_uuid: uuid.UUID,
    db: Session = Depends(get_db),
):
    cert = crud.get_certificate_by_uuid(db, verification_uuid)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate invalid or authentic record not found",
        )

    player = crud.get_player(db, cert.player_id)
    tournament = crud.get_tournament(db, cert.tournament_id)

    player_name = player.full_name if player else "Player"
    tournament_name = tournament.name if tournament else "Tournament"
    issued_str = cert.issued_at.strftime("%Y-%m-%d")

    pdf_bytes = generate_certificate_pdf(
        player_name=player_name,
        tournament_name=tournament_name,
        rank=cert.rank,
        total_points=cert.total_points,
        verification_uuid=str(cert.verification_uuid),
        issued_at_str=issued_str,
    )

    filename = f"Certificate_{player_name.replace(' ', '_')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
