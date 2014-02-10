from formencode.api import FancyValidator, Invalid
from savalidation.validators import formencode_factory


class UniquenessValidator(FancyValidator):
    messages = {
        "invalid": "The field is not unique"
    }

    def validate_python(self, value, state):
        entity = state.entity
        EntityClass = entity.__class__
        if EntityClass.query.filter(EntityClass.name == value, EntityClass.id != entity.id).count():
            raise Invalid(self.message('invalid', state), value, state)


validates_uniqueness = formencode_factory(UniquenessValidator)
