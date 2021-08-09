import { Temporal } from '@js-temporal/polyfill';
import test from 'ava';
import { getEta, stops, startTime, tomorrow } from '../src/components/stops';

const compare = Temporal.ZonedDateTime.compare;
test('calculates stops right', t => {
    const ww = stops[0];
    const [_,__,distance] = ww;
    const eta = getEta(distance, {day1: 20, day2: 20, overnight: 20 });
    t.is(0, compare(eta, startTime.with({
        hour: 19,
        minute: 42
    })));
});
test('moves to night mode', t => {
    const eta = getEta(40, {day1: 10, overnight: 20, day2: 10});
    t.is(0, compare(eta, startTime.with({
        hour: 20,
        minute: 51
    })));
});

test("day time", (t) => {
  const eta = getEta(160, { day1: 10, overnight: 10, day2: 20 });
  const comparison = tomorrow.with({
    hour: 7,
    minute: 35,
  });
  t.is(0, compare(eta.round({ smallestUnit: "minutes" }), comparison));
});