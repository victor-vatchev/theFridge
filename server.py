from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, text, bindparam
from database import db, Recipe, Ingredient, Instruction

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.before_request
def before_request():
    g.db = db

@app.teardown_request
def teardown_request(exception):
    db_session = getattr(g, 'db', None)
    if db_session is not None:
        db_session.close()

# ----------------------------------------------------------------------
# creating recipe route
@app.route('/createRecipe', methods=['POST'])
def handle_recipe_data():
    recipe_data = request.json

    try:
        # Start a new transaction
        db.begin()

        # populate the recipe table
        new_recipe = Recipe(name=recipe_data['recipeName'])
        db.add(new_recipe)
        db.commit()

        # populate the ingredients table along with the recipe id that it correlates with
        new_recipe_ingredients = [Ingredient(name=ingredient['ingredient'], measurement=ingredient['measurement'], 
                                            amount=ingredient['amount'], recipe_id=new_recipe.id) for ingredient in recipe_data['ingredients']]
        db.add_all(new_recipe_ingredients)

        # populate the instructions table along with the recipe id that it correlates with
        new_recipe_instructions = [Instruction(description=instruction, recipe_id=new_recipe.id) for instruction in recipe_data['instructions']]
        db.add_all(new_recipe_instructions)

        # commit the changes
        db.commit()

    except Exception as e:
        # An error occurred, rollback the transaction
        db.rollback()
        return str(e), 500

    return 'Recipe data received and processed successfully', 200

# ----------------------------------------------------------------------
# gets all recipe names
@app.route('/getRecipeNames', methods=['GET'])
def get_recipes():
    # Prepare the SQL statement
    stmt = text("SELECT id, name FROM recipes")

    # Execute the prepared statement
    result_proxy = db.execute(stmt)

    # Fetch all rows from the executed statement
    recipes = [{'id': row.id, 'recipeName': row.name} for row in result_proxy]

    return {'recipes': recipes}  # Return entire recipe objects

# ----------------------------------------------------------------------
# deletes a recipe
@app.route('/deleteRecipe', methods=['POST'])
def delete_recipe():
    recipe_id = request.json['recipeId']

    try:
        # Start a new transaction
        db.begin()

        # delete the recipe
        db.query(Ingredient).filter(Ingredient.recipe_id == bindparam('recipe_id')).params(recipe_id=recipe_id).delete(synchronize_session='fetch')
        db.query(Instruction).filter(Instruction.recipe_id == bindparam('recipe_id')).params(recipe_id=recipe_id).delete(synchronize_session='fetch')
        db.query(Recipe).filter(Recipe.id == bindparam('recipe_id')).params(recipe_id=recipe_id).delete(synchronize_session='fetch')
        db.commit()
    except Exception as e:
        # An error occurred, rollback the transaction
        db.rollback()
        return str(e), 500
    
    return 'Recipe deleted successfully', 200

# ----------------------------------------------------------------------
# updates a chosen recipe
@app.route('/updateRecipe/<recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    data = request.get_json()

    try:
        # Start a new transaction
        db.begin()

        recipe = db.query(Recipe).get(recipe_id)
        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404

        recipe.name = data['recipeName']

        # Delete all existing ingredients and instructions for the recipe
        ingredients = db.query(Ingredient).filter_by(recipe_id=recipe_id).all()
        for ingredient in ingredients:
            db.delete(ingredient)
        instructions = db.query(Instruction).filter_by(recipe_id=recipe_id).all()
        for instruction in instructions:
            db.delete(instruction)

        # Add new ingredients
        for ingredient_data in data['ingredients']:
            new_ingredient = Ingredient(
                name=ingredient_data['ingredient'],
                amount=ingredient_data['amount'],
                measurement=ingredient_data['measurement'],
                recipe_id=recipe_id
            )
            db.add(new_ingredient)

        # Add new instructions
        for instruction_data in data['instructions']:
            if isinstance(instruction_data, dict):
                new_instruction = Instruction(
                    description=instruction_data['description'],
                    recipe_id=recipe_id
                )
                db.add(new_instruction)
            else:
                new_instruction = Instruction(
                    description=instruction_data,
                    recipe_id=recipe_id
                )
                db.add(new_instruction)
                print(f"Unexpected instruction data: {instruction_data}")

        db.commit()
    except Exception as e:
        # An error occurred, rollback the transaction
        db.rollback()
        return jsonify({'message': 'An error occurred: ' + str(e)}), 500
    
    return recipe.to_dict()

# ----------------------------------------------------------------------
# get a chosen recipe
@app.route('/getRecipe/<recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    return recipe.to_dict() if recipe else ('Recipe not found', 404)

# ----------------------------------------------------------------------
# get the recipes that contain all the ingredients
@app.route('/findRecipes', methods=['POST'])
def get_recipes_with_ingredients():    
    # Get the ingredients from the request
    data = request.get_json()
    ingredients = data['ingredients']

    # Query the database for recipes that contain all the ingredients
    recipes = db.query(Recipe).join(Ingredient).filter(
            Ingredient.name.in_(ingredients)).group_by(Recipe.id).having(func.count(Ingredient.id) >= len(ingredients)).all()

    # Convert the recipes to dictionaries to make them JSON serializable
    recipes_dict = [recipe.to_dict() for recipe in recipes]

    # Return the recipes as JSON
    return jsonify(recipes_dict)

if __name__ == '__main__':
    app.run(debug = True)