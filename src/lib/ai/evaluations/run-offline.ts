import { runOfflineEvaluation, summarizeEvaluationResults } from "./offline";

const run = runOfflineEvaluation();
const summary = summarizeEvaluationResults(run.results);

console.log(
  JSON.stringify(
    {
      ...run,
      summary,
    },
    null,
    2,
  ),
);
