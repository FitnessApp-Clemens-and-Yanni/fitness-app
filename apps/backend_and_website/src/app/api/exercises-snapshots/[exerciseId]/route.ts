import { type NextRequest, NextResponse } from "next/server";
import { exercisesSnapshotsData } from "./exercisesSnapshotsData";

export function GET(req: NextRequest) {
  const arr = req.nextUrl.pathname.split("/");
  const id = arr[arr.length - 1]!;

  return NextResponse.json(
    exercisesSnapshotsData.find((x) => x.exerciseId === id),
  );
}
