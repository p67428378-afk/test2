from fastapi import FastAPI
from server.api.v1 import payouts, tds
from server.database import engine
from server.models import payout_batch, payout_transaction, tds_configuration, audit_log

payout_batch.Base.metadata.create_all(bind=engine)
payout_transaction.Base.metadata.create_all(bind=engine)
tds_configuration.Base.metadata.create_all(bind=engine)
audit_log.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(payouts.router, prefix="/api/v1/payouts", tags=["payouts"])
app.include_router(tds.router, prefix="/api/v1/tds", tags=["tds"])

@app.get("/")
def read_root():
    return {"message": "Interest Payout Microservice"}
