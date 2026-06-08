"""Create users table

Revision ID: 94cc1e8a460e
Revises: 4746544ef750
Create Date: 2026-06-07 15:09:48.345106

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94cc1e8a460e'
down_revision: Union[str, None] = '4746544ef750'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
