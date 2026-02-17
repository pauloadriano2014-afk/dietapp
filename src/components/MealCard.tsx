import { Meal, MealItem } from "@/types/database";

interface MealCardProps {
  meal: Meal;
  items: MealItem[];
  children?: React.ReactNode; 
}

export default function MealCard({ meal, items, children }: MealCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full">
            {meal.time}
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">{meal.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-400">{meal.calories} kcal</p>
          <div className="flex gap-1.5 mt-2 justify-end">
            <div className="flex flex-col items-center bg-orange-50 px-2 py-1 rounded-lg">
              <span className="text-[9px] font-bold text-orange-400 uppercase">P</span>
              <span className="text-xs font-bold text-orange-700">{meal.protein}g</span>
            </div>
            <div className="flex flex-col items-center bg-blue-50 px-2 py-1 rounded-lg">
              <span className="text-[9px] font-bold text-blue-400 uppercase">C</span>
              <span className="text-xs font-bold text-blue-700">{meal.carbs}g</span>
            </div>
            <div className="flex flex-col items-center bg-green-50 px-2 py-1 rounded-lg">
              <span className="text-[9px] font-bold text-green-400 uppercase">G</span>
              <span className="text-xs font-bold text-green-700">{meal.fats}g</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {items?.map((item) => (
          <div key={item.id} className="flex flex-col border-l-2 border-slate-100 pl-3">
            <span className="text-sm font-semibold text-slate-700">{item.name}</span>
            <span className="text-xs text-slate-500">{item.amount}</span>
            {item.substitutions && (
              <p className="text-[11px] text-amber-600 bg-amber-50 self-start px-2 py-0.5 rounded mt-1">
                Substituir por: {item.substitutions}
              </p>
            )}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}