import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  guardrailCategories,
  guardrailCategorySections,
  guardrailTopics,
  guardrailTopicsBySlug,
} from "./index";

assert.equal(guardrailTopics.length, 24, "the library must contain exactly 24 topics");
assert.equal(new Set(guardrailTopics.map((topic) => topic.number)).size, 24);
assert.equal(new Set(guardrailTopics.map((topic) => topic.slug)).size, 24);
assert.deepEqual(
  guardrailTopics.map((topic) => topic.number),
  Array.from({ length: 24 }, (_, index) => index + 1),
);
assert.equal(guardrailCategorySections.length, 5);
assert.deepEqual(
  new Set(guardrailTopics.map((topic) => topic.category)),
  new Set(guardrailCategories.map((category) => category.id)),
);

for (const topic of guardrailTopics) {
  assert.ok(topic.summary.length > 0, `${topic.slug} needs a summary`);
  assert.ok(topic.definition.length > 0, `${topic.slug} needs a definition`);
  assert.ok(topic.sourceConcept.length > 0, `${topic.slug} needs a source concept`);
  assert.ok(topic.productAdaptation.length > 0, `${topic.slug} needs an adaptation`);
  assert.ok(topic.example.description.length > 0, `${topic.slug} needs an example`);
  assert.ok(topic.appliesWhen.length > 0, `${topic.slug} needs applicability guidance`);
  assert.ok(topic.avoidWhen.length > 0, `${topic.slug} needs non-applicability guidance`);
  for (const relatedSlug of topic.relatedSlugs) {
    assert.ok(guardrailTopicsBySlug.has(relatedSlug), `${topic.slug} links to ${relatedSlug}`);
  }
}

const route = readFileSync("app/docs/guardrails/[slug]/page.tsx", "utf8");
const docsHeader = readFileSync("components/product/product-header.tsx", "utf8");
assert.match(route, /generateStaticParams/);
assert.match(route, /notFound/);
assert.match(route, /generateMetadata/);
assert.match(docsHeader, /Docs/);
assert.match(docsHeader, /aria-current/);

console.log("Guardrail documentation checks passed.");
