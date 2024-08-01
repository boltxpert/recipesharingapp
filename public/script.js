document.getElementById('add-recipe').addEventListener('submit', function (event) {
  event.preventDefault();
  var title = document.getElementById('title').value;
  var ingredients = document.getElementById('ingredients').value;
  var instructions = document.getElementById('instructions').value;

  var recipe = {
    title: title,
    ingredients: ingredients,
    instructions: instructions
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/recipes', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
  
        var data = JSON.parse(xhttp.responseText);
        if (data.acknowledged) {
          alert('Recipe added successfully!');
        } else {
          alert('Error adding recipe');
        }
    }
  };
  xhttp.onerror = function () {
    console.error('Error:', xhttp.statusText);
  };

  xhttp.send(JSON.stringify(recipe));

});

function updatedRecipe() {
  var id = document.getElementById('recipe_id').value;
  var title = document.getElementById('title').value;
  var ingredients = document.getElementById('ingredients').value;
  var instructions = document.getElementById('instructions').value;

  var recipe = {
    title: title,
    ingredients: ingredients,
    instructions: instructions
  };
  
  xhttp.open('PUT', '/recipes/' + id, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      if (data.modifiedCount > 0) {
        alert('Recipe updated successfully!');
      } else {
        alert('Recipe not found');
      }
    }
  };
  
  xhttp.onerror = function () {
    console.error('Error:', xhttp.statusText);
  };
  xhttp.send(JSON.stringify(recipe));
    
}

function deleteRecipe() {
  var id = document.getElementById('recipe_id').value;
  xhttp.open('DELETE', '/recipes/' + id, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      if (data.acknowledged) {
        alert('Recipe deleted successfully!');
      } else {
        alert('Recipe not found');
      }
    }
  };
  
  xhttp.onerror = function () {
    console.error('Error:', xhttp.statusText);
  };
  xhttp.send();
    
}

function displayRecipes() {
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/recipes", true);

  xhttp.onreadystatechange = function () {
    var recipeData = document.getElementById('recipe-data');

    if (this.readyState == 4 && this.status == 200) {
      var recipes = JSON.parse(this.responseText);
      recipes.forEach(recipe => {
        var tr = document.createElement('tr');
        tr.innerHTML = "<td>" + recipe._id + "</td><td>" + recipe.title + "</td><td>" + recipe.ingredients + "</td><td>" + recipe.instructions + "</td>";
        recipeData.appendChild(tr);
      });
    }
  };
  
  xhttp.onerror = function () {
    console.error('Error:', xhttp.statusText);
  };
  xhttp.send();
}

function loadRecipeIDs(){
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/recipes", true);

  xhttp.onreadystatechange = function () {
    var recipe_ids = document.getElementById('recipe_id');

    if (this.readyState == 4 && this.status == 200) {
      var recipes = JSON.parse(this.responseText);
      recipes.forEach(recipe => {
        var option = document.createElement('option');
        option.innerHTML = recipe._id;
        recipe_ids.appendChild(option);
      });
    }
  };
  
  xhttp.onerror = function () {
    console.error('Error:', xhttp.statusText);
  };
  xhttp.send();
}

function showRecipeData(){
  var id = document.getElementById('recipe_id').value;
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/recipes/" + id, true);
  xhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
      var recipe = JSON.parse(this.responseText);
   
      document.getElementById('title').value=recipe.title;
      document.getElementById('ingredients').value=recipe.ingredients;
      document.getElementById('instructions').value=recipe.instructions;
    }

  }
  xhttp.onerror = function () {
    console.error('Error:', xhttp.statusText);
  };
  xhttp.send();

}