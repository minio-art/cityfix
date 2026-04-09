from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    name = Column(String)
    phone = Column(String)
    password_hash = Column(String, nullable=True)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reports = relationship("Issue", back_populates="user", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="user", cascade="all, delete-orphan")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    issue_id = Column(Integer, ForeignKey("issues.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (UniqueConstraint('user_id', 'issue_id', name='unique_user_issue'),)
    
    user = relationship("User", back_populates="votes")
    issue = relationship("Issue", back_populates="votes")


class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String)
    district = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)
    photo_before = Column(String, nullable=True)
    photo_hash = Column(String, nullable=True)
    status = Column(String, default="new")
    cluster_id = Column(Integer, ForeignKey("clusters.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    votesCount = Column(Integer, default=0)

    user = relationship("User", back_populates="reports")
    cluster = relationship("Cluster", back_populates="issues")
    votes = relationship("Vote", back_populates="issue", cascade="all, delete-orphan")


class Cluster(Base):
    __tablename__ = "clusters"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    title = Column(String)
    district = Column(String)
    center_lat = Column(Float)
    center_lon = Column(Float)
    issue_count = Column(Integer, default=1)
    priority = Column(String, default="medium")
    status = Column(String, default="new")
    photo_after = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    issues = relationship("Issue", back_populates="cluster", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())