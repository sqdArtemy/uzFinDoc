from flask_sqlalchemy.query import Query

from db_init import db


class SortMixin:
    def get_sorted_query(self, query: Query, model: db.Model, sort_fields: list[str], sort_mappings: dict = {}) -> Query:
        sort_columns = []

        for field in sort_fields:
            sort_order = True

            if field[0] == '-':
                sort_order = False
                field = field[1:]

            column = getattr(model, field)
            if field in sort_mappings:
                sort_model, field = sort_mappings.get(field)
                query.join(sort_model)
                column = field

            if not sort_order:
                column = column.desc()

            sort_columns.append(column)

        return query.order_by(*sort_columns)
