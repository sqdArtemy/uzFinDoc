"""Translation Creation

Revision ID: 498e6f25196a
Revises: f70efa096d47
Create Date: 2024-04-13 20:01:01.360263

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '498e6f25196a'
down_revision = 'f70efa096d47'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Translation',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language', postgresql.ENUM('UZ', 'ENG', name='language', create_type=False), nullable=False),
    sa.Column('generated_at', sa.DateTime(), nullable=False),
    sa.Column('details_status', sa.Enum('PROCESSING', 'DONE', 'FAILED', name='translationstatus'), nullable=False),
    sa.Column('details_word_count', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Translation')
    # ### end Alembic commands ###
