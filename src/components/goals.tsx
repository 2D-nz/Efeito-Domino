import { toBRCurrency } from "@/lib/currency";
import { getBalance, getGoals } from "@/lib/supabase-utils";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { SaveToGoals } from "./add-to-goals";

const supabase = createClient();

export const Goals = async () => {
  const { data, error } = await supabase.auth.getUser();
  let uid = data.user?.id;
  const goals = (await getGoals(supabase, uid)) as [];
  const balance = await getBalance(supabase, uid);
  console.log("goals ", goals);
  return (
    <div>
      {goals.length > 0 ? (
        <div className="md:flex gap-10 grid">
          {goals.map((goal: any) => {
            return <GoalCard goal={goal} key={goal.id} balance={balance} />;
          })}
        </div>
      ) : (
        <div className="flex gap-10">Nenhuma meta cadastrada</div>
      )}
    </div>
  );
};

export const GoalCard = ({ goal, balance }: { goal: any; balance: number }) => {
  const getBarWidth = (achievedValue: number, goalValue: number) => {
    return (achievedValue / goalValue) * 100 > 100
      ? 100
      : (achievedValue / goalValue) * 100;
  };
  const barWidth = getBarWidth(goal.achieved_value, goal.goal_value);
  const isOver = goal.achieved_value > goal.goal_value;
  return (
    <div>
      <div className="h-40 w-[320px]  bg-primary grid px-5 py-2 rounded-xl text-light-text">
        <SaveToGoals goal={goal} balance={balance} />
        <p className="text-4xl"> {goal.name} </p>
        <div className="flex justify-between items-baseline">
          <p className=" text-xs text-green-500">
            {toBRCurrency(goal.achieved_value)}
          </p>

          <p className="">{toBRCurrency(goal.goal_value)}</p>
        </div>

        <div className="h-5 w-full rounded-lg outline-1 outline">
          <div
            style={{
              width: `${barWidth}%`,
            }}
            className={cn(
              "rounded-lg h-5",
              isOver ? "bg-red-500" : "bg-green-500"
            )}
          ></div>
        </div>
      </div>
    </div>
  );
};
