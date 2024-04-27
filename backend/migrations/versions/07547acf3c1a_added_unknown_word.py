"""Added Unknown Word.

Revision ID: 07547acf3c1a
Revises: 92a8b6bbcaeb
Create Date: 2024-04-27 12:38:46.252694

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07547acf3c1a'
down_revision = '92a8b6bbcaeb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Feedback', schema=None) as batch_op:
        batch_op.drop_column('id')

    with op.batch_alter_table('Word', schema=None) as batch_op:
        batch_op.alter_column('written_form',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.String(length=255),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Word', schema=None) as batch_op:
        batch_op.alter_column('written_form',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)

    with op.batch_alter_table('Feedback', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Feedback_id_seq"\'::regclass)'), autoincrement=True, nullable=False))

    # ### end Alembic commands ###