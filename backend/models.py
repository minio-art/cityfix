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
    category = Column(String)
    description = Column(String, nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    photo_before = Column(String)
    status = Column(String, default="pending")
    cluster_id = Column(Integer, ForeignKey("clusters.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))

class Cluster(Base):
    __tablename__ = "clusters"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    center_lat = Column(Float)
    center_lon = Column(Float)
    issue_count = Column(Integer, default=1)
    priority = Column(String, default="medium")
    status = Column(String, default="new")
    photo_after = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())