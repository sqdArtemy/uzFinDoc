"""Document Creation

Revision ID: eded552cc6cb
Revises: 172e9aebd1ee
Create Date: 2024-04-13 19:15:48.189924

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eded552cc6cb'
down_revision = '172e9aebd1ee'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Document',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('format', sa.String(length=20), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('uploaded_at', sa.DateTime(), nullable=False),
    sa.Column('link', sa.String(length=255), nullable=False),
    sa.Column('type', sa.Enum('OUTPUT_FILE', 'INPUT_FILE', name='documenttype'), nullable=False),
    sa.Column('language', sa.Enum('UZ', 'ENG', name='language'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('link')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Document')
    # ### end Alembic commands ###