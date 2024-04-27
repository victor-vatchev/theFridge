from sqlalchemy import Column, Integer, String, Text, ForeignKey, Index, create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)

    # establish one-to-many relationship with Ingredients
    ingredients = relationship('Ingredient', back_populates='recipe', cascade="all, delete")
    instructions = relationship('Instruction', back_populates='recipe', cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'recipeName': self.name,
            'ingredients': [ingredient.to_dict() for ingredient in self.ingredients],
            'instructions': [instruction.to_dict() for instruction in self.instructions],
        }

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    amount = Column(Integer)  # e.g., 200, 2, etc.
    measurement = Column(String)  # e.g., 'grams', 'cups', etc.
    recipe_id = Column(Integer, ForeignKey('recipes.id'))

    # establish one-to-many relationship with recipes
    recipe = relationship('Recipe', back_populates='ingredients')

    def to_dict(self):
        return {
            'id': self.id,
            'ingredient': self.name,
            'amount': self.amount,
            'measurement': self.measurement
        }

class Instruction(Base):
    __tablename__ = 'instructions'

    id = Column(Integer, primary_key=True)
    description = Column(String)
    recipe_id = Column(Integer, ForeignKey('recipes.id'))

    recipe = relationship('Recipe', back_populates='instructions')

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description
        }

# create engine and session
engine = create_engine('sqlite:///recipes.db', isolation_level='Serializable')
Session = sessionmaker(bind=engine)
db = Session()

# create tables
Base.metadata.create_all(engine)