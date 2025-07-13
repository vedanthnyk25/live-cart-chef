import json
# For demonstration purposes, if you don't have google.adk installed,
# a dummy Agent class is provided. In a real ADK setup,
# 'from google.adk.agents import Agent' would be used.
try:
    from google.adk.agents import Agent
except ImportError:
    print("Warning: 'google.adk' library not found. Using a dummy Agent class for demonstration.")
    class Agent:
        def __init__(self, name: str, model: str, description: str, instruction: str, tools: list):
            self.name = name
            self.model = model
            self.description = description
            self.instruction = instruction
            self.tools = tools
        def __str__(self):
            return f"Dummy Agent(name='{self.name}', description='{self.description}')"
        def __repr__(self):
            return self.__str__()


def get_cart_and_stock_info(present_cart_json: str, items_in_stock_json: str) -> dict:
    """
    Provides the current cart items and available stock items to the LLM.
    The LLM will use this information to suggest recipes.

    Args:
        present_cart_json (str): A JSON string representing a list of items
                                 currently in the user's cart (e.g., '["itemA", "itemB"]').
        items_in_stock_json (str): A JSON string representing a list of all
                                   items available in the e-shopping site's stock
                                   (e.g., '["itemX", "itemY", "itemZ"]').

    Returns:
        dict: A dictionary containing the status and the parsed data.
              - If successful, 'status' will be "success" and 'report' will be a
                JSON string containing the parsed cart and stock items.
              - If there's a JSON parsing error, 'status' will be "error" and
                'error_message' will describe the issue.
    """
    try:
        # Parse the JSON string inputs into Python lists
        present_cart = json.loads(present_cart_json)
        items_in_stock = json.loads(items_in_stock_json)
    except json.JSONDecodeError as e:
        return {
            "status": "error",
            "error_message": f"Invalid JSON format provided for cart or stock: {e}. Please ensure inputs are valid JSON list strings."
        }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"An unexpected error occurred during input parsing: {e}"
        }

    # The tool now simply reports back the parsed information to the LLM.
    # The LLM will then use this information to generate recipe suggestions.
    report_data = {
        "current_cart_items": present_cart,
        "available_stock_items": items_in_stock
    }

    return {
        "status": "success",
        "report": json.dumps(report_data, indent=2)
    }

# Define the root_agent instance using the Google ADK Agent class
root_agent = Agent(
    name="ai_powered_recipe_suggestion_agent",
    model="gemini-2.0-flash", # Use a suitable model for your application
    description=(
        "An AI-powered agent that intelligently suggests new recipes based on items "
        "in a user's shopping cart and the available items in the e-shopping site's stock. "
        "The agent leverages its own knowledge of recipes to propose dishes and "
        "identifies additional items from stock needed to complete them, aiming to increase sales."
    ),
    instruction=(
        "You are an expert culinary assistant and an e-commerce sales strategist. "
        "Your goal is to suggest at least two delicious recipes that the user can make "
        "by utilizing items they already have in their 'current_cart_items' and "
        "by adding a few more ingredients from the 'available_stock_items' provided by the tool. "
        "Do NOT use any predefined recipe lists. Instead, rely on your extensive culinary knowledge "
        "to creatively combine ingredients. "
        "Crucially, all 'extra_items_required' for a suggested dish MUST be present in the 'available_stock_items' "
        "and not already in the 'current_cart_items'. "
        "You MUST provide your suggestions in the following JSON format:\n"
        "[\n"
        "  {\n"
        "    \"dish_name\": \"Name of the Recipe\",\n"
        "    \"extra_items_required\": [\"item1_from_stock\", \"item2_from_stock\"]\n"
        "  },\n"
        "  {\n"
        "    \"dish_name\": \"Another Recipe Name\",\n"
        "    \"extra_items_required\": [\"item_X_from_stock\", \"item_Y_from_stock\"]\n"
        "  }\n"
        "]\n"
        "Ensure that the 'extra_items_required' list only contains items that are actually needed "
        "and can be found in the 'available_stock_items'. "
        "When calling the 'get_cart_and_stock_info' tool, ensure that both 'present_cart_json' "
        "and 'items_in_stock_json' arguments are provided as valid JSON string "
        "representations of lists (e.g., '[\"apple\", \"banana\"]')."
    ),
    tools=[get_cart_and_stock_info], # Pass the tool function here
)

# --- Example of how the tool would be called (for testing/understanding purposes) ---
if __name__ == "__main__":
    print("--- Simulating direct tool calls (as if triggered by the LLM) ---")

    # Scenario 1: User has some basic items, and stock is rich
    current_cart_1_json = json.dumps(["pasta", "onion", "eggs"])
    available_stock_1_json = json.dumps([
        "canned tomatoes", "garlic", "olive oil", "basil", "chicken breast",
        "broccoli", "carrots", "soy sauce", "ginger", "rice", "flour",
        "milk", "sugar", "baking powder", "strawberries", "blueberries",
        "maple syrup", "lentils", "celery", "vegetable broth", "cumin",
        "coriander", "cheese", "butter", "salt", "pepper"
    ])
    result_1 = get_cart_and_stock_info(current_cart_1_json, available_stock_1_json)
    print("\n--- Scenario 1: Rich Stock & Some Cart Items (Tool Output) ---")
    print(json.dumps(result_1, indent=4))
    # In a real ADK setup, the LLM would receive this 'result_1' and then generate its recipe suggestions.

    # Scenario 2: User has very few items, limited stock
    current_cart_2_json = json.dumps(["chicken breast"])
    available_stock_2_json = json.dumps(["broccoli", "soy sauce", "rice", "flour", "eggs", "cheese"])
    result_2 = get_cart_and_stock_info(current_cart_2_json, available_stock_2_json)
    print("\n--- Scenario 2: Limited Stock & Few Cart Items (Tool Output) ---")
    print(json.dumps(result_2, indent=4))

    # Scenario 3: Invalid JSON input
    invalid_cart_json = "not a valid json list"
    valid_stock_json = json.dumps(["milk", "eggs"])
    result_3 = get_cart_and_stock_info(invalid_cart_json, valid_stock_json)
    print("\n--- Scenario 3: Invalid JSON Input (Tool Output) ---")
    print(json.dumps(result_3, indent=4))

    print("\n--- Important Note ---")
    print("The above `print` statements show what the *tool function* returns to the LLM.")
    print("The actual JSON recipe suggestions will be generated by the LLM itself,")
    print("based on these inputs and its 'instruction'. You would typically interact")
    print("with the `root_agent` instance directly (e.g., `root_agent.generate_response(user_query)`).")