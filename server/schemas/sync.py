from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class SyncTransactionItem(BaseModel):
    client_tx_id: str = Field(..., min_length=1)
    payload_type: str = Field(..., min_length=1)  # create_site, create_artifact, update_artifact, create_layer, custody_transfer
    payload: Dict[str, Any]
    client_timestamp: Optional[datetime] = None


class BatchSyncRequest(BaseModel):
    transactions: List[SyncTransactionItem]


class SyncResultItem(BaseModel):
    client_tx_id: str
    status: str  # SYNCED, FAILED, SKIPPED
    entity_id: Optional[str] = None
    detail: Optional[str] = None


class BatchSyncResponse(BaseModel):
    total_received: int
    synced_count: int
    failed_count: int
    results: List[SyncResultItem]


class SyncStatusResponse(BaseModel):
    server_time: datetime
    server_version: str = "v2.0.0"
    status: str = "online"
    total_synced_transactions: int
