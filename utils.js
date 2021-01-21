function el(query) {
	return document.querySelector(query);
}

/*
KEY - VALUE PAIRS
Main Dish - 1
Snack - 2 
Side Dish - 3 
Desserts - 4 
Breakfast - 5
-1 - error
*/

function intToRecipeTypeString(intVal)
{
	switch(intVal)
	{
		case 1:
			return "Main Dish";
		case 2:
			return "Snack";
		case 3:
			return "Side Dish";
		case 4:
			return "Dessert";
		case 5:
			return "Breakfast";
		case 6:
			return "Misc";
		default:
			return "Invalid";
	}
}

function stringToRecipeTypeInt(strVal)
{
	switch(strVal)
	{
		
		case "Main Dish":
		return 1;
		case "Snack":
		return 2;
		case "Side Dish":
		return 3;
		case "Dessert":
		return 4;
		case "Breakfast":
		return 5;
		case "Misc":
		return 6;
		default:
			return -1;
	}
}