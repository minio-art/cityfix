"""init db

Revision ID: 4746544ef750
Revises: e5e26c85af7f
Create Date: 2026-06-07 15:07:59.449111

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4746544ef750'
down_revision: Union[str, None] = 'e5e26c85af7f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
