export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Ingredient {
  /** Name of the ingredient (e.g., "Flour") */
  name: string;
  /** Quantity/measure description (e.g., "2 cups") */
  amount: string;
}

export interface InstructionStep {
  /** Step number starting at 1 */
  step: number;
  /** Instruction text for the step */
  text: string;
}

export interface Recipe {
  /** Unique id (UUID-like string) */
  id: string;
  /** Recipe title */
  title: string;
  /** Optional short description/subtitle */
  description?: string;
  /** Optional image URL (can be data URL) */
  imageUrl?: string;
  /** Preparation time in minutes */
  prepMinutes?: number;
  /** Cooking time in minutes */
  cookMinutes?: number;
  /** Estimated servings */
  servings?: number;
  /** Difficulty level */
  difficulty?: Difficulty;
  /** List of ingredients */
  ingredients: Ingredient[];
  /** Cooking instructions as ordered steps */
  instructions: InstructionStep[];
  /** Tags/categories for filtering */
  tags: string[];
  /** Whether the user marked it as favorite */
  favorite: boolean;
  /** Created timestamp (ms since epoch) */
  createdAt: number;
  /** Updated timestamp (ms since epoch) */
  updatedAt: number;
}
