/* @flow */

import { processExpression } from "./expression";
import type { UserContext } from "./types";

export function determineSegmentTreatments({
  context,
  expression,
}: {|
  context: UserContext,
  expression: string,
|}): boolean {
  return processExpression({ context, expression });
}

export function decideTreatment({
  sample,
  probs,
}: {|
  sample: $ReadOnlyArray<string>,
  probs: $ReadOnlyArray<number>,
|}): string {
  const random = Math.random();

  let segment = probs[0];
  for (let i = 0; i < probs.length; i++) {
    if (random <= segment) {
      return sample[i];
    }

    segment += probs[i + 1];
  }

  return sample[0]; // this should never happen, but if it does, return control
}
