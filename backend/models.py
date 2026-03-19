from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    phone = Column(String)
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)  # ДОБАВЛЕНО
    description = Column(String, nullable=True)
    category = Column(String)  # category вместо categoryId
    district = Column(String)  # ДОБАВЛЕНО
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)  # ДОБАВЛЕНО
    photo_before = Column(String, nullable=True)
    photo_hash = Column(String, nullable=True)
    status = Column(String, default="new")
    cluster_id = Column(Integer, ForeignKey("clusters.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    ai_feedback = Column(String, nullable=True)
    # Добавим для совместимости
    votesCount = Column(Integer, default=0)

class Cluster(Base):
    __tablename__ = "clusters"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)  # category вместо categoryId
    title = Column(String)  # ДОБАВЛЕНО
    district = Column(String)  # ДОБАВЛЕНО
    center_lat = Column(Float)
    center_lon = Column(Float)
    issue_count = Column(Integer, default=1)
    priority = Column(String, default="medium")
    status = Column(String, default="new")
    photo_after = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())