"""Pydantic schemas for request validation and response serialization."""

from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field


# --- Podcast Schemas ---


class PodcastBase(BaseModel):
    title: str = Field(..., max_length=255, description="Title of the podcast show")
    description: str = Field(..., description="Show summary and overview")
    author: str = Field(..., max_length=255, description="Host / Author name")
    cover_image_url: str = Field(..., max_length=512, description="Cover art image URL")
    category: str = Field(..., max_length=100, description="Primary category tag")
    total_subscribers: int = Field(0, ge=0, description="Subscriber count metric")


class PodcastCreate(PodcastBase):
    pass


class Podcast(PodcastBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PodcastListResponse(BaseModel):
    items: List[Podcast]
    total: int
    page: int
    limit: int
    pages: int


# --- Episode Schemas ---


class EpisodeBase(BaseModel):
    title: str = Field(..., max_length=255, description="Title of the episode")
    description: str = Field(..., description="Episode summary / show notes")
    audio_url: str = Field(..., max_length=512, description="Direct audio stream URL")
    duration_seconds: int = Field(..., ge=0, description="Total duration in seconds")
    episode_number: int = Field(..., ge=1, description="Sequential episode number")
    publish_date: datetime = Field(..., description="Release date in UTC")


class EpisodeCreate(EpisodeBase):
    podcast_id: str


class Episode(EpisodeBase):
    id: str
    podcast_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EpisodeListResponse(BaseModel):
    items: List[Episode]
    total: int
    page: int
    limit: int
    pages: int
