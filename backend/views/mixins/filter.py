import json
from flask_sqlalchemy.query import Query

from db_init import db


class FilterMixin:
    def get_filtered_query(self, query: Query, model: db.Model, filters: json, filter_mappings: dict = {}) -> Query:
        filters_dict = json.loads(filters)

        for field, value in filters_dict.items():
            if field in filter_mappings.keys():
                filter_nested_field, field = filter_mappings.get(field)
                query = query.filter(filter_nested_field.has(field == value))
            else:
                query = query.filter(getattr(model, field) == value)

        return query
