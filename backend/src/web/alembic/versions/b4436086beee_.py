"""empty message

Revision ID: b4436086beee
Revises: 77f477c3c4b7
Create Date: 2024-11-22 21:20:05.369935

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.ext.asyncio import AsyncSession, AsyncConnection
from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory

#class Factory(SQLAlchemyFactory):
#    __model__ =
#    __set_relationships__ = True


# revision identifiers, used by Alembic.
revision: str = 'b4436086beee'
down_revision: Union[str, None] = '77f477c3c4b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('age_groups',
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('age_from', sa.Integer(), nullable=False),
    sa.Column('age_to', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('locations',
    sa.Column('city', sa.String(), nullable=False),
    sa.Column('region', sa.String(), nullable=True),
    sa.Column('country', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('name_sport_events',
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('events',
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('name_event_id', sa.Integer(), nullable=False),
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.Column('age_group_id', sa.Integer(), nullable=False),
    sa.Column('participants_count', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['age_group_id'], ['age_groups.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['location_id'], ['locations.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['name_event_id'], ['name_sport_events.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pdf_files',
    sa.Column('file_id', sa.Integer(), nullable=False),
    sa.Column('touch_date', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['file_id'], ['files.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('disciplines',
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('programs',
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    # ### end Alembic commands ###
    async def seed_db(connection: AsyncConnection):
        session = AsyncSession(bind=connection)
#        Factory.__async_session__ = session
#        await Factory.create_batch_async(10)


    op.run_async(seed_db)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('programs')
    op.drop_table('disciplines')
    op.drop_table('pdf_files')
    op.drop_table('events')
    op.drop_table('name_sport_events')
    op.drop_table('locations')
    op.drop_table('age_groups')
    # ### end Alembic commands ###