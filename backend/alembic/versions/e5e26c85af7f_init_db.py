"""init db

Revision ID: e5e26c85af7f
Revises: f3d0fcce92fd
Create Date: 2026-06-07 15:02:48.177496

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5e26c85af7f'
down_revision: Union[str, None] = 'f3d0fcce92fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
