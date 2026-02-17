export type UserRole = 'coach' | 'aluno';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  coach_id?: string;
}

export interface MealItem {
  id: string;
  meal_id: string;
  name: string;
  amount: string;
  substitutions?: string;
}

export interface Meal {
  id: string;
  student_id: string;
  title: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items?: MealItem[];
}