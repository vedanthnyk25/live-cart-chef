export interface Product {
  id: number,
  name: string,
  price: number,
  tags?: string;
}

export interface Suggestion {
  id: number;
  user_id: number;
  dish_name: string;
  extra_items: string[];
  created_at: string;
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

export interface SuggestionsAvailableResponse {
  available: boolean;
}


