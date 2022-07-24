import { Temporal } from "@js-temporal/polyfill";
import test from "ava";
import { getEta, Paces, Stop } from "../src/components/stops";

const compare = Temporal.ZonedDateTime.compare;
const startTime = Temporal.ZonedDateTime.from({
  year: 2022,
  month: 8,
  day: 1,
  hour: 18,
  minute: 0,
  timeZone: Temporal.TimeZone.from("America/Chicago"),
});
const tomorrow = startTime.add({ days: 1 }).with({ hour: 0, minute: 0 });
test("simple stops", (t) => {
  const stops: Stop[] = [
    ["First", [], 10],
    ["Second", [], 20],
  ];
  const paces: Paces = {
    day1: 10,
    day2: 10,
    overnight: 10,
    stop: 10,
  };
  const startTime = Temporal.ZonedDateTime.from({
    year: 2022,
    month: 8,
    day: 1,
    hour: 18,
    minute: 0,
    timeZone: Temporal.TimeZone.from("America/Chicago"),
  });
  const first = getEta(stops[0], paces, startTime, stops);
  const second = getEta(stops[1], paces, startTime, stops);
  t.is(startTime.with({ hour: 19 }).toString(), first.toString());
  t.is(startTime.with({ hour: 20, minute: 10 }).toString(), second.toString());

  // t.is(0, compare(eta.round({ smallestUnit: "minutes" }), comparison));
});

test("into overnight", (t) => {
  const stops: Stop[] = [
    ["First", [], 10],
    ["Second", [], 30],
    ["Third", [], 40],
  ];
  const nightStart = startTime.with({ hour: 20, minute: 0 });
  const morningStart = tomorrow.with({ hour: 6, minute: 0 });
  const paces: Paces = {
    day1: 10,
    overnight: 5,
    day2: 10,
    stop: 30,
  };
  const first = getEta(
    stops[0],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const second = getEta(
    stops[1],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const third = getEta(
    stops[2],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  t.is(startTime.with({ hour: 19 }).toString(), first.toString());
  t.is(startTime.with({ hour: 23, minute: 0 }).toString(), second.toString());
  t.is(tomorrow.with({ hour: 1, minute: 30 }).toString(), third.toString());
});
test("stop during transition", (t) => {
  const stops: Stop[] = [
    ["First", [], 20],
    ["Second", [], 30],
  ];
  const nightStart = startTime.with({ hour: 20, minute: 0 });
  const morningStart = tomorrow.with({ hour: 6, minute: 0 });
  const paces: Paces = {
    day1: 10,
    overnight: 5,
    day2: 10,
    stop: 30,
  };
  const first = getEta(
    stops[0],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const second = getEta(
    stops[1],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  t.is(startTime.with({ hour: 20 }).toString(), first.toString());
  t.is(startTime.with({ hour: 22, minute: 30 }).toString(), second.toString());
});
test("morning transition", (t) => {
  const stops: Stop[] = [
    ["First", [], 20],
    ["Second", [], 30],
    ["Third", [], 55],
    ["Fourth", [], 65],
  ];
  const nightStart = startTime.with({ hour: 20, minute: 0 });
  const morningStart = tomorrow.with({ hour: 6, minute: 0 });
  const paces: Paces = {
    day1: 10,
    overnight: 5,
    day2: 10,
    stop: 60,
  };
  const first = getEta(
    stops[0],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const second = getEta(
    stops[1],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const third = getEta(
    stops[2],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const fourth = getEta(
    stops[3],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  // leave first at 2100
  // hit second at 2300
  // leave second at 0000
  // hit third at 0500
  // leave third at 0600
  // hit fourth at 0700
  t.is(startTime.with({ hour: 20 }).toString(), first.toString());
  t.is(startTime.with({ hour: 23 }).toString(), second.toString());
  t.is(tomorrow.with({ hour: 5 }).toString(), third.toString());
  t.is(tomorrow.with({ hour: 7 }).toString(), fourth.toString());
});
test("Does not count bridges", (t) => {
  const stops: Stop[] = [
    ["First", [], 20],
    ["Bridge", ["B"], 25],
    ["Second", [], 30],
    ["Bridge", ["B"], 45],
    ["Third", [], 55],
    ["Fourth", [], 65],
  ];
  const nightStart = startTime.with({ hour: 20, minute: 0 });
  const morningStart = tomorrow.with({ hour: 6, minute: 0 });
  const paces: Paces = {
    day1: 10,
    overnight: 5,
    day2: 10,
    stop: 60,
  };
  const first = getEta(
    stops[0],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const second = getEta(
    stops[2],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  const third = getEta(
    stops[4],
    paces,
    startTime,
    stops,
    nightStart,
    morningStart
  );
  // leave first at 2100
  // hit second at 2300
  // leave second at 0000
  // hit third at 0500
  // leave third at 0600
  // hit fourth at 0700
  t.is(startTime.with({ hour: 20 }).toString(), first.toString());
  t.is(startTime.with({ hour: 23 }).toString(), second.toString());
  t.is(tomorrow.with({ hour: 5 }).toString(), third.toString());
});

